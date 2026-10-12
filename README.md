# ExpenseFlow — Personal Expense & Budget Management Dashboard

A responsive personal finance dashboard built with **React.js**, **JavaScript**, **HTML5**, and **CSS3** to track income, expenses, and monthly budgets.

![ExpenseFlow Dashboard](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Design-1572B6?logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Key Features

- **Responsive Personal Finance Dashboard**: Built with a sleek desktop sidebar and collapsible mobile drawer navigation across Dashboard, Transactions, Budget Planner, and Analytics.
- **Transaction Management**: Add, edit, delete, search, and filter transactions in real time using React state and JavaScript array methods.
- **Dynamic Financial Calculations**: Built using `filter()` and `reduce()` for:
  - Total Net Balance
  - Total Inflow (Income) & Outflow (Expenses)
  - Remaining Monthly Budget
  - Category-wise Spending Breakdown
  - Monthly Savings Rate (%)
- **Persistent Storage**: Integrated `localStorage` for transactions, custom budget thresholds, and user theme preferences.
- **Theme & Currency Support**: Responsive Dark and Light mode with persistent preferences and multi-currency formatting (`$`, `€`, `£`, `₹`, `¥`, `CAD`, `AUD`).
- **Data Export & Reset**: Instant CSV export of transactions and quick demo data restore.

---

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism, Micro-animations)
- **Typography**: Inter & Sora (Google Fonts)
- **Icons**: Custom SVG Icons

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Surajnitp/ExpenseFlow.git
cd ExpenseFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
The application will be live at `http://localhost:5173/`.

### 4. Build for production
```bash
npm run build
```

---

## License
MIT License.
