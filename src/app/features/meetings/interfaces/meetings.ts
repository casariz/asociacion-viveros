import { Status } from "../../../interfaces/status";
import { User } from "../../users/interfaces/user";
import { Topic } from "./topics";


export interface Meetings {
    meeting_id: number,
    meeting_date: string,
    start_hour: string,
    called_by: string,
    placement: string,
    meeting_description: string,
    topics: Topic | Topic[] | string,
    director: User,
    secretary: User,
    created_by: User,
    creation_date: string,
    status: Status
}