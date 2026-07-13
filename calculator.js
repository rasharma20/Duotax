// ============================================
// Calculator State Management Framework
// ============================================

// State-based pricing per m² (base rates)
const statePricing = {
  'NSW': 2300,
  'VIC': 2200,
  'QLD': 2100,
  'ACT': 2350,
  'WA': 2150,
  'SA': 2050
};

// Finish level multipliers
const finishLevelMultipliers = {
  'Low': 0.85,
  'Standard': 1.0,
  'High': 1.25
};

// Wall type cost adjustments (additional cost per m²)
const wallTypeAdjustments = {
  'Brick Veneer': 0,
  'Double Brick': 150,
  'Concrete': 100
};

// Initialize state object
const calculatorState = {
  state: 'NSW',
  propertyType: 'Granny',
  finishLevel: 'Standard',
  wallType: 'Brick Veneer',
  ductedAC: true,
  completionYear: '2020',
  floorArea: 200,
  bedrooms: 4,
  floors: 1
};

// Configuration for button groups
const buttonGroups = {
  state: {
    selector: '[data-group="state"]',
    stateKey: 'state',
    activeClass: 'active-state-btn'
  },
  propertyType: {
    selector: '[data-group="propertyType"]',
    stateKey: 'propertyType',
    activeClass: 'active-property-btn'
  },
  finishLevel: {
    selector: '[data-group="finishLevel"]',
    stateKey: 'finishLevel',
    activeClass: 'active-finish-btn'
  },
  wallType: {
    selector: '[data-group="wallType"]',
    stateKey: 'wallType',
    activeClass: 'active-wall-btn'
  }
};

// Initialize button groups with data attributes on DOM ready
function initializeButtonGroups() {
  // State buttons
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim();
    
    // State buttons (NSW, VIC, QLD, ACT, WA, SA)
    if (['NSW', 'VIC', 'QLD', 'ACT', 'WA', 'SA'].includes(text)) {
      btn.setAttribute('data-group', 'state');
      btn.setAttribute('data-value', text);
    }
    
    // Property type buttons
    if (['House', 'Granny', 'Appartment', 'Office', 'Warehouse'].includes(text)) {
      btn.setAttribute('data-group', 'propertyType');
      btn.setAttribute('data-value', text);
    }
    
    // Finish level buttons
    if (['Low', 'Standard', 'High'].includes(text) && !btn.hasAttribute('data-group')) {
      btn.setAttribute('data-group', 'finishLevel');
      btn.setAttribute('data-value', text);
    }
    
    // Wall type buttons
    if (['Brick Veneer', 'Double Brick', 'Concrete'].includes(text)) {
      btn.setAttribute('data-group', 'wallType');
      btn.setAttribute('data-value', text);
    }
  });
}

// Update visual state for button group
function updateButtonGroup(groupKey, newValue) {
  const buttons = document.querySelectorAll(`[data-group="${groupKey}"]`);
  buttons.forEach(btn => {
    btn.classList.remove(
      'border-2 border-[#E27D24]',
      'bg-[#FDF2E9]',
      'text-[#E27D24]',
      'font-bold'
    );
    btn.classList.add(
      'border',
      'border-[#E2E8F0]',
      'bg-white',
      'text-[#64748B]'
    );

    if (btn.getAttribute('data-value') === newValue) {
      btn.classList.remove(
        'border',
        'border-[#E2E8F0]',
        'bg-white',
        'text-[#64748B]'
      );
      btn.classList.add(
        'border-2',
        'border-[#E27D24]',
        'bg-[#FDF2E9]',
        'text-[#E27D24]',
        'font-bold'
      );
    }
  });
}

// Attach click listeners to button groups
function attachButtonListeners() {
  Object.entries(buttonGroups).forEach(([groupName, config]) => {
    document.querySelectorAll(`[data-group="${groupName}"]`).forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const newValue = this.getAttribute('data-value');
        calculatorState[config.stateKey] = newValue;
        updateButtonGroup(groupName, newValue);
        
        console.log(`✓ ${groupName} changed to: ${newValue}`);
        console.log('Current state:', calculatorState);
        
        // Trigger calculation update
        calculateEstimate();
      });
    });
  });
}

