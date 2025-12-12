// ========================================
// GUYUB-PAY - Interactive JavaScript
// ========================================

// Global State Management
const appState = {
    currentScreen: 'home',
    currentUser: {
        name: 'Ahmad Budiman',
        nik: '3201234567890123',
        phone: '08123456789',
        alamat: 'Jl. Contoh No. 123, Jakarta',
        email: 'ahmad.budiman@email.com',
        role: 'Warga RT 05 / RW 02'
    },
    currentPayment: null
};

// ========================================
// Navigation Functions
// ========================================
function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenId;
        
        // Add animation
        targetScreen.style.animation = 'none';
        setTimeout(() => {
            targetScreen.style.animation = 'fadeIn 300ms ease';
        }, 10);
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-screen') === screenId) {
            item.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Payment Functions
// ========================================
function showPayment(posId) {
    const posData = {
        'p-001': {
            id: 'p-001',
            name: 'Iuran Sampah Bulanan',
            amount: 10000,
            periode: 'Bulan'
        },
        'p-002': {
            id: 'p-002',
            name: 'Iuran Keamanan RT',
            amount: 15000,
            periode: 'Bulan'
        },
        'p-003': {
            id: 'p-003',
            name: 'Iuran Kebersihan Lingkungan',
            amount: 12000,
            periode: 'Bulan'
        }
    };
    
    const pos = posData[posId];
    if (pos) {
        appState.currentPayment = pos;
        
        // Update payment screen with data
        document.getElementById('paymentPosName').textContent = pos.name;
        document.getElementById('paymentAmount').textContent = formatCurrency(pos.amount);
        document.getElementById('amount').value = pos.amount;
        
        // Navigate to payment screen
        navigateTo('payment');
    }
}

function processPayment() {
    const method = document.querySelector('input[name="method"]:checked').value;
    const payerName = document.getElementById('payerName').value;
    const payerPhone = document.getElementById('payerPhone').value;
    const amount = document.getElementById('amount').value;
    
    // Validation
    if (!payerName || !payerPhone) {
        showToast('Mohon lengkapi semua data', 'error');
        return;
    }
    
    if (!payerPhone.match(/^08[0-9]{8,12}$/)) {
        showToast('Nomor HP tidak valid. Gunakan format 08xxxxxxxxxx', 'error');
        return;
    }
    
    // Show loading animation
    const button = event.target;
    button.disabled = true;
    button.innerHTML = '<span class="loading">Memproses...</span>';
    
    // Simulate payment processing
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = 'Bayar Sekarang';
        
        // Generate transaction hash
        const txHash = 'TX-' + Date.now().toString(36).toUpperCase();
        
        // Show success modal
        showSuccessModal(txHash);
    }, 2000);
}

