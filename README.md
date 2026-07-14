# Construction Cost Calculator (React)

This project is a React + Vite migration of the original HTML/CSS/JS calculator.

The migration preserves functional behavior while restructuring the code into a feature-oriented React architecture.

## Tech Stack

- React
- Vite
- Tailwind CSS (v4 via Vite plugin)
- ESLint

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Project Structure

```text
src/
	App.jsx
	index.css
	main.jsx
	features/
		calculator/
			CalculatorPage.jsx
			components/
				AccordionInfo.jsx
				DuctedToggle.jsx
				OptionButtonGroup.jsx
				ResultCard.jsx
			model/
				calculateEstimate.js
				constants.js
			utils/
				formatMoney.js
```

## Behavior Parity Notes

- Pricing and estimate formula are centralized in `src/features/calculator/model/calculateEstimate.js`.
- Default values are centralized in `src/features/calculator/model/constants.js`.
- Low, mid, and high ranges match the original implementation logic:
	- low = total * 0.91 (rounded)
	- mid = total
	- high = total * 1.09 (rounded)

## Safe Cleanups Included

- Removed duplicate and conflicting vanilla JavaScript implementation.
- Normalized property label to `Apartment`.
- Centralized configuration and formatting logic.
