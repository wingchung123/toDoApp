import isEqual from 'lodash.isequal';

export enum Status {
    Open = 'Open',
    InProgress = 'In Progress',
    Blocked = 'Blocked',
    Closed = 'Closed'
}

export class Task { 
    _taskId : number;
    _userId : number;
    _title : string;
    _description : string;
    _status : Status;

    constructor(taskId: number, userId: number, title: string, description: string, status:Status) {
        this._taskId = taskId;
        this._userId = userId;
        this._title = title;
        this._description = description
        this._status = status;
    }

    get taskId() {
        return this._taskId
    }

    get userId() {
        return this._userId
    }

    set userId(value:number) {
        this._userId = value;
    }

    get title() {
        return this._title
    }

    set title(value: string) {
        this._title = value;
    }

    get description() {
        return this._description
    }

    set description(value:string) {
        this._description = value
    }

    get status() {
        return this._status
    }

    set status(value:Status) {
        this._status = value
    }

    equals(obj1: any): boolean {
        return isEqual(this, obj1)
    }

    toJSON() {
        return {
            "taskId" : this._taskId,
            "userId" : this._userId,
            "title" : this._title,
            "description" : this._description,
            "status" : this._status
        }
    }

    
}