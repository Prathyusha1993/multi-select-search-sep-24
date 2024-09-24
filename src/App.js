import './App.css';
import { useEffect, useRef, useState } from 'react';
import Pill from './components/Pill';

// https://dummyjson.com/users/search?q=${searchTerm}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = () => {
      if(searchTerm.trim() === '') {
        setSuggestions([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setSuggestions(data))
      .catch((error) => console.log(error))
    };
    return fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm('');
    setSuggestions([]);
    inputRef.current.focus();
  }

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter((selectedUser) => selectedUser.id !== user.id);
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  }

  const handleKeyDown = (e) => {
    if(e.key === 'Backspace' && e.target.value === '' && selectedUsers.length > 0) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  }

  return (
    <div className="App">
      <h1>Multi Select Search Using React</h1>
      {selectedUsers.map((user) => {
        return <Pill key={user.email}
        image={user.image}
        text={`${user.firstName} ${user.lastName}`}
        onClick={() => handleRemoveUser(user)} />
      })}
      <div className='user-search-input'>
        <input ref={inputRef} placeholder='Enter Your Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
        <ul className='suggestions-list'>
          {suggestions?.users?.map((user) => {
            return !selectedUserSet.has(user.email) ? (<li key={user.email} onClick={() => handleSelectUser(user)}>
              <img src={user.image} alt={`${user.firstName}`} />
              <span>{`${user.firstName} ${user.lastName}`}</span>
            </li>) : <></>
})}
        </ul>
      </div>
    </div>
  );
}

export default App;
