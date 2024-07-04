import { User } from "./user";
import { Status } from "./status";

export interface Wallet {
    obligation_id: number,
    obligation_description: string,
    category_id: number,
    server_name: string,
    quantity: number,
    period: string,
    alert_time: number,
    created_by: User,
    last_payment: number,
    expiration_date: string,
    observations: string,
    internal_reference: string,
    reviewed_by: User,
    reviewed_date: string,
    status: Status,
}