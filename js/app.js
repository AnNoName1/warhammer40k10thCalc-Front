//app.js

import { calculateResults, checkServerStatus } from './api.js';
import { renderDistributionCharts } from './charts.js';

document.addEventListener('submit', async (e) => {
    if (e.target.id === 'calc-form') {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Convert checkbox strings to booleans
        data.lethalHits = formData.get('lethalHits') === 'on';
        data.devastatingWounds = formData.get('devastatingWounds') === 'on';

        const resultsDisplay = document.getElementById('results-display');
        resultsDisplay.innerHTML = `<div class="loading">Consulting the Machine Spirit...</div>`;

        const results = await calculateResults(data);

        if (results && results.summary) {
            // 1. Extract the correct key from the API response
            // 2. Format the long float to a readable decimal
            const avgDestroyed = parseFloat(results.summary.average_destroyed).toFixed(2);
            
            // 3. Update the summary card
            resultsDisplay.innerHTML = `
                <div class="results-card">
                    <h4>Expected Models Destroyed: <span class="highlight">${avgDestroyed}</span></h4>
                </div>
            `;

            // 4. Render the distribution charts
            // We pass the raw distribution objects and the target container ID
            renderDistributionCharts(results.distributions, 'charts-container');
        }
    }

});

import { router, navigateTo } from './router.js';

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    // Intercept navigation clicks
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    monitorServer(); // Start the adaptive polling loop
    router(); // Initialize first page
});

async function monitorServer() {
    const statusLabel = document.querySelector('.status');
    const isAlive = await checkServerStatus();

    if (isAlive) {
        statusLabel.innerHTML = 'System: <span class="online">Online</span>';
        currentPollInterval = 30000; // Reset to 30s when healthy
    } else {
        statusLabel.innerHTML = 'System: <span class="offline">Offline - Reconnecting</span>';
        currentPollInterval = 5000;  // Switch to 5s reconnect attempts
    }

    // Schedule next check based on current health state
    setTimeout(monitorServer, currentPollInterval);
}