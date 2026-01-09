/**
 * Scheduler UI Logic
 * Handles schedule type switching and date/time validation
 */

document.addEventListener('DOMContentLoaded', () => {
    const scheduleTypeSelect = document.getElementById('scheduleType');
    const oneTimeSchedule = document.getElementById('oneTimeSchedule');
    const recurringSchedule = document.getElementById('recurringSchedule');
    const dateTimeInput = document.getElementById('scheduleDateTime');

    // Set minimum datetime to now
    function setMinDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateTimeInput.min = now.toISOString().slice(0, 16);
    }

    setMinDateTime();

    // Handle schedule type change
    scheduleTypeSelect.addEventListener('change', (e) => {
        const type = e.target.value;

        if (type === 'one-time') {
            oneTimeSchedule.style.display = 'block';
            recurringSchedule.style.display = 'none';
            dateTimeInput.required = true;
            document.getElementById('cronExpression').required = false;
        } else {
            oneTimeSchedule.style.display = 'none';
            recurringSchedule.style.display = 'block';
            dateTimeInput.required = false;
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
