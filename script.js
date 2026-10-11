"use strict";

const STORAGE_KEY = "studyspace-dashboard-v1";
const CATEGORIES = {
  assignment: "Assignment",
  learning: "Learning",
  project: "Project",
  personal: "Personal",
};
const STATUSES = ["todo", "progress", "done"];
const STATUS_LABELS = { todo: "To do", progress: "In progress", done: "Done" };
const TIMER_MODES = {
  focus: { label: "FOCUS SESSION", caption: "One thing at a time", seconds: 25 * 60 },
  short: { label: "SHORT BREAK", caption: "Take a little breather", seconds: 5 * 60 },
  long: { label: "LONG BREAK", caption: "You’ve earned a longer rest", seconds: 15 * 60 },
};
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 79;

const dateKey = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};
const today = new Date();
const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateKey(date);
};
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function createInitialState() {
  return {
    tasks: [
      { id: "task-1", title: "Finish the web technology lab record", category: "assignment", due: addDays(2), status: "todo", createdAt: dateKey(today) },
      { id: "task-2", title: "Review chapter 4: data structures", category: "learning", due: "", status: "progress", createdAt: dateKey(today) },
      { id: "task-3", title: "Submit statistics problem set", category: "assignment", due: addDays(4), status: "todo", createdAt: dateKey(today) },
      { id: "task-4", title: "Build the first project wireframe", category: "project", due: "", status: "todo", createdAt: dateKey(today) },
      { id: "task-5", title: "Watch the intro to machine learning", category: "learning", due: "", status: "done", createdAt: dateKey(today) },
    ],
    goals: [
      { id: "goal-1", title: "Reach my semester GPA goal", progress: 60 },
      { id: "goal-2", title: "Complete my portfolio project", progress: 35 },
    ],
    habits: [
      { id: "habit-1", title: "Review notes for 15 minutes", checks: {} },
      { id: "habit-2", title: "Practice a coding problem", checks: {} },
      { id: "habit-3", title: "Get enough water while studying", checks: {} },
    ],
    focusByDay: {},
  };
}

function loadState() {
  const initial = createInitialState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initial;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") throw new Error("Saved study data is not in the expected format.");
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : initial.tasks,
      goals: Array.isArray(parsed.goals) ? parsed.goals : initial.goals,
      habits: Array.isArray(parsed.habits) ? parsed.habits : initial.habits,
      focusByDay: parsed.focusByDay && typeof parsed.focusByDay === "object" ? parsed.focusByDay : {},
    };
  } catch (error) {
    console.error("Unable to load saved Studyspace data.", error);
    announce("Saved data could not be loaded. Your current session will use fresh sample data.");
    return initial;
  }
}

let state = loadState();
let taskFilter = "all";
let activeSuggestion = -1;
let selectedMode = "focus";
let remainingSeconds = TIMER_MODES.focus.seconds;
let timerInterval = null;
let timerEndTime = null;

const byId = (id) => document.getElementById(id);

function announce(message) {
  const status = byId("status-message");
  if (status) status.textContent = message;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save Studyspace data.", error);
    announce("Your changes could not be saved. Check your browser storage settings.");
  }
}

function formatShortDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "No due date";
  if (dateString === dateKey(new Date())) return "Due today";
  return `Due ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function renderTasks() {
  const board = byId("task-board");
  const visibleTasks = state.tasks.filter((task) => taskFilter === "all" || task.category === taskFilter);
  board.innerHTML = STATUSES.map((status) => {
    const tasks = visibleTasks.filter((task) => task.status === status);
    const cards = tasks.length
      ? tasks.map((task) => `
        <article class="task-card ${status === "done" ? "is-done" : ""}">
          <span class="task-category ${escapeHtml(task.category)}">${escapeHtml(CATEGORIES[task.category] || "Personal")}</span>
          <p class="task-title">${escapeHtml(task.title)}</p>
          <div class="task-meta">
            <span>${escapeHtml(formatShortDate(task.due))}</span>
            <span class="task-actions">
              ${status !== "progress" && status !== "done" ? `<button class="task-action" type="button" data-task-action="progress" data-id="${escapeHtml(task.id)}">Start</button>` : ""}
              ${status !== "done" ? `<button class="task-action" type="button" data-task-action="done" data-id="${escapeHtml(task.id)}">Complete</button>` : `<button class="task-action" type="button" data-task-action="todo" data-id="${escapeHtml(task.id)}">Reopen</button>`}
              <button class="task-action delete-task" type="button" data-task-action="delete" data-id="${escapeHtml(task.id)}" aria-label="Delete ${escapeHtml(task.title)}">×</button>
            </span>
          </div>
        </article>
      `).join("")
      : '<p class="empty-column">Nothing here yet</p>';
    return `
      <section class="board-column status-${status}" aria-label="${STATUS_LABELS[status]} tasks">
        <div class="column-heading"><span class="column-name"><span class="column-dot"></span>${STATUS_LABELS[status]}</span><span class="column-count">${tasks.length}</span></div>
        <div class="task-stack">${cards}</div>
      </section>
    `;
  }).join("");
}

function renderGoals() {
  const list = byId("goal-list");
  list.innerHTML = state.goals.length ? state.goals.map((goal) => `
    <article class="goal-item">
      <div class="goal-item-top">
        <span class="goal-title">${escapeHtml(goal.title)}</span>
        <span class="goal-percent">${goal.progress}%</span>
      </div>
      <div class="goal-item-bottom">
        <div class="goal-track" role="progressbar" aria-label="${escapeHtml(goal.title)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${goal.progress}"><span style="width:${goal.progress}%"></span></div>
        <button class="goal-action" type="button" data-goal-action="increase" data-id="${escapeHtml(goal.id)}" ${goal.progress >= 100 ? "disabled" : ""}>+10%</button>
        <button class="goal-delete" type="button" data-goal-action="delete" data-id="${escapeHtml(goal.id)}" aria-label="Delete goal: ${escapeHtml(goal.title)}">×</button>
      </div>
    </article>
  `).join("") : '<p class="empty-state">Your next big thing starts with a goal.</p>';
  byId("goal-count").textContent = `${state.goals.length} ${state.goals.length === 1 ? "goal" : "goals"}`;
}

function renderHabits() {
  const key = dateKey(new Date());
  byId("habit-date").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
  byId("habit-list").innerHTML = state.habits.length ? state.habits.map((habit) => {
    const completed = habit.checks?.[key] === true;
    const streak = calculateStreak(habit);
    return `
      <div class="habit-item ${completed ? "is-complete" : ""}">
        <button class="habit-check ${completed ? "checked" : ""}" type="button" data-habit-action="toggle" data-id="${escapeHtml(habit.id)}" aria-label="${completed ? "Mark incomplete" : "Mark complete"}: ${escapeHtml(habit.title)}" aria-pressed="${completed}">${completed ? "✓" : ""}</button>
        <span class="habit-name">${escapeHtml(habit.title)}</span>
        ${streak ? `<span class="habit-streak">✳ ${streak} day${streak === 1 ? "" : "s"}</span>` : ""}
        <button class="habit-delete" type="button" data-habit-action="delete" data-id="${escapeHtml(habit.id)}" aria-label="Delete habit: ${escapeHtml(habit.title)}">×</button>
      </div>
    `;
  }).join("") : '<p class="empty-state">Build a routine, one small habit at a time.</p>';
}

function calculateStreak(habit) {
  let streak = 0;
  const cursor = new Date();
  while (habit.checks?.[dateKey(cursor)] === true) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function startOfWeek(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function renderWeek() {
  const todayDate = new Date();
  const monday = startOfWeek(todayDate);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { key: dateKey(date), label: new Intl.DateTimeFormat(undefined, { weekday: "narrow" }).format(date), minutes: Number(state.focusByDay[dateKey(date)]) || 0, isToday: dateKey(date) === dateKey(todayDate) };
  });
  const maximum = Math.max(...week.map((day) => day.minutes), 30);
  byId("week-chart").innerHTML = week.map((day) => {
    const height = day.minutes ? Math.max(7, Math.round((day.minutes / maximum) * 100)) : 3;
    return `<div class="chart-day ${day.isToday ? "today" : ""}" aria-label="${new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(new Date(`${day.key}T00:00:00`))}: ${day.minutes} focus minutes">
      <div class="chart-bar-wrap"><span class="chart-bar" style="height:${height}%" title="${day.minutes} min"></span></div>
      <span class="chart-day-label">${escapeHtml(day.label)}</span>
    </div>`;
  }).join("");
  const total = week.reduce((sum, day) => sum + day.minutes, 0);
  byId("week-total").textContent = `${total} min`;
}

function renderDashboard() {
  const todayKey = dateKey(new Date());
  const completedTasks = state.tasks.filter((task) => task.status === "done").length;
  const weekStart = dateKey(startOfWeek(new Date()));
  const focusThisWeek = Object.entries(state.focusByDay).reduce((total, [day, minutes]) => total + (day >= weekStart && day <= dateKey(new Date()) ? Number(minutes) || 0 : 0), 0);
  const completedHabits = state.habits.filter((habit) => habit.checks?.[todayKey] === true).length;
  const completedGoals = state.goals.filter((goal) => goal.progress >= 100).length;

  byId("stat-tasks").textContent = String(completedTasks);
  byId("stat-tasks-total").textContent = `/ ${state.tasks.length} total tasks`;
  byId("tasks-progress").style.width = `${state.tasks.length ? Math.min(100, (completedTasks / state.tasks.length) * 100) : 0}%`;
  byId("stat-goals").textContent = String(state.goals.length - completedGoals);
  byId("stat-goals-total").textContent = `${completedGoals} completed`;
  byId("goals-progress").style.width = `${state.goals.length ? (completedGoals / state.goals.length) * 100 : 0}%`;
  byId("stat-focus").textContent = String(focusThisWeek);
  byId("focus-progress").style.width = `${Math.min(100, (focusThisWeek / 300) * 100)}%`;
  byId("stat-habits").textContent = String(completedHabits);
  byId("stat-habits-total").textContent = `/ ${state.habits.length} checked in`;
  byId("habits-progress").style.width = `${state.habits.length ? (completedHabits / state.habits.length) * 100 : 0}%`;
}

function getSuggestions() {
  const incompleteTasks = state.tasks.filter((task) => task.status !== "done");
  const overdue = incompleteTasks.find((task) => task.due && task.due < dateKey(new Date()));
  if (overdue) return [`One thing at a time: give “${overdue.title}” a 15-minute head start, then decide on your next step.`];
  const dueSoon = incompleteTasks.find((task) => task.due && task.due <= addDays(2));
  const suggestions = [];
  if (dueSoon) suggestions.push(`“${dueSoon.title}” is coming up soon. Try one 25-minute focus session to get it moving.`);
  const uncheckedHabit = state.habits.find((habit) => habit.checks?.[dateKey(new Date())] !== true);
  if (uncheckedHabit) suggestions.push(`A tiny win still counts: take a few minutes for “${uncheckedHabit.title}” today.`);
  const unfinishedGoal = state.goals.find((goal) => goal.progress < 100);
  if (unfinishedGoal) suggestions.push(`Your goal “${unfinishedGoal.title}” is ${unfinishedGoal.progress}% along. Pick one small action to move it forward.`);
  if (incompleteTasks.length) suggestions.push("Try turning your next task into a 25-minute focus block. You can always take a break after.");
  if (!incompleteTasks.length && !uncheckedHabit && !unfinishedGoal) suggestions.push("You’ve made room for your priorities today. Take a well-earned break and celebrate how far you’ve come.");
  if (!suggestions.length) suggestions.push("Choose one small, specific task to begin. Getting started is progress.");
  return suggestions;
}

function renderSuggestion(next = false) {
  const suggestions = getSuggestions();
  activeSuggestion = next ? (activeSuggestion + 1) % suggestions.length : Math.max(0, activeSuggestion) % suggestions.length;
  byId("suggestion-copy").textContent = suggestions[activeSuggestion];
}

function renderAll() {
  renderTasks();
  renderGoals();
  renderHabits();
  renderWeek();
  renderDashboard();
  renderSuggestion();
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  byId("timer-display").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const total = TIMER_MODES[selectedMode].seconds;
  const progress = byId("timer-progress");
  progress.style.strokeDasharray = String(TIMER_CIRCUMFERENCE);
  progress.style.strokeDashoffset = String(TIMER_CIRCUMFERENCE * (1 - remainingSeconds / total));
}

function stopTimer() {
  if (timerInterval !== null) window.clearInterval(timerInterval);
  timerInterval = null;
  timerEndTime = null;
  byId("timer-toggle").textContent = "Start focusing";
  byId("timer-toggle").setAttribute("aria-label", "Start timer");
}

function setTimerMode(mode) {
  if (!TIMER_MODES[mode]) return;
  stopTimer();
  selectedMode = mode;
  remainingSeconds = TIMER_MODES[mode].seconds;
  document.querySelectorAll(".mode-button").forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  byId("timer-mode-label").textContent = TIMER_MODES[mode].label;
  byId("timer-caption").textContent = TIMER_MODES[mode].caption;
  updateTimerDisplay();
}

function finishTimer() {
  stopTimer();
  remainingSeconds = 0;
  updateTimerDisplay();
  if (selectedMode === "focus") {
    const key = dateKey(new Date());
    state.focusByDay[key] = (Number(state.focusByDay[key]) || 0) + TIMER_MODES.focus.seconds / 60;
    saveState();
    renderWeek();
    renderDashboard();
    announce("Focus session complete. Your study time has been added to this week.");
  } else {
    announce("Break time is over. Take a breath and start again when you’re ready.");
  }
  byId("timer-toggle").textContent = "Start again";
}

function toggleTimer() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    timerEndTime = null;
    byId("timer-toggle").textContent = "Resume session";
    updateTimerDisplay();
    return;
  }
  if (remainingSeconds <= 0) remainingSeconds = TIMER_MODES[selectedMode].seconds;
  timerEndTime = Date.now() + remainingSeconds * 1000;
  byId("timer-toggle").textContent = "Pause session";
  byId("timer-toggle").setAttribute("aria-label", "Pause timer");
  timerInterval = window.setInterval(() => {
    remainingSeconds = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
    updateTimerDisplay();
    if (remainingSeconds === 0) finishTimer();
  }, 250);
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const title = String(data.get("title") || "").trim();
  if (!title) return;
  const category = String(data.get("category"));
  if (!(category in CATEGORIES)) {
    announce("Choose a valid task category.");
    return;
  }
  state.tasks.unshift({ id: makeId(), title, category, due: String(data.get("due") || ""), status: "todo", createdAt: dateKey(new Date()) });
  saveState();
  form.reset();
  byId("task-title").focus();
  renderAll();
  announce(`Added task: ${title}`);
}

function handleGoalSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = String(new FormData(form).get("title") || "").trim();
  if (!title) return;
  state.goals.push({ id: makeId(), title, progress: 0 });
  saveState();
  form.reset();
  renderAll();
  announce(`Added goal: ${title}`);
}

function handleHabitSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const title = String(new FormData(form).get("title") || "").trim();
  if (!title) return;
  state.habits.push({ id: makeId(), title, checks: {} });
  saveState();
  form.reset();
  renderAll();
  announce(`Added daily habit: ${title}`);
}

byId("task-form").addEventListener("submit", handleTaskSubmit);
byId("goal-form").addEventListener("submit", handleGoalSubmit);
byId("habit-form").addEventListener("submit", handleHabitSubmit);
byId("task-filter").addEventListener("change", (event) => {
  taskFilter = event.currentTarget.value;
  renderTasks();
});

byId("task-board").addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-action]");
  if (!button) return;
  const task = state.tasks.find((item) => item.id === button.dataset.id);
  if (!task) return;
  const action = button.dataset.taskAction;
  if (action === "delete") {
    state.tasks = state.tasks.filter((item) => item.id !== task.id);
    announce(`Deleted task: ${task.title}`);
  } else if (STATUSES.includes(action)) {
    task.status = action;
    announce(`Moved "${task.title}" to ${STATUS_LABELS[action]}.`);
  }
  saveState();
  renderAll();
});

byId("goal-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-goal-action]");
  if (!button) return;
  const goal = state.goals.find((item) => item.id === button.dataset.id);
  if (!goal) return;
  if (button.dataset.goalAction === "increase") {
    goal.progress = Math.min(100, goal.progress + 10);
    announce(`${goal.title}: ${goal.progress}% complete.`);
  } else if (button.dataset.goalAction === "delete") {
    state.goals = state.goals.filter((item) => item.id !== goal.id);
    announce(`Deleted goal: ${goal.title}`);
  }
  saveState();
  renderAll();
});

byId("habit-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-habit-action]");
  if (!button) return;
  const habit = state.habits.find((item) => item.id === button.dataset.id);
  if (!habit) return;
  if (button.dataset.habitAction === "delete") {
    state.habits = state.habits.filter((item) => item.id !== habit.id);
  } else {
    habit.checks = habit.checks || {};
    const key = dateKey(new Date());
    habit.checks[key] = habit.checks[key] !== true;
  }
  saveState();
  renderAll();
});

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => setTimerMode(button.dataset.mode));
});
byId("timer-toggle").addEventListener("click", toggleTimer);
byId("timer-reset").addEventListener("click", () => {
  stopTimer();
  remainingSeconds = TIMER_MODES[selectedMode].seconds;
  updateTimerDisplay();
  announce("Timer reset.");
});
byId("suggestion-refresh").addEventListener("click", () => renderSuggestion(true));

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

byId("today-label").textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(today).toUpperCase();
renderAll();
updateTimerDisplay();
