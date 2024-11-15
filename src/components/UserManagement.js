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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            showNotification('Error fetching users.');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUsername, password: loginPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setIsLoggedIn(true);
            showNotification(`Welcome, ${data.user.username}!`);
            setLoginUsername('');
            setLoginPassword('');
        } catch (error) {
            showNotification('Invalid username or password.');
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: addUsername, password: addPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showNotification(`User ${data.user.username} added successfully. Logging you in now...`);
            setLoginUsername(addUsername);
            setLoginPassword(addPassword);
            handleLogin();
            setAddUsername('');
            setAddPassword('');
        } catch (error) {
            showNotification(error.message);
        }
    };

    const handleEditUser = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: users[editingUserIndex].username,
                    password: editPassword,
                    newUsername: editUsername,
                    newPassword: editPassword,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showNotification(`User ${data.user.username} updated successfully.`);
            fetchUsers(); 
            setEditUsername('');
            setEditPassword('');
            setEditingUserIndex(null);
        } catch (error) {
            showNotification(error.message);
        }
    };

    const handleDeleteUser = async (index) => {
        const username = users[index].username;
        try {
            const response = await fetch(`http://localhost:3000/api/users/${username}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error deleting user.');
            showNotification('User deleted successfully.');
            fetchUsers(); 
        } catch (error) {
            showNotification(error.message);
        }
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
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>
                                        <button onClick={() => handleStartEdit(user, index)}>Edit</button>
                                        <button onClick={() => handleDeleteUser(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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