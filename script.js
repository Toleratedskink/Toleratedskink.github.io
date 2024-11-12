// Global assignment data storage
let assignments = [];

// Navigate to the Assignments page
function goToAssignments() {
    document.getElementById('homepage-container').style.display = 'none';
    document.getElementById('calendar-page').style.display = 'none';
    document.getElementById('assignments-container').style.display = 'block';
    renderAssignments();
}

// Navigate to the Calendar page from Assignments page
function goToCalendar() {
    document.getElementById('assignments-container').style.display = 'none';
    document.getElementById('calendar-page').style.display = 'block';
}

// Navigate to the Homepage from any page
function goToHome() {
    document.getElementById('assignments-container').style.display = 'none';
    document.getElementById('calendar-page').style.display = 'none';
    document.getElementById('homepage-container').style.display = 'block';
}

// Handle assignment form submission
document.getElementById('assignment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('assignment-name').value;
    const dueDate = document.getElementById('due-date').value;
    const difficulty = document.getElementById('difficulty').value;

    assignments.push({ name, dueDate, difficulty });

    // Close form modal
    closeAssignmentForm();

    // Re-render calendar and assignments list
    renderCalendar(currentMonth, currentYear);
    renderAssignments();
});

// Render assignments on the assignments page
function renderAssignments() {
    const assignmentList = document.getElementById('assignment-list');
    assignmentList.innerHTML = ''; // Clear the existing list

    assignments.forEach((assignment) => {
        const li = document.createElement('li');
        li.textContent = `${assignment.name} - Due: ${assignment.dueDate}`;
        assignmentList.appendChild(li);
    });
}

// Calendar logic
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

    // Re-render the calendar and assignments list
    renderCalendar(currentMonth, currentYear);
    renderAssignments();
}

// Initial render of the calendar
renderCalendar(currentMonth, currentYear);
