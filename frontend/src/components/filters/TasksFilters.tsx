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
import { TasksFilterType, TasksFilterArrType } from "../../types/filtersTypes";

const TasksFilters = ({ selectedFilters, setSelectedFilters }: { selectedFilters: TasksFilterType, setSelectedFilters: (selectedFilters: any) => void; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TasksFilterArrType | null>(null);

  const filters = [
    { name: "hrs", label: "Ответственный" },
    { name: "priorities", label: "Приоритет" },
    { name: "done", label: "Закрыта" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:8080/api/hrs"),
          fetch("http://localhost:8080/api/priorities"),
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
          priorities: results[1],
          done: false
        });
      } catch (err: any) {
        throw new Error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any, filterName: string) => {
    if (filterName === filters[2].name) {
      setSelectedFilters((prev: TasksFilterType) => ({
        ...prev,
        [filterName]: Boolean(Number(e.target.value))
      }));
    }
    else setSelectedFilters((prev: TasksFilterType) => ({
      ...prev,
      [filterName]: e.target.value
    }));
    console.log(selectedFilters)
  };

  const handleReset = () => {
    setSelectedFilters({
      hrs: null,
      priorities: null,
      done: true
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
                value={selectedFilters.done ? 1 : 0}
                onChange={(e) => handleChange(e, filters[2].name)}
                input={<OutlinedInput label={filters[2].label} />}
              >
                <MenuItem key={0} value={0}>
                  Нет
                </MenuItem>
                <MenuItem key={1} value={1}>
                  Да
                </MenuItem>
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
export default TasksFilters;
