export interface Task {
    id: number,
    name: string,
    remarks: string,
    done: boolean,
    dueDateTime: Date,
    dueDate: number,
    repeat: string,
    list: string,
    refTaskId: number,
    type: string,
    detail: any
}