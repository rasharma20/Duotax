/* Calculator interactivity: button toggles + real-time calculation */
document.addEventListener('DOMContentLoaded', () => {
  // --- Configuration (base rates and multipliers) ---
  const stateBaseRates = {
    NSW: 2100,
    VIC: 2000,
    QLD: 1900,
    ACT: 2200,
    WA: 1950,
    SA: 1850
  };
  const finishMultipliers = {
    Low: 0.90,
    Standard: 1.00,
    High: 1.20
  };
  const DUCTED_AC_COST = 41413;
  const BEDROOM_EXTRA = 15000; // per bedroom above 1
  const FLOORS_EXTRA = 25000; // if floors > 1

  // --- Helpers to set classes ---
  function setActiveButton(button) {
    const group = button.dataset.group;
    if (!group) return;
    const buttons = document.querySelectorAll(`button[data-group="${group}"]`);
    buttons.forEach(btn => {
      // inactive style
      btn.classList.remove('border-2','border-[#E27D24]','bg-[#FDF2E9]','text-[#E27D24]','font-bold');
      btn.classList.add('border','border-[#E2E8F0]','bg-white','text-[#64748B]','font-normal');
    });
    // active style on clicked
    button.classList.remove('border','border-[#E2E8F0]','bg-white','text-[#64748B]','font-normal');
    button.classList.add('border-2','border-[#E27D24]','bg-[#FDF2E9]','text-[#E27D24]','font-bold');
  }

  function toggleDucted(button) {
    const active = button.classList.toggle('ducted-active');
    if (active) {
      button.classList.remove('bg-[#E2E8F0]','justify-start');
      button.classList.add('bg-[#E27D24]','justify-end');
    } else {
      button.classList.remove('bg-[#E27D24]','justify-end');
      button.classList.add('bg-[#E2E8F0]','justify-start');
    }
    return active;
  }

  // --- Initialize data-group/data-value attributes if missing ---
  function initializeGroups() {
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim();
      if (!btn.hasAttribute('data-group')) {
        if (['NSW','VIC','QLD','ACT','WA','SA'].includes(text)) {
          btn.dataset.group = 'state'; btn.dataset.value = text;
        }
        if (['House','Granny','Appartment','Apartment','Office','Warehouse'].includes(text)) {
          btn.dataset.group = 'propertyType'; btn.dataset.value = text;
        }
        if (['Low','Standard','High'].includes(text)) {
          btn.dataset.group = 'finishLevel'; btn.dataset.value = text;
        }
        if (['Brick Veneer','Double Brick','Concrete'].includes(text)) {
          btn.dataset.group = 'wallType'; btn.dataset.value = text;
        }
      } else {
        if (!btn.hasAttribute('data-value')) btn.dataset.value = text;
      }
    });

    const ductToggle = document.querySelector('[data-toggle="ducted-ac"]');
    if (ductToggle) {
      const initiallyOn = ductToggle.classList.contains('bg-[#E27D24]') || ductToggle.classList.contains('ducted-active');
      if (initiallyOn) ductToggle.classList.add('ducted-active');
      else { ductToggle.classList.remove('ducted-active'); ductToggle.classList.add('bg-[#E2E8F0]','justify-start'); }
    }
  }

  // --- Read current inputs from DOM into a single state object ---
  function readState() {
    const s = {
      state: getSelectedValue('state') || 'NSW',
      propertyType: getSelectedValue('propertyType') || '',
      finishLevel: getSelectedValue('finishLevel') || 'Standard',
      wallType: getSelectedValue('wallType') || '',
      ductedAC: Boolean(document.querySelector('[data-toggle="ducted-ac"]')?.classList.contains('ducted-active')),
      completionYear: document.querySelector('select')?.value || '',
      floorArea: parseFloat(document.querySelector('input[type="number"]')?.value) || 0,
      bedrooms: parseInt(document.querySelectorAll('input[type="number"]')[1]?.value) || 0,
      floors: parseInt(document.querySelectorAll('input[type="number"]')[2]?.value) || 0
    };
    return s;
  }

  function getSelectedValue(group) {
    const active = document.querySelector(`button[data-group="${group}"].border-2`);
    return active?.dataset?.value;
  }

  // --- Main calculation logic ---
  function calculateAndUpdate() {
    const st = readState();
    const baseRateStandard = stateBaseRates[st.state] ?? 2100;
    const finishMultiplier = finishMultipliers[st.finishLevel] ?? 1.0;
    const baseRate = Math.round(baseRateStandard * finishMultiplier);

    const baseBuildCost = Math.round(st.floorArea * baseRate);

    const bedroomsExtra = Math.max(0, (st.bedrooms || 0) - 1) * BEDROOM_EXTRA;
    const floorsExtra = (st.floors || 0) > 1 ? FLOORS_EXTRA : 0;
    const ductedCost = st.ductedAC ? DUCTED_AC_COST : 0;

    const total = baseBuildCost + bedroomsExtra + floorsExtra + ductedCost;

    const low = Math.round(total * 0.91);
    const mid = Math.round(total);
    const high = Math.round(total * 1.09);

    updateEstimateUI({ low, mid, high, baseBuildCost, ductedCost, total, st, baseRate });
  }

  // --- DOM update helpers ---
  function formatMoney(n) { return `$${Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`; }

  function updateEstimateUI({ low, mid, high, baseBuildCost, ductedCost, total, st, baseRate }) {
    const mainEl = document.querySelector('aside h2'); if (mainEl) mainEl.textContent = formatMoney(mid);

    const quickRows = document.querySelectorAll('aside .space-y-2.5 > .flex.justify-between');
    if (quickRows && quickRows.length >= 3) {
      const lowPrice = quickRows[0].querySelector('span:last-child');
      const midPrice = quickRows[1].querySelector('span:last-child');
      const highPrice = quickRows[2].querySelector('span:last-child');
      if (lowPrice) lowPrice.textContent = formatMoney(low);
      if (midPrice) midPrice.textContent = formatMoney(mid);
      if (highPrice) highPrice.textContent = formatMoney(high);
    }

    const breakdownRows = document.querySelectorAll('aside .space-y-3 .flex.justify-between');
    if (breakdownRows && breakdownRows.length >= 3) {
      const baseSpan = breakdownRows[0].querySelector('span:last-child');
      const ductedSpan = breakdownRows[1].querySelector('span:last-child');
      const totalSpan = breakdownRows[2].querySelector('span:last-child');
      if (baseSpan) baseSpan.textContent = formatMoney(baseBuildCost);
      if (ductedSpan) ductedSpan.textContent = formatMoney(ductedCost);
      if (totalSpan) totalSpan.textContent = formatMoney(total);
    }

    // Update bottom 'Your inputs' summary
    let yourInputsBtn = null;
    document.querySelectorAll('button').forEach(b => { if ((b.textContent||'').trim().includes('Your inputs')) yourInputsBtn = b; });
    if (yourInputsBtn) {
      const container = yourInputsBtn.closest('.p-5');
      if (container) {
        let para = container.querySelector('p.text-xs');
        if (!para) para = container.querySelector('p');
        if (para) {
          const summary = `\n            <div style="margin-top:.6rem;font-size:.85rem;color: #334155;">\n              <strong>Selections:</strong>\n              ${st.state ? ` State: ${st.state};` : ''}\n              ${st.propertyType ? ` Property: ${st.propertyType};` : ''}\n              ${st.finishLevel ? ` Finish: ${st.finishLevel};` : ''}\n              ${st.wallType ? ` Wall: ${st.wallType};` : ''}\n              Year: ${st.completionYear || '—'}; Area: ${st.floorArea} m²; Bedrooms: ${st.bedrooms}; Floors: ${st.floors};\n            </div>`;
          let summaryNode = container.querySelector('#your-inputs-summary');
          if (!summaryNode) { summaryNode = document.createElement('div'); summaryNode.id = 'your-inputs-summary'; para.insertAdjacentElement('afterend', summaryNode); }
          summaryNode.innerHTML = summary;
        }
      }
    }
  }

  // --- Event wiring ---
  function wireButtonGroups() {
    document.querySelectorAll('button[data-group]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.preventDefault(); setActiveButton(btn); calculateAndUpdate(); });
    });
  }

  function wireDuctToggle() {
    const toggle = document.querySelector('[data-toggle="ducted-ac"]');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => { e.preventDefault(); toggleDucted(toggle); calculateAndUpdate(); });
  }

  function wireInputs() {
    const yearSelect = document.querySelector('select'); if (yearSelect) yearSelect.addEventListener('change', () => calculateAndUpdate());
    const nums = document.querySelectorAll('input[type="number"]');
    nums.forEach(n => { n.addEventListener('input', () => { if (n.value && Number(n.value) < 0) n.value = 0; calculateAndUpdate(); }); });
  }

  // --- Accordion wiring: toggle individual sections independently ---
  function wireAccordions() {
    document.querySelectorAll('.accordion-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.dataset.target;
        if (!targetId) return;
        const content = document.getElementById(targetId);
        if (!content) return;
        const isHidden = content.classList.contains('hidden');
        // toggle only this content
        if (isHidden) {
          content.classList.remove('hidden');
          // arrow
          const arrow = toggle.querySelector('.accordion-arrow'); if (arrow) arrow.textContent = '▲';
        } else {
          content.classList.add('hidden');
          const arrow = toggle.querySelector('.accordion-arrow'); if (arrow) arrow.textContent = '▼';
        }
      });
    });
  }

  // --- Run initialization ---
  initializeGroups();
  ['state','propertyType','finishLevel','wallType'].forEach(g => {
    const active = document.querySelector(`button[data-group="${g}"]`).classList.contains('border-2') ? document.querySelector(`button[data-group="${g}"]`) : null;
    const alreadyActive = document.querySelector(`button[data-group="${g}"].border-2`);
    if (!alreadyActive) { const first = document.querySelector(`button[data-group="${g}"]`); if (first) setActiveButton(first); }
  });
  wireButtonGroups(); wireDuctToggle(); wireInputs();
  wireAccordions();
  calculateAndUpdate();

});


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
