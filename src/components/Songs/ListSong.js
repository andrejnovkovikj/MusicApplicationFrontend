import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import songService from "../Services/songService";

const ListSong = ({ user }) => {
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songData = await songService.getAllSongs();
                setSongs(songData);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        const fetchLikedSongs = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend.onrender.com/api/songs/${user.email}/liked-songs`);
                    if (!response.ok) throw new Error("Failed to fetch liked songs");
                    const likedSongsData = await response.json();
                    setLikedSongs(likedSongsData.map(song => song.id));
                } catch (error) {
                    console.error("Error fetching liked songs:", error);
                }
            }
        };

        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend.onrender.com/api/users/${user.uid}/role`);
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === 'ADMIN');
                } catch (error) {
                    console.error("Error fetching admin status:", error);
                }
            }
        };

        fetchIsAdmin();
        fetchSongs();
        fetchLikedSongs();
    }, [user]);

    const handleLike = async (songId) => {
        if (!user) return alert("You need to be logged in to like a song.");
        try {
            await songService.likeSong(user.email, songId);
            setLikedSongs([...likedSongs, songId]);
        } catch (error) {
            console.error("Error liking the song:", error);
        }
    };

    const handleUnlike = async (songId) => {
        if (!user) return alert("You need to be logged in to unlike a song.");
        try {
            await songService.unlikeSong(user.email, songId);
            setLikedSongs(likedSongs.filter(id => id !== songId));
        } catch (error) {
            console.error("Error unliking the song:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this song?")) {
            try {
                await songService.deleteSong(id);
                setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
                alert("Song deleted successfully!");
            } catch (error) {
                console.error("Error deleting song:", error);
                alert("Failed to delete the song.");
            }
        }
    };

    const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Songs</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for a song..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="list-group">
                    {filteredSongs.length > 0 ? (
                        filteredSongs.map((song) => (
                            <li
                                key={song.id}
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
                                <Link to={`/songs/${song.id}`} className="text-white text-decoration-none">
                            <div className="d-flex align-items-center">
                                    <img
                                        src={song.album.imageUrl}
                                        alt={song.title}
                                        className="rounded"
                                        style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                                    />
                                    <div>
                                            {song.title}
                                        <br />
                                        <small>{song.album.title}</small>
                                    </div>
                                </div>
                                </Link>

                                <div className="d-flex justify-content-center p-3">
                                    <button
                                        className={`btn ${likedSongs.includes(song.id) ? "btn-danger" : "btn-outline-danger"}`}
                                        onClick={() => likedSongs.includes(song.id) ? handleUnlike(song.id) : handleLike(song.id)}
                                    >
                                        {likedSongs.includes(song.id) ? "Unlike ❤️" : "Like ♡"}
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No songs available</li>
                    )}
                </ul>
                <div className="d-flex justify-content-center">
                    {isAdmin && <Link to="/songs/create" className="btn btn-primary mt-3 col-md-6">Create New Song</Link>}
                </div>
            </div>
        </div>
    );


};

export default ListSong;
