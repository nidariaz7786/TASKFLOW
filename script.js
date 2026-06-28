const TASKS_KEY = "taskflow_tasks";
const SETTINGS_KEY = "taskflow_settings";


let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];

let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {

    darkMode: false,

    theme: "blue",

    reminder: false,

    completionAlert: true

};


const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const searchTask = document.getElementById("searchTask");

const filterStatus = document.getElementById("filterStatus");

const sortTasks = document.getElementById("sortTasks");



const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const completionRate = document.getElementById("completionRate");

const progressBar = document.getElementById("progressBar");



const taskTitle = document.getElementById("taskTitle");

const taskCategory = document.getElementById("taskCategory");

const taskPriority = document.getElementById("taskPriority");

const taskDate = document.getElementById("taskDate");

const taskDescription = document.getElementById("taskDescription");



const completedTaskList = document.getElementById("completedTaskList");

const completedCount = document.getElementById("completedCount");

const todayCompleted = document.getElementById("todayCompleted");

const successRate = document.getElementById("successRate");

const deleteAllCompleted =
    document.getElementById("deleteAllCompleted");



const profileTotal =
    document.getElementById("profileTotal");

const profileCompleted =
    document.getElementById("profileCompleted");

const profilePending =
    document.getElementById("profilePending");

const profilePercent =
    document.getElementById("profilePercent");

const recentActivity =
    document.getElementById("recentActivity");




const darkModeToggle =
    document.getElementById("darkModeToggle");

const themeColor =
    document.getElementById("themeColor");

const exportTasks =
    document.getElementById("exportTasks");

const clearCompleted =
    document.getElementById("clearCompleted");

const deleteAllTasks =
    document.getElementById("deleteAllTasks");

function saveTasks() {

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );

}


function saveSettings() {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}


function generateID() {

    return Date.now() + Math.floor(Math.random() * 1000);

}

function findTask(id) {

    return tasks.find(task => task.id === id);

}

function showToast(message, color = "#22c55e") {

    const toast = document.createElement("div");

    toast.className = "toast-message";

    toast.style.background = color;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}


function applyDarkMode() {

    if (settings.darkMode) {

        document.body.classList.add("dark-mode");

        if (darkModeToggle) {

            darkModeToggle.checked = true;

        }

    }

    else {

        document.body.classList.remove("dark-mode");

    }

}


function applyTheme() {

    document.documentElement.style.setProperty(
        "--primary",
        getThemeColor(settings.theme)
    );

}



function getThemeColor(theme) {

    switch (theme) {

        case "green":
            return "#16a34a";

        case "purple":
            return "#7c3aed";

        case "red":
            return "#dc2626";

        default:
            return "#4f46e5";
    }

}


document.addEventListener("DOMContentLoaded", function () {

    applyDarkMode();

    applyTheme();

});

let activity = JSON.parse(localStorage.getItem("taskflow_activity")) || [];

function saveActivity() {

    localStorage.setItem(
        "taskflow_activity",
        JSON.stringify(activity)
    );

}

function addActivity(text) {

    activity.unshift({

        message: text,

        time: new Date().toLocaleString()

    });

    if (activity.length > 10) {

        activity.pop();

    }

    saveActivity();

}

if (taskForm) {

    taskForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const title = taskTitle.value.trim();

        const category = taskCategory.value;

        const priority = taskPriority.value;

        const dueDate = taskDate.value;

        const description = taskDescription.value.trim();


        // Validation

        if (title === "") {

            showToast("Task title is required.", "#ef4444");

            return;

        }


        const task = {

            id: generateID(),

            title: title,

            category: category,

            priority: priority,

            dueDate: dueDate,

            description: description,

            completed: false,

            createdAt: new Date().toISOString(),

            completedAt: null

        };


        tasks.push(task);

        saveTasks();

        addActivity("Added task : " + title);

        showToast("Task Added Successfully");

        taskForm.reset();


        // Refresh UI

        if (typeof renderTasks === "function") {

            renderTasks();

        }

        if (typeof updateStatistics === "function") {

            updateStatistics();

        }

    });

}


function deleteTask(id) {

    const task = findTask(id);

    if (!task) return;

    const confirmDelete = confirm(
        "Delete this task?"
    );

    if (!confirmDelete) return;


    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    addActivity("Deleted task : " + task.title);

    showToast("Task Deleted", "#ef4444");


    if (typeof renderTasks === "function") {

        renderTasks();

    }

    if (typeof updateStatistics === "function") {

        updateStatistics();

    }

}


