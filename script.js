// Global variable to hold assignment data
let assignments = [];

// Function to navigate to the Assignments page
function goToAssignments() {
    // Hide the homepage and show the assignments page
    document.getElementById('homepage-container').style.display = 'none';
    document.getElementById('assignments-container').style.display = 'block';

    // Update the bell notification
    updateBell();
}

// Function to go back to the homepage
function goToHome() {
    document.getElementById('assignments-container').style.display = 'none';
    document.getElementById('homepage-container').style.display = 'block';
}

// Function to update the bell notification
function updateBell() {
    // Filter assignments that are due today or later
    const dueAssignments = assignments.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate >= new Date(); // Filter assignments due today or later
    });

    // Update bell count display
    const bellCountText = document.getElementById('bell-count');
    bellCountText.textContent = dueAssignments.length;

    // Show/hide the bell count based on the number of due assignments
    const bellContainer = document.getElementById('bell-container');
    if (dueAssignments.length > 0) {
        bellContainer.classList.add('active');
    } else {
        bellContainer.classList.remove('active');
    }
}

// Handle assignment form submission
document.getElementById('assignment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('assignment-name').value;
    const dueDate = document.getElementById('due-date').value;
    const difficulty = document.getElementById('difficulty').value;

    // Add the assignment to the assignments array
    assignments.push({ name, dueDate, difficulty });

    // Reset form
    document.getElementById('assignment-name').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('difficulty').value = '1';

    // Update the calendar
    renderCalendar(currentMonth, currentYear);
    updateBell();
});

// Calendar rendering logic
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Function to change month
function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

// Function to render the calendar
function renderCalendar(month, year) {
    const calendarBody = document.querySelector('#calendar tbody');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    monthYearDisplay.textContent = `${getMonthName(month)} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay();

    let calendarDays = [];
    let currentDay = 1;

    // Create empty slots before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        calendarDays.push('');
    }

    // Add the days of the current month
    for (let i = currentDay; i <= lastDateOfMonth; i++) {
        calendarDays.push(i);
    }

    // Render calendar rows
    calendarBody.innerHTML = '';
    let row = document.createElement('tr');
    calendarDays.forEach((day, index) => {
        if (index % 7 === 0 && index !== 0) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
        }
        const cell = document.createElement('td');
        cell.textContent = day || '';
        row.appendChild(cell);
    });

    calendarBody.appendChild(row);

    // Now, mark the assignments on the calendar
    assignments.forEach((assignment, index) => {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate.getMonth() === month && dueDate.getFullYear() === year) {
            const day = dueDate.getDate();
            const cells = document.querySelectorAll('#calendar td');
            for (let i = 0; i < cells.length; i++) {
                if (parseInt(cells[i].textContent) === day) {
                    const assignmentIndex = document.createElement('div');
                    assignmentIndex.classList.add('assignment-mark');
                    assignmentIndex.textContent = index + 1; // Use the assignment index as the label
                    assignmentIndex.onclick = () => deleteAssignment(index); // Add delete on click
                    cells[i].appendChild(assignmentIndex);
                }
            }
        }
    });
}

// Helper function to get the month's name
function getMonthName(monthIndex) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
}

// Function to delete an assignment
function deleteAssignment(index) {
    // Remove the assignment from the assignments array
    assignments.splice(index, 1);

    // Re-render the calendar
    renderCalendar(currentMonth, currentYear);

    // Update the bell notification
    updateBell();
}

// Initial render of the calendar
renderCalendar(currentMonth, currentYear);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }
  
