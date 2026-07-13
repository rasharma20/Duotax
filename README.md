# Construction Cost Calculator

A modern, interactive Australian construction cost calculator built with vanilla JavaScript, Tailwind CSS, and state management framework.

## Features

✨ **Interactive State Management**
- Manage calculator state across multiple input options
- Real-time cost updates as selections change
- Persistent state tracking

🎨 **Beautiful UI**
- Responsive design using Tailwind CSS
- Orange highlight (#E27D24) for selected options
- Smooth animations and transitions
- Professional styling with custom CSS enhancements

📊 **Comprehensive Calculations**
- State-based pricing (NSW, VIC, QLD, ACT, WA, SA)
- Finish level multipliers (Low, Standard, High)
- Wall type adjustments (Brick Veneer, Double Brick, Concrete)
- Floor area, bedrooms, and floors customization
- Optional Ducted A/C add-on (~9% increase)

📈 **Dynamic Cost Estimates**
- Main estimated cost
- Low/Mid/High range calculations
- Detailed cost breakdown
- Cost per m² calculation

## Project Structure

```
d:\DUO\
├── index.html           # Main HTML structure
├── calculator.js        # JavaScript state management & calculations
├── styles.css           # Custom CSS styles and animations
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # This file
```

## Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/rasharma20/Duotax.git
   cd DUO
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required

3. **Interact with the calculator**
   - Click state buttons to select a location
   - Choose property type, finish level, and wall type
   - Input dimensions (floor area, bedrooms, floors)
   - Select construction year (1970-2030)
   - Toggle Ducted A/C inclusion
   - View real-time cost estimates

## Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Pure JS, no frameworks
- **CSS3** - Custom animations and transitions

## State Object Properties

```javascript
const calculatorState = {
  state: 'NSW',              // Selected state
  propertyType: 'Granny',    // Property type
  finishLevel: 'Standard',   // Finish specification
  wallType: 'Brick Veneer',  // Wall construction type
  ductedAC: true,            // Ducted A/C included
  completionYear: '2020',    // Construction year
  floorArea: 200,            // Floor area in m²
  bedrooms: 4,               // Number of bedrooms
  floors: 1                  // Number of floors
}
```

## Pricing Configuration

### State Base Rates (per m²)
- NSW: $2,300
- VIC: $2,200
- QLD: $2,100
- ACT: $2,350
- WA: $2,150
- SA: $2,050

### Finish Level Multipliers
- Low: 0.85x
- Standard: 1.0x
- High: 1.25x

### Wall Type Adjustments (per m²)
- Brick Veneer: $0
- Double Brick: +$150
- Concrete: +$100

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Orange | #E27D24 |
| Primary Light | Light Orange | #FDF2E9 |
| Background | Light Gray | #F8FAFC |
| Border | Light Border | #E2E8F0 |
| Text | Dark Text | #0F172A |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Export estimates as PDF
- [ ] Save calculations history
- [ ] Multi-property comparison
- [ ] API integration for real-time pricing
- [ ] Currency conversion
- [ ] Local storage for user preferences

## License

MIT License - feel free to use and modify

## Author

DuoTax Development Team

---

*Construction cost estimates are indicative only. Figures are based on current market data and may vary. For detailed assessments, consult with a quantity surveyor.*
