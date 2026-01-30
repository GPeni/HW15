// --- Navigation Logic ---
function showScreen(screenId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// --- Auth Logic ---
const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const goal = document.getElementById('reg-goal').value;
    const msgDiv = document.getElementById('reg-msg');

    const users = getUsers();

    // Validations
    if (users.some(u => u.username === username || u.email === email)) {
        msgDiv.className = "msg error";
        msgDiv.innerText = "Username or Email already exists!";
        return;
    }

    const newUser = {
        id: "u_" + Date.now(),
        username, email, password, goal,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    msgDiv.className = "msg success";
    msgDiv.innerText = "Registration successful! Redirecting to login...";
    setTimeout(() => showScreen('login-screen'), 1500);
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const loginId = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-password').value;
    const msgDiv = document.getElementById('login-msg');

    const user = getUsers().find(u => (u.username === loginId || u.email === loginId) && u.password === pass);

    if (user) {
        // Create session object (Excluding password for security!)
        const sessionUser = { id: user.id, username: user.username, email: user.email, goal: user.goal };
        sessionStorage.setItem("loggedInUser", JSON.stringify(sessionUser));
        initDashboard();
    } else {
        msgDiv.className = "msg error";
        msgDiv.innerText = "Invalid credentials!";
    }
});

// --- Dashboard & AI Logic ---
function initDashboard() {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user) {
        showScreen('login-screen');
        return;
    }
    document.getElementById('user-name-display').innerText = user.username;
    document.getElementById('user-goal-display').innerText = user.goal;
    showScreen('dashboard-screen');
}

function generatePlan() {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const hours = document.getElementById('study-hours').value || 1;
    const output = document.getElementById('ai-plan-output');
    output.innerHTML = "<h4>Personalized Plan for " + user.goal + ":</h4>";

    // "AI" logic - creating different steps based on goal
    const steps = [
        `Day 1: Fundamentals of ${user.goal} (${hours} hours)`,
        `Day 2: Advanced syntax and patterns`,
        `Day 3: Building a mini project`,
        `Day 4: Code review and debugging`,
        `Day 5: Deployment and final test`
    ];

    steps.forEach(step => {
        const div = document.createElement('div');
        div.className = "plan-item";
        div.innerText = step;
        output.appendChild(div);
    });
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    showScreen('login-screen');
}

// Check if user is already logged in on refresh
window.onload = () => {
    if (sessionStorage.getItem("loggedInUser")) {
        initDashboard();
    }
};