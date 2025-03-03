import React, { useState, useEffect } from "react";
import playlistService from "../Services/playlistService";
import { Link } from "react-router-dom";
import {Nav} from "react-bootstrap";

const ListPlaylists = ({ user }) => {
    const [playlists, setPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUserLoggedIn , setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const data = await playlistService.getAllPlaylists();
                setPlaylists(data);
            } catch (error) {
                console.error("Error fetching playlists : ", error);
            }
        };

        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    if (!response.ok) throw new Error("Failed to fetch admin status");

                    const adminStatus = await response.json();
                    setIsUserLoggedIn(true);
                    if (adminStatus === "ADMIN") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Error getting admin status:", error);
                }
            }
        };

        fetchIsAdmin();
        fetchPlaylists();
    }, [user]);

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (playlists.length > 0 && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [playlists, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;
    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Playlists</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for a playlist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ul className="list-group">
                    {filteredPlaylists.length > 0 ? (
                        filteredPlaylists.map((playlist) => (
                            <li
                                key={playlist.id}
                                className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white"
                                style={{
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    transform: "scale(1)",
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <Link to={`/playlists/${playlist.id}`} className="text-white text-decoration-none">
                                    <div className="d-flex align-items-center">
                                        <img
                                            className="rounded-circle"
                                            src={playlist.imageUrl}
                                            alt={playlist.name}
                                            style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                                        />
                                        {playlist.name}
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No playlists found</li>
                    )}
                </ul>

                <div className="d-flex justify-content-center">
                    {isUserLoggedIn && (
                        <Link to="/playlists/create" className="btn btn-primary mt-3 col-md-6">
                            Create New Playlist
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListPlaylists;
