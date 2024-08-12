import React from 'react';
import './List.css';

// Function to generate a random color in hex format
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface Expense {
  title: string;
  amount: number;
  members: string[];
  paidBy: string; // New property to track who paid
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  members: string[]; // Pass the list of group members
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit, members }) => {
  // Calculate the total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="expense-list-container">
      {/* Display the total expenses at the top */}
      <div className="total-expenses">
        <h2>Total Expenses: Rs. {totalExpenses.toFixed(2)}</h2>
      </div>

      <ul>
        {expenses.map((expense, index) => {
          const numMembers = expense.members.length;
          const amountPerMember = numMembers > 0 ? expense.amount / numMembers : 0;
          const backgroundColor = getRandomColor(); // Get a random color for each expense item

          return (
            <li
              key={index}
              className="expense-item"
              style={{ backgroundColor }}
            >
              <div className="display">
                <div>
                  <span className="expense-item-title">{expense.title}: </span>
                  <span className="expense-item-amount">
                    Rs. {expense.amount.toFixed(2)} (Split with: {expense.members.join(', ')})
                  </span>
                </div>
                <div className="expense-item-details">
                  {numMembers > 0 && (
                    <>
                      <p>PER PERSON: Rs. {amountPerMember.toFixed(2)}</p>
                      <div className="owes-container">
                        <strong>Owes:</strong>
                        <ul>
                          {expense.members
                            .filter(member => member !== expense.paidBy)
                            .map((member, i) => (
                              <li key={i} className="owes-item">
                                {member} owes {expense.paidBy} Rs. {amountPerMember.toFixed(2)}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
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
    </div>
  );
};

export default ExpenseList;
