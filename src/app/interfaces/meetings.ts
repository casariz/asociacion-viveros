import { Person } from "./person";
import { Status } from "./status";

export interface Meetings {
    meeting_id: number,
    meeting_date: string,
    start_hour: string,
    called_by: Person,
    placement: string,
    meeting_description: string,
    topics: string,
    created_by: Person,
    creation_date: string,
    status: Status
}
