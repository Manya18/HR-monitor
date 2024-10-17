import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import { CandidateType } from "../../types/CandidatesTypes";
import PageLayout from "../../layouts/pageLayout/PageLayout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import "./candidatesPage.css";
import { useEffect, useState } from "react";
import { parseDateTime } from "../../logic/parseDateTime";
import { CandidateFilterType } from "../../types/filtersTypes";
import SortSelect from "../../components/sortSelect/SortSelect";
import CandidatesFilters from "../../components/filters/CandidatesFilters";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<CandidateFilterType>({
    vacancies: null,
    hrs: null,
    statuses: null
  });

  const getQueryString = () => {
    const params = [];

    if (selectedFilters.hrs) {
      params.push(`hr_ids=${selectedFilters.hrs}`);
    }
    if (selectedFilters.vacancies) {
      params.push(`vacancy_ids=${selectedFilters.vacancies}`);
    }
    if (selectedFilters.statuses) {
      params.push(`status_ids=${selectedFilters.statuses}`);
    }
      return params.length > 0 ? `?${params.join('&')}` : '';
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/candidates${getQueryString()}`);
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    fetchTasks();
  }, [selectedFilters]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Принят":
        return "status-accepted";
      case "Отклонен HR":
      case "Отклонен кандидатом":
        return "status-rejected";
      default:
        return "status-default";
    }
  };

  return (
    <PageLayout tab="candidates">
      <div className="page-title">
        <div>Кандидаты</div>
      </div>
      <div className="page-content">
      <div className="page-filters">
          <SortSelect></SortSelect>
          <CandidatesFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}></CandidatesFilters>
        </div>
        <table className="content-table">
          <thead>
            <tr className="content-table-head">
              <th>Кандидат</th>
              <th>Вакансия</th>
              <th>Статус</th>
              <th>Добавлено</th>
              <th>Ответственный</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) =>
              candidate.vacancies.map((vacancy, index) => (
                <tr
                  className="content-table-rows"
                  key={`${candidate.fio}-${vacancy.id}`}
                >
                  {index === 0 && (
                    <td rowSpan={candidate.vacancies.length}>
                      {candidate.fio}
                    </td>
                  )}
                  <td>{vacancy.vacancy_type.title}</td>
                  <td className={getStatusColorClass(vacancy.status.title)}>
                    {vacancy.status.title}
                  </td>
                  <td>{parseDateTime(vacancy.created_at).date}</td>
                  <td className="CandidatesPage-responsible">
                    <AccountCircleOutlinedIcon style={{ marginRight: "5px" }} />
                    {vacancy.responsible.fio}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default CandidatesPage;
