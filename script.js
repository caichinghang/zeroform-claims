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
            'success-screen',
            'receipt-screen'
        ];
        
        this.cases = [
            { id: 'gastroscopy', name: 'Gastroscopy (Inpatient)', amount: 'HKD 10,000', type: 'diagnostic', icon: 'fas fa-肠镜' },
            { id: 'surgery', name: 'Heart Surgery', amount: 'HKD 50,000', type: 'surgery', icon: 'fas fa-heartbeat' },
            { id: 'emergency', name: 'Emergency Treatment', amount: 'HKD 8,000', type: 'emergency', icon: 'fas fa-ambulance' },
            { id: 'therapy', name: 'Physical Therapy', amount: 'HKD 3,000', type: 'therapy', icon: 'fas fa-child' },
            { id: 'checkup', name: 'Full Body Checkup', amount: 'HKD 2,500', type: 'checkup', icon: 'fas fa-user-md' }
        ];
        
        this.selectedCase = this.cases[0]; // Default to gastroscopy
        this.isAnimating = false;
        this.transactionId = null; // To store transaction ID
        this.blockHeight = null; // To store block height
        
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
        
        // "Continue" buttons
        document.getElementById('continue-from-case').addEventListener('click', () => this.nextScreen());
        document.getElementById('continue-from-oracle').addEventListener('click', () => this.nextScreen());
        document.getElementById('continue-from-policy').addEventListener('click', () => this.nextScreen());
        document.getElementById('continue-from-payment').addEventListener('click', () => this.nextScreen());

        // Receipt screen buttons
        document.getElementById('view-receipt-button').addEventListener('click', () => this.showReceiptScreen());
        document.getElementById('receipt-back-to-summary').addEventListener('click', () => this.showScreen(this.screens.indexOf('success-screen')));
        // Placeholder for PDF download
        document.getElementById('download-receipt-pdf').addEventListener('click', () => alert('PDF download functionality to be implemented.'));
        
        // Case roulette interaction
        this.setupCaseCards();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Add mouse interaction enhancements
        this.setupMouseInteractions();
    }
    
    setupCaseCards() {
        const cardsContainer = document.querySelector('.case-cards-container');
        cardsContainer.innerHTML = ''; // Clear previous cards

        this.cases.forEach((caseItem, index) => {
            const card = document.createElement('div');
            card.className = 'case-card';
            card.dataset.caseId = caseItem.id;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="case-card-face case-card-front">
                    <i class="fas fa-file-medical-alt"></i> 
                    <span>Case File</span>
                </div>
                <div class="case-card-face case-card-back">
                    <i class="${caseItem.icon || 'fas fa-question-circle'}"></i>
                    <h4>${caseItem.name}</h4>
                    <p>${caseItem.amount}</p>
                </div>
            `;
            cardsContainer.appendChild(card);
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
        this.transactionId = null;
        this.blockHeight = null;
        this.showScreen(0);
        document.querySelector('.selected-case').classList.add('hidden');
        document.getElementById('continue-from-case').classList.add('hidden');
        this.setupCaseCards();
        this.resetAnimations();
    }
    
    nextScreen() {
        if (this.isAnimating || this.currentScreen >= this.screens.length - 2) { // Adjusted for receipt screen
             // If on success screen and next is called, it might be via a continue button if we add one there
            if (this.currentScreen === this.screens.indexOf('success-screen')) {
                // Potentially navigate to receipt or end, handled by specific buttons now
                return;
            }
            if (this.currentScreen >= this.screens.length -1) return;
        }

        // Hide all continue buttons before proceeding
        document.getElementById('continue-from-case').classList.add('hidden');
        document.getElementById('continue-from-oracle').classList.add('hidden');
        document.getElementById('continue-from-policy').classList.add('hidden');
        document.getElementById('continue-from-payment').classList.add('hidden');
        
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
    
    // Case Selection Animation - NEW Card Flip Reveal
    animateCaseSelection() {
        this.isAnimating = true;
        const cardsContainer = document.querySelector('.case-cards-container');
        const selectedCaseElement = document.querySelector('.selected-case');
        selectedCaseElement.classList.add('hidden');
        document.getElementById('continue-from-case').classList.add('hidden');

        this.setupCaseCards(); // Ensure cards are fresh
        const caseCards = Array.from(cardsContainer.children);

        // 1. Animate cards into view (simple fade-in for now)
        caseCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0px)';
            }, 100 + index * 100); 
        });

        // 2. Rapid highlight movement
        let highlightIndex = 0;
        let highlightCycles = 0;
        const totalHighlightSpins = 3; // How many times to cycle through cards
        const highlightSpeed = 80; // ms per highlight change

        const highlightInterval = setInterval(() => {
            caseCards.forEach(card => card.classList.remove('highlighted'));
            if (caseCards[highlightIndex]) {
                caseCards[highlightIndex].classList.add('highlighted');
            }
            highlightIndex++;
            if (highlightIndex >= caseCards.length) {
                highlightIndex = 0;
                highlightCycles++;
            }

            if (highlightCycles >= totalHighlightSpins) {
                clearInterval(highlightInterval);
                
                // 3. Stop on a random card
                const randomIndex = Math.floor(Math.random() * this.cases.length);
                this.selectCase(this.cases[randomIndex]);
                const selectedCardElement = caseCards[randomIndex];

                caseCards.forEach(card => card.classList.remove('highlighted'));
                if (selectedCardElement) {
                    selectedCardElement.classList.add('highlighted');
                }

                // 4. Flip the selected card and dim others
                setTimeout(() => {
                    caseCards.forEach((card, idx) => {
                        if (idx === randomIndex) {
                            card.classList.add('flipped');
                        } else {
                            card.style.opacity = '0.5'; // Dim other cards
                        }
                    });

                    // 5. Show selected case details
                    setTimeout(() => {
                        selectedCaseElement.classList.remove('hidden');
                        this.addAnimationClass('selected-case', 'bounce-in');
                        this.isAnimating = false;
                        document.getElementById('continue-from-case').classList.remove('hidden');
                    }, 700); // Wait for flip animation
                }, 500); // Delay before flipping
            }
        }, highlightSpeed);
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
            document.getElementById('continue-from-oracle').classList.remove('hidden'); // Show continue button
        }, 5500); // Increased from 3500
    }
    
    // Policy Verification Animation - Slowed down
    animatePolicyVerification() {
        const matchSteps = document.querySelectorAll('.match-step');
        const policyCard = document.querySelector('.policy-card');
        const stepDelay = 1500; // Delay for each step

        // Reset all steps to initial state (neither processing nor completed)
        matchSteps.forEach(step => {
            step.classList.remove('processing', 'completed');
        });
        
        // Show policy card
        setTimeout(() => {
            if (policyCard) {
                this.addAnimationClass('policy-card', 'slide-up');
            }
        }, 500); // Shortened delay for card appearance
        
        // Animate verification steps sequentially
        let currentStep = 0;
        const animateNextStep = () => {
            if (currentStep < matchSteps.length) {
                const step = matchSteps[currentStep];
                
                // Add processing (yellow)
                step.classList.add('processing');
                this.addAnimationClass(step, 'bounce-in'); // Bounce in when yellow

                setTimeout(() => {
                    // Remove processing, add completed (green)
                    step.classList.remove('processing');
                    step.classList.add('completed');
                    // Optionally, re-bounce or use a different animation for green
                    // this.addAnimationClass(step, 'bounce-in'); 

                    currentStep++;
                    animateNextStep(); // Process next step
                }, stepDelay); // Time for yellow state
            } else {
                // All steps completed
                this.isAnimating = false;
                document.getElementById('continue-from-policy').classList.remove('hidden');
            }
        };

        // Start animation after card is shown
        setTimeout(() => {
            animateNextStep();
        }, 1000); // Delay to start first step after card animation
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
            document.getElementById('continue-from-payment').classList.remove('hidden'); // Show continue button
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
        const transactionIdEl = document.getElementById('transaction-id-value');
        const blockHeightEl = document.getElementById('block-height-value');
        
        if (transactionIdEl) {
            const randomHash = this.generateRandomHash();
            this.transactionId = `0x${randomHash}...`;
            transactionIdEl.textContent = this.transactionId;
        }
        
        if (blockHeightEl) {
            const randomBlock = Math.floor(Math.random() * 100000) + 1800000;
            this.blockHeight = `#${randomBlock.toLocaleString()}`;
            blockHeightEl.textContent = this.blockHeight;
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
            step.classList.remove('completed', 'processing'); 
        });
        
        // Reset progress bars
        this.updateProgressBars();
    }

    showReceiptScreen() {
        document.getElementById('receipt-case-name').textContent = this.selectedCase.name;
        document.getElementById('receipt-case-amount').textContent = this.selectedCase.amount;
        document.getElementById('receipt-processing-time').textContent = document.querySelector('#success-screen .summary-item:nth-child(1) .value').textContent; 
        document.getElementById('receipt-transaction-id').textContent = this.transactionId || '-';
        document.getElementById('receipt-block-height').textContent = this.blockHeight || '-';

        this.showScreen(this.screens.indexOf('receipt-screen'));
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
    @keyframes particleFloat { 
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const demo = new ZeroFormDemo();
    
    const buttons = document.querySelectorAll('button, .floating-card, .case-item');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            AnimationManager.addRippleEffect(button, e);
        });
    });
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';
    });
});

document.body.style.cssText = `
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.8s ease;
`;

window.ZeroFormDemo = ZeroFormDemo;
window.AnimationManager = AnimationManager;