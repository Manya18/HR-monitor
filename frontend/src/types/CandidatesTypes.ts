import { VacanciesType } from "./VacanciesType"

export type CandidateType = {
    fio: string,
    phone: string,
    status: string,
    description: string,
    vacancies: VacanciesType[],
    responsible: string,
}