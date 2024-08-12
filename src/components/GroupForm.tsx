import React, { useState, useEffect } from 'react';
import './Group.css';

interface Group {
  title: string;
  members: string[];
}

interface GroupFormProps {
  onCreateGroup: (newGroup: Group) => void;
  onUpdateGroup: (updatedGroup: Group) => void;
  initialGroup: Group | null;
  onNext: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onCreateGroup, onUpdateGroup, initialGroup, onNext }) => {
  const [title, setTitle] = useState(initialGroup?.title || '');
  const [members, setMembers] = useState<string[]>(initialGroup?.members || ['']);
  const [isGroupCreated, setIsGroupCreated] = useState(false);

  useEffect(() => {
    if (initialGroup) {
      setTitle(initialGroup.title);
      setMembers(initialGroup.members);
    }
  }, [initialGroup]);

  const handleMemberChange = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    if (members.length < 6) {
      setMembers([...members, '']);
    }
  };

  const handleSubmit = () => {
    const nonEmptyMembers = members.filter(member => member.trim() !== '');

    if (!title.trim()) {
      alert('Group title cannot be empty.');
      return;
    }

    if (nonEmptyMembers.length === 0) {
      alert('You must add at least one member to the group.');
      return;
    }
    
    const newGroup = { title, members: members.filter(member => member.trim() !== '') }; // Filter out empty members
    if (initialGroup) {
      onUpdateGroup(newGroup);
    } else {
      onCreateGroup(newGroup);
      setIsGroupCreated(true); // Mark group as created
    }
    setTitle('');
    setMembers(['']); // Reset to a single member input for new group
  };

  return (
    <div className="group-form">
      <h2>{initialGroup ? 'Edit Group' : 'Create Group'}</h2>
      <div className="form-group">
        <label htmlFor="title">Group Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Members:</label>
        <div className="members-inputs">
          {members.map((member, index) => (
            <input
              key={index}
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              placeholder={`Member ${index + 1}`}
            />
          ))}
        </div>
        {members.length < 6 && (
          <button onClick={addMember} className="add-member-button">Add Member</button>
        )}
      </div>
      <button onClick={handleSubmit}>{initialGroup ? 'Update Group' : 'Create Group'}</button>
      {isGroupCreated && (
        <button onClick={onNext}>Go to Expenses</button>
      )}
    </div>
  );
};

export default GroupForm;
