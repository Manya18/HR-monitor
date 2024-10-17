import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./createVacancy.css";
import { useEffect, useState } from "react";
import {
  DivisionType,
  HRType,
  PriorityType,
  VacanciesType,
} from "../../types/VacanciesType";
import ModalLayout from "../../layouts/ModalLayout";

const CreateVacancy = ({open, setOpen }: { open: boolean; setOpen: (isOpen: boolean) => void; }) => {
  const [responsible, setResponsible] = useState("");
  const [responsibles, setResponsibles] = useState<HRType[]>([]);
  const [division, setDivision] = useState("");
  const [divisions, setDivisions] = useState<DivisionType[]>([]);
  const [vacanciesType, setVacanciesType] = useState("");
  const [vacanciesTypes, setVacanciesTypes] = useState<VacanciesType[]>([]);
  const [priority, setPriority] = useState("");
  const [priorities, setPriorities] = useState<PriorityType[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [experience, setExperience] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    p: 4,
  };

  const createVacancy = async () => {
    const response = await fetch("http://localhost:8080/api/vacancy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        vacancy_type_id: vacanciesType,
        priority_id: priority,
        division_id: division,
        min_expirience: parseInt(experience),
        description: desc,
        hr_id: responsible,
      }),
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchResponsibles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hrs/");
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: HRType[] = await response.json();
        setResponsibles(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    const fetchDivisions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/divisions/");
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: DivisionType[] = await response.json();
        setDivisions(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    const fetchVacanciesTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/vacancy_types/"
        );
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: VacanciesType[] = await response.json();
        setVacanciesTypes(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    const fetchsetPriorities = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/priorities/");
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data: VacanciesType[] = await response.json();
        setPriorities(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    fetchResponsibles();
    fetchDivisions();
    fetchVacanciesTypes();
    fetchsetPriorities();
  }, []);

  return (
    <ModalLayout open={open} setOpen={setOpen} style={style}>
      <div className="VacanciesPage-modal-title">Создать вакансию</div>
      <div className="VacanciesPage-modal-content">
        <div className="VacanciesPage-modal-wrapper">
          <div className="VacanciesPage-modal-side">
            <TextField
              id="outlined-basic"
              label="Название"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Описание"
              multiline
              rows={4}
              variant="outlined"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="responsible-select-label">
                Ответственный
              </InputLabel>
              <Select
                labelId="responsible-select-label"
                id="responsible-select"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                label="Ответственный"
              >
                {responsibles.map((responsible) => (
                  <MenuItem key={responsible.id} value={responsible.id}>
                    {responsible.fio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="VacanciesPage-modal-side">
            <FormControl fullWidth>
              <InputLabel id="division-select-label">Отдел</InputLabel>
              <Select
                labelId="division-select-label"
                id="division-select"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                label="Отдел"
              >
                {divisions.map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="post-select-label">Должность</InputLabel>
              <Select
                labelId="post-select-label"
                id="post-select"
                value={vacanciesType}
                onChange={(e) => setVacanciesType(e.target.value)}
                label="Должность"
              >
                {vacanciesTypes.map((vacanciesType) => (
                  <MenuItem key={vacanciesType.id} value={vacanciesType.id}>
                    {vacanciesType.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="priority-select-label">Приоритет</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Приоритет"
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.id} value={priority.id}>
                    {priority.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Опыт работы"
              type="number"
              fullWidth
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="VacanciesPage-modal-btnGroup">
          <button
            className="outlined-button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Отмена
          </button>
          <button className="red-button" onClick={createVacancy}>
            Создать
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default CreateVacancy;
