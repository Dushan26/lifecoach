// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    const icon = this.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});
// About Section Animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalNumber = parseInt(stat.textContent);
            const isPercentage = stat.textContent.includes('%');
            const hasPlus = stat.textContent.includes('+');
            
            let currentNumber = 0;
            const increment = finalNumber / 50;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }
                
                let displayNumber = Math.floor(currentNumber);
                let suffix = '';
                
                if (isPercentage) {
                    suffix = '<span class="stat-plus">%</span>';
                } else if (hasPlus) {
                    suffix = '<span class="stat-plus">+</span>';
                }
                
                stat.innerHTML = displayNumber + suffix;
            }, 50);
        });
    }

    // Approach items hover effect
    const approachItems = document.querySelectorAll('.approach-item-new');
    approachItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Quote card interactive effect
    const quoteCard = document.querySelector('.quote-card');
    if (quoteCard) {
        quoteCard.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        quoteCard.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
});

// Book a Session Functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookBtns = document.querySelectorAll('.book-btn');
    const bookingCalendar = document.getElementById('booking-calendar');
    const calendarGrid = document.getElementById('calendarGrid');
    const timeSlots = document.getElementById('timeSlots');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const bookingForm = document.getElementById('bookingForm');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let selectedSession = null;
    let selectedDate = null;
    let selectedTime = null;
    let currentDate = new Date();
    
    const sessionData = {
        discovery: {
            name: 'Discovery Call',
            duration: '30 minutes',
            price: 'FREE'
        },
        coaching: {
            name: '1-on-1 Coaching',
            duration: '60 minutes',
            price: '$150'
        },
        vip: {
            name: 'VIP Intensive',
            duration: '3 hours',
            price: '$450'
        }
    };
    
    const availableTimeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    // Book button click handlers
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectedSession = this.dataset.session;
            updateBookingSummary();
            showBookingCalendar();
        });
    });
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    function showBookingCalendar() {
        bookingCalendar.style.display = 'block';
        bookingCalendar.scrollIntoView({ behavior: 'smooth' });
        renderCalendar();
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = '600';
            // Book a Session Functionality (Continued)
            dayHeader.style.color = '#B8860B';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            dayHeader.style.fontSize = '0.9rem';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const cellDate = new Date(year, month, day);
            const isToday = cellDate.toDateString() === today.toDateString();
            const isPast = cellDate < today && !isToday;
            const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
            
            if (isPast) {
                dayElement.classList.add('unavailable');
            } else if (!isWeekend) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => selectDate(cellDate, dayElement));
            } else {
                dayElement.classList.add('unavailable');
            }
            
            if (isToday) {
                dayElement.style.border = '2px solid #B8860B';
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked date
        element.classList.add('selected');
        selectedDate = date;
        
        // Show time slots
        showTimeSlots();
        updateBookingSummary();
    }
    
    function showTimeSlots() {
        timeSlots.style.display = 'block';
        timeSlotsGrid.innerHTML = '';
        
        availableTimeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
            timeSlotsGrid.appendChild(timeSlot);
        });
        
        timeSlots.scrollIntoView({ behavior: 'smooth' });
    }
    
    function selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked time
        element.classList.add('selected');
        selectedTime = time;
        
        // Show booking form
        showBookingForm();
        updateBookingSummary();
    }
    
    function showBookingForm() {
        bookingForm.style.display = 'block';
        bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function updateBookingSummary() {
        if (!selectedSession) return;
        
        const session = sessionData[selectedSession];
        document.getElementById('summarySession').textContent = session.name;
        document.getElementById('summaryDuration').textContent = session.duration;
        document.getElementById('summaryPrice').textContent = session.price;
        
        if (selectedDate && selectedTime) {
            const dateStr = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('summaryDateTime').textContent = `${dateStr} at ${selectedTime}`;
        }
    }
    
    // Form submission
    const bookingFormElement = document.querySelector('.session-booking-form');
    bookingFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const bookingData = {
            session: selectedSession,
            date: selectedDate,
            time: selectedTime,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            goals: formData.get('goals')
        };
        
        // Show loading state
        const submitBtn = this.querySelector('.confirm-booking-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Simulate booking process
        setTimeout(() => {
            showBookingConfirmation(bookingData);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
    
    function showBookingConfirmation(bookingData) {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'booking-confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Booking Confirmed!</h3>
                <p>Thank you ${bookingData.firstName}! Your ${sessionData[bookingData.session].name} has been successfully booked.</p>
                <div class="confirmation-details">
                    <div class="detail-item">
                        <strong>Date & Time:</strong> ${bookingData.date.toLocaleDateString()} at ${bookingData.time}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${sessionData[bookingData.session].duration}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${bookingData.email}
                    </div>
                </div>
                <p class="confirmation-note">You'll receive a confirmation email with all the details and a calendar invite shortly.</p>
                <button class="close-confirmation-btn" onclick="closeConfirmation()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add to global scope for onclick handler
        window.closeConfirmation = function() {
            modal.remove();
            // Reset form
            bookingFormElement.reset();
            bookingCalendar.style.display = 'none';
            selectedSession = null;
            selectedDate = null;
            selectedTime = null;
        };
    }
    
    // Initialize calendar with current month
    renderCalendar();
    
    // Smooth scroll for session cards
    const sessionCards = document.querySelectorAll('.session-card');
    sessionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured-session') 
                ? 'scale(1.05) translateY(-15px)' 
                : 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured-session') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
        });
    });
});

