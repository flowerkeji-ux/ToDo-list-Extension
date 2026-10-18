
let tasks = [];

const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskSummary = document.querySelector('#task-summary');

function save() {
    chrome.storage.local.set({ tasks });
}

function DoTheTask() {
    taskList.replaceChildren();
    if(tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = '';
        emptyMessage.classList.add('empty');
        taskList.append(emptyMessage);
    }
    tasks.forEach((task) => {
        const taskItem = document.createElement('li');
    	taskItem.className = `task${task.completed ? ' completed' : ''}`;
  

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.title} as complete`);

    checkbox.addEventListener('change', () => {
			task.completed = checkbox.checked;
			save();
			DoTheTask();
	});

    const taskName = document.createElement('span');
    taskName.textContent = task.title;
		const cancelButton = document.createElement('button');
		cancelButton.type = 'button';
		cancelButton.className = 'cancel-button';
		cancelButton.textContent = 'Cancel';
		cancelButton.setAttribute('aria-label', `Cancel ${task.title}`);
		cancelButton.addEventListener('click', () => {

			const taskIndex = tasks.indexOf(task);
			tasks.splice(taskIndex, 1);
			save();
			DoTheTask();
		});

    	taskItem.append(checkbox, taskName, cancelButton);
		taskList.append(taskItem);
});      	

	const tasksLeft = tasks.filter((task) => !task.completed).length;
     taskSummary.textContent = tasks.length === 0
        ? ''
        : `${tasksLeft} task${tasksLeft === 1 ? '' : 's'} left`;

}
taskForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const title = taskInput.value.trim();
	if (!title) return;

	tasks.push({ title, completed: false });
	taskInput.value = '';
	taskInput.focus();
	DoTheTask();
	save();
});

chrome.storage.local.get('tasks', (data) => {
	tasks = data.tasks || [];
	DoTheTask();
});







        











