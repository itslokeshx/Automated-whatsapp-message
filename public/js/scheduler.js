/**
 * Scheduler UI Logic
 * Handles schedule type switching and date/time validation
 */

document.addEventListener('DOMContentLoaded', () => {
    const scheduleTypeSelect = document.getElementById('scheduleType');
    const oneTimeSchedule = document.getElementById('oneTimeSchedule');
    const recurringSchedule = document.getElementById('recurringSchedule');

    // New datetime picker elements
    const dateInput = document.getElementById('scheduleDate');
    const hourSelect = document.getElementById('scheduleHour');
    const minuteSelect = document.getElementById('scheduleMinute');
    const datetimePreview = document.getElementById('datetimePreview');

    // Set minimum date to today
    function setMinDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${year}-${month}-${day}`;

        // Set default to today
        if (!dateInput.value) {
            dateInput.value = `${year}-${month}-${day}`;
        }
    }

    // Update datetime preview
    function updatePreview() {
        const date = dateInput.value;
        const hour = hourSelect.value;
        const minute = minuteSelect.value;

        if (date && hour && minute) {
            const dateObj = new Date(`${date}T${hour}:${minute}`);
            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            datetimePreview.textContent = dateObj.toLocaleDateString('en-US', options);
            datetimePreview.style.color = 'var(--accent-primary)';
        } else {
            datetimePreview.textContent = 'Not selected';
            datetimePreview.style.color = 'var(--text-muted)';
        }
    }

    // Get combined datetime value for form submission
    window.getScheduledDateTime = function () {
        const date = dateInput.value;
        const hour = hourSelect.value;
        const minute = minuteSelect.value;

        if (!date || !hour || !minute) {
            return null;
        }

        return `${date}T${hour}:${minute}`;
    };

    setMinDate();
    updatePreview();

    // Format minute input to always be 2 digits
    minuteSelect.addEventListener('blur', () => {
        if (minuteSelect.value) {
            const value = parseInt(minuteSelect.value);
            if (value >= 0 && value <= 59) {
                minuteSelect.value = String(value).padStart(2, '0');
                updatePreview();
            }
        }
    });

    // Add event listeners for live preview
    dateInput.addEventListener('change', updatePreview);
    hourSelect.addEventListener('change', updatePreview);
    minuteSelect.addEventListener('input', updatePreview);

    // Handle schedule type change
    scheduleTypeSelect.addEventListener('change', (e) => {
        const type = e.target.value;

        if (type === 'one-time') {
            oneTimeSchedule.style.display = 'block';
            recurringSchedule.style.display = 'none';
            dateInput.required = true;
            hourSelect.required = true;
            minuteSelect.required = true;
            document.getElementById('cronExpression').required = false;
        } else {
            oneTimeSchedule.style.display = 'none';
            recurringSchedule.style.display = 'block';
            dateInput.required = false;
            hourSelect.required = false;
            minuteSelect.required = false;
            document.getElementById('cronExpression').required = true;
        }
    });

    // Cron expression helper
    const cronExamples = {
        'Daily at 5:00 PM': '0 17 * * *',
        'Daily at 9:00 AM': '0 9 * * *',
        'Every Monday at 10:00 AM': '0 10 * * 1',
        'Every hour': '0 * * * *',
        'Every 30 minutes': '*/30 * * * *',
    };

    // Add cron helper tooltip (optional enhancement)
    const cronInput = document.getElementById('cronExpression');
    cronInput.addEventListener('focus', () => {
        console.log('Cron examples:', cronExamples);
    });
});