// Additional utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.session-booking-form input, .session-booking-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value && !validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
});



// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add this to handle actual email sending
function sendBookingEmail(bookingData) {
    // Integration with EmailJS, Formspree, or your backend
    // Example with EmailJS:
    emailjs.send('service_id', 'template_id', {
        to_email: bookingData.email,
        session_type: sessionData[bookingData.session].name,
        date: formatDate(bookingData.date),
        time: bookingData.time,
        client_name: `${bookingData.firstName} ${bookingData.lastName}`
    });
}
// Update the button selector in your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const mainBookBtn = document.getElementById('mainBookBtn'); // This line stays the same
    // ... rest of your existing JavaScript code remains unchanged
    
    // Enhanced hover effects for the horizontal discovery card
    const discoveryCard = document.querySelector('.session-card-horizontal');
    discoveryCard.addEventListener('mouseenter', function() {
        if (!isBookingOpen) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        }
    });
    
    discoveryCard.addEventListener('mouseleave', function() {
        if (!isBookingOpen) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Book a Session Functionality - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Make sure we're targeting the correct button
    const mainBookBtn = document.getElementById('mainBookBtn');
    const minimizeBtn = document.getElementById('minimizeBooking');
    const bookingCalendar = document.getElementById('booking-calendar');
    const calendarGrid = document.getElementById('calendarGrid');
    const timeSlots = document.getElementById('timeSlots');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const bookingForm = document.getElementById('bookingForm');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let isBookingOpen = false;
    let selectedDate = null;
    let selectedTime = null;
    let currentDate = new Date();
    
    // Debug: Check if elements exist
    console.log('Main Book Button:', mainBookBtn);
    console.log('Booking Calendar:', bookingCalendar);
    
    const sessionData = {
        discovery: {
            name: 'Discovery Call',
            duration: '30 minutes',
            price: 'FREE'
        }
    };
    
    const availableTimeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    // Main book button click handler - FIXED
    if (mainBookBtn) {
        mainBookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Book button clicked!'); // Debug
            
            if (!isBookingOpen) {
                showBookingCalendar();
            } else {
                hideBookingCalendar();
            }
        });
    } else {
        console.error('Main book button not found!');
    }
    
    // Minimize button click handler
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideBookingCalendar();
        });
    }
    
    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    function showBookingCalendar() {
        console.log('Showing booking calendar...'); // Debug
        
        if (!bookingCalendar) {
            console.error('Booking calendar element not found!');
            return;
        }
        
        isBookingOpen = true;
        bookingCalendar.style.display = 'block';
        bookingCalendar.classList.remove('closing');
        
        // Update button state
        if (mainBookBtn) {
            mainBookBtn.classList.add('booking-active');
            mainBookBtn.innerHTML = '<i class="fas fa-times"></i><span class="btn-text">Close Booking</span>';
        }
        
        // Scroll to booking section
        setTimeout(() => {
            bookingCalendar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        renderCalendar();
        updateBookingSummary();
    }
    
    function hideBookingCalendar() {
        console.log('Hiding booking calendar...'); // Debug
        
        if (!bookingCalendar) return;
        
        isBookingOpen = false;
        
        // Add closing animation
        bookingCalendar.classList.add('closing');
        
        // Update button state
        if (mainBookBtn) {
            mainBookBtn.classList.remove('booking-active');
            mainBookBtn.innerHTML = '<i class="fas fa-calendar-alt"></i><span class="btn-text">Book Discovery Call</span>';
        }
        
        // Hide after animation
        setTimeout(() => {
            bookingCalendar.style.display = 'none';
            bookingCalendar.classList.remove('closing');
            
            // Reset booking state
            resetBookingState();
        }, 400);
        
        // Scroll back to book section
        const bookSection = document.getElementById('book-session');
        if (bookSection) {
            bookSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    function resetBookingState() {
        selectedDate = null;
        selectedTime = null;
        
        if (timeSlots) timeSlots.style.display = 'none';
        if (bookingForm) bookingForm.style.display = 'none';
        
        // Clear selections
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Reset form
        const form = document.querySelector('.session-booking-form');
        if (form) form.reset();
        
        updateBookingSummary();
    }
    
    function renderCalendar() {
        if (!calendarGrid) {
            console.error('Calendar grid not found!');
            return;
        }
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        if (currentMonthEl) {
            currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.className = 'calendar-day-header';
            dayHeader.style.cssText = `
                font-weight: 600;
                color: #B8860B;
                text-align: center;
                padding: 0.5rem;
                font-size: 0.9rem;
                background: rgba(184, 134, 11, 0.1);
                border-radius: 8px;
                margin-bottom: 0.5rem;
            `;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day calendar-day-empty';
            emptyDay.style.cssText = `
                padding: 1rem;
                text-align: center;
                border-radius: 10px;
                margin: 2px;
            `;
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.style.cssText = `
                padding: 1rem;
                text-align: center;
                border-radius: 10px;
                margin: 2px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                border: 2px solid transparent;
            `;
            
            const cellDate = new Date(year, month, day);
            const isToday = cellDate.toDateString() === today.toDateString();
            const isPast = cellDate < today && !isToday;
            const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
            
            if (isPast) {
                dayElement.classList.add('unavailable');
                dayElement.style.cssText += `
                    color: #ccc;
                    background: #f5f5f5;
                    cursor: not-allowed;
                `;
            } else if (!isWeekend) {
                dayElement.classList.add('available');
                dayElement.style.cssText += `
                    color: #2C2C2C;
                    background: rgba(184, 134, 11, 0.1);
                    hover: background-color: #B8860B;
                `;
                dayElement.addEventListener('click', () => selectDate(cellDate, dayElement));
                dayElement.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#B8860B';
                    this.style.color = 'white';
                });
                dayElement.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('selected')) {
                        this.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
                        this.style.color = '#2C2C2C';
                    }
                });
            } else {
                dayElement.classList.add('unavailable');
                dayElement.style.cssText += `
                    color: #ccc;
                    background: #f5f5f5;
                    cursor: not-allowed;
                `;
            }
            
            if (isToday) {
                dayElement.style.border = '2px solid #B8860B';
                dayElement.style.fontWeight = '700';
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Set calendar grid layout
        calendarGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
            margin-top: 1rem;
        `;
    }
    
    function selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
            day.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
            day.style.color = '#2C2C2C';
        });
        
        // Add selection to clicked date
        element.classList.add('selected');
        element.style.backgroundColor = '#B8860B';
        element.style.color = 'white';
        element.style.fontWeight = '700';
        
        selectedDate = date;
        
        // Show time slots
        showTimeSlots();
        updateBookingSummary();
    }
    
    function showTimeSlots() {
        if (!timeSlots || !timeSlotsGrid) return;
        
        timeSlots.style.display = 'block';
        timeSlotsGrid.innerHTML = '';
        
        availableTimeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.style.cssText = `
                padding: 1rem 1.5rem;
                background: rgba(184, 134, 11, 0.1);
                border: 2px solid rgba(184, 134, 11, 0.3);
                border-radius: 25px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                margin: 0.5rem;
            `;
            
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
            timeSlot.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#B8860B';
                this.style.color = 'white';
            });
            timeSlot.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
                    this.style.color = '#2C2C2C';
                }
            });
            
            timeSlotsGrid.appendChild(timeSlot);
        });
        
        // Set grid layout for time slots
        timeSlotsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.5rem;
            margin-top: 1rem;
        `;
        
        timeSlots.scrollIntoView({ behavior: 'smooth' });
    }
    
    function selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
            slot.style.backgroundColor = 'rgba(184, 134, 11, 0.1)';
            slot.style.color = '#2C2C2C';
        });
        
        // Add selection to clicked time
        element.classList.add('selected');
        element.style.backgroundColor = '#B8860B';
        element.style.color = 'white';
        element.style.fontWeight = '700';
        
        selectedTime = time;
        
        // Show booking form
        showBookingForm();
        updateBookingSummary();
    }
    
    function showBookingForm() {
        if (!bookingForm) return;
        
        bookingForm.style.display = 'block';
        bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function updateBookingSummary() {
        const session = sessionData.discovery;
        
        const summarySession = document.getElementById('summarySession');
        const summaryDuration = document.getElementById('summaryDuration');
        const summaryPrice = document.getElementById('summaryPrice');
        const summaryDateTime = document.getElementById('summaryDateTime');
        
        if (summarySession) summarySession.textContent = session.name;
        if (summaryDuration) summaryDuration.textContent = session.duration;
        if (summaryPrice) summaryPrice.textContent = session.price;
        
        if (selectedDate && selectedTime && summaryDateTime) {
            const dateStr = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            summaryDateTime.textContent = `${dateStr} at ${selectedTime}`;
        } else if (summaryDateTime) {
            summaryDateTime.textContent = 'Not selected';
        }
    }
    
    // Form submission
    const bookingFormElement = document.querySelector('.session-booking-form');
    if (bookingFormElement) {
        bookingFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {
                session: 'discovery',
                date: selectedDate,
                time: selectedTime,
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                goals: formData.get('goals')
            };
            
            // Show loading state
            const submitBtn = this.querySelector('.confirm-booking-btn');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Simulate booking process
                setTimeout(() => {
                    showBookingConfirmation(bookingData);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    function showBookingConfirmation(bookingData) {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'booking-confirmation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div class="confirmation-content" style="
                background: white;
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <div class="confirmation-icon" style="
                    font-size: 4rem;
                    color: #28a745;
                    margin-bottom: 1rem;
                ">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    color: #2C2C2C;
                    margin-bottom: 1rem;
                ">Booking Confirmed!</h3>
                <p style="
                    color: #555;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                ">Thank you ${bookingData.firstName}! Your ${sessionData.discovery.name} has been successfully booked.</p>
                <div class="confirmation-details" style="
                    text-align: left;
                    background: rgba(253, 246, 227, 0.5);
                    padding: 1.5rem;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                ">
                    <div class="detail-item" style="margin-bottom: 0.75rem;">
                        <strong>Date & Time:</strong> ${bookingData.date.toLocaleDateString()} at ${bookingData.time}
                    </div>
                    <div class="detail-item" style="margin-bottom: 0.75rem;">
                        <strong>Duration:</strong> ${sessionData.discovery.duration}
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong> ${bookingData.email}
                    </div>
                </div>
                <p class="confirmation-note" style="
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                ">You'll receive a confirmation email with all the details and a calendar invite shortly.</p>
                <button class="close-confirmation-btn" onclick="closeConfirmation()" style="
                    background: linear-gradient(135deg, #B8860B, #CD853F);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add to global scope for onclick handler
        window.closeConfirmation = function() {
            modal.remove();
            hideBookingCalendar();
        };
    }
    
    // Initialize calendar with current month
    renderCalendar();
    
    // Enhanced hover effects for the horizontal discovery card
    const discoveryCard = document.querySelector('.session-card-horizontal');
    if (discoveryCard) {
        discoveryCard.addEventListener('mouseenter', function() {
            if (!isBookingOpen) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        discoveryCard.addEventListener('mouseleave', function() {
            if (!isBookingOpen) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    }
});

