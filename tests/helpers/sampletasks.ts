import {Status, Task} from 'struct/task'

export let OpenTask1 = new Task(1, 1,"Open Task Title", 'Open Task Description', Status.Open);
export let ClosedTask2 = new Task(2, 1,"Closed Task Title", 'Closed Task Description', Status.Closed);
export let BlockedTask3 = new Task(3, 1,"Blocked Task Title", 'Blocked Task Description', Status.Blocked);
export let InProgressTask4 = new Task(4, 1,"In Progress Task Title", 'In Progress Task Description', Status.InProgress);