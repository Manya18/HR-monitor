import { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import './filters.css'
import { VacancyFilterArrType, VacancyFilterType } from "../../types/filtersTypes";

const VacancyFilters = ({selectedFilters, setSelectedFilters} : {selectedFilters: VacancyFilterType, setSelectedFilters: (selectedFilters: any) => void;}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<VacancyFilterArrType | null>(null);

  const filters = [
    { name: "divisions", label: "Отдел" },
    { name: "priorities", label: "Приоритет" },
    { name: "hrs", label: "Ответственный" },
    { name: "statuses", label: "Статус" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/hrs"),
          fetch("http://localhost:8080/api/divisions"),
          fetch("http://localhost:8080/api/priorities"),
          fetch("http://localhost:8080/api/vacancyStatuses"),
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
          divisions: results[1],
          priorities: results[2],
          statuses: results[3]
        });
      } catch (err: any) {
        throw new Error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any, filterName: string) => {
    setSelectedFilters((prev: VacancyFilterType) => ({
      ...prev,
      [filterName]: e.target.value
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
      divisions: null,
      priorities: null,
      hrs: null,
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
                value={selectedFilters.divisions}
                onChange={(e) => handleChange(e, filters[0].name)}
                input={<OutlinedInput label={filters[0].label} />}
              >
                {data &&
                  data.divisions.map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>{filters[1].label}</InputLabel>
              <Select
                value={selectedFilters.priorities}
                onChange={(e) => handleChange(e, filters[1].name)}
                input={<OutlinedInput label={filters[1].label} />}
              >
                {data &&
                  data.priorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      {priority.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>{filters[2].label}</InputLabel>
              <Select
                value={selectedFilters.hrs}
                onChange={(e) => handleChange(e, filters[2].name)}
                input={<OutlinedInput label={filters[2].label} />}
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
              <InputLabel>{filters[3].label}</InputLabel>
              <Select
                value={selectedFilters.statuses}
                onChange={(e) => handleChange(e, filters[3].name)}
                input={<OutlinedInput label={filters[3].label} />}
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
export default VacancyFilters;
