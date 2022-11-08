
import {Status, Task} from 'struct/task'


describe('Task Struct', () => {

    let testTaskId: number;
    let testUserId: number;
    let testTitle: string;
    let testDescription: string;
    let testStatus: Status;


    beforeEach(() => {
        testTaskId = 1;
        testUserId = 1;
        testTitle = 'Test Titile';
        testDescription = 'Test Description'
        testStatus = Status.Open
    })

    it('does create Task object as expected', () => {
        let testTask = new Task(testTaskId, testUserId, testTitle, testDescription, testStatus)

        expect(testTask.taskId).toBe(testTaskId);
        expect(testTask.userId).toBe(testUserId);
        expect(testTask.title).toBe(testTitle);
        expect(testTask.description).toBe(testDescription);
        expect(testTask.status).toBe(testStatus);
    });

});