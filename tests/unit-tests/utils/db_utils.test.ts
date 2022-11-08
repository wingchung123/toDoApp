
import { Task } from "struct/task";
import { TaskDbUtils } from "utils/db_utils";

import { OpenTask1, ClosedTask2, BlockedTask3, InProgressTask4 } from "../../helpers/sampletasks";


describe('Task DB Utils Empty DB', () => {

    let testDB: TaskDbUtils;

    beforeEach(() => {
        testDB = new TaskDbUtils();
    })

    it('does add an item to the DB', () => {
        // expect testDB is empty prior
        expect(testDB.size).toBe(0);

        testDB.addTask(
            OpenTask1.userId, 
            OpenTask1.title,
            OpenTask1.description,
            OpenTask1.status
        );

        // size should be = 1
        expect(testDB.size).toBe(1);
    });

    it('does set initial task id to 1', () => {
        // expect testDB is empty prior
        expect(testDB.size).toBe(0);

        let newTask = testDB.addTask(
            OpenTask1.userId, 
            OpenTask1.title,
            OpenTask1.description,
            OpenTask1.status
        );

        expect(newTask.taskId).toBe(1);
    });

    it('does increment next_task_id', () => {
        // expect testDB is empty prior
        expect(testDB.size).toBe(0);

        let newTask = testDB.addTask(
            OpenTask1.userId, 
            OpenTask1.title,
            OpenTask1.description,
            OpenTask1.status
        );

        expect(testDB.nextTaskId).toBe(2);
    });

});

