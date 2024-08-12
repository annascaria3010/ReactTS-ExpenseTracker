import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import EditExpenseForm from './components/EditExpense';
import GroupForm from './components/GroupForm';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'; // Import the CSS file

interface Expense {
  title: string;
  amount: number;
  members: string[];
  paidBy: string;
}

interface Group {
  title: string;
  members: string[];
  backgroundColor?: string; // Add an optional backgroundColor property
}

enum View {
  Initial,
  GroupForm,
  ExpenseForm
}

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState<number | null>(null);
  const [view, setView] = useState<View>(View.Initial);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedGroups = localStorage.getItem('groups');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedGroups) setGroups(JSON.parse(savedGroups));
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

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

  const handleCreateGroup = (newGroup: Group) => {
    if (!newGroup.title) {
      alert('Group title cannot be empty.');
      return;
    }
    const groupWithColor = {
      ...newGroup,
      backgroundColor: getRandomColor(),
    };
    setGroups((prevGroups) => [...prevGroups, groupWithColor]);
    setCurrentGroup(groupWithColor);
    setExpenses([]); // Reset expenses for the new group
    setView(View.ExpenseForm);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    if (currentGroup) {
      setGroups((prevGroups) => prevGroups.map(group =>
        group.title === currentGroup.title ? { ...updatedGroup, backgroundColor: currentGroup.backgroundColor } : group
      ));
      setCurrentGroup(updatedGroup);
      setView(View.ExpenseForm);
    }
  };

  const handleDeleteGroup = (index: number) => {
    setGroups((prevGroups) => prevGroups.filter((_, i) => i !== index));
  };

  const handleGoBack = () => {
    if (currentGroup) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('groups', JSON.stringify(groups));
    }
    setView(View.GroupForm);
  };

  const handleGoBackToInitial = () => {
    setView(View.Initial);
  };

  const handleAddGroupClick = () => {
    setCurrentGroup(null); // Reset currentGroup to clear the form
    setView(View.GroupForm);
  };

  const handleGroupClick = (group: Group) => {
    setCurrentGroup(group);
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    setView(View.ExpenseForm);
  };

  const handleGoToNext = () => {
    if (currentGroup) {
      setView(View.ExpenseForm);
    }
  };

  // Function to calculate the total expenses for a group
  const calculateTotalExpense = (group: Group) => {
    return expenses
      .filter(expense => expense.members.some(member => group.members.includes(member)))
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getOwesList = (group: Group) => {
    return expenses
      .filter(expense => expense.members.some(member => group.members.includes(member)))
      .flatMap(expense =>
        expense.members
          .filter(member => member !== expense.paidBy)
          .map(member => ({
            payer: expense.paidBy,
            member,
            amount: (expense.amount / expense.members.length).toFixed(2),
            title: expense.title // Include the expense title in the output
          }))
      );
  };

  // Helper function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h1>
        {(view === View.ExpenseForm || view === View.GroupForm) && (
          <button className="go-back-button"
          onClick={view === View.ExpenseForm ? handleGoBack : handleGoBackToInitial} >
            Go Back
          </button>
        )}
        <span className="header">Expense Tracker</span>
      </h1>
      {view === View.Initial && (
        <>
          <p className="message">Click on the plus to create a group</p>
          <button onClick={handleAddGroupClick} className="add-group-button">
            <i className="fas fa-plus"> </i>
          </button>
          <div className="group-list">
            {groups.map((group, index) => (
              <div
                key={index}
                className="group-item"
                onClick={() => handleGroupClick(group)}
                style={{ backgroundColor: group.backgroundColor }} // Apply the random background color
              >
                <div className="group-details">
                  <h2>
                    {group.title}
                    <span className="total-expense">
                      Rs. {calculateTotalExpense(group).toFixed(2)}
                    </span>
                  </h2>
                  <ul>
                    {group.members.map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                  <div className="owes-list">
                    {getOwesList(group).map((oweItem, i) => (
                      <p key={i} className="owes-item">
                        {oweItem.member} owes {oweItem.payer} Rs. {oweItem.amount} for {oweItem.title}
                      </p>
                    ))}
                  </div>
                </div>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering group click
                  handleDeleteGroup(index);
                }} className="delete-button">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {view === View.GroupForm && (
        <GroupForm
          onCreateGroup={handleCreateGroup}
          onUpdateGroup={handleUpdateGroup}
          initialGroup={currentGroup}
          onNext={handleGoToNext}
        />
      )}
      {view === View.ExpenseForm && (
        <>
          {isEditing && currentExpenseIndex !== null ? (
            <EditExpenseForm
              expense={expenses[currentExpenseIndex]}
              onSave={handleSaveExpense}
              onCancel={handleCancelEdit}
              members={currentGroup ? currentGroup.members : []} // Pass members prop
            />
          ) : (
            <ExpenseForm
              onSubmit={handleAddExpense}
              members={currentGroup ? currentGroup.members : []} // Pass members prop
            />
          )}
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
            members={currentGroup?.members || []} // Pass the current group's members
          />
        </>
      )}
    </div>
  );
};

export default App;
