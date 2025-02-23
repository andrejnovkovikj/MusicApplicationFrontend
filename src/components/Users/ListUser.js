import React, { useEffect, useState } from "react";
import userService from "../Services/userService";
import {Link, Navigate} from 'react-router-dom';

const ListUser = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        userService.getAllUsers()
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Users</h2>

                <ul className="list-group">
                    {users.length > 0 ? (
                        users.map(user => (
                            <li key={user.id} className="list-group-item bg-dark text-white">
                                <Link to={`/users/${user.uid}`} className="text-white text-decoration-none">
                                    <h6 className="mb-0">{user.email}</h6>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No users available</li>
                    )}
                </ul>
            </div>
        </div>
    );

};

export default ListUser;
