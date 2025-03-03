import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import playlistService from "../Services/playlistService";

const DetailsPlaylist = ({ user }) => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const playlistData = await playlistService.getPlaylistById(id);
                setPlaylist(playlistData);
                setSongs(playlistData.songs);

                if (user && playlistData.user.email === user.email) {
                    setIsOwner(true);
                }else{
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching playlist details:", error);
            }
        };

        fetchPlaylistData();
    }, [id, user]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
            try {
                await playlistService.deletePlaylist(id);
                alert("Playlist deleted successfully!");
                navigate("/");
            } catch (error) {
                console.error("Error deleting playlist:", error);
                alert("Failed to delete the playlist.");
            }
        }
    };

    useEffect(() => {
        if (playlist) {
            setLoading(false);
        }
    }, [playlist]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    if (!playlist) return <div className="text-center text-danger">Error: Playlist not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center flex-grow-1">{playlist.name}</h2>
                <small className="text-center">{playlist.user.email}</small>
                <p className="text-center">{playlist.description}</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    {isOwner && (
                        <Dropdown>
                            <Dropdown.Toggle size="sm" id="playlist-options">
                                Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/playlists/edit/${playlist.id}`}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={handleDelete} className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    <img className="img-fluid rounded" src={playlist.imageUrl}
                         style={{ width: "200px", height: "200px", objectFit: "cover" }} alt={playlist.name} />
                </div>

                <div className="mt-4">
                    <h3 className="text-center mb-3">Songs in this Playlist:</h3>
                    {songs.length > 0 ? (
                        <ul className="list-group">
                            {songs.map((song) => (
                                <Link to={`/songs/${song.id}`} key={song.id}
                                      className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                                    <div className="d-flex align-items-center">
                                        <img src={song.album.imageUrl} alt={song.title} className="rounded me-3"
                                             style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                        <h5 className="mb-0">{song.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-white">No songs available for this playlist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPlaylist;
