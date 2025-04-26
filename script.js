document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const numberInput = document.getElementById('numberInput');
    const resultsDiv = document.getElementById('results');
    const finalResultDiv = document.getElementById('finalResult');
    const resultsSection = document.getElementById('resultsSection');

    analyzeBtn.addEventListener('click', function() {
        // Get the input value and trim whitespace
        const input = numberInput.value.trim();
        
        if (!input) {
            alert('Vui lòng nhập ít nhất một dãy số.');
            return;
        }

        // Split input by commas and remove any whitespace
        const sequences = input.split(',').map(seq => seq.trim());
        
        // Clear previous results
        resultsDiv.innerHTML = '';
        finalResultDiv.innerHTML = '';
        
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
            
            // Display steps for this sequence
            resultsDiv.innerHTML += `<p><strong>Dãy ${index + 1}:</strong> ${steps.join(' - ')}</p>`;
            
            // Add all steps to our collection
            allSteps.push(...steps);
        });
        
        // Show the final combined result
        if (allSteps.length > 0) {
            finalResultDiv.innerHTML = `<p><strong>Kết quả tổng hợp:</strong> ${allSteps.join(', ')}</p>`;
            resultsSection.style.display = 'block';
        }
    });

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
}); 