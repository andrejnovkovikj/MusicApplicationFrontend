import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import playlistService from "../Services/playlistService";

const CreatePlaylist = ({ user }) => {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const fetchIsLoggedIn = async () => {
            if (user) {
                setIsUserLoggedIn(true);
            }
        };
        fetchIsLoggedIn();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPlaylist = {
            name,
            description,
            imageUrl,
            uid: user.uid,
        };

        try {
            await playlistService.createPlaylist(newPlaylist);
            navigate("/playlists");
        } catch (error) {
            console.error("Error adding playlist:", error);
        }
    };

    if (!isUserLoggedIn) return <div className="d-flex justify-content-center"><h4>You don't have access to this page!</h4></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Create Playlist</h2>


                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Playlist Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Image URL:</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => {
                                setImageUrl(e.target.value);
                            }}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Create Playlist</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylist;
