import React from 'react';
import './List.css';

interface Expense {
  title: string;
  amount: number;
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
          <span className="expense-item-title">{expense.title} :</span>
          <span className="expense-item-amount">RS.{expense.amount.toFixed(2)}</span>
          
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
