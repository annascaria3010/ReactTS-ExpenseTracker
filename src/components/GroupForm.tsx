import React, { useState, useEffect } from 'react';

interface GroupFormProps {
  onCreateGroup: (group: { title: string; members: string[] }) => void;
  onUpdateGroup: (group: { title: string; members: string[] }) => void; // New prop for updating group
  initialGroup: { title: string; members: string[] } | null;
  onNext: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onCreateGroup, onUpdateGroup, initialGroup, onNext }) => {
  const [title, setTitle] = useState(initialGroup ? initialGroup.title : '');
  const [members, setMembers] = useState(initialGroup ? initialGroup.members : ['']);

  useEffect(() => {
    if (initialGroup) {
      setTitle(initialGroup.title);
      setMembers(initialGroup.members);
    } else {
      setTitle('');
      setMembers(['']);
    }
  }, [initialGroup]);

  const handleAddMember = () => {
    if (members.length < 6) {
      setMembers([...members, '']);
    }
  };

  const handleMemberChange = (index: number, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialGroup) {
      onUpdateGroup({ title, members: members.filter(member => member.trim() !== '') });
    } else {
      onCreateGroup({ title, members: members.filter(member => member.trim() !== '') });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Group Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Members:</label>
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            value={member}
            onChange={(e) => handleMemberChange(index, e.target.value)}
          />
        ))}
        {members.length < 6 && <button type="button" onClick={handleAddMember}>Add Member</button>}
      </div>
      <button type="submit">{initialGroup ? 'Update Group' : 'Create Group'}</button>
      <button type="button" onClick={onNext}>Go to Next</button>
    </form>
  );
};

export default GroupForm;
