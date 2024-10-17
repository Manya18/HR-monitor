import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import ModalLayout from "../../layouts/ModalLayout";
import "./taskView.css";
import { useEffect, useState } from "react";
import { DivisionType, HRType, PriorityType, StatusType, VacanciesType } from "../../types/VacanciesType";
import { parseDateTime } from "../../logic/parseDateTime";

const TaskView = ({
  open,
  setOpen,
  taskId,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  taskId: number | null;
}) => {
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [isStatusesOpen, setIsStatusesOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StatusType>();

  const [responsible, setResponsible] = useState("");
  const [responsibles, setResponsibles] = useState<HRType[]>([]);
  const [division, setDivision] = useState("");
  const [vacancyId, setVacancyId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [candidateFIO, setCandidateFIO] = useState("");
  const [priority, setPriority] = useState("");
  const [priorities, setPriorities] = useState<PriorityType[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [descCandidate, setDescCandidate] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [experienceCandidate, setExperienceCandidate] = useState("");
  const [experience, setExperience] = useState("");

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
    fetchsetPriorities();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    p: 4,
    overflowY: "scroll",
    maxHeight: "80vh",
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/candidateStatuses`);
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    fetchStatuses();
  }, []);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (taskId) {
        try {
          const response = await fetch(`http://localhost:8080/api/task/${taskId}`);
          if (!response.ok) throw new Error("Trouble");
          const taskData = await response.json();
          setTitle(taskData.title);
          setCandidateId(taskData.candidate_id)
          setStatus(taskData.status.title)
          setDeadline(taskData.deadline);
          setVacancyId(taskData.vacancy_id)
          setPriority(taskData.priority.id);
          setResponsible(taskData.responsible.fio)
        } catch (error) {
          console.error(error);
        }
      }
    };
    const fetchCandidatesDetails = async () => {
      if (candidateId) {
        try {
          const response = await fetch(`http://localhost:8080/api/candidate/${candidateId}`);
          if (!response.ok) throw new Error("Trouble");
          const taskData = await response.json();
          setCandidateFIO(taskData.fio);
          setDescCandidate(taskData.description);
          setExperienceCandidate(taskData.expirience);
        } catch (error) {
          console.error(error);
        }
      }
    };
    const fetchVacancies = async () => {
      if (vacancyId) {
        try {
          const response = await fetch(`http://localhost:8080/api/vacancy/${vacancyId}`);
          if (!response.ok) throw new Error("Trouble");
          const taskData = await response.json();
          setDesc(taskData.description);
          setExperience(taskData.min_expirience);
          setDivision(taskData.division.title);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchTaskDetails();
    fetchCandidatesDetails();
    fetchVacancies();
  }, [taskId, candidateId, vacancyId]);

  const changeTaskStatus = async (status: StatusType, candidateId: number) => {
    if (!taskId) return;
    console.log('dsdsd', vacancyId, status.id)


    const response = await fetch(`http://localhost:8080/api/candidate/${candidateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vacancy_id: vacancyId,
        status_id: status.id,
      }),
    });

    if (response.ok) {
      setIsStatusesOpen(false);
      setOpen(false);
    }
  }

  return (
    <ModalLayout open={open} setOpen={setOpen} style={style}>
      <div className="TaskView-title page-title">
        <div className=""> Задача {taskId}</div>
      </div>
      <div className="TaskView-content">
        <div className="TaskView-content-columns">
          <div className="TaskView-content-vacancy">
            <div className="TaskView-content-vacancy-title">Вакансия</div>
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Описание"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              multiline
              rows={2}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Отдел"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Необходимый опыт работы"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              type="number"
              disabled
            />
            <FormControl fullWidth>
              <InputLabel id="TaskView-priority">Приоритет</InputLabel>
              <Select
                labelId="TaskView-priority-label"
                id="TaskView-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label="Priority"
                disabled
              >
                {priorities.map((prior) => (
                  <MenuItem key={prior.id} value={prior.id}>{prior.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="TaskView-content-candidates">
            <div className="TaskView-content-candidates-title">Кандидат</div>
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="ФИО"
              value={candidateFIO}
              onChange={(e) => setCandidateFIO(e.target.value)}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Резюме"
              value={descCandidate}
              onChange={(e) => setDescCandidate(e.target.value)}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Опыт работы"
              value={experienceCandidate}
              onChange={(e) => setExperienceCandidate(e.target.value)}
              disabled
            />
            <TextField
              className="TaskView-textfield"
              required
              id="outlined-required"
              label="Статус кандидата"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled
            />
          </div>
        </div>
        <div className="TaskView-content-commonInfo">
          <div className="TaskView-content-commonInfo-title">О задаче</div>
          <TextField
            className="TaskView-textfield"
            required
            id="outlined-required"
            value={parseDateTime(deadline).date}
            onChange={(e) => setDeadline(e.target.value)}
            label="Дедлайн"
            disabled
          />
          <TextField
            className="TaskView-textfield"
            required
            id="outlined-required"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            label="Описание"
            disabled
          />
          <FormControl fullWidth>
            <InputLabel id="TaskView-commonInfo-priority">Приоритет</InputLabel>
            <Select
              labelId="TaskView-priority-label"
              id="TaskView-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
              disabled
            >
              {priorities.map((prior) => (
                <MenuItem key={prior.id} value={prior.id}>{prior.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="TaskView-textfield"
            required
            id="outlined-required"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            label="Ответственный"
            disabled
          />
        </div>
      </div>
      <div className="TaskView-btnGroup">
        <button className="outlined-button" onClick={() => { setOpen(false); setIsStatusesOpen(false) }}>
          Отмена
        </button>
        <div className="TaskView-btnGroup-dropdown">
          <button className="red-button" onClick={() => setIsStatusesOpen(!isStatusesOpen)}>
            Выполнено
          </button>
          {isStatusesOpen && statuses && (
            <ul className="TaskView-btnGroup-dropdown-menu">
              {statuses.map((status) => (
                <li key={status.id} onClick={() => changeTaskStatus(status, status.id)}>
                  {status.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ModalLayout>
  );
};

export default TaskView;
