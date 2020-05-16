export interface Task {
    id: number,
    name: string,
    remarks: string,
    done: boolean,
    dueDateTime: Date,
    dueDate: number
}