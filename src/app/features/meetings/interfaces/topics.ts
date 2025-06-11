import { Status } from "../../../interfaces/status";

export interface Topic {
    topic_id: number;
    meeting_id: number;
    type: string;
    topic: string;
    status: number;
    formattedTopic?: string;
}