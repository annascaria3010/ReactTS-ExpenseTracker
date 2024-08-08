import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import './Edit.css'; // Make sure to update CSS if needed

interface Expense {
  title: string;
  amount: number;
  members: string[];
}

interface EditExpenseFormProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
  members: string[];
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onSave, onCancel, members }) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(expense.members);

  useEffect(() => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setSelectedMembers(expense.members);
  }, [expense]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || amount <= 0 || selectedMembers.length === 0) {
      alert('Please fill in all fields correctly.');
      return;
    }
    onSave({ title, amount, members: selectedMembers });
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
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Title:</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-amount">Amount:</label>
          <input
            type="number"
            id="edit-amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
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
        <button className="add-button" type="submit">Save</button>
        <button className='cancel-button' type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditExpenseForm;
