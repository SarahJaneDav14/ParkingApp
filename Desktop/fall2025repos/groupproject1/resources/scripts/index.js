// Auburn University Parking App - JavaScript Functionality

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main app initialization
function initializeApp() {
    setupEventListeners();
    updateParkingAvailability();
    startRealTimeUpdates();
    setupSmoothScrolling();
}

// Set up event listeners for interactive elements
function setupEventListeners() {
    // Find Parking button functionality
    const findParkingBtn = document.querySelector('.btn-primary');
    if (findParkingBtn) {
        findParkingBtn.addEventListener('click', handleFindParking);
    }

    // View Map button functionality
    const viewMapBtn = document.querySelector('.btn-outline-primary');
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', handleViewMap);
    }

    // Parking lot cards click functionality
    const parkingCards = document.querySelectorAll('.card');
    parkingCards.forEach(card => {
        card.addEventListener('click', function() {
            const lotName = this.querySelector('.card-title').textContent.trim();
            showParkingDetails(lotName);
        });
    });

    // Navigation link smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Handle Find Parking button click
function handleFindParking() {
    // Show loading state
    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Finding...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;

        // Show results (in a real app, this would show actual results)
        showParkingResults();
    }, 1500);
}

// Handle View Map button click
function handleViewMap() {
    // In a real app, this would open a map or navigate to map view
    alert('Map view would open here. This would show an interactive map of Auburn University campus with parking lot locations.');
}

// Show parking search results
function showParkingResults() {
    const results = [
        { name: 'Student Center Lot', available: 45, rate: '$2/hour', distance: '0.2 miles' },
        { name: 'Library Lot', available: 12, rate: '$1.50/hour', distance: '0.4 miles' },
        { name: 'Stadium Lot', available: 3, rate: '$3/hour', distance: '0.8 miles' }
    ];

    // Create modal or update UI with results
    const modal = createResultsModal(results);
    document.body.appendChild(modal);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// Create results modal
function createResultsModal(results) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Available Parking Near You</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        ${results.map(lot => `
                            <div class="col-md-6 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <h6 class="card-title">${lot.name}</h6>
                                        <p class="card-text">
                                            <span class="badge bg-success me-2">${lot.available} spots</span>
                                            <span class="text-muted">${lot.rate}</span>
                                        </p>
                                        <small class="text-muted">${lot.distance} away</small>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Get Directions</button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Show parking lot details
function showParkingDetails(lotName) {
    const details = getParkingLotDetails(lotName);
    alert(`Parking Lot: ${details.name}\n\nAvailable Spots: ${details.available}\nRate: ${details.rate}\nHours: ${details.hours}\n\n${details.description}`);
}

// Get parking lot details
function getParkingLotDetails(lotName) {
    const lots = {
        'Student Center Lot': {
            name: 'Student Center Lot',
            available: 45,
            rate: '$2.00/hour',
            hours: '24/7',
            description: 'Main student center parking with 24/7 access. Close to dining and student services.'
        },
        'Library Lot': {
            name: 'Library Lot',
            available: 12,
            rate: '$1.50/hour',
            hours: '6 AM - 11 PM',
            description: 'Convenient parking near Ralph Brown Draughon Library. Perfect for study sessions.'
        },
        'Stadium Lot': {
            name: 'Stadium Lot',
            available: 3,
            rate: '$3.00/hour',
            hours: '24/7',
            description: 'Premium parking near Jordan-Hare Stadium. Higher rates during game days.'
        }
    };
    
    return lots[lotName] || { name: lotName, available: 0, rate: 'N/A', hours: 'N/A', description: 'No details available.' };
}

// Update parking availability (simulate real-time updates)
function updateParkingAvailability() {
    const availabilityElements = document.querySelectorAll('.badge');
    
    availabilityElements.forEach(badge => {
        if (badge.textContent.includes('Available:')) {
            // Simulate random availability changes
            const currentCount = parseInt(badge.textContent.match(/\d+/)[0]);
            const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const newCount = Math.max(0, Math.min(50, currentCount + change));
            
            badge.textContent = `Available: ${newCount}`;
            
            // Update badge color based on availability
            badge.className = 'badge';
            if (newCount > 20) {
                badge.classList.add('bg-success');
            } else if (newCount > 5) {
                badge.classList.add('bg-warning');
            } else {
                badge.classList.add('bg-danger');
            }
        }
    });
}

// Start real-time updates
function startRealTimeUpdates() {
    // Update availability every 30 seconds
    setInterval(updateParkingAvailability, 30000);
}

// Setup smooth scrolling for navigation
function setupSmoothScrolling() {
    // This is handled in setupEventListeners, but we can add additional smooth scrolling behavior here
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Utility function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Utility function to get current time
function getCurrentTime() {
    return new Date();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Export functions for potential external use
window.AuburnParking = {
    findParking: handleFindParking,
    viewMap: handleViewMap,
    showNotification: showNotification,
    updateAvailability: updateParkingAvailability
};
