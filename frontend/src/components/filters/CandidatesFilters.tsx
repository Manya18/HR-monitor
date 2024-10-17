import { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { DivisionType, HRType, PriorityType, StatusType } from "../../types/VacanciesType";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import './filters.css'
import { CandidateFilterType, CandidateFilterArrType} from "../../types/filtersTypes";

const CandidatesFilters = ({selectedFilters, setSelectedFilters} : {selectedFilters: CandidateFilterType, setSelectedFilters: (selectedFilters: any) => void;}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<CandidateFilterArrType | null>(null);

  const filters = [
    { name: "hrs", label: "Ответственный" },
    { name: "vacancies", label: "Вакансии" },
    { name: "statuses", label: "Статус" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/hrs"),
          fetch("http://localhost:8080/api/vacancies"),
          fetch("http://localhost:8080/api/candidateStatuses"),
        ]);

        const results = await Promise.all(
          responses.map((response) => {
            if (!response.ok) {
              throw new Error(
                `Ошибка при получении данных: ${response.statusText}`
              );
            }
            return response.json();
          })
        );
        setData({
          hrs: results[0],
          vacancies: results[1],
          statuses: results[2]
        });
      } catch (err: any) {
        throw new Error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any, filterName: string) => {
    setSelectedFilters((prev: CandidateFilterType) => ({
      ...prev,
      [filterName]: e.target.value
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
        hrs: null,
        vacancies: null,
        statuses: null
    }
    );
  };

  return (
    <div className="filters">
      <button className="outlined-button" onClick={() => setIsOpen(!isOpen)}>
        <FilterAltIcon />
      </button>
      {isOpen && (
        <div className="filters-dropdown">
          <div className="filters-menu">
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>{filters[0].label}</InputLabel>
              <Select
                value={selectedFilters.hrs}
                onChange={(e) => handleChange(e, filters[0].name)}
                input={<OutlinedInput label={filters[0].label} />}
              >
                {data &&
                  data.hrs.map((hr) => (
                    <MenuItem key={hr.id} value={hr.id}>
                      {hr.fio}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>{filters[1].label}</InputLabel>
              <Select
                value={selectedFilters.vacancies}
                onChange={(e) => handleChange(e, filters[1].name)}
                input={<OutlinedInput label={filters[1].label} />}
              >
                {data &&
                  data.vacancies.map((vacancy) => (
                    <MenuItem key={vacancy.id} value={vacancy.id}>
                      {vacancy.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>{filters[2].label}</InputLabel>
              <Select
                value={selectedFilters.statuses}
                onChange={(e) => handleChange(e, filters[2].name)}
                input={<OutlinedInput label={filters[2].label} />}
              >
                {data &&
                  data.statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="filters-btnGroup">
            <button className="outlined-button" onClick={handleReset}>
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CandidatesFilters;
