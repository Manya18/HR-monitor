import {
  DivisionType,
  HRType,
  PriorityType,
  StatusType,
  VacancyType,
} from "./VacanciesType";

export type VacancyFilterType = {
  hrs: HRType | null;
  divisions: DivisionType | null;
  priorities: PriorityType | null;
  statuses: StatusType | null;
};

export type VacancyFilterArrType = {
  hrs: HRType[];
  divisions: DivisionType[];
  priorities: PriorityType[];
  statuses: StatusType[];
};

export type CandidateFilterType = {
  hrs: HRType | null;
  vacancies: VacancyType | null;
  statuses: StatusType | null;
};

export type CandidateFilterArrType = {
  hrs: HRType[];
  vacancies: VacancyType[];
  statuses: StatusType[];
};

export type TasksFilterType = {
    hrs: HRType | null;
    priorities: PriorityType | null;
    done: boolean;
  };
  
  export type TasksFilterArrType = {
    hrs: HRType[];
    priorities: PriorityType[];
    done: boolean;
  };
  