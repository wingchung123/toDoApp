

import { update } from "lodash";
import { Status, Task } from "struct/task";
import { getEnvironmentData } from "worker_threads";

export class TaskDbUtils {

    _mapOfTasks: Map<number, Task>;
    _nextTaskId: number; // store as next task ID so that UI can generate view accordingly prior to adding to DB

    constructor() {
        this._mapOfTasks = new Map<number, Task>()
        this._nextTaskId = 1
    }

    get nextTaskId() {
        return this._nextTaskId
    }

    get size() {
        return this._mapOfTasks.size
    }

    addTask(userId: number, title: string, description: string, status:Status=Status.Open): Task {
        let new_task_id = this._nextTaskId

        // Create new task and add it to the DB
        let new_task = new Task(new_task_id, userId, title, description, status)
        this._mapOfTasks.set(new_task_id, new_task)

        // increment _nextTaskId
        this._nextTaskId+= 1

        return new_task
    }

    updateTask(updated_task:Task): boolean {
        if (this.hasTask(updated_task.taskId)) {
            this._mapOfTasks.set(updated_task.taskId, updated_task);
            return true
        } else {
            throw RangeError(`[TaskDbUtils] updateTask(): Cannot get task with ID ${updated_task.taskId}`)
        }
    }
    
    getTask(task_id: number): Task {

        if ( this.hasTask(task_id) ) {
            let returnTask = this._mapOfTasks.get(task_id);
            if (returnTask !== undefined) {
                return returnTask
            }
        }
        // if function reaches here, no task was found; throw error
        throw RangeError(`[TaskDbUtils] getTask(): Cannot get task with ID ${task_id}`)
    }

    removeTask(task_id: number) {
        if ( this.hasTask(task_id) ) {
            this._mapOfTasks.delete(task_id)
        } else {
            throw RangeError(`[TaskDbUtils] removeTask(): Cannot find task with ID ${task_id}`)
        }
    }

    listAllTasks(): Task[] {
        return Array.from(this._mapOfTasks.values())
    }

    hasTask(task_id: number) {
        return this._mapOfTasks.has(task_id);
    }

}
