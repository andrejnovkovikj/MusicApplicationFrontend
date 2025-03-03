import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import playlistService from "../Services/playlistService";

const EditPlaylist = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playlist, setPlaylist] = useState({
        name: "",
        description: "",
        imageUrl: "",
    });

    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const data = await playlistService.getPlaylistById(id);
                setPlaylist(data);

                if (user && data.user.email === user.email) {
                    setIsOwner(true);
                } else {
                    navigate("/playlists");
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching playlist: ", error);
            }
        };
        fetchPlaylistData();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlaylist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await playlistService.updatePlaylist(id, playlist);
            navigate(`/playlists`);
        } catch (error) {
            console.error("Error updating playlist: ", error);
            alert("Failed to update playlist");
        }
    };

    useEffect(() => {
        if (playlist ) {
            setLoading(false);
        }
    }, [playlist]);

    if (loading) return <div><h1>Loading...</h1></div>;

    if (!isOwner) return <div className="d-flex justify-content-center"><h4>You don't have access to this page!</h4></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Edit Playlist</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={playlist.name}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Image URL:</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={playlist.imageUrl}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Description:</label>
                        <textarea
                            name="description"
                            value={playlist.description}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Update Playlist</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlaylist;
