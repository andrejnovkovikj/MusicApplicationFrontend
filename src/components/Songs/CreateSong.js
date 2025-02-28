import React, { useState, useEffect } from "react";
import {Navigate, useNavigate} from "react-router-dom";
import songService from "../Services/songService";
import albumService from "../Services/albumService";
import artistService from "../Services/artistService";

const CreateSong = ({ user }) => {
    const navigate = useNavigate();


    const [title, setTitle] = useState("");
    const [filePath, setFilePath] = useState("");
    const [lengthSeconds, setLengthSeconds] = useState("");
    const [albumId, setAlbumId] = useState("");
    const [artistId, setArtistId] = useState("");
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumsData, artistsData] = await Promise.all([
                    albumService.getAllAlbums(),
                    artistService.getAllArtists(),
                ]);

                setAlbums(albumsData);
                setArtists(artistsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load albums or artists.");
            } finally {
                setLoading(false);
            }
        };
        const fetchIsAdmin = async () => {
            if(user){
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminResponse = await response.json();
                    if(isAdminResponse === "ADMIN"){
                        setIsAdmin(true);
                    }else
                        setIsAdmin(false);

                }catch (error){
                    console.error("Error fetching admin status: ",error);
                }
            }
        };
        fetchIsAdmin();
        fetchData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !filePath.trim() || !lengthSeconds || !albumId) {
            setError("All fields are required.");
            return;
        }

        const newSong = {
            title,
            filePath,
            lengthSeconds: Number(lengthSeconds),
            album: { id: albumId }
        };

        try {
            await songService.createSong(newSong);
            navigate("/songs");
        } catch (error) {
            console.error("Error adding song:", error);
            setError("Failed to create song. Please try again.");
        }
    };
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>


    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Create Song</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">File Path (URL):</label>
                        <input
                            type="text"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Length (Seconds):</label>
                        <input
                            type="number"
                            min="1"
                            value={lengthSeconds}
                            onChange={(e) => setLengthSeconds(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Album:</label>
                        <select
                            value={albumId}
                            onChange={(e) => setAlbumId(e.target.value)}
                            className="form-select bg-dark text-white border-secondary"
                            required
                        >
                            <option value="" disabled>Select an album</option>
                            {albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.title}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Create Song</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default CreateSong;
