import { User } from "./user";

export interface Assistants {
    meeting_id: number,
    user_id: User,
    stamp: string,
    status: number
}
