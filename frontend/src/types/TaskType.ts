import { HRType, PriorityType, StatusType } from "./VacanciesType"

export type TaskType = {
    id: number,
    candidate_id: number,
    deadline: string,
    done: boolean,
    finished_at: string | null
    title: string,
    status: StatusType,
    priority: PriorityType,
    description: string,
    responsible: HRType,
    vacancy_id: number
}