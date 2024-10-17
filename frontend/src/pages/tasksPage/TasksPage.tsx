import "./tasksPage.css";
import PageLayout from "../../layouts/pageLayout/PageLayout";
import { TaskType } from "../../types/TaskType";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useEffect, useState } from "react";
import { parseDateTime } from "../../logic/parseDateTime";
import TaskView from "../../components/taskView/TaskView";
import SortSelect from "../../components/sortSelect/SortSelect";
import { TasksFilterType } from "../../types/filtersTypes";
import TasksFilters from "../../components/filters/TasksFilters";

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<TasksFilterType>({
    hrs: null,
    priorities: null,
    done: true
  });

  const getQueryString = () => {
    const params = [];

    if (selectedFilters.hrs) {
      params.push(`hr_id=${selectedFilters.hrs}`);
    }
    if (selectedFilters.priorities) {
      params.push(`priority_id=${selectedFilters.priorities}`);
    }
    if (selectedFilters.done !== null) {
      params.push(`done=${selectedFilters.done}`);
    }
    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/tasks${getQueryString()}`);
        if (!response.ok) {
          throw new Error("Trouble");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        throw new Error("Trouble");
      }
    };
    fetchTasks();
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

  const handleRowClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };
  return (
    <PageLayout tab="tasks">
      <div className="page-title">
        <div>Задачи</div>
      </div>
      <div className="page-content">
        <div className="page-filters">
          <SortSelect></SortSelect>
          <TasksFilters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}></TasksFilters>
        </div>
        <table className="content-table">
          <thead>
            <tr className="content-table-head">
              <th>Описание задачи</th>
              <th>Приоритет</th>
              <th>Дедлайн</th>
              <th>Ответственный</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                className="content-table-rows"
                key={task.id}
                onClick={() => handleRowClick(task.id)}
              >
                <td className="">{task.title}</td>
                <td>
                  <span
                    className={`priority-circle ${getPriorityColor(
                      task.priority.title
                    )}`}
                  />
                  {task.priority.title}
                </td>
                <td className="">{parseDateTime(task.deadline).date}</td>
                <td className="TasksPage-responsible">
                  <AccountCircleOutlinedIcon style={{ marginRight: "5px" }} />
                  {task.responsible.fio}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TaskView open={open} setOpen={setOpen} taskId={selectedTaskId} />
    </PageLayout>
  );
};

export default TasksPage;
