// Body Type Calculator JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bodyTypeForm = document.getElementById('bodyTypeForm');
  const resetFormBtn = document.getElementById('resetForm');
  const resultsContainer = document.getElementById('results');
  const metricToggle = document.getElementById('metricToggle');
  const imperialToggle = document.getElementById('imperialToggle');
  
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const wristInput = document.getElementById('wrist');
  const shoulderInput = document.getElementById('shoulder');
  const hipInput = document.getElementById('hip');
  const waistInput = document.getElementById('waist');
  
  const heightUnit = document.getElementById('heightUnit');
  const weightUnit = document.getElementById('weightUnit');
  const wristUnit = document.getElementById('wristUnit');
  const shoulderUnit = document.getElementById('shoulderUnit');
  const hipUnit = document.getElementById('hipUnit');
  const waistUnit = document.getElementById('waistUnit');
  
  let isMetric = true;
  
  // Unit toggle functionality
  metricToggle.addEventListener('click', () => {
    if (!isMetric) {
      isMetric = true;
      metricToggle.classList.add('active');
      imperialToggle.classList.remove('active');
      updateUnits();
      convertToMetric();
    }
  });
  
  imperialToggle.addEventListener('click', () => {
    if (isMetric) {
      isMetric = false;
      imperialToggle.classList.add('active');
      metricToggle.classList.remove('active');
      updateUnits();
      convertToImperial();
    }
  });
  
  // Update unit labels
  function updateUnits() {
    if (isMetric) {
      heightUnit.textContent = 'cm';
      weightUnit.textContent = 'kg';
      wristUnit.textContent = 'cm';
      shoulderUnit.textContent = 'cm';
      hipUnit.textContent = 'cm';
      waistUnit.textContent = 'cm';
    } else {
      heightUnit.textContent = 'in';
      weightUnit.textContent = 'lb';
      wristUnit.textContent = 'in';
      shoulderUnit.textContent = 'in';
      hipUnit.textContent = 'in';
      waistUnit.textContent = 'in';
    }
  }
  
  // Convert values between metric and imperial
  function convertToMetric() {
    if (heightInput.value) heightInput.value = (parseFloat(heightInput.value) * 2.54).toFixed(1);
    if (weightInput.value) weightInput.value = (parseFloat(weightInput.value) / 2.205).toFixed(1);
    if (wristInput.value) wristInput.value = (parseFloat(wristInput.value) * 2.54).toFixed(1);
    if (shoulderInput.value) shoulderInput.value = (parseFloat(shoulderInput.value) * 2.54).toFixed(1);
    if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) * 2.54).toFixed(1);
    if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) * 2.54).toFixed(1);
  }
  
  function convertToImperial() {
    if (heightInput.value) heightInput.value = (parseFloat(heightInput.value) / 2.54).toFixed(1);
    if (weightInput.value) weightInput.value = (parseFloat(weightInput.value) * 2.205).toFixed(1);
    if (wristInput.value) wristInput.value = (parseFloat(wristInput.value) / 2.54).toFixed(1);
    if (shoulderInput.value) shoulderInput.value = (parseFloat(shoulderInput.value) / 2.54).toFixed(1);
    if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) / 2.54).toFixed(1);
    if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) / 2.54).toFixed(1);
  }
  
  // Form submission
  bodyTypeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const wrist = wristInput.value ? parseFloat(wristInput.value) : null;
    const shoulder = shoulderInput.value ? parseFloat(shoulderInput.value) : null;
    const hip = hipInput.value ? parseFloat(hipInput.value) : null;
    const waist = waistInput.value ? parseFloat(waistInput.value) : null;
    
    const weightChange = document.querySelector('input[name="weightChange"]:checked').value;
    const muscleTone = document.querySelector('input[name="muscleTone"]:checked').value;
    const boneStructure = document.querySelector('input[name="boneStructure"]:checked').value;
    
    // Convert to metric if using imperial
    let heightMetric = height;
    let weightMetric = weight;
    let wristMetric = wrist;
    let shoulderMetric = shoulder;
    let hipMetric = hip;
    let waistMetric = waist;
    
    if (!isMetric) {
      heightMetric = height * 2.54;
      weightMetric = weight / 2.205;
      if (wrist) wristMetric = wrist * 2.54;
      if (shoulder) shoulderMetric = shoulder * 2.54;
      if (hip) hipMetric = hip * 2.54;
      if (waist) waistMetric = waist * 2.54;
    }
    
    // Calculate body type
    const bodyTypeResult = calculateBodyType(
      gender, 
      age, 
      heightMetric, 
      weightMetric, 
      wristMetric, 
      shoulderMetric, 
      hipMetric, 
      waistMetric, 
      weightChange, 
      muscleTone, 
      boneStructure
    );
    
    // Display results
    displayResults(bodyTypeResult);
    
    // Update tips visibility
    updateTips(bodyTypeResult.primaryType);
    
    // Save calculation
    saveCalculation('body_type', {
      gender,
      age,
      height,
      weight,
      weightChange,
      muscleTone,
      boneStructure,
      isMetric
    }, bodyTypeResult);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Reset form
  resetFormBtn.addEventListener('click', () => {
    bodyTypeForm.reset();
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
  });
  
  // Calculate body type based on inputs
  function calculateBodyType(gender, age, height, weight, wrist, shoulder, hip, waist, weightChange, muscleTone, boneStructure) {
    // Initialize scores
    let ectomorphScore = 0;
    let mesomorphScore = 0;
    let endomorphScore = 0;
    
    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100));
    
    // Adjust based on BMI
    if (bmi < 18.5) {
      ectomorphScore += 3;
      mesomorphScore += 0;
      endomorphScore += 0;
    } else if (bmi >= 18.5 && bmi < 25) {
      ectomorphScore += 1;
      mesomorphScore += 2;
      endomorphScore += 0;
    } else if (bmi >= 25 && bmi < 30) {
      ectomorphScore += 0;
      mesomorphScore += 2;
      endomorphScore += 1;
    } else {
      ectomorphScore += 0;
      mesomorphScore += 0;
      endomorphScore += 3;
    }
    
    // Adjust based on weight change tendency
    if (weightChange === 'hard') {
      ectomorphScore += 3;
      mesomorphScore += 0;
      endomorphScore += 0;
    } else if (weightChange === 'moderate') {
      ectomorphScore += 1;
      mesomorphScore += 3;
      endomorphScore += 1;
    } else if (weightChange === 'easy') {
      ectomorphScore += 0;
      mesomorphScore += 1;
      endomorphScore += 3;
    }
    
    // Adjust based on muscle tone
    if (muscleTone === 'low') {
      ectomorphScore += 2;
      mesomorphScore += 0;
      endomorphScore += 1;
    } else if (muscleTone === 'moderate') {
      ectomorphScore += 1;
      mesomorphScore += 3;
      endomorphScore += 1;
    } else if (muscleTone === 'high') {
      ectomorphScore += 0;
      mesomorphScore += 3;
      endomorphScore += 0;
    }
    
    // Adjust based on bone structure
    if (boneStructure === 'small') {
      ectomorphScore += 3;
      mesomorphScore += 0;
      endomorphScore += 0;
    } else if (boneStructure === 'medium') {
      ectomorphScore += 1;
      mesomorphScore += 3;
      endomorphScore += 1;
    } else if (boneStructure === 'large') {
      ectomorphScore += 0;
      mesomorphScore += 1;
      endomorphScore += 3;
    }
    
    // Adjust based on waist-to-hip ratio if available
    if (waist && hip) {
      const whr = waist / hip;
      
      if (gender === 'male') {
        if (whr < 0.85) {
          ectomorphScore += 2;
          mesomorphScore += 1;
          endomorphScore += 0;
        } else if (whr >= 0.85 && whr < 0.95) {
          ectomorphScore += 1;
          mesomorphScore += 3;
          endomorphScore += 0;
        } else {
          ectomorphScore += 0;
          mesomorphScore += 1;
          endomorphScore += 2;
        }
      } else { // female
        if (whr < 0.75) {
          ectomorphScore += 2;
          mesomorphScore += 1;
          endomorphScore += 0;
        } else if (whr >= 0.75 && whr < 0.85) {
          ectomorphScore += 1;
          mesomorphScore += 3;
          endomorphScore += 0;
        } else {
          ectomorphScore += 0;
          mesomorphScore += 1;
          endomorphScore += 2;
        }
      }
    }
    
    // Adjust based on shoulder to waist ratio if available
    if (shoulder && waist) {
      const swr = shoulder / waist;
      
      if (gender === 'male') {
        if (swr > 1.5) {
          ectomorphScore += 1;
          mesomorphScore += 3;
          endomorphScore += 0;
        } else if (swr > 1.2 && swr <= 1.5) {
          ectomorphScore += 1;
          mesomorphScore += 2;
          endomorphScore += 1;
        } else {
          ectomorphScore += 0;
          mesomorphScore += 0;
          endomorphScore += 2;
        }
      } else { // female
        if (swr > 1.4) {
          ectomorphScore += 1;
          mesomorphScore += 3;
          endomorphScore += 0;
        } else if (swr > 1.1 && swr <= 1.4) {
          ectomorphScore += 1;
          mesomorphScore += 2;
          endomorphScore += 1;
        } else {
          ectomorphScore += 0;
          mesomorphScore += 0;
          endomorphScore += 2;
        }
      }
    }
    
    // Calculate total and percentages
    const totalScore = ectomorphScore + mesomorphScore + endomorphScore;
    const ectomorphPercentage = Math.round((ectomorphScore / totalScore) * 100);
    const mesomorphPercentage = Math.round((mesomorphScore / totalScore) * 100);
    const endomorphPercentage = Math.round((endomorphScore / totalScore) * 100);
    
    // Determine primary type
    let primaryType = '';
    let secondaryType = '';
    
    if (ectomorphPercentage >= mesomorphPercentage && ectomorphPercentage >= endomorphPercentage) {
      primaryType = 'ectomorph';
      secondaryType = mesomorphPercentage >= endomorphPercentage ? 'mesomorph' : 'endomorph';
    } else if (mesomorphPercentage >= ectomorphPercentage && mesomorphPercentage >= endomorphPercentage) {
      primaryType = 'mesomorph';
      secondaryType = ectomorphPercentage >= endomorphPercentage ? 'ectomorph' : 'endomorph';
    } else {
      primaryType = 'endomorph';
      secondaryType = mesomorphPercentage >= ectomorphPercentage ? 'mesomorph' : 'ectomorph';
    }
    
    return {
      ectomorphPercentage,
      mesomorphPercentage,
      endomorphPercentage,
      primaryType,
      secondaryType,
      bmi: bmi.toFixed(1)
    };
  }
  
  // Display results in the DOM
  function displayResults(result) {
    resultsContainer.innerHTML = `
      <div class="result-header">
        <div class="result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </div>
        <div class="result-title">
          <h3>Your Body Type</h3>
          <p>Your primary type is <strong class="primary-type">${capitalizeFirstLetter(result.primaryType)}</strong> with <strong class="secondary-type">${capitalizeFirstLetter(result.secondaryType)}</strong> tendencies</p>
        </div>
      </div>
      
      <div class="result-details">
        <h4>Body Type Composition</h4>
        
        <div class="result-bar-container">
          <div class="result-bar-label">
            <span>Ectomorph</span>
            <span>${result.ectomorphPercentage}%</span>
          </div>
          <div class="result-bar-outer">
            <div class="result-bar-inner ectomorph" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="result-bar-container">
          <div class="result-bar-label">
            <span>Mesomorph</span>
            <span>${result.mesomorphPercentage}%</span>
          </div>
          <div class="result-bar-outer">
            <div class="result-bar-inner mesomorph" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="result-bar-container">
          <div class="result-bar-label">
            <span>Endomorph</span>
            <span>${result.endomorphPercentage}%</span>
          </div>
          <div class="result-bar-outer">
            <div class="result-bar-inner endomorph" style="width: 0%"></div>
          </div>
        </div>
        
        <div class="result-summary">
          <p>BMI: <strong>${result.bmi}</strong></p>
          <p>Most people are a blend of body types. Your results show that you're primarily a <strong>${capitalizeFirstLetter(result.primaryType)}</strong> with some <strong>${capitalizeFirstLetter(result.secondaryType)}</strong> characteristics.</p>
          <p>Scroll down to see personalized nutrition and exercise recommendations for your body type.</p>
        </div>
      </div>
    `;
    
    resultsContainer.classList.remove('hidden');
    
    // Animate the result bars after a short delay
    setTimeout(() => {
      document.querySelector('.result-bar-inner.ectomorph').style.width = `${result.ectomorphPercentage}%`;
      document.querySelector('.result-bar-inner.mesomorph').style.width = `${result.mesomorphPercentage}%`;
      document.querySelector('.result-bar-inner.endomorph').style.width = `${result.endomorphPercentage}%`;
    }, 100);
  }
  
  // Update tips section to show relevant tips for the user's body type
  function updateTips(primaryType) {
    // Get all tip sections
    const tipSections = document.querySelectorAll('.tip-section');
    
    // Hide all tips
    tipSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Show tips for the primary body type
    document.querySelectorAll(`.tip-section[data-type="${primaryType}"]`).forEach(section => {
      section.style.display = 'block';
    });
    
    // Highlight the relevant body type card
    const bodyTypeCards = document.querySelectorAll('.body-type-card');
    bodyTypeCards.forEach(card => {
      card.style.borderColor = 'var(--color-border)';
      card.style.transform = 'none';
    });
    
    const activeCard = document.getElementById(`${primaryType}-card`);
    if (activeCard) {
      activeCard.style.borderColor = 'var(--color-primary-500)';
      activeCard.style.borderWidth = '2px';
      activeCard.style.transform = 'translateY(-5px)';
      activeCard.style.boxShadow = 'var(--shadow-lg)';
      
      // Scroll to the active card
      setTimeout(() => {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }
  
  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});