describe('Task DB Utils Non-empty DB', () => {

    let testDB: TaskDbUtils;

    beforeEach(() => {
        testDB = new TaskDbUtils();

        testDB.addTask(
            OpenTask1.userId, 
            OpenTask1.title,
            OpenTask1.description,
            OpenTask1.status
        );
        testDB.addTask(
            ClosedTask2.userId, 
            ClosedTask2.title,
            ClosedTask2.description,
            ClosedTask2.status
        );
        testDB.addTask(
            BlockedTask3.userId, 
            BlockedTask3.title,
            BlockedTask3.description,
            BlockedTask3.status
        );
    })

    it('does have 3 keys but not 1', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        expect(testDB.hasTask(OpenTask1.taskId)).toBeTruthy();
        expect(testDB.hasTask(ClosedTask2.taskId)).toBeTruthy();
        expect(testDB.hasTask(BlockedTask3.taskId)).toBeTruthy();
        expect(testDB.hasTask(InProgressTask4.taskId)).toBeFalsy();
    })

    it('does add more items and increments next_task_id', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        testDB.addTask(
            InProgressTask4.userId, 
            InProgressTask4.title,
            InProgressTask4.description,
            InProgressTask4.status
        );

        expect(testDB.size).toBe(4);
        expect(testDB.nextTaskId).toBe(5);

    });

    it('does update multiple items and keeps others unchanged', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        let newUserId = 10;
        let newTitle = "New title";

        let testOpenTask: Task = testDB.getTask(OpenTask1.taskId);
        let testClosedTask: Task = testDB.getTask(ClosedTask2.taskId);

        testOpenTask.userId = newUserId;
        testClosedTask.title = newTitle;

        testDB.updateTask(testOpenTask);
        testDB.updateTask(testClosedTask)

        let testBlockedTask: Task = testDB.getTask(BlockedTask3.taskId);

        // size is unchanged
        expect(testDB.size).toBe(3);

        expect(testOpenTask.equals(OpenTask1)).toBeFalsy();
        expect(testOpenTask.userId).toBe(newUserId);
        expect(testClosedTask.equals(ClosedTask2)).toBeFalsy();
        expect(testClosedTask.title).toBe(newTitle);
        expect(testBlockedTask.equals(BlockedTask3)).toBeTruthy();

    });

    it('does throw error when updating non-existent task', () => {
        // 3 tasks in DB & InProgress task not in DB
        expect(testDB.size).toBe(3);
        expect(testDB.hasTask(InProgressTask4.taskId)).toBeFalsy()

        let newUserId = 10;

        InProgressTask4.userId = newUserId;

        try {
            testDB.updateTask(InProgressTask4);
        } catch (e:any) {
            expect(e).toBeInstanceOf(RangeError)
            expect((e.message as string)).toContain(`${InProgressTask4.taskId}`)
        }
        
        // size is unchanged
        expect(testDB.size).toBe(3);
    });

    it('does get multiple items', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        let testOpenTask = testDB.getTask(OpenTask1.taskId);
        let testClosedTask = testDB.getTask(ClosedTask2.taskId);
        let testBlockedTask = testDB.getTask(BlockedTask3.taskId);

        // size is unchanged
        expect(testDB.size).toBe(3);

        expect(testOpenTask.equals(OpenTask1)).toBeTruthy();
        expect(testClosedTask.equals(ClosedTask2)).toBeTruthy();
        expect(testBlockedTask.equals(BlockedTask3)).toBeTruthy();

    });

    it('does remove multiple items', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        // remove 2 tasks
        testDB.removeTask(OpenTask1.taskId);
        testDB.removeTask(ClosedTask2.taskId);

        // only 1 task left in DB
        expect(testDB.size).toBe(1);
        expect(testDB.hasTask(OpenTask1.taskId)).toBeFalsy();
        expect(testDB.hasTask(ClosedTask2.taskId)).toBeFalsy();
        expect(testDB.hasTask(BlockedTask3.taskId)).toBeTruthy();

    });

    it('does throw error when removing non-existing task', () => {
        // 3 tasks in DB & InProgress task not in DB
        expect(testDB.size).toBe(3);
        expect(testDB.hasTask(InProgressTask4.taskId)).toBeFalsy()

        try {
            testDB.removeTask(InProgressTask4.taskId);
        } catch (e:any) {
            expect(e).toBeInstanceOf(RangeError)
            expect((e.message as string)).toContain(`${InProgressTask4.taskId}`)
        }
        
        expect(testDB.size).toBe(3);

    });

    it('does throw error when trying to get or update removed tasks', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        // remove 2 tasks
        testDB.removeTask(OpenTask1.taskId);
        testDB.removeTask(ClosedTask2.taskId);

        // expect correct error instances & messages
        try {
            testDB.getTask(OpenTask1.taskId);
        } catch (e:any) {
            expect(e).toBeInstanceOf(RangeError)
            expect((e.message as string)).toContain(`${OpenTask1.taskId}`)
        }

        try {
            testDB.updateTask(ClosedTask2);
        } catch (e:any) {
            expect(e).toBeInstanceOf(RangeError)
            expect((e.message as string)).toContain(`${ClosedTask2.taskId}`)
        }

        // still able to get existing task
        let testBlockedTask = testDB.getTask(BlockedTask3.taskId);
        expect(testBlockedTask.equals(BlockedTask3)).toBeTruthy();
    });

    it('does list tasks', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        let listOfTasks = testDB.listAllTasks();

        expect(testDB.size).toBe(3);
        expect(listOfTasks).toContainEqual(OpenTask1);
        expect(listOfTasks).toContainEqual(ClosedTask2);
        expect(listOfTasks).toContainEqual(BlockedTask3);
        expect(listOfTasks).not.toContainEqual(InProgressTask4);
    });

    it('does not list removed tasks', () => {
        // 3 tasks in DB
        expect(testDB.size).toBe(3);

        testDB.removeTask(OpenTask1.taskId);
        let listOfTasks = testDB.listAllTasks();

        expect(testDB.size).toBe(2);
        expect(listOfTasks).not.toContainEqual(OpenTask1);
        expect(listOfTasks).toContainEqual(ClosedTask2);
        expect(listOfTasks).toContainEqual(BlockedTask3);
        expect(listOfTasks).not.toContainEqual(InProgressTask4);
    });


});