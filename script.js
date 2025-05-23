// ZeroForm Claims Interactive Demo
class ZeroFormDemo {
    constructor() {
        this.currentScreen = 0;
        this.screens = [
            'welcome-screen',
            'case-screen', 
            'oracle-screen',
            'policy-screen',
            'payment-screen',
            'success-screen'
        ];
        
        this.cases = [
            { id: 'gastroscopy', name: '住院肠胃镜检查', amount: 'HKD 10,000', type: 'diagnostic' },
            { id: 'surgery', name: '心脏手术', amount: 'HKD 50,000', type: 'surgery' },
            { id: 'emergency', name: '急诊治疗', amount: 'HKD 8,000', type: 'emergency' },
            { id: 'therapy', name: '物理治疗', amount: 'HKD 3,000', type: 'therapy' },
            { id: 'checkup', name: '全身检查', amount: 'HKD 2,500', type: 'checkup' }
        ];
        
        this.selectedCase = this.cases[0]; // Default to gastroscopy
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeBackgroundAnimations();
        this.setupProgressBars();
        this.updateCurrentDate();
        
        // Add initial loading animation
        setTimeout(() => {
            this.addAnimationClass('welcome-screen', 'fade-in');
        }, 500);
    }
    
    setupEventListeners() {
        // Start demo button
        const startBtn = document.getElementById('start-demo');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startDemo());
        }
        
        // Restart demo button
        const restartBtn = document.getElementById('restart-demo');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartDemo());
        }
        
        // Case roulette interaction
        this.setupCaseRoulette();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Add mouse interaction enhancements
        this.setupMouseInteractions();
    }
    
    setupCaseRoulette() {
        const rouletteContainer = document.querySelector('.case-roulette');
        const caseItems = document.querySelectorAll('.case-item');
        
        if (!rouletteContainer || !caseItems.length) return;
        
        // Position case items for roulette animation
        caseItems.forEach((item, index) => {
            item.style.transform = `translateY(${index * 100}%)`;
            item.addEventListener('click', () => {
                this.selectCase(this.cases[index]);
            });
        });
    }
    
    setupMouseInteractions() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.source-node, .party, .floating-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverEffect(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeHoverEffect(element);
            });
        });
    }
    
    addHoverEffect(element) {
        element.style.transform = 'translateY(-10px) scale(1.02)';
        element.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
    }
    
    removeHoverEffect(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
    }
    
    handleKeyboard(e) {
        if (this.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextScreen();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousScreen();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                this.restartDemo();
                break;
        }
    }
    
    startDemo() {
        if (this.isAnimating) return;
        this.nextScreen();
    }
    
    restartDemo() {
        this.currentScreen = 0;
        this.selectedCase = this.cases[0];
        this.showScreen(0);
        this.updateSelectedCase();
        this.resetAnimations();
    }
    
    nextScreen() {
        if (this.isAnimating || this.currentScreen >= this.screens.length - 1) return;
        
        this.isAnimating = true;
        this.currentScreen++;
        
        // Special handling for different screens
        switch(this.currentScreen) {
            case 1: // Case selection
                this.showScreen(this.currentScreen);
                this.animateCaseSelection();
                break;
            case 2: // Oracle detection
                this.showScreen(this.currentScreen);
                this.animateOracleDetection();
                break;
            case 3: // Policy verification
                this.showScreen(this.currentScreen);
                this.animatePolicyVerification();
                break;
            case 4: // Payment processing
                this.showScreen(this.currentScreen);
                this.animatePaymentFlow();
                break;
            case 5: // Success
                this.showScreen(this.currentScreen);
                this.animateSuccess();
                break;
            default:
                this.showScreen(this.currentScreen);
                setTimeout(() => { this.isAnimating = false; }, 1000);
        }
    }
    
    previousScreen() {
        if (this.isAnimating || this.currentScreen <= 0) return;
        
        this.currentScreen--;
        this.showScreen(this.currentScreen);
    }
    
    showScreen(screenIndex) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(this.screens[screenIndex]);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.addAnimationClass(this.screens[screenIndex], 'slide-up');
        }
        
        // Update progress bars
        this.updateProgressBars();
    }
    
    updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        const progress = ((this.currentScreen + 1) / this.screens.length) * 100;
        
        progressBars.forEach(bar => {
            bar.style.setProperty('--width', `${progress}%`);
        });
    }
    
    // Case Selection Animation
    animateCaseSelection() {
        const roulette = document.querySelector('.case-roulette');
        const caseItems = document.querySelectorAll('.case-item');
        const selectedCaseElement = document.querySelector('.selected-case');
        
        if (!roulette || !caseItems.length) return;
        
        // Animate roulette spinning
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            caseItems.forEach((item, index) => {
                const offset = (index + spinCount) % caseItems.length;
                item.style.transform = `translateY(${offset * 100 - 200}%)`;
                item.style.opacity = offset === 2 ? '1' : '0.3';
            });
            
            spinCount++;
            
            if (spinCount >= 20) { // Increased from 15 to 20 for longer spin
                clearInterval(spinInterval);
                
                // Randomly select a case instead of always using the default
                const randomCaseIndex = Math.floor(Math.random() * this.cases.length);
                this.selectCase(this.cases[randomCaseIndex]);
                
                // Position the selected case in the center
                caseItems.forEach((item, index) => {
                    if (index === randomCaseIndex) {
                        item.style.transform = 'translateY(0%)';
                        item.style.opacity = '1';
                    } else {
                        item.style.opacity = '0.3';
                    }
                });
                
                setTimeout(() => {
                    this.addAnimationClass('selected-case', 'bounce-in');
                    this.isAnimating = false;
                    
                    // Auto advance after selection - slowed down
                    setTimeout(() => this.nextScreen(), 5000); // Increased from 3000 to 5000
                }, 1000); // Increased from 500 to 1000
            }
        }, 300); // Increased from 200 to 300 for slower spinning
    }
    
    selectCase(caseData) {
        this.selectedCase = caseData;
        this.updateSelectedCase();
        
        // Update case throughout the demo
        this.updateCaseInformation();
    }
    
    updateSelectedCase() {
        const selectedCaseText = document.getElementById('selected-case-text');
        if (selectedCaseText) {
            selectedCaseText.textContent = this.selectedCase.name;
        }
    }
    
    updateCaseInformation() {
        // Update amount displays throughout all screens
        const amountElements = document.querySelectorAll('.amount');
        amountElements.forEach(el => {
            if (el.textContent.includes('HKD') || el.textContent.includes('+')) {
                if (el.textContent.includes('+')) {
                    el.textContent = `+ ${this.selectedCase.amount}`;
                } else {
                    el.textContent = this.selectedCase.amount;
                }
            }
        });
        
        // Update specific IDs for procedure info
        const procedureNameEl = document.getElementById('procedure-name');
        if (procedureNameEl) {
            procedureNameEl.textContent = this.selectedCase.name;
        }
        
        const procedureAmountEl = document.getElementById('procedure-amount');
        if (procedureAmountEl) {
            procedureAmountEl.textContent = this.selectedCase.amount;
        }
        
        // Update procedure names in oracle screen
        const procedureValueElements = document.querySelectorAll('.event-details .detail-item .value');
        procedureValueElements.forEach(el => {
            if (el.parentElement.querySelector('.label')?.textContent === 'Procedure:') {
                el.textContent = this.selectedCase.name;
            }
            if (el.parentElement.querySelector('.label')?.textContent === 'Amount:') {
                el.textContent = this.selectedCase.amount;
            }
        });
        
        // Update summary values in success screen
        const summaryAmountElements = document.querySelectorAll('.summary-item .value');
        summaryAmountElements.forEach(el => {
            if (el.parentElement.querySelector('.label')?.textContent === 'Amount Paid:') {
                el.textContent = this.selectedCase.amount;
            }
        });
        
        // Update money flow display
        const moneyFlowElements = document.querySelectorAll('.money-flow span');
        moneyFlowElements.forEach(el => {
            if (el.textContent.includes('HKD')) {
                el.textContent = this.selectedCase.amount;
            }
        });
        
        // Update balance displays
        const balanceElements = document.querySelectorAll('.balance .amount');
        balanceElements.forEach(el => {
            if (el.textContent.includes('HKD')) {
                if (el.textContent.includes('+')) {
                    el.textContent = `+ ${this.selectedCase.amount}`;
                } else {
                    el.textContent = this.selectedCase.amount;
                }
            }
        });
    }
    
    // Oracle Detection Animation - Slowed down
    animateOracleDetection() {
        const sourceNodes = document.querySelectorAll('.source-node');
        const flowLines = document.querySelectorAll('.flow-line');
        const eventCard = document.querySelector('.detected-event');
        
        // Step 1: Activate hospital connection
        setTimeout(() => {
            const hospitalNode = document.querySelector('.source-node.hospital .status-indicator');
            if (hospitalNode) {
                hospitalNode.classList.remove('connecting');
                this.addAnimationClass('source-node.hospital', 'bounce-in');
            }
        }, 1500); // Increased from 1000
        
        // Step 2: Activate HSBC connection
        setTimeout(() => {
            const hsbcNode = document.querySelector('.source-node.hsbc .status-indicator');
            if (hsbcNode) {
                hsbcNode.classList.remove('connecting');
                this.addAnimationClass('source-node.hsbc', 'bounce-in');
            }
        }, 3000); // Increased from 2000
        
        // Step 3: Show data flow
        setTimeout(() => {
            flowLines.forEach(line => {
                line.style.animation = 'flowAnimation 2s infinite';
            });
        }, 4000); // Increased from 2500
        
        // Step 4: Show detected event
        setTimeout(() => {
            if (eventCard) {
                this.addAnimationClass('detected-event', 'slide-up');
                this.updateCurrentDate();
                // Ensure case information is updated
                this.updateCaseInformation();
            }
            this.isAnimating = false;
            
            // Auto advance - slowed down
            setTimeout(() => this.nextScreen(), 6000); // Increased from 4000
        }, 5500); // Increased from 3500
    }
    
    // Policy Verification Animation - Slowed down
    animatePolicyVerification() {
        const matchSteps = document.querySelectorAll('.match-step');
        const policyCard = document.querySelector('.policy-card');
        
        // Show policy card
        setTimeout(() => {
            if (policyCard) {
                this.addAnimationClass('policy-card', 'slide-up');
            }
        }, 1000); // Increased from 500
        
        // Animate verification steps
        matchSteps.forEach((step, index) => {
            setTimeout(() => {
                if (index < matchSteps.length - 1) {
                    step.classList.remove('processing');
                    step.classList.add('completed');
                    this.addAnimationClass(step, 'bounce-in');
                } else {
                    step.classList.add('processing');
                }
            }, (index + 1) * 1500); // Increased from 1000 to 1500
        });
        
        // Complete final step
        setTimeout(() => {
            const finalStep = matchSteps[matchSteps.length - 1];
            if (finalStep) {
                finalStep.classList.remove('processing');
                finalStep.classList.add('completed');
                this.addAnimationClass(finalStep, 'bounce-in');
            }
            this.isAnimating = false;
            
            // Auto advance - slowed down
            setTimeout(() => this.nextScreen(), 3000); // Increased from 2000
        }, matchSteps.length * 1500 + 2000); // Adjusted timing
    }
    
    // Payment Flow Animation - Slowed down
    animatePaymentFlow() {
        const transferAnimation = document.querySelector('.transfer-animation');
        const moneyFlow = document.querySelector('.money-flow');
        const parties = document.querySelectorAll('.party');
        const transactionDetails = document.querySelector('.transaction-details');
        
        // Ensure case information is updated first
        this.updateCaseInformation();
        
        // Step 1: Highlight HSBC
        setTimeout(() => {
            const hsbcParty = document.querySelector('.party.hsbc-bank');
            if (hsbcParty) {
                this.addAnimationClass('party.hsbc-bank', 'bounce-in');
                hsbcParty.style.borderColor = 'var(--secondary-color)';
            }
        }, 1500); // Increased from 1000
        
        // Step 2: Start transfer animation
        setTimeout(() => {
            if (moneyFlow) {
                moneyFlow.style.animation = 'moneyBounce 1s infinite';
                this.addAnimationClass('transfer-animation', 'fade-in');
            }
        }, 3000); // Increased from 2000
        
        // Step 3: Complete transfer to hospital
        setTimeout(() => {
            const hospitalParty = document.querySelector('.party.hospital');
            if (hospitalParty) {
                hospitalParty.style.borderColor = 'var(--success-color)';
                this.addAnimationClass('party.hospital', 'bounce-in');
                
                // Update balance display
                const hospitalBalance = hospitalParty.querySelector('.amount');
                if (hospitalBalance) {
                    hospitalBalance.style.color = 'var(--success-color)';
                    this.animateCountUp(hospitalBalance, this.selectedCase.amount);
                }
            }
        }, 6000); // Increased from 4000
        
        // Step 4: Show transaction details
        setTimeout(() => {
            if (transactionDetails) {
                this.addAnimationClass('transaction-details', 'slide-up');
                this.generateRandomTransactionData();
            }
            this.isAnimating = false;
            
            // Auto advance - slowed down
            setTimeout(() => this.nextScreen(), 4000); // Increased from 3000
        }, 7500); // Increased from 5000
    }
    
    // Success Animation - Slowed down
    animateSuccess() {
        const successIcon = document.querySelector('.success-icon');
        const summaryItems = document.querySelectorAll('.summary-item');
        const actionButtons = document.querySelector('.action-buttons');
        
        // Ensure case information is updated
        this.updateCaseInformation();
        
        // Step 1: Show success icon
        setTimeout(() => {
            if (successIcon) {
                this.addAnimationClass('success-icon', 'bounce-in');
            }
        }, 1000); // Increased from 500
        
        // Step 2: Animate summary items
        summaryItems.forEach((item, index) => {
            setTimeout(() => {
                this.addAnimationClass(item, 'slide-up');
                
                // Animate counting for processing time
                const value = item.querySelector('.value');
                if (value && value.textContent.includes('second')) {
                    this.animateCountUpTime(value, 2.3);
                }
            }, (index + 1) * 500 + 1500); // Increased timing
        });
        
        // Step 3: Show action buttons
        setTimeout(() => {
            if (actionButtons) {
                this.addAnimationClass('action-buttons', 'fade-in');
            }
            this.isAnimating = false;
        }, summaryItems.length * 500 + 3000); // Increased timing
    }
    
    // Utility Functions
    addAnimationClass(element, animationClass) {
        const el = typeof element === 'string' ? document.querySelector(`.${element}`) : element;
        if (el) {
            el.classList.add(animationClass);
            setTimeout(() => {
                el.classList.remove(animationClass);
            }, 1000);
        }
    }
    
    animateCountUp(element, targetText) {
        const target = parseInt(targetText.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `+ HKD ${Math.floor(current).toLocaleString()}`;
        }, 50);
    }
    
    animateCountUpTime(element, targetTime) {
        let current = 0;
        const increment = targetTime / 20;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetTime) {
                current = targetTime;
                clearInterval(timer);
            }
            element.textContent = `${current.toFixed(1)} seconds`;
        }, 50);
    }
    
    generateRandomTransactionData() {
        const transactionId = document.querySelector('.detail-item .value:first-child');
        const blockHeight = document.querySelectorAll('.detail-item .value')[1];
        
        if (transactionId) {
            const randomHash = this.generateRandomHash();
            transactionId.textContent = `0x${randomHash}...`;
        }
        
        if (blockHeight) {
            const randomBlock = Math.floor(Math.random() * 100000) + 1800000;
            blockHeight.textContent = `#${randomBlock.toLocaleString()}`;
        }
    }
    
    generateRandomHash() {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    setupProgressBars() {
        // Initialize progress bars with animated shine effect
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.style.setProperty('--width', '0%');
        });
    }
    
    initializeBackgroundAnimations() {
        // Create additional floating particles
        this.createFloatingParticles();
        
        // Add subtle mouse parallax effect
        this.setupParallaxEffect();
    }
    
    createFloatingParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;
        
        // Add dynamic particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'dynamic-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: 0.3;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    setupParallaxEffect() {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            // Apply subtle parallax to floating elements
            const floatingElements = document.querySelectorAll('.floating-card, .floating-particles');
            floatingElements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                element.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
            });
        });
    }
    
    resetAnimations() {
        // Reset all animations and states
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.classList.remove('fade-in', 'slide-up', 'bounce-in');
        });
        
        // Reset status indicators
        const statusIndicators = document.querySelectorAll('.status-indicator');
        statusIndicators.forEach(indicator => {
            indicator.classList.remove('connecting');
        });
        
        // Reset match steps
        const matchSteps = document.querySelectorAll('.match-step');
        matchSteps.forEach((step, index) => {
            step.classList.remove('completed');
            if (index === matchSteps.length - 1) {
                step.classList.add('processing');
            }
        });
        
        // Reset progress bars
        this.updateProgressBars();
    }
}

// Enhanced Animation System
class AnimationManager {
    static addRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    static addParticleExplosion(x, y) {
        const container = document.body;
        const colors = ['#00d4ff', '#7b68ee', '#00ff88', '#ff6b35'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (i / 12) * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
                animation: particleExplosion 1s ease-out forwards;
            `;
            
            container.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
}

// Add CSS animations for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes particleExplosion {
        to {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const demo = new ZeroFormDemo();
    
    // Add ripple effects to buttons
    const buttons = document.querySelectorAll('button, .floating-card, .case-item');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            AnimationManager.addRippleEffect(button, e);
            AnimationManager.addParticleExplosion(e.clientX, e.clientY);
        });
    });
    
    // Add loading completion animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    });
});

// Set initial page state
document.body.style.cssText = `
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.8s ease;
`;

// Export for potential external use
window.ZeroFormDemo = ZeroFormDemo;
window.AnimationManager = AnimationManager; 