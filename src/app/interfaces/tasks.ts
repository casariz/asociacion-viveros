import { Meetings } from "./meetings";
import { Person } from "./person";
import { Status } from "./status";

export interface Tasks {
    task_id: number,
    meeting: Meetings,
    start_date: string,
    estimated_time: string,
    units: number,
    type_id: number,
    task_description: string,
    assigned_to: Person,
    observations: string,
    created_by: Person,
    creation_date: string,
    reviewed_by: number,
    review_date: string,
    status: Status
}
