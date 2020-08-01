export interface Task {
    id: number,
    name: string,
    remarks: string,
    done: boolean,
    dueDateTime: Date,
    dueDate: number,
    repeat: string,
    repeating: string,
    list: string,
    refTaskId: number,
    type: string,
    detail: any
}

export interface TaskForDisplay {
    id: number,
    name: string,
    remarks: string,
    done: boolean,
    dueDateTime: Date,
    dueDate: number,
    repeat: string,
    repeating: string,
    list: string,
    refTaskId: number,
    type: string,
    detail: any,
    expanded: boolean
}