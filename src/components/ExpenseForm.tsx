import React, { useState } from 'react';
import './Form.css'; // Import the CSS file

interface ExpenseFormProps {
  onAddExpense: (expense: { title: string; amount: number }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddExpense({ title, amount });
    setTitle('');
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
