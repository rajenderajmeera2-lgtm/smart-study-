<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World!</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
      <h1 class="title">Hello World!</h1>
      <p id="currentTime"></p>
      <script src="script.js"></script>
  </body>
</html><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Smart AI - Student Productivity & Learning Platform</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background-color: #f0f4f8;
      color: #1e293b;
    }

    /* Navigation Bar */
    nav {
      background: linear-gradient(90deg, #1e1b4b, #312e81, #4338ca);
      color: #ffffff;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    }

    .brand {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .brand span {
      color: #38bdf8;
    }

    .nav-links {
      font-size: 14px;
      color: #e0e7ff;
    }

    .container {
      max-width: 1020px;
      margin: 24px auto;
      padding: 0 20px;
    }

    /* Hero + AI Assistant Banner */
    .ai-banner {
      background: linear-gradient(135deg, #4f46e5, #0ea5e9);
      color: #ffffff;
      padding: 20px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
    }

    .ai-banner h1 {
      font-size: 22px;
      margin-bottom: 6px;
    }

    .ai-banner p {
      font-size: 14px;
      opacity: 0.95;
    }

    .ai-btn {
      background: #ffffff;
      color: #4f46e5;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }

    .ai-btn:hover {
      background: #f8fafc;
    }

    /* Summary Cards */
    .summary-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #ffffff;
      padding: 14px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      border-top: 4px solid #4f46e5;
    }

    .stat-card h3 {
      font-size: 24px;
      color: #4f46e5;
    }

    .stat-card span {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    /* Input Form */
    .form-box {
      background: #ffffff;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .form-box select,
    .form-box input {
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
    }

    .form-box input[type="text"] {
      flex: 1;
      min-width: 200px;
    }

    .form-box button {
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .form-box button:hover {
      background: #4338ca;
    }

    /* Tracker Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 16px;
    }

    .card {
      background: #ffffff;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .card h2 {
      font-size: 16px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f1f5f9;
      color: #1e1b4b;
    }

    ul {
      list-style: none;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }

    li.completed span.title {
      text-decoration: line-through;
      color: #94a3b8;
    }

    .badge {
      font-size: 11px;
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: 6px;
      font-weight: 600;
    }

    .actions button {
      border: none;
      cursor: pointer;
      font-size: 12px;
      margin-left: 4px;
      padding: 3px 7px;
      border-radius: 4px;
    }

    .btn-done {
      color: #16a34a;
      background: #dcfce7;
    }

    .btn-del {
      color: #dc2626;
      background: #fee2e2;
    }

    footer {
      text-align: center;
      padding: 24px;
      color: #64748b;
      font-size: 13px;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <!-- Top Navigation Bar -->
  <nav>
    <div class="brand">🤖 Study Smart <span>AI</span></div>
    <div class="nav-links">Goals • Habits • Assignments • Learning • Projects</div>
  </nav>

  <div class="container">
    <!-- AI Study Assistant Banner -->
    <div class="ai-banner">
      <div>
        <h1>Welcome to Study Smart AI</h1>
        <p id="ai-tip">✨ AI Study Insight: Break your "Web Tech Lab Record" assignment into two 25-minute Pomodoro sessions today!</p>
      </div>
      <button class="ai-btn" onclick="generateAiTip()">⚡ Get New AI Study Tip</button>
    </div>

    <!-- Summary Counter Bar -->
    <div class="summary-bar">
      <div class="stat-card"><h3 id="count-goals">0</h3><span>🎯 Goals</span></div>
      <div class="stat-card"><h3 id="count-habits">0</h3><span>🔥 Habits</span></div>
      <div class="stat-card"><h3 id="count-assignments">0</h3><span>📝 Assignments</span></div>
      <div class="stat-card"><h3 id="count-learning">0</h3><span>📚 Learning</span></div>
      <div class="stat-card"><h3 id="count-projects">0</h3><span>💻 Projects</span></div>
    </div>

    <!-- Add New Item Form -->
    <div class="form-box">
      <select id="category">
        <option value="goals">🎯 Goal</option>
        <option value="habits">🔥 Habit</option>
        <option value="assignments">📝 Assignment</option>
        <option value="learning">📚 Learning Topic</option>
        <option value="projects">💻 Project</option>
      </select>
      <input type="text" id="titleInput" placeholder="Enter task or goal for Study Smart AI...">
      <input type="text" id="detailInput" placeholder="Tag / Due / Streak (e.g., Due Friday)">
      <button onclick="addItem()">+ Add to Tracker</button>
    </div>

    <!-- 5 Tracker Sections -->
    <div class="grid">
      <div class="card">
        <h2>🎯 Academic Goals</h2>
        <ul id="list-goals"></ul>
      </div>
      <div class="card">
        <h2>🔥 Daily Study Habits</h2>
        <ul id="list-habits"></ul>
      </div>
      <div class="card">
        <h2>📝 Assignments &amp; Deadlines</h2>
        <ul id="list-assignments"></ul>
      </div>
      <div class="card">
        <h2>📚 Learning Modules</h2>
        <ul id="list-learning"></ul>
      </div>
      <div class="card">
        <h2>💻 Student Projects</h2>
        <ul id="list-projects"></ul>
      </div>
    </div>
  </div>

  <footer>
    &copy; 2026 Study Smart AI — Empowering Students to Track Goals, Habits, Assignments, Learning &amp; Projects
  </footer>

  <script>
    // Pre-loaded sample student data for Study Smart AI
    const trackerData = [
      { id: 1, category: 'goals', title: 'Score 9.2+ SGPA in Semester Exams', detail: 'Target: Sem End', done: false },
      { id: 2, category: 'habits', title: 'Practice 2 Coding Problems Daily', detail: '10-Day Streak', done: true },
      { id: 3, category: 'assignments', title: 'Submit AI & Web Tech Lab Record', detail: 'Due: Friday', done: false },
      { id: 4, category: 'learning', title: 'Machine Learning & JS Basics', detail: '75% Learned', done: false },
      { id: 5, category: 'projects', title: 'Study Smart AI Web Portal', detail: 'Completed', done: true }
    ];

    const aiTips = [
      '✨ AI Study Insight: Use Active Recall for 15 minutes after finishing your Machine Learning module.',
      '✨ AI Study Insight: Complete your highest-priority Assignment before 6 PM to boost habit consistency!',
      '✨ AI Study Insight: Great 10-day coding streak! Try building a mini-feature for your Student Project today.',
      '✨ AI Study Insight: Review your Academic Goals every Sunday evening to plan the week ahead.'
    ];
    let tipIndex = 0;

    function generateAiTip() {
      tipIndex = (tipIndex + 1) % aiTips.length;
      document.getElementById('ai-tip').textContent = aiTips[tipIndex];
    }

    function renderTracker() {
      const categories = ['goals', 'habits', 'assignments', 'learning', 'projects'];

      categories.forEach(cat => {
        const listEl = document.getElementById('list-' + cat);
        listEl.innerHTML = '';

        const items = trackerData.filter(item => item.category === cat);
        document.getElementById('count-' + cat).textContent = items.length;

        items.forEach(item => {
          const li = document.createElement('li');
          if (item.done) li.classList.add('completed');

          li.innerHTML = `
            <div>
              <span class="title">${item.title}</span>
              ${item.detail ? `<span class="badge">${item.detail}</span>` : ''}
            </div>
            <div class="actions">
              <button class="btn-done" onclick="toggleDone(${item.id})">✓</button>
              <button class="btn-del" onclick="deleteItem(${item.id})">✕</button>
            </div>
          `;
          listEl.appendChild(li);
        });
      });
    }

    function addItem() {
      const category = document.getElementById('category').value;
      const title = document.getElementById('titleInput').value.trim();
      const detail = document.getElementById('detailInput').value.trim();

      if (!title) {
        alert('Please enter a title!');
        return;
      }

      trackerData.push({
        id: Date.now(),
        category: category,
        title: title,
        detail: detail || 'Active',
        done: false
      });

      document.getElementById('titleInput').value = '';
      document.getElementById('detailInput').value = '';
      renderTracker();
    }

    function toggleDone(id) {
      const item = trackerData.find(i => i.id === id);
      if (item) {
        item.done = !item.done;
        renderTracker();
      }
    }

    function deleteItem(id) {
      const index = trackerData.findIndex(i => i.id === id);
      if (index !== -1) {
        trackerData.splice(index, 1);
        renderTracker();
      }
    }

    // Initialize Study Smart AI dashboard
    renderTracker();
  </script>
</body>
</html>