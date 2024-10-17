import { VacanciesType } from "../../types/VacanciesType";
import PageLayout from "../../layouts/pageLayout/PageLayout";
import { useEffect, useState } from "react";
import "./vacanciesPage.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { parseDateTime } from "../../logic/parseDateTime";
import CreateVacancy from "../../components/createVacancy/CreateVacancy";
import VacancyView from "../../components/vacancyView/VacancyView";
import SortSelect from "../../components/sortSelect/SortSelect";
import VacancyFilters from "../../components/filters/VacancyFilters";
import { VacancyFilterType } from "../../types/filtersTypes";

const VacanciesPage = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openView, setOpenView] = useState<boolean>(false);
  const [vacancies, setVacancies] = useState<VacanciesType[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<VacancyFilterType>({
    divisions: null,
    priorities: null,
    hrs: null,
    statuses: null
  });

  const getQueryString = () => {
    const params = [];

    if (selectedFilters.divisions) {
      params.push(`division_id=${selectedFilters.divisions}`);
    }
    if (selectedFilters.hrs) {
      params.push(`hr_id=${selectedFilters.hrs}`);
    }
    if (selectedFilters.priorities) {
      params.push(`priority_id=${selectedFilters.priorities}`);
    }
    if (selectedFilters.statuses) {
      params.push(`status_id=${selectedFilters.statuses}`);
    }
      return params.length > 0 ? `?${params.join('&')}` : '';
  }
  
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/vacancies${getQueryString()}`);
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data = await response.json();
        setVacancies(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    fetchVacancies();
  }, [selectedFilters]);

  const getPriorityColor = (priorityName: string) => {
    switch (priorityName) {
      case "Высокий":
        return "priority-high";
      case "Средний":
        return "priority-average";
      case "Низкий":
        return "priority-low";
      default:
        return "";
    }
  };

  const getStatusClass = (statusName: string) => {
    switch (statusName) {
      case "Открыта":
        return "status-open";
      case "Закрыта":
        return "status-closed";
      case "Отменена":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const sortParams = {

  }

  return (
    <PageLayout tab="vacancies">
      <div className="page-title">
        <div>Вакансии</div>
        <button className="red-button" onClick={() => setOpenCreate(true)}>
          Добавить вакансию
        </button>
      </div>
      <div className="page-content">
        <div className="page-filters">
          <SortSelect></SortSelect>
          <VacancyFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}></VacancyFilters>
        </div>
        <table className="content-table">
          <thead>
            <tr className="content-table-head">
              <th>Название</th>
              <th>Статус</th>
              <th>Приоритет</th>
              <th>Кандидаты</th>
              <th>Отклики</th>
              <th>Создано</th>
              <th>Ответственный</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((vacancy) => (
              <tr className="content-table-rows" key={vacancy.id} onClick={() => {setOpenView(true); setSelectedVacancy(vacancy.id)}}>
                <td className="">
                  <div>
                    <div className="vacancies-title">{vacancy.title}</div>
                    <div className="vacancies-division">
                      {vacancy.division.title}
                    </div>
                  </div>
                </td>
                <td className="">
                  <div
                    className={`status-block ${getStatusClass(
                      vacancy.status.title
                    )}`}
                  >
                    {vacancy.status.title}
                  </div>
                </td>
                <td>
                  <span
                    className={`priority-circle ${getPriorityColor(
                      vacancy.priority.title
                    )}`}
                  />
                  {vacancy.priority.title}
                </td>
                <td>
                  <div className="VacanciesPage-centeredFlex">
                    <AccountCircleOutlinedIcon style={{ marginRight: "5px" }} />
                    <span className="VacanciesPage-span">{vacancy.value_candidates}</span>
                  </div>
                </td>
                <td id="VacanciesPage-responses">
                  <div className="VacanciesPage-centeredFlex">
                    <AccountCircleOutlinedIcon style={{ marginRight: "5px" }} />
                    <span className="VacanciesPage-span">{vacancy.value_responses}</span>
                  </div>
                </td>
                <td id="VacanciesPage-datetime">
                  <div>{parseDateTime(vacancy.created_at).date}</div>
                  <div>{parseDateTime(vacancy.created_at).time}</div>
                </td>
                <td className="">{vacancy.responsible.fio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateVacancy open={openCreate} setOpen={setOpenCreate} />
      <VacancyView open={openView} setOpen={setOpenView} vacancy_id={selectedVacancy}/>
    </PageLayout>
  );
};

export default VacanciesPage;