function toggleTask(id) {

    const task = findTask(id);

    if (!task) return;


    task.completed = !task.completed;


    if (task.completed) {

        task.completedAt = new Date().toISOString();

        addActivity("Completed : " + task.title);

        showToast("Task Completed");

    }

    else {

        task.completedAt = null;

        addActivity("Marked Pending : " + task.title);

        showToast("Task Pending Again", "#f59e0b");

    }


    saveTasks();


    if (typeof renderTasks === "function") {

        renderTasks();

    }

    if (typeof updateStatistics === "function") {

        updateStatistics();

    }

}


function editTask(id) {

    const task = findTask(id);

    if (!task) return;


    const newTitle = prompt(

        "Edit Task Title",

        task.title

    );


    if (newTitle === null) {

        return;

    }


    if (newTitle.trim() === "") {

        showToast("Title cannot be empty", "#ef4444");

        return;

    }


    const newDescription = prompt(

        "Edit Description",

        task.description

    );


    task.title = newTitle.trim();

    task.description =

        newDescription === null

            ? task.description

            : newDescription;


    saveTasks();

    addActivity("Edited : " + task.title);

    showToast("Task Updated");


    if (typeof renderTasks === "function") {

        renderTasks();

    }

}



function removeAllTasks() {

    if (tasks.length === 0) {

        showToast("No Tasks Found", "#ef4444");

        return;

    }

    const answer = confirm(

        "Delete ALL tasks?"

    );

    if (!answer) return;


    tasks = [];

    saveTasks();

    addActivity("Deleted all tasks");

    showToast("All Tasks Deleted", "#ef4444");


    if (typeof renderTasks === "function") {

        renderTasks();

    }

    if (typeof updateStatistics === "function") {

        updateStatistics();

    }

}

function clearCompletedTasks() {

    const completed = tasks.filter(

        task => task.completed

    );

    if (completed.length === 0) {

        showToast("No completed tasks", "#ef4444");

        return;

    }


    tasks = tasks.filter(

        task => !task.completed

    );

    saveTasks();

    addActivity("Cleared completed tasks");

    showToast("Completed Tasks Removed");


    if (typeof renderTasks === "function") {

        renderTasks();

    }

    if (typeof updateStatistics === "function") {

        updateStatistics();

    }

}


if (deleteAllTasks) {

    deleteAllTasks.addEventListener(

        "click",

        removeAllTasks

    );

}


if (clearCompleted) {

    clearCompleted.addEventListener(

        "click",

        clearCompletedTasks

    );

}

