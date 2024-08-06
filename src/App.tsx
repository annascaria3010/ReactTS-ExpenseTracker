import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import EditExpenseForm from './components/EditExpense';
import './App.css'; 

interface Expense {
  title: string;
  amount: number;
  members: string[];
}

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState<number | null>(null);
  const [isGroupCreated, setIsGroupCreated] = useState(false);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const handleDeleteExpense = (index: number) => {
    setExpenses((prevExpenses) => prevExpenses.filter((_, i) => i !== index));
  };

  const handleEditExpense = (index: number) => {
    setCurrentExpenseIndex(index);
    setIsEditing(true);
  };

  const handleSaveExpense = (updatedExpense: Expense) => {
    if (currentExpenseIndex !== null) {
      setExpenses((prevExpenses) => prevExpenses.map((expense, index) =>
        index === currentExpenseIndex ? updatedExpense : expense
      ));
      setIsEditing(false);
      setCurrentExpenseIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentExpenseIndex(null);
  };

  const handleCreateGroup = () => {
    setIsGroupCreated(true);
  };

  return (
    <div className='App'>
      <h1 className="App-header">Expense Tracker</h1>
      {!isGroupCreated ? (
        <button className='Group-button'
        onClick={handleCreateGroup}>Create Group</button>
      ) : (
        <>
          {isEditing && currentExpenseIndex !== null ? (
            <EditExpenseForm
              expense={expenses[currentExpenseIndex]}
              onSave={handleSaveExpense}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ExpenseForm onAddExpense={handleAddExpense} />
          )}
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        </>
      )}
    </div>
  );
};

export default App;
