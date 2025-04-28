document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const filterBtn = document.getElementById('filterBtn');
    const numberInput = document.getElementById('numberInput');
    const resultsDiv = document.getElementById('results');
    const finalResultDiv = document.getElementById('finalResult');
    const resultsSection = document.getElementById('resultsSection');
    const filteredResultsDiv = document.getElementById('filteredResults');
    const uniqueNumbersDiv = document.getElementById('uniqueNumbers');
    const duplicateNumbersDiv = document.getElementById('duplicateNumbers');
    
    // Add gambling-themed animation when user interacts with the input
    numberInput.addEventListener('focus', function() {
        this.classList.add('active');
        playSlotMachineSound();
    });
    
    numberInput.addEventListener('blur', function() {
        this.classList.remove('active');
    });

    // Add sound effects
    function playSlotMachineSound() {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/slot-machine-1.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play prevented by browser policy"));
    }
    
    function playCoinSound() {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/coins-to-table-2.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play prevented by browser policy"));
    }

    // Initialize money rain overlay
    const moneyRainOverlay = document.createElement('div');
    moneyRainOverlay.className = 'money-rain-overlay';
    document.body.appendChild(moneyRainOverlay);
    
    // Money rain animation
    function startMoneyRain(duration = 3000, intensity = 'medium') {
        moneyRainOverlay.classList.add('active');
        
        let count;
        switch(intensity) {
            case 'light': count = 20; break;
            case 'medium': count = 40; break;
            case 'heavy': count = 80; break;
            default: count = 40;
        }
        
        const interval = setInterval(() => {
            createMoney();
        }, 100);
        
        setTimeout(() => {
            clearInterval(interval);
            setTimeout(() => {
                moneyRainOverlay.classList.remove('active');
                // Clean up money elements after animation ends
                setTimeout(() => {
                    const moneyElements = document.querySelectorAll('.money');
                    moneyElements.forEach(el => el.remove());
                }, 5000);
            }, 2000);
        }, duration);
    }
    
    function createMoney() {
        const money = document.createElement('div');
        money.className = 'money';
        
        // Randomly choose between coin and bill
        if (Math.random() > 0.7) {
            money.classList.add('bill');
        } else {
            money.classList.add('coin');
        }
        
        // Random position
        const left = Math.random() * 100;
        money.style.left = `${left}%`;
        
        // Random rotation
        const rotation = Math.random() * 360;
        money.style.transform = `rotate(${rotation}deg)`;
        
        // Random delay
        const delay = Math.random() * 0.5;
        money.style.animationDelay = `${delay}s`;
        
        moneyRainOverlay.appendChild(money);
        
        // Remove after animation completes to prevent memory issues
        const duration = money.classList.contains('bill') ? 5000 : 3000;
        setTimeout(() => {
            money.remove();
        }, duration + delay * 1000);
    }

    analyzeBtn.addEventListener('click', function() {
        // Add button animation
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
        
        // Get the input value and trim whitespace
        const input = numberInput.value.trim();
        
        if (!input) {
            alert('Vui lòng nhập ít nhất một dãy số.');
            return;
        }

        // Simulate loading animation
        resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Đang phân tích...</div>';
        resultsSection.style.display = 'block';
        
        // Use setTimeout to create a delay effect
        setTimeout(function() {
            processAnalyzeRequest(input);
            playCoinSound();
            // Start a light money rain
            startMoneyRain(2000, 'light');
        }, 800);
    });

    function processAnalyzeRequest(input) {
        // Split input by commas and remove any whitespace
        const sequences = input.split(',').map(seq => seq.trim());
        
        // Clear previous results
        resultsDiv.innerHTML = '';
        finalResultDiv.innerHTML = '';
        filteredResultsDiv.style.display = 'none';
        
        // Process each sequence
        const allSteps = [];
        
        sequences.forEach((sequence, index) => {
            // Validate that the sequence contains only digits
            if (!/^\d+$/.test(sequence)) {
                resultsDiv.innerHTML += `<p>Dãy số ${index + 1}: "${sequence}" không hợp lệ. Vui lòng chỉ nhập các chữ số từ 0-9.</p>`;
                return;
            }
            
            const result = processSequence(sequence);
            const steps = result.steps;
            
            // Display steps for this sequence with animation
            const sequenceEl = document.createElement('div');
            sequenceEl.classList.add('sequence-result');
            sequenceEl.innerHTML = `<p><strong>Dãy ${index + 1}:</strong> ${steps.join(' - ')}</p>`;
            resultsDiv.appendChild(sequenceEl);
            
            // Add fade-in animation
            setTimeout(() => {
                sequenceEl.style.opacity = '1';
                sequenceEl.style.transform = 'translateY(0)';
            }, 100 * index);
            
            // Add all steps to our collection
            allSteps.push(...steps);
        });
        
        // Show the final combined result
        if (allSteps.length > 0) {
            finalResultDiv.innerHTML = `<p><strong>Kết quả tổng hợp:</strong> ${allSteps.join(', ')}</p>`;
            finalResultDiv.style.opacity = '0';
            finalResultDiv.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                finalResultDiv.style.opacity = '1';
                finalResultDiv.style.transform = 'translateY(0)';
                
                // Scroll to results area
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            resultsSection.style.display = 'block';
        }
        
        // Check for jackpot sequences
        checkForJackpot(sequences);
    }

    filterBtn.addEventListener('click', function() {
        // Add button animation
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
        
        // Get the input value and trim whitespace
        const input = numberInput.value.trim();
        
        if (!input) {
            alert('Vui lòng nhập ít nhất một dãy số.');
            return;
        }

        // Simulate loading animation
        resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-dice fa-spin"></i> Đang lọc số...</div>';
        resultsSection.style.display = 'block';
        
        // Use setTimeout to create a delay effect
        setTimeout(function() {
            processFilterRequest(input);
            playCoinSound();
            // Start a medium money rain
            startMoneyRain(3000, 'medium');
        }, 800);
    });

    function processFilterRequest(input) {
        // Split input by commas and remove any whitespace
        const sequences = input.split(',').map(seq => seq.trim());
        
        // Validate sequences
        for (let i = 0; i < sequences.length; i++) {
            if (!/^\d+$/.test(sequences[i])) {
                alert(`Dãy số ${i + 1}: "${sequences[i]}" không hợp lệ. Vui lòng chỉ nhập các chữ số từ 0-9.`);
                return;
            }
        }

        // Clear previous results
        resultsDiv.innerHTML = '';
        finalResultDiv.innerHTML = '';
        uniqueNumbersDiv.innerHTML = '';
        duplicateNumbersDiv.innerHTML = '';
        
        // Process each sequence and generate combinations
        const allSequencesResults = [];
        const allCombinations = [];
        
        sequences.forEach((sequence, index) => {
            const combinations = generateCombinations(sequence);
            allCombinations.push(...combinations);
            
            // Display combinations for this sequence with animation
            const sequenceEl = document.createElement('div');
            sequenceEl.classList.add('sequence-result');
            sequenceEl.innerHTML = `<p><strong>Dãy ${index + 1}:</strong> ${sequence} - ${combinations.join(' ')}</p>`;
            resultsDiv.appendChild(sequenceEl);
            
            // Add fade-in animation
            setTimeout(() => {
                sequenceEl.style.opacity = '1';
                sequenceEl.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        // Display all combinations
        finalResultDiv.innerHTML = `<p><strong>Tất cả các số ghép được:</strong> ${allCombinations.join(' ')}</p>`;
        finalResultDiv.style.opacity = '0';
        finalResultDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            finalResultDiv.style.opacity = '1';
            finalResultDiv.style.transform = 'translateY(0)';
        }, 300);
        
        // Find unique numbers (after removing duplicates) and sort
        const uniqueSorted = Array.from(new Set(allCombinations)).sort((a, b) => parseInt(a) - parseInt(b));
        
        // Find duplicate numbers (numbers that occur more than once)
        const countMap = new Map();
        allCombinations.forEach(num => {
            countMap.set(num, (countMap.get(num) || 0) + 1);
        });
        
        const duplicateNumbers = [];
        countMap.forEach((count, num) => {
            if (count > 1) {
                duplicateNumbers.push(num);
            }
        });
        
        // Sort duplicate numbers
        duplicateNumbers.sort((a, b) => parseInt(a) - parseInt(b));
        
        // Display filtered and sorted results with animations
        setTimeout(() => {
            uniqueNumbersDiv.innerHTML = `<p><strong>Lọc trùng và sắp xếp tăng dần:</strong> ${uniqueSorted.join(' ')}</p>`;
            uniqueNumbersDiv.classList.add('animate');
            
            setTimeout(() => {
                duplicateNumbersDiv.innerHTML = `<p><strong>Số bị trùng:</strong> ${duplicateNumbers.join(' ')}</p>`;
                duplicateNumbersDiv.classList.add('animate');
                
                // Scroll to filtered results
                filteredResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Start heavy money rain for impressive effect after showing all results
                if (uniqueSorted.length > 10) {
                    startMoneyRain(4000, 'heavy');
                }
            }, 300);
            
            // Show results
            resultsSection.style.display = 'block';
            filteredResultsDiv.style.display = 'block';
        }, 600);
        
        // Check for jackpot sequences
        checkForJackpot(sequences);
    }

    // Function to process a sequence according to the rules
    function processSequence(sequence) {
        let currentSeq = sequence;
        const allSteps = [currentSeq];
        
        // Continue processing until we have only 2 or fewer digits
        while (currentSeq.length > 2) {
            let newSeq = '';
            
            for (let i = 0; i < currentSeq.length - 1; i++) {
                const digit1 = parseInt(currentSeq[i]);
                const digit2 = parseInt(currentSeq[i + 1]);
                const sum = digit1 + digit2;
                
                // If sum <= 9, keep it; otherwise, use the absolute difference
                if (sum <= 9) {
                    newSeq += sum;
                } else {
                    newSeq += Math.abs(digit1 - digit2);
                }
            }
            
            currentSeq = newSeq;
            allSteps.push(currentSeq);
        }
        
        return {
            finalResult: currentSeq,
            steps: allSteps
        };
    }

    // Function to generate all combinations within a sequence
    function generateCombinations(sequence) {
        const combinations = [];
        
        for (let i = 0; i < sequence.length; i++) {
            for (let j = 0; j < sequence.length; j++) {
                // Combine each digit with all digits (including itself)
                combinations.push(sequence[i] + sequence[j]);
            }
        }
        
        return combinations;
    }
    
    // Add some gambling-themed animations
    function addFloatingNumbers() {
        const container = document.querySelector('.container');
        const numbers = ['7', '8', '9', '0', '1', '2', '3', '4', '5', '6'];
        
        for (let i = 0; i < 10; i++) {
            const number = document.createElement('div');
            number.classList.add('floating-number');
            number.textContent = numbers[Math.floor(Math.random() * numbers.length)];
            number.style.left = `${Math.random() * 100}%`;
            number.style.animationDuration = `${Math.random() * 10 + 5}s`;
            number.style.animationDelay = `${Math.random() * 5}s`;
            document.body.appendChild(number);
        }
    }
    
    // Add flying dollar sign animation when clicking on numbers
    function addDollarSignListener() {
        document.addEventListener('click', function(e) {
            // Check if we clicked on a results area
            const isInResults = 
                e.target.closest('#results') || 
                e.target.closest('#finalResult') || 
                e.target.closest('#uniqueNumbers') || 
                e.target.closest('#duplicateNumbers');
                
            if (isInResults) {
                createFlyingDollarSign(e.clientX, e.clientY);
            }
        });
    }
    
    function createFlyingDollarSign(x, y) {
        const dollarSign = document.createElement('div');
        dollarSign.className = 'dollar-sign';
        dollarSign.textContent = '$';
        dollarSign.style.left = `${x}px`;
        dollarSign.style.top = `${y}px`;
        
        document.body.appendChild(dollarSign);
        
        // Remove after animation completes
        setTimeout(() => {
            dollarSign.remove();
        }, 2000);
    }

    // Initialize animations
    addFloatingNumbers();
    addDollarSignListener();

    // Add jackpot animation for specific number sequences
    function checkForJackpot(sequences) {
        // Check for lucky sequences like 777, 888, etc.
        const luckyPatterns = ['777', '888', '999', '666', '7777', '8888'];
        
        for (const seq of sequences) {
            if (luckyPatterns.includes(seq)) {
                celebrateJackpot();
                break;
            }
        }
    }
    
    function celebrateJackpot() {
        // Play jackpot sound
        const audio = new Audio('https://www.soundjay.com/misc/sounds/slot-machine-win-1.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play prevented by browser policy"));
        
        // Heavy money rain
        startMoneyRain(8000, 'heavy');
        
        // Add jackpot message
        const jackpotMsg = document.createElement('div');
        jackpotMsg.className = 'jackpot-message';
        jackpotMsg.innerHTML = '<span>JACKPOT!</span>';
        document.body.appendChild(jackpotMsg);
        
        setTimeout(() => {
            jackpotMsg.remove();
        }, 5000);
    }
    
    // Add double-click on container to trigger money rain (Easter egg)
    document.querySelector('.container').addEventListener('dblclick', function() {
        startMoneyRain(3000, 'medium');
    });
}); 