// Workout data structure
const workoutSchedule = {
    'Friday': {
        title: 'Friday — Legs',
        exercises: [
            { name: 'Leg press', sets: '4 sets of 8–12' },
            { name: 'Hack squat or squat machine', sets: '4 sets of 8–12' },
            { name: 'Seated leg curl', sets: '3 sets of 10–15' },
            { name: 'Leg extension', sets: '3 sets of 10–15' },
            { name: 'Glute machine or hip thrust machine', sets: '3 sets of 8–12' },
            { name: 'Standing or seated calf raise machine', sets: '4 sets of 12–20' },
            { name: 'Ab machine or cable crunch', sets: '3 sets of 12–20' }
        ]
    },
    'Saturday': {
        title: 'Saturday — Shoulders / Arms',
        exercises: [
            { name: 'Shoulder press machine', sets: '4 sets of 8–12' },
            { name: 'Lateral raise machine', sets: '4 sets of 12–15' },
            { name: 'Reverse pec deck', sets: '3 sets of 12–15' },
            { name: 'Triceps pressdown', sets: '3 sets of 10–15' },
            { name: 'Overhead triceps extension machine/cable', sets: '3 sets of 10–15' },
            { name: 'Biceps curl machine', sets: '3 sets of 10–15' },
            { name: 'Incline cable curl or preacher curl machine', sets: '3 sets of 10–15' }
        ]
    },
    'Sunday': {
        title: 'Sunday — Upper Pump / Weak Points',
        exercises: [
            { name: 'Chest press machine', sets: '3 sets of 10–15' },
            { name: 'Lat pulldown', sets: '3 sets of 10–15' },
            { name: 'Seated row', sets: '3 sets of 10–15' },
            { name: 'Pec deck fly', sets: '2–3 sets of 12–15' },
            { name: 'Reverse pec deck', sets: '2–3 sets of 12–15' },
            { name: 'Lateral raise machine', sets: '2–3 sets of 12–20' },
            { name: 'Optional core: ab machine or cable crunch', sets: '3 sets of 12–20' }
        ]
    }
};

// State management
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
let currentWorkout = null;
let currentDay = null;

// Initialize app
function init() {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    currentDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    
    // Set greeting based on time of day with motivational twist
    const hour = new Date().getHours();
    const greetingText = hour < 12 ? 'Train Hard' : hour < 18 ? 'Stay Consistent' : 'Push Forward';
    document.getElementById('greeting-text').textContent = `${greetingText} — ${currentDay}`;
    
    // Set workout title
    document.getElementById('workout-title').textContent = workoutSchedule[currentDay]?.title || 'Workout Tracker';
    
    renderWorkouts();
    updateStats();
    renderCalendar();
    renderChart();
    setupNavigation();
}

// Render workout list
function renderWorkouts() {
    const workoutList = document.getElementById('workout-list');
    const schedule = workoutSchedule[currentDay];
    
    if (!schedule) {
        workoutList.innerHTML = '<div class="empty-state"><h3>No workout scheduled</h3><p>Check back another day!</p></div>';
        return;
    }

    workoutList.innerHTML = schedule.exercises.map((exercise, index) => {
        const workoutId = `${currentDay}-${index}`;
        const workoutData = workouts.find(w => w.id === workoutId);
        
        let statusClass = '';
        let statusText = '';
        let actionButtons = '';

        if (workoutData) {
            statusClass = workoutData.status;
            statusText = workoutData.status;
            actionButtons = `
                <button class="action-btn btn-complete" onclick="markComplete('${workoutId}')">✓ Complete</button>
                <button class="action-btn btn-half" onclick="markHalf('${workoutId}')">½ Half</button>
                <button class="action-btn btn-skip" onclick="markSkipped('${workoutId}')">⏭ Skip</button>
                <input type="text" class="weight-input" placeholder="Weight" value="${workoutData.weight || ''}" onchange="updateWeight('${workoutId}', this.value)">
            `;
        } else {
            actionButtons = `
                <button class="action-btn btn-complete" onclick="openModal('${workoutId}')">Log Workout</button>
            `;
        }

        return `
            <div class="workout-item ${statusClass}" id="${workoutId}">
                <h3>${exercise.name}</h3>
                <p>${exercise.sets}</p>
                ${actionButtons}
            </div>
        `;
    }).join('');
}

