import React, { useState, useEffect } from "react";
import artistService from "../Services/artistService";
import {Link, Navigate} from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import axios from "axios";

const ListArtist = ({ user }) => {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin,setIsAdmin] = useState(false);


    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await artistService.getAllArtists();
                setArtists(data);
            } catch (error) {
                console.error("Error fetching artists: ", error);
            }
        };
        const fetchIsAdmin = async () => {
            if(user){
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    if(!response.ok) throw new Error("Failed to fetch admin status");

                    const adminStatus = await response.json();
                    if(adminStatus === "ADMIN"){
                        setIsAdmin(true);
                    }else{
                        setIsAdmin(false);
                    }
                }catch (error){
                    console.error("Error getting admin status:",error);
                }
            }
        };
        fetchIsAdmin();
        fetchArtists();
    }, [user]);


    const filteredArtists = artists.filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (artists.length > 0 && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [artists, isAdmin]);
    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4"
                 style={{width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff"}}>
                <h2 className="text-center mb-4">Artists</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for an artist..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ul className="list-group">
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                            <li
                                key={artist.id}
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
                                <Link to={`/artists/${artist.id}`} className="text-white text-decoration-none">

                                <div className="d-flex align-items-center">
                                    <img
                                        className="rounded-circle"
                                        src={artist.imageUrl}
                                        alt={artist.name}
                                        style={{width: "40px", height: "40px", objectFit: "cover", marginRight: "10px"}}
                                    />
                                        {artist.name}
                                </div>
                                </Link>

                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No artists found</li>
                    )}
                </ul>
                <div className="d-flex justify-content-center">
                    {isAdmin &&
                        <Link to="/artists/create" className="btn btn-primary mt-3 col-md-6">Create New Artist</Link>}
                </div>
            </div>
        </div>
    );
};

export default ListArtist;
