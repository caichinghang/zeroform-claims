class ClaimRushGame {
    constructor() {
        this.currentScreen = 'welcome-screen';
        this.gameMode = null;
        this.score = 0;
        this.claimsProcessed = 0;
        this.gameStartTime = null;
        this.manualModeStats = { claimsProcessed: 0, totalTime: 0, efficiency: 15 };
        this.smartModeStats = { claimsProcessed: 0, totalTime: 0, efficiency: 95 };
        
        // Current claim data
        this.currentClaim = null;
        this.claimQueue = [];
        
        // Educational facts
        this.educationalFacts = [
            {
                title: "Insurance Fraud Facts",
                text: "Insurance fraud costs the industry over $40 billion annually. Smart contracts can reduce fraud by 60% through automated verification and immutable records."
            },
            {
                title: "Processing Time Reality",
                text: "Traditional claims processing takes 7-30 days on average. Smart contracts can process legitimate claims in under 2 minutes with proper oracle integration."
            },
            {
                title: "Manual Processing Costs",
                text: "Manual processing costs $15-25 per claim in administrative overhead. Automated smart contracts reduce this to under $0.50 per claim."
            },
            {
                title: "Customer Satisfaction",
                text: "75% of customers are frustrated with slow claim processing. Instant smart contract approvals increase satisfaction scores by 400%."
            },
            {
                title: "Blockchain Security",
                text: "Blockchain records are tamper-proof and transparent. Every claim transaction is permanently recorded and auditable by all parties."
            },
            {
                title: "Oracle Technology",
                text: "Oracles connect smart contracts to real-world data. They can verify medical records, check policy status, and confirm payments automatically."
            }
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startGameTimer();
        this.generateClaimQueue();
        this.showEducationalPopup();
    }

    bindEvents() {
        // Mode selection
        document.getElementById('select-manual').addEventListener('click', () => this.startMode('manual'));
        document.getElementById('select-smart').addEventListener('click', () => this.startMode('smart'));
        
        // Back buttons
        document.getElementById('back-to-menu').addEventListener('click', () => this.showScreen('welcome-screen'));
        document.getElementById('back-to-menu-smart').addEventListener('click', () => this.showScreen('welcome-screen'));
        
        // Manual mode events
        this.bindManualModeEvents();
        
        // Smart mode events
        this.bindSmartModeEvents();
        
        // Educational popup events
        document.getElementById('close-popup').addEventListener('click', () => this.hideEducationalPopup());
        document.getElementById('popup-continue').addEventListener('click', () => this.hideEducationalPopup());
        
        // Results events
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
        document.getElementById('view-main-demo').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    bindManualModeEvents() {
        // Form inputs
        const formInputs = ['policy-input', 'date-input', 'diagnosis-select', 'provider-input'];
        formInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.checkFormCompletion());
        });
        
        // Step buttons
        document.getElementById('complete-forms').addEventListener('click', () => this.completeFormsStep());
        document.getElementById('complete-documents').addEventListener('click', () => this.completeDocumentsStep());
        document.getElementById('complete-captcha').addEventListener('click', () => this.completeCaptchaStep());
        document.getElementById('complete-processing').addEventListener('click', () => this.completeProcessingStep());
        
        // Document upload
        this.bindDocumentUpload();
        
        // Captcha
        this.bindCaptchaEvents();
    }

    bindSmartModeEvents() {
        // Oracle configuration
        document.getElementById('configure-oracles').addEventListener('click', () => this.configureOracles());
        
        // Oracle node clicks
        document.querySelectorAll('.oracle-node').forEach(node => {
            node.addEventListener('click', () => this.toggleOracleConnection(node));
        });
    }

    bindDocumentUpload() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            this.handleFileUpload(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
    }

    bindCaptchaEvents() {
        document.getElementById('refresh-captcha').addEventListener('click', () => this.generateCaptcha());
        document.getElementById('captcha-input').addEventListener('input', () => this.checkCaptchaCompletion());
        document.getElementById('robot-checkbox').addEventListener('change', () => this.checkCaptchaCompletion());
        
        this.generateCaptcha();
    }

    startMode(mode) {
        this.gameMode = mode;
        this.gameStartTime = Date.now();
        
        if (mode === 'manual') {
            this.startManualMode();
        } else {
            this.startSmartMode();
        }
    }

    startManualMode() {
        this.showScreen('manual-game');
        this.generateNewClaim();
        this.resetManualSteps();
        this.showEducationalPopup('Insurance Fraud Facts');
    }

    startSmartMode() {
        this.showScreen('smart-game');
        this.resetOracleSetup();
        this.showEducationalPopup('Blockchain Security');
    }

    showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    generateNewClaim() {
        const patients = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
        const procedures = ['Emergency Treatment', 'Routine Checkup', 'Surgery', 'Physical Therapy', 'Diagnostic Test'];
        const amounts = [1500, 2500, 5000, 8000, 12000];
        
        this.currentClaim = {
            id: Math.floor(Math.random() * 10000),
            patient: patients[Math.floor(Math.random() * patients.length)],
            procedure: procedures[Math.floor(Math.random() * procedures.length)],
            amount: amounts[Math.floor(Math.random() * amounts.length)]
        };
        
        // Update UI
        document.getElementById('current-claim-number').textContent = this.claimsProcessed + 1;
        document.getElementById('patient-name').textContent = this.currentClaim.patient;
        document.getElementById('procedure-name').textContent = this.currentClaim.procedure;
        document.getElementById('claim-amount').textContent = `$${this.currentClaim.amount.toLocaleString()}`;
    }

    resetManualSteps() {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.getElementById('step-forms').classList.add('active');
        
        // Clear form inputs
        document.getElementById('policy-input').value = '';
        document.getElementById('date-input').value = '';
        document.getElementById('diagnosis-select').value = '';
        document.getElementById('provider-input').value = '';
        
        // Reset document status
        document.querySelectorAll('.doc-status').forEach(status => {
            status.textContent = 'Pending';
            status.className = 'doc-status pending';
        });
        
        // Reset captcha
        this.generateCaptcha();
        document.getElementById('captcha-input').value = '';
        document.getElementById('robot-checkbox').checked = false;
        
        // Reset processing stages
        document.querySelectorAll('.stage-status').forEach(status => {
            status.textContent = 'Pending';
            status.className = 'stage-status pending';
        });
        
        document.getElementById('processing-timer').textContent = this.getRandomProcessingTime();
        document.getElementById('processing-progress').style.width = '0%';
        
        this.checkFormCompletion();
    }

    checkFormCompletion() {
        const policy = document.getElementById('policy-input').value;
        const date = document.getElementById('date-input').value;
        const diagnosis = document.getElementById('diagnosis-select').value;
        const provider = document.getElementById('provider-input').value;
        
        const isComplete = policy && date && diagnosis && provider;
        document.getElementById('complete-forms').disabled = !isComplete;
    }

    completeFormsStep() {
        this.addScore(100);
        this.completeStep('step-forms', 'step-documents');
        this.showEducationalPopup('Manual Processing Costs');
    }

    handleFileUpload(files) {
        if (files.length === 0) return;
        
        let uploadedCount = 0;
        const docItems = document.querySelectorAll('.doc-item');
        
        for (let i = 0; i < Math.min(files.length, 3); i++) {
            setTimeout(() => {
                if (docItems[i]) {
                    const status = docItems[i].querySelector('.doc-status');
                    status.textContent = 'Uploaded';
                    status.className = 'doc-status uploaded';
                    uploadedCount++;
                    
                    if (uploadedCount === 3) {
                        document.getElementById('complete-documents').disabled = false;
                    }
                }
            }, (i + 1) * 800);
        }
    }

    completeDocumentsStep() {
        this.addScore(150);
        this.completeStep('step-documents', 'step-captcha');
        this.showEducationalPopup('Processing Time Reality');
    }

    generateCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.currentCaptcha = captcha;
        document.getElementById('captcha-text').textContent = captcha;
    }

    checkCaptchaCompletion() {
        const input = document.getElementById('captcha-input').value.toUpperCase();
        const robotChecked = document.getElementById('robot-checkbox').checked;
        
        const isComplete = input === this.currentCaptcha && robotChecked;
        document.getElementById('complete-captcha').disabled = !isComplete;
    }

    completeCaptchaStep() {
        this.addScore(75);
        this.completeStep('step-captcha', 'step-processing');
        this.startProcessingAnimation();
        this.showEducationalPopup('Customer Satisfaction');
    }

    startProcessingAnimation() {
        const stages = ['stage-validation', 'stage-review', 'stage-approval'];
        const timer = document.getElementById('processing-timer');
        const progress = document.getElementById('processing-progress');
        
        let currentStage = 0;
        let timeLeft = 225; // 3:45 in seconds
        
        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const progressPercent = ((225 - timeLeft) / 225) * 100;
            progress.style.width = progressPercent + '%';
            
            timeLeft--;
            
            if (timeLeft < 0) {
                document.getElementById('complete-processing').disabled = false;
                return;
            }
            
            // Update stages
            if (currentStage < stages.length) {
                const stageTime = 225 / stages.length;
                const currentStageIndex = Math.floor((225 - timeLeft) / stageTime);
                
                if (currentStageIndex > currentStage) {
                    const prevStage = document.getElementById(stages[currentStage]);
                    prevStage.querySelector('.stage-status').textContent = 'Completed';
                    prevStage.querySelector('.stage-status').className = 'stage-status completed';
                    
                    currentStage++;
                    
                    if (currentStage < stages.length) {
                        const nextStage = document.getElementById(stages[currentStage]);
                        nextStage.querySelector('.stage-status').textContent = 'Processing';
                        nextStage.querySelector('.stage-status').className = 'stage-status processing';
                    }
                }
            }
            
            setTimeout(updateTimer, 1000);
        };
        
        // Start first stage
        const firstStage = document.getElementById(stages[0]);
        firstStage.querySelector('.stage-status').textContent = 'Processing';
        firstStage.querySelector('.stage-status').className = 'stage-status processing';
        
        updateTimer();
    }

    completeProcessingStep() {
        this.addScore(200);
        this.claimsProcessed++;
        this.updateScore();
        
        // Complete all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('completed');
        });
        
        // Start next claim after delay
        setTimeout(() => {
            if (this.claimsProcessed < 5) {
                this.generateNewClaim();
                this.resetManualSteps();
            } else {
                this.endGame();
            }
        }, 2000);
    }

    completeStep(currentStepId, nextStepId) {
        document.getElementById(currentStepId).classList.remove('active');
        document.getElementById(currentStepId).classList.add('completed');
        
        if (nextStepId) {
            document.getElementById(nextStepId).classList.add('active');
        }
    }

    resetOracleSetup() {
        document.querySelectorAll('.connection-status').forEach(status => {
            status.className = 'connection-status disconnected';
            status.innerHTML = '<i class="fas fa-times"></i>';
        });
        
        document.getElementById('claims-queue').innerHTML = '';
        document.getElementById('block-chain').innerHTML = '';
        document.getElementById('transaction-feed').innerHTML = '';
        
        this.generateClaimQueue();
    }

    configureOracles() {
        const oracles = ['hospital-status', 'insurance-status', 'payment-status'];
        let currentOracle = 0;
        
        const connectOracle = () => {
            if (currentOracle >= oracles.length) {
                this.startSmartProcessing();
                return;
            }
            
            const status = document.getElementById(oracles[currentOracle]);
            status.className = 'connection-status connecting';
            status.innerHTML = '<i class="fas fa-clock"></i>';
            
            setTimeout(() => {
                status.className = 'connection-status connected';
                status.innerHTML = '<i class="fas fa-check"></i>';
                currentOracle++;
                
                setTimeout(connectOracle, 800);
            }, 1500);
        };
        
        connectOracle();
    }

    startSmartProcessing() {
        this.addScore(300);
        this.processClaimsAutomatically();
        this.showEducationalPopup('Oracle Technology');
    }

    processClaimsAutomatically() {
        const claims = this.claimQueue.slice(0, 10);
        let processedCount = 0;
        
        const processClaim = (claim, index) => {
            setTimeout(() => {
                // Add to queue as processing
                this.addClaimToQueue(claim, 'processing');
                
                // Add blockchain block
                this.addBlockchainBlock(claim);
                
                // Add transaction
                this.addTransaction(claim);
                
                setTimeout(() => {
                    // Mark as approved
                    this.updateClaimStatus(claim.id, 'approved');
                    processedCount++;
                    this.claimsProcessed++;
                    this.addScore(150);
                    this.updateScore();
                    
                    if (processedCount >= 10) {
                        setTimeout(() => this.endGame(), 2000);
                    }
                }, 2000);
                
            }, index * 1500);
        };
        
        claims.forEach(processClaim);
    }

    addClaimToQueue(claim, status = 'pending') {
        const queueContainer = document.getElementById('claims-queue');
        const claimElement = document.createElement('div');
        claimElement.className = `claim-item ${status}`;
        claimElement.id = `claim-${claim.id}`;
        
        claimElement.innerHTML = `
            <div class="claim-info-smart">
                <div class="claim-id">Claim #${claim.id}</div>
                <div class="claim-amount">$${claim.amount.toLocaleString()}</div>
            </div>
            <div class="claim-status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
        `;
        
        queueContainer.appendChild(claimElement);
    }

    updateClaimStatus(claimId, status) {
        const claimElement = document.getElementById(`claim-${claimId}`);
        if (claimElement) {
            claimElement.className = `claim-item ${status}`;
            const statusElement = claimElement.querySelector('.claim-status');
            statusElement.className = `claim-status ${status}`;
            statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    }

    addBlockchainBlock(claim) {
        const blockChain = document.getElementById('block-chain');
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = `#${claim.id.toString().slice(-3)}`;
        block.title = `Block for Claim #${claim.id}`;
        
        blockChain.appendChild(block);
        
        // Scroll to show new block
        blockChain.scrollLeft = blockChain.scrollWidth;
    }

    addTransaction(claim) {
        const feed = document.getElementById('transaction-feed');
        const transaction = document.createElement('div');
        transaction.className = 'transaction-item';
        
        const hash = this.generateTransactionHash();
        transaction.innerHTML = `
            <div class="tx-hash">${hash}</div>
            <div class="tx-amount">$${claim.amount.toLocaleString()}</div>
        `;
        
        feed.appendChild(transaction);
        
        // Keep only last 10 transactions
        if (feed.children.length > 10) {
            feed.removeChild(feed.firstChild);
        }
        
        feed.scrollTop = feed.scrollHeight;
    }

    generateTransactionHash() {
        return '0x' + Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generateClaimQueue() {
        this.claimQueue = [];
        for (let i = 0; i < 15; i++) {
            this.claimQueue.push({
                id: 10000 + i,
                amount: Math.floor(Math.random() * 10000) + 1000
            });
        }
    }

    addScore(points) {
        this.score += points;
    }

    updateScore() {
        document.getElementById('total-score').textContent = this.score.toLocaleString();
        document.getElementById('claims-processed').textContent = this.claimsProcessed;
    }

    showEducationalPopup(factTitle = null) {
        const fact = factTitle ? 
            this.educationalFacts.find(f => f.title === factTitle) :
            this.educationalFacts[Math.floor(Math.random() * this.educationalFacts.length)];
        
        if (!fact) return;
        
        document.getElementById('popup-title').textContent = fact.title;
        document.getElementById('popup-text').textContent = fact.text;
        document.getElementById('educational-popup').classList.add('active');
    }

    hideEducationalPopup() {
        document.getElementById('educational-popup').classList.remove('active');
    }

    endGame() {
        const gameTime = (Date.now() - this.gameStartTime) / 1000;
        
        if (this.gameMode === 'manual') {
            this.manualModeStats.claimsProcessed = this.claimsProcessed;
            this.manualModeStats.totalTime = gameTime;
        } else {
            this.smartModeStats.claimsProcessed = this.claimsProcessed;
            this.smartModeStats.totalTime = gameTime;
        }
        
        this.showResults();
    }

    showResults() {
        // Update results display
        document.getElementById('manual-claims').textContent = this.manualModeStats.claimsProcessed;
        document.getElementById('manual-time').textContent = this.manualModeStats.totalTime > 0 ? 
            `${(this.manualModeStats.totalTime / this.manualModeStats.claimsProcessed).toFixed(1)}s` : '0s';
        document.getElementById('manual-efficiency').textContent = `${this.manualModeStats.efficiency}%`;
        
        document.getElementById('smart-claims').textContent = this.smartModeStats.claimsProcessed;
        document.getElementById('smart-time').textContent = this.smartModeStats.totalTime > 0 ? 
            `${(this.smartModeStats.totalTime / this.smartModeStats.claimsProcessed).toFixed(1)}s` : '0s';
        document.getElementById('smart-efficiency').textContent = `${this.smartModeStats.efficiency}%`;
        
        document.getElementById('game-results').classList.add('active');
    }

    resetGame() {
        this.score = 0;
        this.claimsProcessed = 0;
        this.gameMode = null;
        this.gameStartTime = null;
        
        this.updateScore();
        document.getElementById('game-results').classList.remove('active');
        this.showScreen('welcome-screen');
    }

    startGameTimer() {
        const startTime = Date.now();
        
        const updateTimer = () => {
            if (!this.gameStartTime) {
                document.getElementById('game-timer').textContent = '0:00';
            } else {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('game-timer').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    getRandomProcessingTime() {
        const times = ['2:15', '3:45', '5:20', '4:30', '6:15'];
        return times[Math.floor(Math.random() * times.length)];
    }

    handleKeyPress(e) {
        // Add keyboard shortcuts for better UX
        switch(e.key) {
            case 'Escape':
                if (document.getElementById('educational-popup').classList.contains('active')) {
                    this.hideEducationalPopup();
                }
                break;
            case 'Enter':
                if (document.getElementById('educational-popup').classList.contains('active')) {
                    this.hideEducationalPopup();
                }
                break;
        }
    }

    toggleOracleConnection(node) {
        const status = node.querySelector('.connection-status');
        
        if (status.classList.contains('disconnected')) {
            status.className = 'connection-status connecting';
            status.innerHTML = '<i class="fas fa-clock"></i>';
            
            setTimeout(() => {
                status.className = 'connection-status connected';
                status.innerHTML = '<i class="fas fa-check"></i>';
            }, 1500);
        } else if (status.classList.contains('connected')) {
            status.className = 'connection-status disconnected';
            status.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClaimRushGame();
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add click ripple effect to buttons
    document.querySelectorAll('button, .mode-card, .oracle-node').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add particle effects for success states
function createParticleExplosion(element) {
    const colors = ['#00d4ff', '#7b68ee', '#00ff88', '#ffba00'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 100;
        const duration = 1000 + Math.random() * 1000;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
} 