// Open modal for logging workout
function openModal(workoutId) {
    currentWorkout = workoutId;
    document.getElementById('workout-name').value = '';
    document.getElementById('workout-sets').value = '';
    document.getElementById('workout-weight').value = '';
    document.getElementById('workout-status').value = 'completed';
    document.getElementById('workout-modal').classList.add('active');
}

// Save workout
function saveWorkout() {
    const name = document.getElementById('workout-name').value;
    const sets = document.getElementById('workout-sets').value;
    const weight = document.getElementById('workout-weight').value;
    const status = document.getElementById('workout-status').value;

    if (!name) {
        alert('Please enter a workout name');
        return;
    }

    const workoutData = {
        id: currentWorkout,
        name: name,
        sets: sets,
        weight: weight,
        status: status,
        timestamp: new Date().toISOString()
    };

    workouts.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    
    document.getElementById('workout-modal').classList.remove('active');
    renderWorkouts();
    updateStats();
    renderChart();
}

// Mark workout as complete
function markComplete(workoutId) {
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex].status = 'completed';
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
        updateStats();
        renderChart();
    }
}

// Mark workout as half completed
function markHalf(workoutId) {
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex].status = 'half';
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
        updateStats();
        renderChart();
    }
}

// Mark workout as skipped
function markSkipped(workoutId) {
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex].status = 'skipped';
        localStorage.setItem('workouts', JSON.stringify(workouts));
        renderWorkouts();
        updateStats();
        renderChart();
    }
}

// Update weight
function updateWeight(workoutId, weight) {
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex !== -1) {
        workouts[workoutIndex].weight = weight;
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

// Update stats display
function updateStats() {
    const completed = workouts.filter(w => w.status === 'completed').length;
    const skipped = workouts.filter(w => w.status === 'skipped').length;
    const total = workouts.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('completion-rate').textContent = `${rate}%`;
    document.getElementById('total-workouts').textContent = total;
    document.getElementById('completed-workouts').textContent = completed;
    document.getElementById('skipped-workouts').textContent = skipped;
}

// Render calendar
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const calendarDays = [];

    // Generate 28 days starting from 28 days ago
    for (let i = 27; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const workoutData = workouts.find(w => {
            const workoutDate = new Date(w.timestamp);
            return workoutDate.getDate() === dayNumber && 
                   workoutDate.getMonth() === date.getMonth() &&
                   workoutDate.getFullYear() === date.getFullYear();
        });

        let statusClass = 'rest';
        let statusText = 'Rest';

        if (workoutData) {
            statusClass = workoutData.status;
            statusText = workoutData.status.charAt(0).toUpperCase() + workoutData.status.slice(1);
        }

        calendarDays.push(`
            <div class="calendar-day ${statusClass}" data-date="${date.toISOString()}">
                <span class="date">${dayNumber} ${month}</span>
                <span class="status">${statusText}</span>
            </div>
        `);
    }

    calendar.innerHTML = calendarDays.join('');
}

// Render chart
function renderChart() {
    const select = document.getElementById('workout-select');
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');

    // Populate dropdown
    select.innerHTML = '<option value="all">All Workouts</option>' + 
        workouts.map(w => `<option value="${w.id}">${w.name}</option>`).join('');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simple bar chart
    const workoutData = select.value === 'all' ? workouts : workouts.filter(w => w.id === select.value);
    
    if (workoutData.length === 0) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No workout data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    const barWidth = (canvas.width - 40) / workoutData.length - 10;
    const maxProgress = Math.max(...workoutData.map(w => w.status === 'completed' ? 1 : 0.5), 1);

    workoutData.forEach((workout, index) => {
        const barHeight = (workout.status === 'completed' ? 1 : 0.5) / maxProgress * (canvas.height - 40);
        const x = 20 + index * (barWidth + 10);
        const y = canvas.height - barHeight - 20;

        ctx.fillStyle = workout.status === 'completed' ? '#2563EB' : 
                       workout.status === 'half' ? '#60A5FA' : 
                       workout.status === 'skipped' ? '#94A3B8' : '#ef4444';
        
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(workout.name.substring(0, 12), x + barWidth / 2, canvas.height - 5);
    });
}

// Tab switching
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Modal buttons
    document.getElementById('save-workout').addEventListener('click', saveWorkout);
    document.getElementById('cancel-workout').addEventListener('click', () => {
        document.getElementById('workout-modal').classList.remove('active');
    });

    // Close modal on outside click
    document.getElementById('workout-modal').addEventListener('click', (e) => {
        if (e.target.id === 'workout-modal') {
            e.target.classList.remove('active');
        }
    });
}

// Initialize
init();
