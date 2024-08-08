import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import './Form.css';

interface Expense {
  title: string;
  amount: number;
  members: string[];
}

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  members: string[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, members }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || amount === undefined || amount <= 0 || selectedMembers.length === 0) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const newExpense: Expense = {
      title,
      amount,
      members: selectedMembers
    };
    onSubmit(newExpense);
    setTitle('');
    setAmount(undefined);
    setSelectedMembers([]);
  };

  const handleMemberSelect = (member: string) => {
    setSelectedMembers(prevSelectedMembers =>
      prevSelectedMembers.includes(member)
        ? prevSelectedMembers.filter(m => m !== member)
        : [...prevSelectedMembers, member]
    );
  };

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>
      <div className="title">
        <label htmlFor="expense-title">Title:</label>
        <input
          type="text"
          id="expense-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="amount">
        <label htmlFor="expense-amount">Amount:</label>
        <input
          type="number"
          id="expense-amount"
          value={amount === undefined ? '' : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div className="title">
        <label htmlFor="split-with">Split with:</label>
        <div id="split-with">
          {members.map((member, index) => (
            <div
              key={index}
              className={`member-option ${selectedMembers.includes(member) ? 'selected' : ''}`}
              onClick={() => handleMemberSelect(member)}
            >
              <i className={`fas ${selectedMembers.includes(member) ? 'fa-check-square' : 'fa-square'}`}></i>
              <span>{member}</span>
            </div>
          ))}
        </div>
        <p>Selected members: {selectedMembers.length}</p>
      </div>
      <button className='add-button'
      onClick={handleSubmit}>Add Expense</button>
    </div>
  );
};

export default ExpenseForm;
