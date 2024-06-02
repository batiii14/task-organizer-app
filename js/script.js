document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const tasksListContainer = document.getElementById('tasksListContainer');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function initialize() {
        renderTasks();
    }

    function renderTasks() {
        tasksListContainer.innerHTML = '';
        tasks.forEach(renderTask);
        updateLocalStorage();
    }

    function renderTask(task) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.toggle('completed', task.completed);
        card.setAttribute('data-category', task.category);

        card.innerHTML = `
            <center>
                <h4>Click anywhere on the card to display the information!</>
                <h2>${task.name}</h2><br>
                <h3>${task.category.toUpperCase()}</h3><br>
                <p>${task.description}</p><br>
                <div class="time-container">
                    <i class="fa fa-clock-o" aria-hidden="true" style="color: white;"></i>
                    <h3>${task.time || "No specific time"}</h3>
                </div>
                <br>
                <center>
                    <button class="completeBtn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </center>
            </center>
        `;

        tasksListContainer.appendChild(card);

        card.addEventListener('click', function (e) {
            const isButton = e.target.tagName.toLowerCase() === 'button';
            if (!isButton) {
                displayTaskDetails(task);
            }
        });

        const editBtn = card.querySelector('.editBtn');
        editBtn.addEventListener('click', function (e) {
            openEditModal(task);
            e.stopPropagation(); 
        });

        const completeBtn = card.querySelector('.completeBtn');
        completeBtn.addEventListener('click', function (e) {
            toggleTaskCompletion(task);
            e.stopPropagation(); 
        });

        const deleteBtn = card.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function (e) {
            deleteTask(task);
            e.stopPropagation(); 
        });
    }

    function toggleTaskCompletion(task) {
        task.completed = !task.completed;
        renderTasks();
    }

    function openEditModal(task) {
        modal.style.display = 'block';
        saveTaskBtn.dataset.taskId = tasks.indexOf(task); 
        document.getElementById('taskInput').value = task.name;
        document.getElementById('categorySelect').value = task.category;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskTime').value = task.time;
    }

    function addOrUpdateTask() {
        const taskId = saveTaskBtn.dataset.taskId;
        const taskInput = document.getElementById('taskInput').value.trim();
        const categorySelect = document.getElementById('categorySelect').value;
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const taskTime = document.getElementById('taskTime').value;

        if (taskInput !== '') {
            if (taskId !== undefined && tasks[taskId] !== undefined) {
                tasks[taskId] = {
                    name: taskInput,
                    category: categorySelect,
                    description: taskDescription,
                    time: taskTime,
                    completed: tasks[taskId].completed
                };
            } else {
                const newTask = {
                    name: taskInput,
                    category: categorySelect,
                    description: taskDescription,
                    time: taskTime,
                    completed: false
                };
                tasks.push(newTask);
            }
            renderTasks();
            modal.style.display = 'none';
            delete saveTaskBtn.dataset.taskId; 
        }
    }

    function deleteTask(task) {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        renderTasks();
    }

    function filterTasks(value) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            switch (value) {
                case 'completed':
                    card.style.display = card.classList.contains('completed') ? 'block' : 'none';
                    break;
                case 'uncompleted':
                    card.style.display = card.classList.contains('completed') ? 'none' : 'block';
                    break;
                default:
                    card.style.display = 'block';
            }
        });
    }

    function displayTaskDetails(task) {
        const { name, category, description, time } = task;
        alert(`Task Name: ${name}\nCategory: ${category}\nDescription: ${description}\nTime: ${time}`);
    }

    addTaskBtn.addEventListener('click', function () {
        openEditModal({ name: '', category: 'shopping', description: '', time: '' });
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        delete saveTaskBtn.dataset.taskId; 
    });

    saveTaskBtn.addEventListener('click', function () {
        addOrUpdateTask();
    });

    filterDropdown.addEventListener('change', function () {
        filterTasks(this.value);
    });

    initialize();

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
