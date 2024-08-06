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
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete,onEdit }) => {
  return (
    <ul>
      {expenses.map((expense, index) => (
        <li key={index} className="expense-item">
         <div>
            <span className="expense-item-title">{expense.title}</span>
            <span className="expense-item-amount">${expense.amount.toFixed(2)}</span>
            <div className="expense-item-members">
              {expense.members.map((member, idx) => (
                <span key={idx} className="expense-item-member">
                  {member}
                </span>
              ))}
            </div>
          </div>
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
          

        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
