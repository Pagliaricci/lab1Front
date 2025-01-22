import React, { useEffect, useState } from 'react';

interface User {
    nickName: string;
    fullName: string;
}

interface UserListProps {
    setSelectedUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ setSelectedUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const nickname = localStorage.getItem('nickname') || '';

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:8081/users');
            const data = await response.json();
            setUsers(data.filter((user: User) => user.nickName !== nickname));
        };
        fetchUsers();
    }, [nickname]);

    return (
        <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Online Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.nickName} onClick={() => setSelectedUser(user.nickName)} className="flex items-center p-2 cursor-pointer hover:bg-gray-200">
                        <img src="../img/user_icon.png" alt={user.fullName} className="w-10 h-10 rounded-full mr-2" />
                        <span>{user.fullName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;