
import * as readline from 'readline';

import { TaskDbUtils } from './utils/db_utils';
import { Status, Task } from "./struct/task";
import { resolve } from 'path';
import { resourceUsage } from 'process';
import { stat } from 'fs';
import { json } from 'stream/consumers';

let db = new TaskDbUtils();
let menuHeaders = (title:string) =>  {return `---------------------\n${title}\n---------------------\n`} 
let mainMenu = menuHeaders("Main Menu")
let addTaskMenu = menuHeaders("Add Task Menu")
let removeTaskMenu = menuHeaders("Remove Task Menu")
let editTaskMenu = menuHeaders("Edit Task Menu")
let taskStatus = "\n\t1. Open\n\t2. In Progress\n\t3. Blocked\n\t4. Closed\n"


let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(question_prompt:string) {
    return new Promise(resolve => rl.question(question_prompt, answ => resolve(answ)))
}

let exitProgram = function() {
	rl.close();
	process.stdin.destroy();
	process.stdout.destroy();
}

let parseUserInputStatus = function(statusString:String): Status | undefined {
	let status: Status | undefined;
	switch(statusString) {
		case '1':
			status = Status.Open;
			break;
		case '2':
			status = Status.InProgress;
			break;
		case '3':
			status = Status.Blocked;
			break;
		case '4':
			status = Status.Closed;
			break;
		default:
			console.log('Invalid Option! Exiting...');
			exitProgram();
	}
	return status;
}

let addTaskUserInput = async function() {
	let userId = <string> await question(`${addTaskMenu}[Task Creation] What the user Id (must be integer)?\n`)
	let title = <string> await question('[Task Creation] What is the task title?\n')
	let description = <string> await question('[Task Creation] What is the task description?\n')
	let statusString = <string> await question(`[Task Creation] What is the task status?${taskStatus}`)
	let status = parseUserInputStatus(statusString)
	if (status === undefined) {
		return false
	}

	let task = db.addTask(parseInt(userId), title, description, status);
	let taskJSON = task.toJSON();
	console.log(`Added the following task:\n${JSON.stringify(taskJSON, null, 4)}`)
	return true
}

let removeTaskUserInput = async function () {
	let taskToRemoveString =  <string> await question(`${removeTaskMenu}[Task Removal] What the task Id (must be integer)?\n`)

	if (Number.isNaN(Number(taskToRemoveString))) {
		console.log("Invalid integer")
		return false
	} else {
		let taskToRemove:number = parseInt(taskToRemoveString);
		if (db.hasTask(taskToRemove)) {
			db.removeTask(taskToRemove)
			console.log(`\nRemoved task with ID ${taskToRemove}\n\n\n`)
			return true
		} else {
			console.log(`Unable to find task with ID ${taskToRemove}`)
			return false

		}
	}
}

let editTaskUserInput = async function () {
	let taskToEditString =  <string> await question(`${editTaskMenu}[Task Edit] What the task Id (must be integer)?\n`)
	
	if (Number.isNaN(Number(taskToEditString))) {
		console.log("Invalid integer")
		return false
	} else {
		let taskToEdit:number = parseInt(taskToEditString);
		if (db.hasTask(taskToEdit)) {

			let task:Task = db.getTask(taskToEdit)

			// Prompt user to change values
			let userIdPrompt =  <string> await question(`[Task Edit] What the user Id (must be integer)?\nCurrent value ${task.taskId};Enter to skip update...\n`)
			if (Number.isNaN(Number(userIdPrompt))) {
				console.log("Invalid integer")
				return false
			}
			task.userId = userIdPrompt == '' ? task.userId : parseInt(userIdPrompt)

			let titlePrompt =  <string> await question(`[Task Edit] What the title?\nCurrent value ${task.title};Enter to skip update...\n`)
			task.title = titlePrompt == '' ? task.title : titlePrompt

			let descriptionPrompt =  <string> await question(`[Task Edit] What the title?\nCurrent value ${task.title};Enter to skip update...\n`)
			task.description = descriptionPrompt == '' ? task.description : descriptionPrompt

			let statusString =  <string> await question(`[Task Edit] What is the task status?${taskStatus};Enter to skip update...\n`)
			task.status = statusString == '' ? task.status : <Status> parseUserInputStatus(statusString)

			// update DB
			db.updateTask(task)
			console.log(`\nUpdated task with ID ${taskToEdit}\n\n\n`)

			return true
		} else {
			console.log(`Unable to find task with ID ${taskToEdit}`)
			return false

		}
	}
}

let listAllTasksFromUserInput = async function() {
	let listOfTasks = db.listAllTasks();
	listOfTasks.forEach((task) => {
		console.log(`${JSON.stringify(task.toJSON(), null, 4)}`)
	})
}

let waitForMainMenuInput = async function() {

	let mainMenuOption = await question(`${mainMenu}1. Add Task\n2. Remove Task\n3. Edit Task\n4. List All Tasks\n5. Exit\n`);
	switch(mainMenuOption) {
		case '1':
			let addSuccess = await addTaskUserInput();
			console.log(addSuccess ? "Successfully added task." : "Failed to add task")
			waitForMainMenuInput();
			break;
		case '2':
			let removeSuccess = await removeTaskUserInput()
			console.log(removeSuccess ? "Successfully removed task." : "Failed to remove task")
			waitForMainMenuInput();
			break;
		case '3':
			let editSuccess = await editTaskUserInput();
			console.log(editSuccess ? "Successfully updated task." : "Failed to update task")
			waitForMainMenuInput();
			break;
		case '4':
			listAllTasksFromUserInput();
			waitForMainMenuInput();
			break;
		case '5':
			console.log('Gracefully Exiting...');
			exitProgram();
			break;
		default:
			console.log('Invalid Option! Exiting...');
			exitProgram();
	}

}

waitForMainMenuInput()