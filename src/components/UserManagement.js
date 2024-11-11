import React, { useState, useEffect } from 'react';

function UserManagement({ showNotification, setIsLoggedIn, isLoginMode }) {
    const [users, setUsers] = useState([]);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [addUsername, setAddUsername] = useState('');
    const [addPassword, setAddPassword] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editingUserIndex, setEditingUserIndex] = useState(null);

    
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);
    }, []);

    const handleLogin = () => {
        if (users.length === 0) {
            showNotification('No users found. Please sign up first.');
            return;
        }

        const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
        if (user) {
            setIsLoggedIn(true);
            showNotification(`Welcome, ${user.username}!`);
            setLoginUsername('');
            setLoginPassword('');
        } else {
            showNotification('Invalid username or password.');
        }
    };

    const handleAddUser = () => {
        const existingUser = users.find(user => user.username === addUsername);
        if (existingUser) {
            showNotification('User already exists. Please choose a different username.');
            return;
        }

        const newUser = { username: addUsername, password: addPassword };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        showNotification(`User ${addUsername} added successfully. Logging you in now...`);

        
        setLoginUsername(addUsername);
        setLoginPassword(addPassword);
        handleLogin(); 

      
        setAddUsername('');
        setAddPassword('');
    };

    const handleEditUser = () => {
        const updatedUsers = users.map((user, index) => 
            index === editingUserIndex ? { username: editUsername, password: editPassword } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        showNotification(`User ${editUsername} updated successfully.`);
        setEditUsername('');
        setEditPassword('');
        setEditingUserIndex(null);
    };

    const handleDeleteUser = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        showNotification('User deleted successfully.');
    };

    const handleStartEdit = (user, index) => {
        setEditUsername(user.username);
        setEditPassword(user.password);
        setEditingUserIndex(index);
    };

    return (
        <div className="user-management">
            {isLoginMode || users.length === 0 ? (
                <>
                    <h3>Login</h3>
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    {users.length === 0 && <p>No users found. Please sign up below.</p>}
                </>
            ) : null}

            <h2>User Management</h2>
            <h3>Add User</h3>
            <input
                type="text"
                placeholder="Username"
                value={addUsername}
                onChange={(e) => setAddUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
            />
            <button onClick={handleAddUser}>Sign Up</button>

            {!isLoginMode && users.length > 0 && (
                <>
                    <h3>Manage Users</h3>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>
                                {user.username}
                                <button onClick={() => handleStartEdit(user, index)}>Edit</button>
                                <button onClick={() => handleDeleteUser(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>

                    {editingUserIndex !== null && (
                        <div>
                            <h3>Edit User</h3>
                            <input
                                type="text"
                                placeholder="Username"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                            />
                            <button onClick={handleEditUser}>Update User</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default UserManagement;