import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Dropdown, Spinner } from "react-bootstrap";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa"; // Add icons for Add/Remove
import songService from "../Services/songService";
import playlistService from "../Services/playlistService";

const DetailsSong = ({ user }) => {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [liked, setLiked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState([]);
    const [isPlaylistLoading, setIsPlaylistLoading] = useState(false); // for loading state
    const navigate = useNavigate();

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
                const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/songs/${user.email}/liked-songs`);
                if (!response.ok) throw new Error("Failed to fetch liked songs");

                const likedSongs = await response.json();
                setLiked(likedSongs.some((likedSong) => likedSong.id.toString() === id));
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            }
        };

        const fetchUserPlaylists = async () => {
            try {
                const userPlaylists = await playlistService.getUserPlaylists(user.email);
                setPlaylists(userPlaylists);
            } catch (error) {
                console.error("Error fetching user playlists:", error);
            }
        };

        fetchSongData();
        fetchLikedSongs();
        fetchUserPlaylists();
    }, [user, id]);
    useEffect(() => {
        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === 'ADMIN');
                } catch (error) {
                    console.error("Error fetching admin status:", error);
                }
            }
        };
        fetchIsAdmin();
    }, [user]);
    const handleLike = async () => {
        if (!user) {
            alert("You need to be logged in to like a song.");
            return;
        }

        try {
            liked ? await songService.unlikeSong(user.email, id) : await songService.likeSong(user.email, id);
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
                navigate("/songs");
            } catch (error) {
                console.error("Error deleting song:", error);
                alert("Failed to delete the song.");
            }
        }
    };

    const handlePlaylistAction = async (playlistId, isInPlaylist) => {
        setIsPlaylistLoading(true);

        try {
            if (isInPlaylist) {
                await playlistService.removeSongFromPlaylist(playlistId, song.id);
                alert("Song removed from playlist!");
            } else {
                await playlistService.addSongToPlaylist(playlistId, song.id);
                alert("Song added to playlist!");
            }

            const updatedPlaylists = await playlistService.getUserPlaylists(user.email);
            setPlaylists(updatedPlaylists);
        } catch (error) {
            console.error("Error updating playlist:", error);
            alert("Failed to update playlist.");
        } finally {
            setIsPlaylistLoading(false);
        }
    };

    useEffect(() => {
        if (song && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [song, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    if (!song) return <div>Error: Song not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center">{song.title}</h2>
                <Link to={`/albums/${song.album.id}`} className="list-group-item">
                    <h3 className="text-center mb-3">{song.album.title}</h3>
                </Link>
                <Link to={`/artists/${song.artist.id}`} className="list-group-item">
                    <h6 className="text-center mb-3">by {song.artist.name}</h6>
                </Link>

                <div className="d-flex justify-content-center mb-3">
                    {isAdmin && (
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

                <div className="d-flex justify-content-center p-3">
                    <Dropdown>
                        <Dropdown.Toggle className="btn btn-primary d-flex justify-content-between align-items-center" disabled={isPlaylistLoading}>
                            {isPlaylistLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Add/Remove from Playlist"
                            )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {playlists.length > 0 ? (
                                playlists.map((playlist) => {
                                    const isInPlaylist = playlist.songs.some((s) => s.id === song.id);
                                    return (
                                        <Dropdown.Item
                                            key={playlist.id}
                                            onClick={() => handlePlaylistAction(playlist.id, isInPlaylist)}
                                        >
                                            {isInPlaylist ? (
                                                <FaMinusCircle className="mr-4 text-danger" />
                                            ) : (
                                                <FaPlusCircle className="mr-2 text-success" />
                                            )}
                                            {isInPlaylist ? ` Remove from ${playlist.name}` : ` Add to ${playlist.name}`}
                                        </Dropdown.Item>
                                    );
                                })
                            ) : (
                                <Dropdown.Item disabled>No playlists found</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default DetailsSong;
