import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import EditExpenseForm from './components/EditExpense';
import GroupForm from './components/GroupForm';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

interface Expense {
  title: string;
  amount: number;
  members: string[];
  paidBy: string;
}

interface Group {
  title: string;
  members: string[];
  backgroundColor?: string;
}

enum View {
  Initial,
  GroupForm,
  ExpenseForm
}

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupExpenses, setGroupExpenses] = useState<Record<string, Expense[]>>({});
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState<number | null>(null);
  const [view, setView] = useState<View>(View.Initial);

  useEffect(() => {
    const savedGroups = localStorage.getItem('groups');
    const savedGroupExpenses = localStorage.getItem('groupExpenses');
    if (savedGroups) setGroups(JSON.parse(savedGroups));
    if (savedGroupExpenses) setGroupExpenses(JSON.parse(savedGroupExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('groupExpenses', JSON.stringify(groupExpenses));
  }, [groupExpenses]);

  const handleAddExpense = (expense: Expense) => {
    if (currentGroup) {
      setGroupExpenses((prevGroupExpenses) => ({
        ...prevGroupExpenses,
        [currentGroup.title]: [...(prevGroupExpenses[currentGroup.title] || []), expense],
      }));
    }
  };

  const handleDeleteExpense = (index: number) => {
    if (currentGroup) {
      setGroupExpenses((prevGroupExpenses) => ({
        ...prevGroupExpenses,
        [currentGroup.title]: prevGroupExpenses[currentGroup.title].filter((_, i) => i !== index),
      }));
    }
  };

  const handleEditExpense = (index: number) => {
    setCurrentExpenseIndex(index);
    setIsEditing(true);
  };

  const handleSaveExpense = (updatedExpense: Expense) => {
    if (currentGroup && currentExpenseIndex !== null) {
      setGroupExpenses((prevGroupExpenses) => ({
        ...prevGroupExpenses,
        [currentGroup.title]: prevGroupExpenses[currentGroup.title].map((expense, index) =>
          index === currentExpenseIndex ? updatedExpense : expense
        ),
      }));
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
    setGroupExpenses((prevGroupExpenses) => ({
      ...prevGroupExpenses,
      [groupWithColor.title]: [], // Initialize expenses for the new group
    }));
    setCurrentGroup(groupWithColor);
    setView(View.ExpenseForm);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    if (currentGroup) {
      setGroups((prevGroups) => prevGroups.map(group =>
        group.title === currentGroup.title ? { ...updatedGroup, backgroundColor: currentGroup.backgroundColor } : group
      ));
      setGroupExpenses((prevGroupExpenses) => {
        const { [currentGroup.title]: removedGroup, ...rest } = prevGroupExpenses;
        return {
          ...rest,
          [updatedGroup.title]: removedGroup || [], // Keep expenses for the updated group title
        };
      });
      setCurrentGroup(updatedGroup);
      setView(View.ExpenseForm);
    }
  };

  const handleDeleteGroup = (index: number) => {
    const groupToDelete = groups[index];
    if (groupToDelete) {
      setGroups((prevGroups) => prevGroups.filter((_, i) => i !== index));
      setGroupExpenses((prevGroupExpenses) => {
        const { [groupToDelete.title]: _, ...rest } = prevGroupExpenses;
        return rest;
      });
    }
  };

  const handleGoBack = () => {
    if (currentGroup) {
      localStorage.setItem('groups', JSON.stringify(groups));
      localStorage.setItem('groupExpenses', JSON.stringify(groupExpenses));
    }
    setView(View.GroupForm);
  };

  const handleGoBackToInitial = () => {
    setView(View.Initial);
  };

  const handleAddGroupClick = () => {
    setCurrentGroup(null);
    setView(View.GroupForm);
  };

  const handleGroupClick = (group: Group) => {
    setCurrentGroup(group);
    setView(View.ExpenseForm);
  };

  const handleGoToNext = () => {
    if (currentGroup) {
      setView(View.ExpenseForm);
    }
  };

  // Function to calculate the total expenses for a group
  const calculateTotalExpense = (group: Group) => {
    return (groupExpenses[group.title] || []).reduce((total, expense) => total + expense.amount, 0);
  };

  const getOwesList = (group: Group) => {
    return (groupExpenses[group.title] || [])
      .filter(expense => expense.members.some(member => group.members.includes(member)))
      .flatMap(expense =>
        expense.members
          .filter(member => member !== expense.paidBy)
          .map(member => ({
            payer: expense.paidBy,
            member,
            amount: (expense.amount / expense.members.length).toFixed(2),
            title: expense.title
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
          <button className="go-back-button" onClick={view === View.ExpenseForm ? handleGoBack : handleGoBackToInitial}>
            Go Back
          </button>
        )}
        <span className="header">Expense Tracker</span>
      </h1>
      {view === View.Initial && (
        <>
          <p className="message">Click on the plus to create a group</p>
          <button onClick={handleAddGroupClick} className="add-group-button">
            <i className="fas fa-plus"></i>
          </button>
          <div className="group-list">
            {groups.map((group, index) => (
              <div
                key={index}
                className="group-item"
                onClick={() => handleGroupClick(group)}
                style={{ backgroundColor: group.backgroundColor }}
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
        expense={groupExpenses[(currentGroup as Group).title][currentExpenseIndex]} // Ensure this is a valid `Expense`
        onSave={handleSaveExpense}
        onCancel={handleCancelEdit}
        members={(currentGroup as Group).members}
      />
    ) : (
      <ExpenseForm
        onSubmit={handleAddExpense}
        members={(currentGroup as Group).members}
      />
    )}
    <ExpenseList
      expenses={groupExpenses[(currentGroup as Group).title] || []} // Use expenses for the current group
      onDelete={handleDeleteExpense}
      onEdit={handleEditExpense}
      members={(currentGroup as Group).members}
    />
  </>
)}

    </div>
  );
};

export default App;
