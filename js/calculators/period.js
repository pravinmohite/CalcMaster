// Period Calculator JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const periodForm = document.getElementById('periodForm');
  const resetFormBtn = document.getElementById('resetForm');
  const resultsContainer = document.getElementById('results');
  const calendarContainer = document.getElementById('calendarContainer');
  const trackSymptomsCheckbox = document.getElementById('trackSymptoms');
  const symptomsSection = document.getElementById('symptomsSection');
  
  // Form slider synchronization
  const cycleLengthInput = document.getElementById('cycleLength');
  const cycleLengthSlider = document.getElementById('cycleLengthSlider');
  const periodLengthInput = document.getElementById('periodLength');
  const periodLengthSlider = document.getElementById('periodLengthSlider');
  const lutealPhaseInput = document.getElementById('lutealPhase');
  const lutealPhaseSlider = document.getElementById('lutealPhaseSlider');
  
  // Calendar navigation
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const currentMonthDisplay = document.getElementById('currentMonth');
  const calendarElement = document.getElementById('calendar');
  
  // Set today's date as the default value for last period input
  const today = new Date();
  const lastPeriodInput = document.getElementById('lastPeriod');
  lastPeriodInput.valueAsDate = today;
  lastPeriodInput.max = today.toISOString().split('T')[0]; // Prevent future dates
  
  // Current calendar display date
  let currentDisplayMonth = today.getMonth();
  let currentDisplayYear = today.getFullYear();
  
  // Calculated cycle data
  let cycleData = null;
  
  // Sync number inputs with sliders
  cycleLengthSlider.addEventListener('input', () => {
    cycleLengthInput.value = cycleLengthSlider.value;
  });
  
  cycleLengthInput.addEventListener('input', () => {
    cycleLengthSlider.value = cycleLengthInput.value;
  });
  
  periodLengthSlider.addEventListener('input', () => {
    periodLengthInput.value = periodLengthSlider.value;
  });
  
  periodLengthInput.addEventListener('input', () => {
    periodLengthSlider.value = periodLengthInput.value;
  });
  
  lutealPhaseSlider.addEventListener('input', () => {
    lutealPhaseInput.value = lutealPhaseSlider.value;
  });
  
  lutealPhaseInput.addEventListener('input', () => {
    lutealPhaseSlider.value = lutealPhaseInput.value;
  });
  
  // Toggle symptoms section
  trackSymptomsCheckbox.addEventListener('change', () => {
    symptomsSection.classList.toggle('hidden', !trackSymptomsCheckbox.checked);
  });
  
  // Form submission
  periodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const lastPeriodDate = new Date(lastPeriodInput.value);
    const cycleLength = parseInt(cycleLengthInput.value);
    const periodLength = parseInt(periodLengthInput.value);
    const lutealPhase = parseInt(lutealPhaseInput.value);
    
    // Track symptoms if enabled
    const trackSymptoms = trackSymptomsCheckbox.checked;
    const selectedSymptoms = [];
    
    if (trackSymptoms) {
      document.querySelectorAll('input[name="symptoms"]:checked').forEach(checkbox => {
        selectedSymptoms.push(checkbox.value);
      });
    }
    
    const symptomsNotes = document.getElementById('symptomsNotes').value;
    
    // Calculate cycle information
    cycleData = calculateCycle(lastPeriodDate, cycleLength, periodLength, lutealPhase);
    
    // Display results
    displayResults(cycleData);
    
    // Generate and display calendar for the current month
    generateCalendar(currentDisplayMonth, currentDisplayYear);
    
    // Save calculation
    saveCalculation('period', {
      lastPeriodDate: lastPeriodDate.toISOString(),
      cycleLength,
      periodLength,
      lutealPhase,
      trackSymptoms,
      selectedSymptoms,
      symptomsNotes
    }, cycleData);
    
    // Show results container
    resultsContainer.classList.remove('hidden');
  });
  
  // Reset form
  resetFormBtn.addEventListener('click', () => {
    periodForm.reset();
    resultsContainer.classList.add('hidden');
    calendarContainer.classList.add('hidden');
    symptomsSection.classList.add('hidden');
    resultsContainer.innerHTML = '';
  });
  
  // Calendar navigation
  prevMonthBtn.addEventListener('click', () => {
    currentDisplayMonth--;
    if (currentDisplayMonth < 0) {
      currentDisplayMonth = 11;
      currentDisplayYear--;
    }
    generateCalendar(currentDisplayMonth, currentDisplayYear);
  });
  
  nextMonthBtn.addEventListener('click', () => {
    currentDisplayMonth++;
    if (currentDisplayMonth > 11) {
      currentDisplayMonth = 0;
      currentDisplayYear++;
    }
    generateCalendar(currentDisplayMonth, currentDisplayYear);
  });
  
  // View calendar button click handler
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-calendar-btn')) {
      e.preventDefault();
      calendarContainer.classList.remove('hidden');
      calendarContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Calculate cycle information
  function calculateCycle(lastPeriodDate, cycleLength, periodLength, lutealPhase) {
    // Initialize result object
    const result = {
      lastPeriod: {
        start: new Date(lastPeriodDate),
        end: new Date(lastPeriodDate)
      },
      nextPeriods: [],
      ovulationDates: [],
      fertileDays: [],
      pmsDays: []
    };
    
    // Set end date of last period
    result.lastPeriod.end.setDate(result.lastPeriod.start.getDate() + periodLength - 1);
    
    // Calculate next periods (3 months forward)
    for (let i = 1; i <= 6; i++) {
      const nextPeriodStart = new Date(lastPeriodDate);
      nextPeriodStart.setDate(nextPeriodStart.getDate() + (cycleLength * i));
      
      const nextPeriodEnd = new Date(nextPeriodStart);
      nextPeriodEnd.setDate(nextPeriodStart.getDate() + periodLength - 1);
      
      result.nextPeriods.push({
        start: nextPeriodStart,
        end: nextPeriodEnd
      });
    }
    
    // Calculate ovulation dates
    // Ovulation typically occurs lutealPhase days before the next period
    for (let i = 0; i < result.nextPeriods.length; i++) {
      const ovulationDate = new Date(result.nextPeriods[i].start);
      ovulationDate.setDate(ovulationDate.getDate() - lutealPhase);
      result.ovulationDates.push(ovulationDate);
      
      // Calculate fertile window (5 days before and day of ovulation)
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 5);
      
      for (let j = 0; j <= 5; j++) {
        const fertileDay = new Date(fertileStart);
        fertileDay.setDate(fertileStart.getDate() + j);
        result.fertileDays.push(fertileDay);
      }
      
      // Calculate PMS days (typically 3-7 days before period)
      const pmsStart = new Date(result.nextPeriods[i].start);
      pmsStart.setDate(pmsStart.getDate() - 7);
      
      for (let j = 0; j < 7; j++) {
        const pmsDay = new Date(pmsStart);
        pmsDay.setDate(pmsStart.getDate() + j);
        result.pmsDays.push(pmsDay);
      }
    }
    
    return result;
  }
  
  // Display results
  function displayResults(data) {
    const nextPeriod = data.nextPeriods[0];
    const ovulationDate = data.ovulationDates[0];
    
    // Format dates for display
    const formatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const nextPeriodStart = nextPeriod.start.toLocaleDateString('en-US', formatOptions);
    const nextPeriodEnd = nextPeriod.end.toLocaleDateString('en-US', formatOptions);
    
    const ovulationDateStr = ovulationDate.toLocaleDateString('en-US', formatOptions);
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    const fertileStartStr = fertileStart.toLocaleDateString('en-US', formatOptions);
    const fertileEndStr = fertileEnd.toLocaleDateString('en-US', formatOptions);
    
    const pmsStart = new Date(nextPeriod.start);
    pmsStart.setDate(pmsStart.getDate() - 7);
    const pmsStartStr = pmsStart.toLocaleDateString('en-US', formatOptions);
    const pmsEndStr = new Date(nextPeriod.start.getTime() - 86400000).toLocaleDateString('en-US', formatOptions);
    
    // Calculate days until next period
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntilPeriod = Math.ceil((nextPeriod.start - today) / (1000 * 60 * 60 * 24));
    
    resultsContainer.innerHTML = `
      <div class="result-header">
        <h3>Your Cycle Forecast</h3>
        <p>${daysUntilPeriod > 0 ? `Your next period is in <strong>${daysUntilPeriod} days</strong>` : 'Your period is due today!'}</p>
      </div>
      
      <div class="result-cards">
        <div class="result-card">
          <div class="result-card-header">
            <div class="result-card-icon period-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h4>Next Period</h4>
          </div>
          <p>Starts: <span class="date-range">${nextPeriodStart}</span></p>
          <p>Ends: <span class="date-range">${nextPeriodEnd}</span></p>
        </div>
        
        <div class="result-card">
          <div class="result-card-header">
            <div class="result-card-icon ovulation-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h4>Ovulation Day</h4>
          </div>
          <p><span class="date-range">${ovulationDateStr}</span></p>
          <p>Most likely day of ovulation based on your cycle length</p>
        </div>
        
        <div class="result-card">
          <div class="result-card-header">
            <div class="result-card-icon fertile-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </div>
            <h4>Fertile Window</h4>
          </div>
          <p>From: <span class="date-range">${fertileStartStr}</span></p>
          <p>To: <span class="date-range">${fertileEndStr}</span></p>
        </div>
        
        <div class="result-card">
          <div class="result-card-header">
            <div class="result-card-icon pms-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h4>PMS Symptoms</h4>
          </div>
          <p>From: <span class="date-range">${pmsStartStr}</span></p>
          <p>To: <span class="date-range">${pmsEndStr}</span></p>
        </div>
      </div>
      
      <button class="view-calendar-btn">View Full Calendar</button>
    `;
  }
  
  // Generate calendar for a specific month
  function generateCalendar(month, year) {
    // Update current month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar
    calendarElement.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    
    dayNames.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      calendarHeader.appendChild(dayElement);
    });
    
    calendarElement.appendChild(calendarHeader);
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get previous month's days if needed
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayElement = createDayElement(prevMonthDays - i, true);
      calendarElement.appendChild(dayElement);
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      
      // Check if day is today
      const isToday = currentDate.toDateString() === new Date().toDateString();
      
      // Check day type
      const dayType = getDayType(currentDate);
      
      const dayElement = createDayElement(i, false, isToday, dayType);
      calendarElement.appendChild(dayElement);
    }
    
    // Calculate remaining days (to make the grid complete)
    const remainingDays = 42 - (firstDay + daysInMonth);
    
    // Add days from next month
    for (let i = 1; i <= remainingDays; i++) {
      const dayElement = createDayElement(i, true);
      calendarElement.appendChild(dayElement);
    }
  }
  
  // Create a day element for the calendar
  function createDayElement(day, isInactive, isToday = false, dayType = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isInactive) dayElement.classList.add('inactive');
    if (isToday) dayElement.classList.add('today');
    
    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);
    
    // Add highlight based on day type
    if (dayType) {
      const highlight = document.createElement('div');
      highlight.className = `day-highlight ${dayType.class}`;
      dayElement.appendChild(highlight);
      
      // Add tooltip with information
      const tooltip = document.createElement('div');
      tooltip.className = 'day-tooltip';
      tooltip.textContent = dayType.tooltip;
      dayElement.appendChild(tooltip);
    }
    
    return dayElement;
  }
  
  // Determine day type based on cycle data
  function getDayType(date) {
    if (!cycleData) return null;
    
    const dateStr = date.toDateString();
    
    // Check if day is in a period
    // First check last period
    if (dateIsBetween(date, cycleData.lastPeriod.start, cycleData.lastPeriod.end)) {
      return { class: 'period-day', tooltip: 'Period' };
    }
    
    // Then check next periods
    for (const period of cycleData.nextPeriods) {
      if (dateIsBetween(date, period.start, period.end)) {
        return { class: 'period-day', tooltip: 'Period' };
      }
    }
    
    // Check if day is ovulation
    for (const ovulationDate of cycleData.ovulationDates) {
      if (dateStr === ovulationDate.toDateString()) {
        return { class: 'ovulation-day', tooltip: 'Ovulation Day' };
      }
    }
    
    // Check if day is in fertile window
    for (const fertileDay of cycleData.fertileDays) {
      if (dateStr === fertileDay.toDateString()) {
        return { class: 'fertile-day', tooltip: 'Fertile Day' };
      }
    }
    
    // Check if day is in PMS window
    for (const pmsDay of cycleData.pmsDays) {
      if (dateStr === pmsDay.toDateString()) {
        return { class: 'pms-day', tooltip: 'PMS Day' };
      }
    }
    
    return null;
  }
  
  // Helper function to check if a date is between two dates
  function dateIsBetween(date, startDate, endDate) {
    const dateToCheck = date.setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(0, 0, 0, 0);
    
    return dateToCheck >= start && dateToCheck <= end;
  }
});