function renderTasks() {

    if (!taskList) return;

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];


    if (searchTask && searchTask.value.trim() !== "") {

        const keyword = searchTask.value
            .toLowerCase()
            .trim();

        filteredTasks = filteredTasks.filter(task =>

            task.title.toLowerCase().includes(keyword) ||

            task.description.toLowerCase().includes(keyword) ||

            task.category.toLowerCase().includes(keyword)

        );

    }


    if (filterStatus) {

        const status = filterStatus.value;

        if (status === "completed") {

            filteredTasks = filteredTasks.filter(

                task => task.completed

            );

        }

        else if (status === "pending") {

            filteredTasks = filteredTasks.filter(

                task => !task.completed

            );

        }

    }


    if (sortTasks) {

        switch (sortTasks.value) {

            case "old":

                filteredTasks.sort(

                    (a, b) =>

                        new Date(a.createdAt) -

                        new Date(b.createdAt)

                );

                break;


            case "priority":

                const order = {

                    High: 1,

                    Medium: 2,

                    Low: 3

                };

                filteredTasks.sort(

                    (a, b) =>

                        order[a.priority] -

                        order[b.priority]

                );

                break;


            default:

                filteredTasks.sort(

                    (a, b) =>

                        new Date(b.createdAt) -

                        new Date(a.createdAt)

                );

        }

    }



    if (filteredTasks.length === 0) {

        taskList.innerHTML = `

            <div class="col-12">

                <div class="alert alert-info text-center">

                    <h4>No Tasks Found</h4>

                    <p>Add your first task.</p>

                </div>

            </div>

        `;

        return;

    }


    filteredTasks.forEach(task => {

        let priorityColor = "";

        switch (task.priority) {

            case "High":

                priorityColor = "danger";

                break;

            case "Medium":

                priorityColor = "warning";

                break;

            default:

                priorityColor = "success";

        }



        const statusBadge = task.completed

            ? `<span class="badge bg-success">
                    Completed
               </span>`

            : `<span class="badge bg-secondary">
                    Pending
               </span>`;



        const card = document.createElement("div");

        card.className = "col-lg-6";



        card.innerHTML = `

        <div class="task-card h-100">

            <div class="d-flex justify-content-between">

                <h4 class="task-title">

                    ${task.title}

                </h4>

                ${statusBadge}

            </div>


            <p class="task-description mt-3">

                ${task.description || "No description"}

            </p>


            <div class="task-info d-flex flex-wrap gap-2 mt-3">

                <span class="badge bg-primary">

                    ${task.category}

                </span>

                <span class="badge bg-${priorityColor}">

                    ${task.priority}

                </span>

                <span class="badge bg-dark">

                    ${task.dueDate || "No Due Date"}

                </span>

            </div>


            <hr>


            <div class="d-flex flex-wrap gap-2">


                <button

                    class="btn btn-success btn-sm"

                    onclick="toggleTask(${task.id})">

                    <i class="fa-solid fa-check"></i>

                    ${task.completed ? "Undo" : "Complete"}

                </button>



                <button

                    class="btn btn-warning btn-sm"

                    onclick="editTask(${task.id})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>



                <button

                    class="btn btn-danger btn-sm"

                    onclick="deleteTask(${task.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </div>

        `;


        taskList.appendChild(card);

    });

}


if (searchTask) {

    searchTask.addEventListener(

        "keyup",

        renderTasks

    );

}


if (filterStatus) {

    filterStatus.addEventListener(

        "change",

        renderTasks

    );

}


if (sortTasks) {

    sortTasks.addEventListener(

        "change",

        renderTasks

    );

}

document.addEventListener(

    "DOMContentLoaded",

    renderTasks

);

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed);

    const pending = tasks.filter(task => !task.completed);

    const completedCountValue = completed.length;

    const pendingCountValue = pending.length;

    const percent =
        total === 0
            ? 0
            : Math.round((completedCountValue / total) * 100);



    if (totalTasks)
        totalTasks.textContent = total;

    if (completedTasks)
        completedTasks.textContent = completedCountValue;

    if (pendingTasks)
        pendingTasks.textContent = pendingCountValue;

    if (completionRate)
        completionRate.textContent = percent + "%";




    if (progressBar) {

        progressBar.style.width = percent + "%";

        progressBar.innerHTML = percent + "%";

    }



    if (profileTotal)
        profileTotal.textContent = total;

    if (profileCompleted)
        profileCompleted.textContent = completedCountValue;

    if (profilePending)
        profilePending.textContent = pendingCountValue;

    if (profilePercent)
        profilePercent.textContent = percent + "%";



    if (completedCount)
        completedCount.textContent = completedCountValue;

    if (successRate)
        successRate.textContent = percent + "%";



    updateTodayCompleted();

    renderCompletedTasks();

    renderRecentActivity();

}

function updateTodayCompleted() {

    if (!todayCompleted) return;

    const today = new Date().toDateString();

    let count = 0;

    tasks.forEach(task => {

        if (
            task.completed &&
            task.completedAt &&
            new Date(task.completedAt).toDateString() === today
        ) {

            count++;

        }

    });

    todayCompleted.textContent = count;

}


function renderCompletedTasks() {

    if (!completedTaskList) return;

    completedTaskList.innerHTML = "";

    const completed = tasks.filter(task => task.completed);



    if (completed.length === 0) {

        const empty = document.getElementById("noCompletedTasks");

        if (empty) {

            empty.classList.remove("d-none");

        }

        return;

    }



    const empty = document.getElementById("noCompletedTasks");

    if (empty) {

        empty.classList.add("d-none");

    }



    completed.forEach(task => {

        const col = document.createElement("div");

        col.className = "col-lg-6";

        col.innerHTML = `

        <div class="task-card">

            <div class="d-flex justify-content-between">

                <h4>${task.title}</h4>

                <span class="badge bg-success">

                    Completed

                </span>

            </div>

            <p class="mt-3">

                ${task.description || "No description"}

            </p>

            <div class="task-info d-flex gap-2 flex-wrap mt-3">

                <span class="badge bg-primary">

                    ${task.category}

                </span>

                <span class="badge bg-warning text-dark">

                    ${task.priority}

                </span>

                <span class="badge bg-dark">

                    ${task.dueDate || "No Date"}

                </span>

            </div>

            <div class="mt-4">

                <button
                    class="btn btn-warning btn-sm"
                    onclick="toggleTask(${task.id})">

                    Undo

                </button>

            </div>

        </div>

        `;

        completedTaskList.appendChild(col);

    });

}

