import { Status } from "../../../interfaces/status";
import { Meetings } from "../../meetings/interfaces/meetings";
import { User } from "../../users/interfaces/user";


export interface Tasks {
    task_id: number,
    meeting: Meetings,
    start_date: string,
    estimated_time: string,
    units: number,
    type_id: number,
    task_description: string,
    assigned_to: User,
    observations: string,
    created_by: User,
    creation_date: string,
    reviewed_by: number,
    review_date: string,
    status: Status
}
