import React from 'react';
import './List.css';

interface Expense {
  title: string;
  amount: number;
  members: string[];
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  members: string[]; // Pass the list of group members
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit, members }) => {
  return (
    <ul>
      {expenses.map((expense, index) => {
        const numMembers = expense.members.length;
        const amountPerMember = numMembers > 0 ? expense.amount / numMembers : 0;

        return (
          <li key={index} className="expense-item">
            <div>
              <span className="expense-item-title">{expense.title}: </span>
              <span className="expense-item-amount">
                Rs. {expense.amount.toFixed(2)} (Split with {numMembers} member{numMembers > 1 ? 's' : ''})
              </span>
            </div>
            <div className="expense-item-details">
              {numMembers > 0 && (
                <p>Amount per member: Rs. {amountPerMember.toFixed(2)}</p>
              )}
            </div>
            <div className="expense-item-buttons">
              <button
                className="expense-item-edit"
                onClick={() => onEdit(index)}
              >
                Edit
              </button>
              <button
                className="expense-item-delete"
                onClick={() => onDelete(index)}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ExpenseList;
