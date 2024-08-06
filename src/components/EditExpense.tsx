import React, { useState, useEffect } from 'react';

interface EditExpenseFormProps {
  expense: { title: string; amount: number; members: string[] };
  onSave: (updatedExpense: { title: string; amount: number; members: string[]  }) => void;
  onCancel: () => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onSave, onCancel }) => {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [members, setMembers] = useState(expense.members);

  useEffect(() => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setMembers(expense.members);
  }, [expense]);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    if (members.length < 6) {
      setMembers([...members, '']);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ title, amount, members });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-title">Title</label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="edit-amount">Amount</label>
        <input
          type="number"
          id="edit-amount"
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
     
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditExpenseForm;
