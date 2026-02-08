// js/charts.js

export function renderDistributionCharts(distributions, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous charts to prevent duplicates on re-run
    container.innerHTML = '';

    // Define render order and display titles
    const chartOrder = ['hits', 'wounds', 'saves_failed', 'damage', 'models_destroyed'];
    const titles = {
        hits: 'Hits Distribution',
        wounds: 'Wounds Distribution',
        saves_failed: 'Saves Failed',
        damage: 'Damage Dealt',
        models_destroyed: 'Models Destroyed'
    };

    chartOrder.forEach(key => {
        if (!distributions[key]) return;
        
        // Create Wrapper DOM elements
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        
        const canvas = document.createElement('canvas');
        wrapper.appendChild(canvas);
        container.appendChild(wrapper);

        // Process Data & Render
        const processedData = processData(distributions[key]);
        createChart(canvas, processedData, titles[key]);
    });
}

function processData(dist, threshold = 0.001) {
    // 1. Sort keys numerically (API returns JSON keys which are strings)
    const sortedKeys = Object.keys(dist).map(Number).sort((a, b) => a - b);
    
    // 2. Calculate Full Cumulative Probability (Chance of getting X or more)
    let cumulativeMap = {};
    let runningSum = 0;
    
    // Iterate backwards to build cumulative sum (X or greater)
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
        const k = sortedKeys[i];
        runningSum += dist[k];
        cumulativeMap[k] = runningSum;
    }

    // 3. Filter for Display (remove very low prob bars to clean up UI)
    const labels = sortedKeys.filter(k => dist[k] >= threshold);
    
    const pmfData = labels.map(k => dist[k]);
    const cumulativeRaw = labels.map(k => cumulativeMap[k]);

    // 4. Scaling Logic
    // We scale the cumulative line (0-100%) to fit the max height of the PMF bars
    // so they can coexist on the same visual scale without one flattening the other.
    const maxBarHeight = Math.max(...pmfData);
    // If maxBarHeight is 0 (shouldn't happen), default to 1 to avoid NaN
    const scaleFactor = maxBarHeight > 0 ? maxBarHeight : 1; 
    
    // Actually, we usually want the line to use a secondary axis or scale it down.
    // Per your reference, we scale the probability to the bar height visually.
    const cumulativeScaled = cumulativeRaw.map(p => p * scaleFactor);

    return { labels, pmfData, cumulativeRaw, cumulativeScaled, maxBarHeight };
}

function createChart(ctx, data, title) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    // The Scaled Cumulative Line (Red)
                    type: 'line',
                    label: 'Prob ≥ X (Scaled)',
                    data: data.cumulativeScaled,
                    borderColor: '#8b0000', // Accent Red
                    borderWidth: 2,
                    pointBackgroundColor: '#8b0000',
                    pointRadius: 2,
                    tension: 0.4, // Smooths the line
                    order: 1 // Render on top
                },
                {
                    // The PMF Bars (Blue)
                    type: 'bar',
                    label: 'Probability',
                    data: data.pmfData,
                    backgroundColor: '#5fb3b3', // Muted cyan/blue
                    hoverBackgroundColor: '#8cdbdb',
                    order: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',    // Hovering a vertical slice shows both data points
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#c5a059', // Accent Gold
                    font: { size: 14, family: 'Segoe UI' }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 13, 13, 0.9)',
                    titleColor: '#c5a059',
                    bodyColor: '#d1d1d1',
                    callbacks: {
                        label: function(context) {
                            // Custom tooltip formatting
                            
                            // If it's the Line dataset, show the RAW true probability
                            if (context.dataset.type === 'line') {
                                const rawVal = data.cumulativeRaw[context.dataIndex];
                                return `Chance ≥ ${context.label}: ${(rawVal * 100).toFixed(1)}%`;
                            }
                            
                            // Bar dataset
                            if (context.parsed.y !== null) {
                                return `Exact: ${(context.parsed.y * 100).toFixed(1)}%`;
                            }
                        }
                    }
                },
                legend: {
                    labels: { color: '#999', boxWidth: 10 }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#888' },
                    grid: { color: '#222' }
                },
                y: {
                    beginAtZero: true,
                    // Add some headroom so the line doesn't get cut off
                    max: data.maxBarHeight * 1.15, 
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    },
                    grid: { color: '#222' }
                }
            }
        }
    });
}