function renderRecentActivity() {

    if (!recentActivity) return;

    recentActivity.innerHTML = "";



    if (activity.length === 0) {

        recentActivity.innerHTML = `

        <li class="list-group-item">

            No recent activity.

        </li>

        `;

        return;

    }



    activity.forEach(item => {

        const li = document.createElement("li");

        li.className = "list-group-item";

        li.innerHTML = `

            <strong>

                ${item.message}

            </strong>

            <br>

            <small class="text-muted">

                ${item.time}

            </small>

        `;

        recentActivity.appendChild(li);

    });

}

if (deleteAllCompleted) {

    deleteAllCompleted.addEventListener(

        "click",

        function () {

            if (!confirm(
                "Delete all completed tasks?"
            )) return;



            tasks = tasks.filter(task => !task.completed);

            saveTasks();

            showToast(
                "Completed Tasks Deleted",
                "#ef4444"
            );

            updateStatistics();

            renderTasks();

        }

    );

}


document.addEventListener(

    "DOMContentLoaded",

    function () {

        updateStatistics();

    }

);


function loadSettings() {


    if (darkModeToggle) {

        darkModeToggle.checked = settings.darkMode;

    }

    applyDarkMode();


    if (themeColor) {

        themeColor.value = settings.theme;

    }

    applyTheme();

}

if (darkModeToggle) {

    darkModeToggle.addEventListener(

        "change",

        function () {

            settings.darkMode = this.checked;

            saveSettings();

            applyDarkMode();

            showToast("Appearance Updated");

        }

    );

}

if (themeColor) {

    themeColor.addEventListener(

        "change",

        function () {

            settings.theme = this.value;

            saveSettings();

            applyTheme();

            showToast("Theme Updated");

        }

    );

}


if (exportTasks) {

    exportTasks.addEventListener(

        "click",

        function () {

            if (tasks.length === 0) {

                showToast(
                    "No Tasks Found",
                    "#ef4444"
                );

                return;

            }


            const json = JSON.stringify(
                tasks,
                null,
                4
            );


            const blob = new Blob(

                [json],

                {

                    type: "application/json"

                }

            );


            const url = URL.createObjectURL(blob);


            const a = document.createElement("a");

            a.href = url;

            a.download = "TaskFlow_Tasks.json";

            a.click();

            URL.revokeObjectURL(url);

            showToast("Tasks Exported");

        }

    );

}

const taskReminder =
    document.getElementById("taskReminder");

if (taskReminder) {

    taskReminder.checked =
        settings.reminder;

    taskReminder.addEventListener(

        "change",

        function () {

            settings.reminder =
                this.checked;

            saveSettings();

        }

    );

}


const completionAlert =
    document.getElementById("completionAlert");

if (completionAlert) {

    completionAlert.checked =
        settings.completionAlert;

    completionAlert.addEventListener(

        "change",

        function () {

            settings.completionAlert =
                this.checked;

            saveSettings();

        }

    );

}


function applyTheme() {

    const root =
        document.documentElement;

    switch (settings.theme) {

        case "green":

            root.style.setProperty(
                "--primary",
                "#16a34a"
            );

            break;

        case "purple":

            root.style.setProperty(
                "--primary",
                "#7c3aed"
            );

            break;

        case "red":

            root.style.setProperty(
                "--primary",
                "#dc2626"
            );

            break;

        default:

            root.style.setProperty(
                "--primary",
                "#4f46e5"
            );

    }

}


function applyDarkMode() {

    if (settings.darkMode) {

        document.body.classList.add(
            "dark-mode"
        );

    }

    else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}



document.addEventListener(

    "DOMContentLoaded",

    function () {

        loadSettings();

    }

);