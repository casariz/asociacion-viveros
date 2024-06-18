export interface TasksInterface {
    task_id: number,
    meeting_id: number,
    start_date: string,
    estimated_time: string,
    units: number,
    type_id: number,
    task_description: string,
    assigned_to: number,
    department_id: number,
    observations: string,
    created_by: number,
    creation_date: string,
    reviewed_by: number,
    review_date: string,
    status: number
}
