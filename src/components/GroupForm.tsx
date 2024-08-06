import React, { useState } from 'react';


interface GroupFormProps {
  onCreateGroup: (group: { title: string; members: string[] }) => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onCreateGroup }) => {
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<string[]>(['']);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateGroup({ title, members });
    setTitle('');
    setMembers(['']);
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleAddMember = () => {
    if (members.length < 6) {
      setMembers([...members, '']);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Group Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Members</label>
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            value={member}
            onChange={(e) => handleMemberChange(index, e.target.value)}
            placeholder={`Member ${index + 1}`}
          />
        ))}
        {members.length < 6 && (
          <button type="button" onClick={handleAddMember}>
            Add Member
          </button>
        )}
      </div>
      <button type="submit">Create Group</button>
    </form>
  );
};

export default GroupForm;
