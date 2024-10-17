import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import "./homePage.css";
import PageLayout from "../../layouts/pageLayout/PageLayout";
import { Metrics } from "../../types/MetricsType";
import { useEffect, useRef, useState } from "react";
// import { Chart, registerables } from 'chart.js';
import 'chartjs-plugin-datalabels';
import { StatusType } from "../../types/VacanciesType";

// Chart.register(...registerables);

type ProcessedVacancy = {
  month: string;
  processed_vacancies: number;
};

type SelectionFunnel = {
  status: string;
  count: number;
};

type RangeDiagram = {
  status: string;
  median: number;
  statusCount: number;
};

type RejectedVacancy = {
  id: number;
  candidate_id: number;
  status_id: number;
  vacancy_id: number;
  updated_at: string;
  last_status_id: number;
  last_status_updated_at: string;
};

const HomePage = () => {
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [processedVacancies, setProcessedVacancies] = useState<ProcessedVacancy[]>([]);
  const [selectionFunnel, setSelectionFunnel] = useState<SelectionFunnel[]>([]);
  const [rangeDiagram, setRangeDiagram] = useState<RangeDiagram[]>([]);
  const [rejectedVacancies, setRejectedVacancies] = useState<RejectedVacancy[]>([]);
  const [candidateStatuses, setCandidateStatuses] = useState<StatusType[]>([]);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const funnelChartRef = useRef<HTMLCanvasElement | null>(null);
  const rangeChartRef = useRef<HTMLCanvasElement | null>(null);
  const rejectedVacanciesChartRef = useRef<HTMLCanvasElement | null>(null);

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  useEffect(() => {
    const fetchCommonMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/commonMetrics/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data = await response.json();
        const transformedMetrics = [
          {
            title: 'Вакансий в работе',
            value: data[0].open_vacancies || 0,
          },
          {
            title: 'Закрытых вакансий',
            value: data[0].closed_vacancies || 0,
          },
          {
            title: 'Средний срок закрытия вакансии',
            value: Math.round(data[0].avg_closing_days) + ' дн.' || 'Нет данных',
          },
          {
            title: 'Число кандидатов',
            value: data[0].candidate_count || 0,
          },
          {
            title: 'Число задач',
            value: data[0].open_tasks_count || 0,
          }
        ];

        setMetrics(transformedMetrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    const fetchProcessedVacancies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/processedVacancies/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: ProcessedVacancy[] = await response.json();

        const transformedData = data.map(v => ({
          month: monthNames[new Date(v.month).getMonth()],
          processed_vacancies: v.processed_vacancies
        }));

        setProcessedVacancies(transformedData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    const fetchSelectionFunnel = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/selectionFunnel/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: { title: string; status_count: string }[] = await response.json();

        const acceptedTags: { status: string; count: number }[] = [];
        const rejectedTags: { status: string; count: number }[] = [];

        data.forEach(v => {
          const transformedData = {
            status: v.title,
            count: parseInt(v.status_count, 10)
          };

          if (transformedData.status === "Отклонен HR" || transformedData.status === "Отклонен кандидатом") {
            rejectedTags.push(transformedData);
          } else {
            acceptedTags.push(transformedData);
          }
        });
        const sortedAcceptedTags = acceptedTags.sort((a, b) => {
          if (a.status === "Отклик") return -1;
          if (b.status === "Отклик") return 1;
          return 0;
        });

        setSelectionFunnel(sortedAcceptedTags);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    const fetchRangeDiagram = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rangeDiagram/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: {
          title: string;
          median_hours: number;
          status_count: string;
        }[] = await response.json();

        const filteredData = data.filter(v =>
          v.title !== "Отклонен HR" && v.title !== "Отклонен кандидатом"
        );

        const transformedData = filteredData.map(v => ({
          status: v.title,
          median: v.median_hours,
          statusCount: parseInt(v.status_count, 10)
        }));

        setRangeDiagram(transformedData);
      } catch (error) {
        console.error("Error fetching range diagram:", error);
      }
    };
    const fetchRejectedVacancies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rejectedVacancies/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: RejectedVacancy[] = await response.json();
        setRejectedVacancies(data);
      } catch (error) {
        console.error("Error fetching range diagram:", error);
      }
    };

    const fetchCandidateStatuses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/candidateStatuses/');
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: StatusType[] = await response.json();
        setCandidateStatuses(data);
      } catch (error) {
        console.error("Error fetching candidate statuses:", error);
      }
    };

    fetchCommonMetrics();
    fetchProcessedVacancies();
    fetchSelectionFunnel();
    fetchRangeDiagram();
    fetchRejectedVacancies();
    fetchCandidateStatuses();
  }, []);

  useEffect(() => {
    if (processedVacancies.length > 0 && chartRef.current) {
      const labels = processedVacancies.map(v => v.month);
      const dataValues = processedVacancies.map(v => v.processed_vacancies);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)', 
        'rgba(255, 206, 86, 0.5)', 
        'rgba(75, 192, 192, 0.5)', 
        'rgba(153, 102, 255, 0.5)', 
        'rgba(255, 159, 64, 0.5)',  
      ];

      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Обработанные вакансии',
            data: dataValues,
            backgroundColor: backgroundColors.slice(0, dataValues.length),
            borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              color: 'black',
              formatter: (value) => value,
              font: {
                weight: 'bold',
                size: 14,
              },
              display: (context) => true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                display: false
              },
              grid: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        },
      });
      return () => {
        chart.destroy();
      };
    }
  }, [processedVacancies]);

  useEffect(() => {
    if (selectionFunnel.length > 0 && funnelChartRef.current) {
      const labels = selectionFunnel.map(v => v.status);
      const dataValues = selectionFunnel.map(v => v.count);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',  
        'rgba(54, 162, 235, 0.5)', 
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',  
        'rgba(153, 102, 255, 0.5)',
      ];

      const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ];

      const funnelChart = new Chart(funnelChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Кандидаты по статусам',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              color: 'black',
              formatter: (value) => value,
              font: {
                weight: 'bold',
                size: 14,
              },
              display: (context) => true
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        },
      });
      return () => {
        funnelChart.destroy();
      };
    }
  }, [selectionFunnel]);

  useEffect(() => {
    if (rangeDiagram.length > 0 && rangeChartRef.current) {
      const labels = rangeDiagram.map(v => v.status);
      const dataValues = rangeDiagram.map(v => v.median);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.5)',  
        'rgba(54, 162, 235, 0.5)',  
        'rgba(255, 206, 86, 0.5)',  
        'rgba(75, 192, 192, 0.5)', 
        'rgba(153, 102, 255, 0.5)', 
      ];

      const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ];

      const rangeChart = new Chart(rangeChartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Медиана часов по статусам',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              color: 'black',
              formatter: (value) => value,
              font: {
                weight: 'bold',
                size: 14,
              },
              display: (context) => true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        },
      });
      return () => {
        rangeChart.destroy();
      };
    }
  }, [rangeDiagram]);

  // useEffect(() => {
  //   if (rejectedVacancies.length > 0 && rejectedVacanciesChartRef.current) {
  //     const hrRejections = rejectedVacancies.reduce<Record<number, number>>((acc, vacancy) => {
  //       if (vacancy.status_id === 5) {
  //         acc[vacancy.last_status_id] = (acc[vacancy.last_status_id] || 0) + 1;
  //       }
  //       return acc;
  //     }, {});

  //     const candidateRejections = rejectedVacancies.reduce<Record<number, number>>((acc, vacancy) => {
  //       if (vacancy.status_id === 4) {
  //         acc[vacancy.last_status_id] = (acc[vacancy.last_status_id] || 0) + 1;
  //       }
  //       return acc;
  //     }, {});

  //     const statusMap = new Map(candidateStatuses.map(status => [status.id, status.title]));
  //     const hrLabels = Object.keys(hrRejections).map(Number).map(id => statusMap.get(id) || `ID ${id}`);
  //     const hrDataValues = Object.values(hrRejections);
  //     const candidateLabels = Object.keys(candidateRejections).map(Number).map(id => statusMap.get(id) || `ID ${id}`);
  //     const candidateDataValues = Object.values(candidateRejections);

  //     const rejectedVacanciesChart = new Chart(rejectedVacanciesChartRef.current, {
  //       type: 'bar',
  //       data: {
  //         //labels: [...hrLabels, ...candidateLabels],
  //         labels: [...hrLabels],
  //         datasets: [
  //           {
  //             label: 'Отклонения от HR',
  //             data: hrDataValues,
  //             backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //             borderColor: 'rgba(255, 99, 132, 1)',
  //             borderWidth: 1,
  //           },
  //           {
  //             label: 'Отклонения от кандидата',
  //             data: candidateDataValues,
  //             backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //             borderColor: 'rgba(54, 162, 235, 1)',
  //             borderWidth: 1,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             display: true,
  //           },
  //           title: {
  //             display: false,
  //           },
  //           datalabels: {
  //             anchor: 'end',
  //             align: 'end',
  //             color: 'black',
  //             formatter: (value) => value,
  //             font: {
  //               weight: 'bold',
  //               size: 14,
  //             },
  //             display: (context) => true,
  //           },
  //         },
  //         scales: {
  //           y: {
  //             beginAtZero: true,
  //             grid: {
  //               display: false,
  //             },
  //           },
  //           x: {
  //             grid: {
  //               display: false,
  //             },
  //           },
  //         },
  //       },
  //     });

  //     return () => {
  //       rejectedVacanciesChart.destroy();
  //     };
  //   }
  // }, [rejectedVacancies, candidateStatuses]);



  return (
    <PageLayout tab="">
      <div className="page-title HomePage">
        <div className="HomePage-header-title">Анализ подбора сотрудников</div>
      </div>
      <div className="HomePage-content">
        {metrics.length > 0 ? (
          metrics.map((metric) => (
            <div className="MetricsPanel" key={metric.title}>
              <div className="Metrics-title">{metric.title}</div>
              <div className="Metrics-data">{metric.value}</div>
            </div>
          ))
        ) : (
          <div>Loading metrics...</div>
        )}
      </div>
      <div className="HomePage-charts">
        <div className="chart-container">
          <h2 className="chart-title">Количество обработанных вакансий по месяцам</h2>
          <canvas ref={chartRef} id="vacanciesChart"></canvas>
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Воронка найма</h2>
          <canvas ref={funnelChartRef} id="selectionFunnelChart"></canvas>
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Затраченное время на каждый этап</h2>
          <canvas ref={rangeChartRef} id="rangeDiagramChart"></canvas>
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Отклоненные кандидаты по статусам</h2>
          <canvas ref={rejectedVacanciesChartRef} id="rejectedVacanciesChart"></canvas>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