// Calculate total build cost
function calculateEstimate() {
  const basePricePerM2 = statePricing[calculatorState.state] || 2300;
  const finishMultiplier = finishLevelMultipliers[calculatorState.finishLevel] || 1.0;
  const wallAdjustment = wallTypeAdjustments[calculatorState.wallType] || 0;
  
  // Base cost
  const pricePerM2 = (basePricePerM2 * finishMultiplier) + wallAdjustment;
  const baseCost = pricePerM2 * calculatorState.floorArea;
  
  // Ducted A/C add-on (roughly 9% of base cost)
  const ductedAcCost = calculatorState.ductedAC ? baseCost * 0.09 : 0;
  
  // Total estimate
  const totalCost = baseCost + ductedAcCost;
  
  // Calculate range (low, mid, high)
  const lowEstimate = totalCost * 0.91;
  const midEstimate = totalCost;
  const highEstimate = totalCost * 1.09;
  
  // Update UI
  updateEstimateDisplay(midEstimate, lowEstimate, highEstimate, baseCost, ductedAcCost);
  
  console.log(`💰 Estimate calculated: $${totalCost.toLocaleString()}`);
}

// Update the display with calculated values
function updateEstimateDisplay(mid, low, high, base, ducted) {
  // Main estimated cost
  const mainCostEl = document.querySelector('h2');
  if (mainCostEl) {
    mainCostEl.textContent = `$${mid.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // Low estimate
  const lowEstEl = document.querySelectorAll('.flex.justify-between')[0];
  if (lowEstEl) {
    const priceSpan = lowEstEl.querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${low.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // Mid estimate
  const midEstEl = document.querySelectorAll('.flex.justify-between')[1];
  if (midEstEl) {
    const priceSpan = midEstEl.querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${mid.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // High estimate
  const highEstEl = document.querySelectorAll('.flex.justify-between')[2];
  if (highEstEl) {
    const priceSpan = highEstEl.querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${high.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // Base build cost
  const costBreakdownEls = document.querySelectorAll('.space-y-3 .flex.justify-between');
  if (costBreakdownEls[0]) {
    const priceSpan = costBreakdownEls[0].querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${base.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // Ducted A/C cost
  if (costBreakdownEls[1]) {
    const priceSpan = costBreakdownEls[1].querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${ducted.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
  
  // Total in breakdown
  if (costBreakdownEls[2]) {
    const priceSpan = costBreakdownEls[2].querySelector('span:last-child');
    if (priceSpan) priceSpan.textContent = `$${(base + ducted).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
  }
}

// Ducted A/C Toggle Handler
function attachToggleListener() {
  const toggleBtn = document.querySelector('[data-toggle="ducted-ac"]');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      calculatorState.ductedAC = !calculatorState.ductedAC;
      
      // Update visual state
      if (calculatorState.ductedAC) {
        toggleBtn.classList.add('bg-[#E27D24]');
        toggleBtn.classList.remove('bg-[#E2E8F0]');
        toggleBtn.classList.add('justify-end');
        toggleBtn.classList.remove('justify-start');
      } else {
        toggleBtn.classList.remove('bg-[#E27D24]');
        toggleBtn.classList.add('bg-[#E2E8F0]');
        toggleBtn.classList.add('justify-start');
        toggleBtn.classList.remove('justify-end');
      }
      
      console.log(`✓ Ducted A/C: ${calculatorState.ductedAC ? 'ON' : 'OFF'}`);
      console.log('Current state:', calculatorState);
      
      // Trigger calculation update
      calculateEstimate();
    });
  }
}

// Attach listeners to number inputs
function attachInputListeners() {
  const inputs = document.querySelectorAll('input[type="number"]');
  
  inputs.forEach((input, index) => {
    input.addEventListener('change', function() {
      const value = parseFloat(this.value) || 0;
      
      if (index === 0) {
        calculatorState.floorArea = value;
        console.log(`📐 Floor area: ${value} m²`);
      } else if (index === 1) {
        calculatorState.bedrooms = value;
        console.log(`🛏️ Bedrooms: ${value}`);
      } else if (index === 2) {
        calculatorState.floors = value;
        console.log(`🏢 Floors: ${value}`);
      }
      
      // Trigger calculation
      calculateEstimate();
    });
  });
}

// Attach listener to year selector
function attachYearListener() {
  const yearSelect = document.querySelector('select');
  
  if (yearSelect) {
    yearSelect.addEventListener('change', function() {
      calculatorState.completionYear = this.value;
      console.log(`📅 Completion year: ${this.value}`);
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Calculator Framework Initialized');
  initializeButtonGroups();
  attachButtonListeners();
  attachToggleListener();
  attachInputListeners();
  attachYearListener();
  logState();
  
  // Calculate initial estimate
  calculateEstimate();
});
