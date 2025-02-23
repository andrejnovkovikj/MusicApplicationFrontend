import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import songService from "../Services/songService";

const DetailsSong = ({ user }) => {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [liked, setLiked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const songData = await songService.getSongById(id);
                setSong(songData);
            } catch (error) {
                console.error("Error fetching song details:", error);
            }
        };

        const fetchLikedSongs = async () => {
            try {
                const response = await fetch(`https://musicapplicationbackend.onrender.com/api/songs/${user.email}/liked-songs`);
                if (!response.ok) throw new Error("Failed to fetch liked songs");

                const likedSongs = await response.json();
                const isLiked = likedSongs.some((likedSong) => likedSong.id.toString() === id);
                setLiked(isLiked);
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            }
        };

        const fetchIsAdmin = async () => {
            try {
                const response = await fetch(`https://musicapplicationbackend.onrender.com/api/users/${user.uid}/role`);
                const isAdminResponse = await response.json();
                setIsAdmin(isAdminResponse === 'ADMIN');
            } catch (error) {
                console.error("Error fetching admin status:", error);
            }
        };

        fetchIsAdmin();
        fetchSongData();
        fetchLikedSongs();
    }, [user, id]);

    const handleLike = async () => {
        if (!user) {
            alert("You need to be logged in to like a song.");
            return;
        }

        try {
            if (liked) {
                await songService.unlikeSong(user.email, id);
            } else {
                await songService.likeSong(user.email, id);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this song?")) {
            try {
                await songService.deleteSong(id);
                alert("Song deleted successfully!");
                window.location.href = "/songs";
            } catch (error) {
                console.error("Error deleting song:", error);
                alert("Failed to delete the song.");
            }
        }
    };

    if (!song) return <div>Error: Song not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center">{song.title}</h2>
                <Link to={`/albums/${song.album.id}`} className="list-group-item">
                    <h3 className="text-center mb-3">{song.album.title}</h3>
                </Link>
                <Link to={`/artists/${song.artist.id}`} className="list-group-item">
                    <h6 className="text-center mb-3"> by {song.artist.name}</h6>
                </Link>

                <div className="d-flex justify-content-center mb-3">
                    {!isAdmin ? (
                        <div></div>
                    ) : (
                        <Dropdown>
                            <Dropdown.Toggle size="sm" id="song-options">
                                Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/songs/edit/${song.id}`}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(song.id)} className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    <img
                        className="img-fluid rounded"
                        src={song.album.imageUrl}
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                        alt={song.title}
                    />
                </div>

                <div className="d-flex justify-content-center p-3">
                    <button className={`btn ${liked ? "btn-danger" : "btn-outline-danger"}`} onClick={handleLike}>
                        {liked ? "Unlike ❤️" : "Like ♡"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DetailsSong;
