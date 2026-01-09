/**
 * Main Application Logic
 * Handles API communication and UI interactions
 */

// Toast notification system
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// API helper
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Send immediate message
async function sendMessage(recipient, message) {
    const btn = document.getElementById('sendBtn');
    const originalContent = btn.innerHTML;

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Sending...';

        const payload = { to: recipient };
        if (message) payload.message = message;

        const result = await apiCall('/api/messages/send', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        showToast('Message sent successfully! ✓', 'success');

        // Clear form
        document.getElementById('sendMessageForm').reset();

        return result;
    } catch (error) {
        showToast(`Failed to send message: ${error.message}`, 'error');
        throw error;
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// Schedule message
async function scheduleMessage(recipient, message, scheduledTime, cronExpression) {
    const btn = document.getElementById('scheduleBtn');
    const originalContent = btn.innerHTML;

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Scheduling...';

        const payload = { to: recipient };
        if (message) payload.message = message;
        if (scheduledTime) payload.scheduledTime = scheduledTime;
        if (cronExpression) payload.cronExpression = cronExpression;

        const result = await apiCall('/api/messages/schedule', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        showToast('Message scheduled successfully! ⏰', 'success');

        // Clear form
        document.getElementById('scheduleMessageForm').reset();

        // Refresh scheduled messages list
        await loadScheduledMessages();

        return result;
    } catch (error) {
        showToast(`Failed to schedule message: ${error.message}`, 'error');
        throw error;
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// Load scheduled messages
async function loadScheduledMessages() {
    const container = document.getElementById('scheduledListContainer');

    try {
        const data = await apiCall('/api/messages/scheduled');

        if (data.jobs && data.jobs.length > 0) {
            container.innerHTML = `
        <div class="scheduled-list">
          ${data.jobs.map(job => createScheduledItem(job)).join('')}
        </div>
      `;

            // Add event listeners to cancel buttons
            data.jobs.forEach(job => {
                const cancelBtn = document.getElementById(`cancel-${job.id}`);
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => cancelScheduledMessage(job.id));
                }
            });
        } else {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>No scheduled messages</p>
        </div>
      `;
        }
    } catch (error) {
        container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <p>Failed to load scheduled messages</p>
      </div>
    `;
        console.error('Failed to load scheduled messages:', error);
    }
}

// Create scheduled item HTML
function createScheduledItem(job) {
    const timeDisplay = job.type === 'one-time'
        ? new Date(job.scheduledTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : job.cronExpression;

    return `
    <div class="scheduled-item slide-in">
      <div class="scheduled-info">
        <div class="scheduled-recipient">📱 ${job.recipient}</div>
        <div class="scheduled-time">⏰ ${timeDisplay}</div>
        <span class="scheduled-type">${job.type}</span>
      </div>
      <button class="btn btn-danger btn-sm" id="cancel-${job.id}">
        Cancel
      </button>
    </div>
  `;
}

// Cancel scheduled message
async function cancelScheduledMessage(jobId) {
    if (!confirm('Are you sure you want to cancel this scheduled message?')) {
        return;
    }

    try {
        await apiCall(`/api/messages/scheduled/${jobId}`, {
            method: 'DELETE',
        });

        showToast('Scheduled message cancelled', 'success');
        await loadScheduledMessages();
    } catch (error) {
        showToast(`Failed to cancel message: ${error.message}`, 'error');
    }
}

// Check server health
async function checkHealth() {
    const statusDiv = document.getElementById('healthStatus');
    const btn = document.getElementById('healthCheckBtn');
    const originalContent = btn.innerHTML;

    try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>';

        statusDiv.innerHTML = '<p class="text-muted">Checking server health...</p>';

        const data = await apiCall('/api/health');

        const uptimeMinutes = Math.floor(data.environment.uptime / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        const uptimeDisplay = uptimeHours > 0
            ? `${uptimeHours}h ${uptimeMinutes % 60}m`
            : `${uptimeMinutes}m`;

        statusDiv.innerHTML = `
      <div style="display: grid; gap: var(--space-sm);">
        <div class="status-badge success">
          <span class="status-dot"></span>
          Server is healthy
        </div>
        <p class="text-secondary">⏱️ Uptime: ${uptimeDisplay}</p>
        <p class="text-secondary">🌏 Timezone: ${data.environment.timezone}</p>
        <p class="text-secondary">📱 WhatsApp: ${data.config.hasToken ? '✅ Connected' : '❌ Not configured'}</p>
        <p class="text-secondary">🔢 Node: ${data.environment.nodeVersion}</p>
      </div>
    `;
    } catch (error) {
        statusDiv.innerHTML = `
      <div class="status-badge error">
        <span class="status-dot"></span>
        Health check failed
      </div>
      <p class="text-muted" style="margin-top: var(--space-sm);">${error.message}</p>
    `;
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Send message form
    document.getElementById('sendMessageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipient = document.getElementById('sendRecipient').value;
        const message = document.getElementById('sendMessage').value;
        await sendMessage(recipient, message);
    });

    // Schedule message form
    document.getElementById('scheduleMessageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipient = document.getElementById('scheduleRecipient').value;
        const message = document.getElementById('scheduleMessage').value;
        const type = document.getElementById('scheduleType').value;

        let scheduledTime = null;
        let cronExpression = null;

        if (type === 'one-time') {
            const dateTime = document.getElementById('scheduleDateTime').value;
            if (!dateTime) {
                showToast('Please select a date and time', 'error');
                return;
            }
            scheduledTime = new Date(dateTime).toISOString();
        } else {
            cronExpression = document.getElementById('cronExpression').value;
            if (!cronExpression) {
                showToast('Please enter a cron expression', 'error');
                return;
            }
        }

        await scheduleMessage(recipient, message, scheduledTime, cronExpression);
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadScheduledMessages);

    // Health check button
    document.getElementById('healthCheckBtn').addEventListener('click', checkHealth);

    // Initial load
    loadScheduledMessages();
    checkHealth();
});
