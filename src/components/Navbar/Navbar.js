import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from "../Authorization/Logout";
import React, { useRef } from "react";

const Navbar = ({ user }) => {
    const navbarToggleRef = useRef(null);

    const closeNavbar = () => {
        if (navbarToggleRef.current) {
            navbarToggleRef.current.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Music Application</Link>

                <button
                    ref={navbarToggleRef}
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/artists" className="nav-link" onClick={closeNavbar}>Artists</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/albums" className="nav-link" onClick={closeNavbar}>Albums</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/songs" className="nav-link" onClick={closeNavbar}>Songs</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/playlists" className="nav-link" onClick={closeNavbar}>Playlists</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/concerts" className="nav-link" onClick={closeNavbar}>Concerts</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/users" className="nav-link" onClick={closeNavbar}>Users</Link>
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
                                <Link to="/login" className="btn btn-outline-light me-2" onClick={closeNavbar}>Login</Link>
                                <Link to="/register" className="btn btn-light" onClick={closeNavbar}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
