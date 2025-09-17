const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const completedCount = document.getElementById('completedCount');
    const pendingCount = document.getElementById('pendingCount');

    let tasks = [];

    window.addEventListener('load', () => {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        tasks = JSON.parse(stored);
      }
      renderTasks();
      updateStats();
    });

    addTaskBtn.addEventListener('click', () => {
      addOrEditTask();
    });
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addOrEditTask();
      }
    });

    clearAllBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
      }
    });
let editingId = null;

function addOrEditTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  if (editingId !== null) {
    // EDIT MODE
    const task = tasks.find(t => t.id === editingId);
    if (task) {
      task.text = text;
    }
    editingId = null;
  } else {
    // ADD MODE
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    tasks.push(newTask);
  }

  taskInput.value = '';
  saveTasks();
  renderTasks();
  updateStats();
}


    function toggleComplete(id) {
      const t = tasks.find(t => t.id === id);
      if (t) {
        t.completed = !t.completed;
        saveTasks();
        renderTasks();
        updateStats();
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      updateStats();
    }

   function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    taskInput.value = task.text;
    editingId = id;
    taskInput.focus(); // Optional: focus the input field for quick editing
  }
}


    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      const pending = tasks.filter(t => !t.completed);
      const completed = tasks.filter(t => t.completed);
      const combined = [...pending, ...completed];

      combined.forEach((t, index) => {
        const li = document.createElement('li');
        if (t.completed) {
          li.classList.add('completed');
        }

        const indexSpan = document.createElement('span');
        indexSpan.className = 'index-number';
        indexSpan.textContent = `${index + 1}. `;

        const textSpan = document.createElement('span');
        textSpan.textContent = t.text;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'task-buttons';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'completeBtn';
        completeBtn.textContent = t.completed ? 'Undo' : 'Complete';
        completeBtn.addEventListener('click', () => toggleComplete(t.id));

        const editBtn = document.createElement('button');
        editBtn.className = 'editBtn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(t.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(t.id));

        buttonsDiv.appendChild(completeBtn);
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);

        li.appendChild(indexSpan);
        li.appendChild(textSpan);
        li.appendChild(buttonsDiv);

        taskList.appendChild(li);
      });
    }

    function updateStats() {
      const total = tasks.length;
      const completedNum = tasks.filter(t => t.completed).length;
      const pendingNum = total - completedNum;

      taskCount.textContent = `Total: ${total}`;
      completedCount.textContent = `Completed: ${completedNum}`;
      pendingCount.textContent = `Pending: ${pendingNum}`;
    }