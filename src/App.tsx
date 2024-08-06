import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import EditExpenseForm from './components/EditExpense';
import GroupForm from './components/GroupForm';
import './App.css'; // Import the CSS file

interface Expense {
  title: string;
  amount: number;
  members: string[];
}

interface Group {
  title: string;
  members: string[];
}

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState<number | null>(null);

  const handleAddExpense = (expense: { title: string; amount: number }) => {
    if (group) {
      setExpenses((prevExpenses) => [...prevExpenses, { ...expense, members: group.members }]);
    }
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

  const handleCreateGroup = (newGroup: Group) => {
    setGroup(newGroup);
  };

  return (
    <div>
      <h1 className="header">Expense Tracker</h1>
      {!group ? (
        <GroupForm onCreateGroup={handleCreateGroup} />
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