function showSuccessModal(txHash) {
    const modal = document.getElementById('successModal');
    const txDisplay = document.getElementById('txHashDisplay');
    
    txDisplay.textContent = txHash;
    appState.currentTxHash = txHash;
    
    modal.classList.add('active');
    
    // Add confetti animation (simple version)
    createConfetti();
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

function viewReceipt() {
    closeSuccessModal();
    showReceipt(appState.currentTxHash);
}

function backToHome() {
    closeSuccessModal();
    navigateTo('home');
    
    // Show success toast
    showToast('Pembayaran berhasil! 🎉', 'success');
}

// ========================================
// Receipt Functions
// ========================================
function showReceipt(txHash) {
    const modal = document.getElementById('receiptModal');
    const txHashElement = document.getElementById('receiptTxHash');
    
    txHashElement.textContent = txHash;
    
    modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function downloadReceipt() {
    showToast('Mengunduh bukti pembayaran...', 'success');
    // In real app, this would generate and download PDF
    setTimeout(() => {
        showToast('Bukti pembayaran berhasil diunduh!', 'success');
    }, 1000);
}

function shareReceipt() {
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'Bukti Pembayaran GUYUB-PAY',
            text: 'Pembayaran iuran telah berhasil!',
            url: window.location.href
        }).then(() => {
            showToast('Berhasil dibagikan!', 'success');
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback: copy to clipboard
        const txHash = document.getElementById('receiptTxHash').textContent;
        navigator.clipboard.writeText(txHash).then(() => {
            showToast('Nomor transaksi berhasil disalin!', 'success');
        });
    }
}

// ========================================
// Pos Detail Functions
// ========================================
function showPosDetail(posId) {
    // In a real app, this would navigate to a detail screen
    showToast('Membuka detail pos iuran...', 'info');
    // For demo, we'll just show an alert
    setTimeout(() => {
        alert('Detail Pos Iuran\n\nFitur ini akan menampilkan informasi lengkap tentang pos iuran, termasuk riwayat pembayaran dan statistik.');
    }, 300);
}

// ========================================
// Utility Functions
// ========================================
function formatCurrency(amount) {
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? '#2EA44F' : 
                   type === 'error' ? '#E94F4F' : '#2B9ED8',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(11, 32, 67, 0.2)',
        zIndex: '10000',
        fontWeight: '600',
        fontSize: '14px',
        animation: 'slideInRight 300ms ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 300ms ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Create simple confetti effect
function createConfetti() {
    const colors = ['#2B9ED8', '#F6E6D6', '#2EA44F', '#E94F4F'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const duration = 2000 + Math.random() * 2000;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { 
                transform: `translateY(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Remove confetti after animation
        setTimeout(() => {
            if (document.body.contains(confetti)) {
                document.body.removeChild(confetti);
            }
        }, duration);
    }
}

// ========================================
// Filter Tabs Functionality
// ========================================
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter bills (in real app, this would filter the data)
            const filter = this.textContent.trim();
            filterBills(filter);
        });
    });
}

function filterBills(filter) {
    const bills = document.querySelectorAll('.bill-card');
    
    bills.forEach(bill => {
        if (filter === 'Semua') {
            bill.style.display = 'block';
        } else if (filter === 'Belum Bayar' && bill.classList.contains('pending')) {
            bill.style.display = 'block';
        } else if (filter === 'Lunas' && bill.classList.contains('paid')) {
            bill.style.display = 'block';
        } else {
            bill.style.display = 'none';
        }
    });
    
    // Animate filtered items
    setTimeout(() => {
        bills.forEach((bill, index) => {
            if (bill.style.display !== 'none') {
                bill.style.animation = 'none';
                setTimeout(() => {
                    bill.style.animation = `fadeIn 300ms ease ${index * 50}ms`;
                }, 10);
            }
        });
    }, 10);
}

// ========================================
// Search Functionality
// ========================================
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const posCards = document.querySelectorAll('.pos-card');
            
            posCards.forEach(card => {
                const title = card.querySelector('.pos-title').textContent.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 300ms ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// ========================================
// Progress Bar Animation
// ========================================
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// ========================================
// Notification Animations
// ========================================
function animateNotifications() {
    const notifications = document.querySelectorAll('.notification-item');
    
    notifications.forEach((notification, index) => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            notification.style.transition = 'all 300ms ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// ========================================
// Add CSS Animations
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }
    
    .loading {
        display: inline-block;
        animation: pulse 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 GUYUB-PAY Loaded Successfully!');
    
    // Initialize navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            navigateTo(screenId);
        });
    });
    
    // Initialize filter tabs
    initFilterTabs();
    
    // Initialize search
    initSearch();
    
    // Animate progress bars
    animateProgressBars();
    
    // Animate notifications on home screen
    if (appState.currentScreen === 'home') {
        setTimeout(animateNotifications, 500);
    }
    
    // Close modal when clicking overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeModal);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC to close modals
        if (e.key === 'Escape') {
            closeModal();
            closeSuccessModal();
        }
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .pos-card, .bill-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Welcome toast
    setTimeout(() => {
        showToast('Selamat datang di GUYUB-PAY! 👋', 'success');
    }, 500);
    
    // Add subtle parallax effect on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.app-header');
        
        if (header) {
            const parallaxOffset = scrollTop * 0.5;
            header.style.transform = `translateY(${parallaxOffset}px)`;
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Animate stat items on hover
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const value = this.querySelector('.stat-value');
            if (value) {
                const originalValue = value.textContent;
                value.style.animation = 'pulse 500ms ease';
                setTimeout(() => {
                    value.style.animation = '';
                }, 500);
            }
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            ripple.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(2)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// ========================================
// Service Worker Registration (for PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ========================================
// Offline Detection
// ========================================
window.addEventListener('online', () => {
    showToast('Koneksi internet tersambung kembali', 'success');
});

window.addEventListener('offline', () => {
    showToast('Tidak ada koneksi internet', 'error');
});

// Export functions for global use
window.navigateTo = navigateTo;
window.showPayment = showPayment;
window.processPayment = processPayment;
window.showReceipt = showReceipt;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.viewReceipt = viewReceipt;
window.backToHome = backToHome;
window.downloadReceipt = downloadReceipt;
window.shareReceipt = shareReceipt;
window.showPosDetail = showPosDetail;
