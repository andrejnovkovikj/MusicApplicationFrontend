import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from "../Authorization/Logout";
import React from "react";

const Navbar = ({ user }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Music Application</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/artists" className="nav-link">Artists</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/albums" className="nav-link">Albums</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/songs" className="nav-link">Songs</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/playlists" className="nav-link">Playlists</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/concerts" className="nav-link">Concerts</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/users" className="nav-link">Users</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {user ? (
                            <>
                                <span className="text-white me-3">
                                    Welcome, <Link to={`/users/${user.uid}`} className="text-white text-decoration-underline">{user.email}</Link>
                                </span>
                                <Logout />
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                                <Link to="/register" className="btn btn-light">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
