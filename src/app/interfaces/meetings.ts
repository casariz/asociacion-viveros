import { User } from "./user";
import { Status } from "./status";

export interface Meetings {
    meeting_id: number,
    meeting_date: string,
    start_hour: string,
    called_by: User,
    placement: string,
    meeting_description: string,
    topics: string,
    created_by: User,
    creation_date: string,
    status: Status
}
