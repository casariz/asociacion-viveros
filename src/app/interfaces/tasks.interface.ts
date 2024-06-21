import { MeetingsInterface } from "./meetings.interface";
import { Person } from "./person";
import { Status } from "./status";

export interface TasksInterface {
    task_id: number,
    meeting_id: MeetingsInterface,
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
