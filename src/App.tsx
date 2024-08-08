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
}

interface Group {
  title: string;
  members: string[];
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
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setCurrentGroup(newGroup);
    setExpenses([]); // Reset expenses for the new group
    setView(View.ExpenseForm);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    if (currentGroup) {
      setGroups((prevGroups) => prevGroups.map(group =>
        group.title === currentGroup.title ? updatedGroup : group
      ));
      setCurrentGroup(updatedGroup);
      // If navigating to the expense form, keep existing expenses
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

  return (
    <div>
      <h1 className='header' >
        {(view === View.ExpenseForm || view === View.GroupForm) && (
          <button onClick={view === View.ExpenseForm ? handleGoBack : handleGoBackToInitial} className="go-back-button">
            Go Back
          </button>
        )}
        Expense Tracker
      </h1>
      {view === View.Initial && (
        <>
          <p className="message">Click on the plus to create a group</p>
          <button onClick={handleAddGroupClick} className="add-group-button">
            <i className="fas fa-plus"> </i>
          </button>
          <div className="group-list">
            {groups.map((group, index) => (
              <div key={index} className="group-item" onClick={() => handleGroupClick(group)}>
                <div className="group-details">
                  <h2>{group.title}</h2>
                  <ul>
                    {group.members.map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
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
