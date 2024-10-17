export type VacanciesType = {
  id: number;
  title: string;
  vacancy_type: VacancyType;
  status: StatusType;
  priority: PriorityType;
  division: DivisionType;
  min_expirience: number;
  value_candidates: number;
  value_responses: number;
  description: string;
  created_at: string;
  finished_at: string | null;
  responsible: HRType;
};

export type CreateVacancyType = {
  title: string;
  vacancy_type_id: number | string;
  priority_id: number | string;
  division_id: number | string;
  min_expirience: number;
  description: string;
  hr_id: number | string;
};

export type VacancyType = {
  id: number;
  title: string;
};

export type StatusType = {
  id: number;
  title: string;
};

export type PriorityType = {
  id: number;
  title: string;
};

export type DivisionType = {
  id: number;
  title: string;
};

export type HRType = {
  id: number;
  fio: string;
  phone: string;
  email: string;
  is_head: boolean;
};
