import { useEffect, useState } from "react";
import ModalLayout from "../../layouts/ModalLayout";

const VacancyView = ({
  open,
  setOpen,
  vacancy_id,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  vacancy_id: number;
}) => {
  const [vacancyData, setVacancyData] = useState<any | null>(null);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    p: 4,
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      if (vacancy_id) {
        try {
          const response = await fetch(`http://localhost:8080/api/vacancy/${vacancy_id}`);
          if (!response.ok) throw new Error("Trouble");
          const taskData = await response.json();
          setVacancyData(taskData);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchVacancies();
  }, [vacancy_id]);

  return (
    <ModalLayout open={open} setOpen={setOpen} style={style}>
      {vacancyData ? (
        <div>
          <h2>{vacancyData.title}</h2>
          <p><strong>Описание:</strong> {vacancyData.description}</p>
          <p><strong>Тип вакансии:</strong> {vacancyData.vacancy_type_id}</p>
          <p><strong>Приоритет:</strong> {vacancyData.priority.title}</p>
          <p><strong>Минимальный опыт:</strong> {vacancyData.min_expirience} лет</p>
          <p><strong>Отдел:</strong> {vacancyData.division.title}</p>
          <p><strong>Ответственный:</strong> {vacancyData.responsible.fio}</p>
          <p><strong>Создано:</strong> {new Date(vacancyData.created_at).toLocaleDateString()}</p>
          <p><strong>Закрыто:</strong> {new Date(vacancyData.finished_at).toLocaleDateString()}</p>
          <p><strong>Количество откликов:</strong> {vacancyData.value_responses}</p>
          <p><strong>Количество кандидатов:</strong> {vacancyData.value_candidates}</p>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </ModalLayout>
  );
};

export default VacancyView;
