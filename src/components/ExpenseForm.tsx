import React, { useState } from 'react';
import './Form.css';

interface ExpenseFormProps {
  onAddExpense: (expense: { title: string; amount: number; members: string[] }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [members, setMembers] = useState<string[]>(['']);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddExpense({ title, amount, members });
    setTitle('');
    setAmount(0);
    setMembers(['']);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    if (members.length < 6) {
      setMembers([...members, '']);
    }
    }
  

  return (
    <form onSubmit={handleSubmit}>
      <div className='title'>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className='amount'>
        <label htmlFor="amount">Amount: </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Members</label>
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            value={member}
            onChange={(e) => handleMemberChange(index, e.target.value)}
            placeholder={`Member ${index + 1}`}
          />
        ))}
        {members.length < 6 && (
          <button type="button" onClick={handleAddMember}>
            Add Member
          </button>
        )}
      </div>
      <button className="add-button"
      type="submit">Add Expense</button>
      
    </form>
  );
};

export default ExpenseForm;
