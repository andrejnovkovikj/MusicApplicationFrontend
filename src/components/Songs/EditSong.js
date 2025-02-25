import React, { useState, useEffect } from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import songService from "../Services/songService";
import albumService from "../Services/albumService";
import artistService from "../Services/artistService";
import axios from "axios";

const EditSong = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
    const [loading,setLoading] = useState(true);

    const [song, setSong] = useState({
        title: "",
        filePath: "",
        lengthSeconds: "",
        albumId: "",
        artistId: "",
    });

    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const data = await songService.getSongById(id);
                setSong({
                    title: data.title,
                    filePath: data.filePath,
                    lengthSeconds: data.lengthSeconds,
                    albumId: data.album.id,
                    artistId: data.artist.id,
                });
            } catch (error) {
                console.error("Error fetching song: ", error);
            }
        };

        const fetchDropdownData = async () => {
            try {
                const albumsData = await albumService.getAllAlbums();
                setAlbums(albumsData);

                const artistsData = await artistService.getAllArtists();
                setArtists(artistsData);
            } catch (error) {
                console.error("Error fetching dropdown data: ", error);
            }
        };
        const fetchIsAdmin = async () => {
            if(user){
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminStatus = await response.json();

                    if( isAdminStatus === "ADMIN"){
                        setIsAdmin(true);
                    }else
                        setIsAdmin(false);

                }catch (error){
                    console.error("Error fetching admin status: ",error);
                }
            }
        };

        fetchIsAdmin();
        fetchSongData();
        fetchDropdownData();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSong((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedSong = {
            title: song.title,
            filePath: song.filePath,
            lengthSeconds: song.lengthSeconds,
            album: { id: song.albumId },
            artist: { id: song.artistId },
        };

        try {
            await songService.updateSong(id, updatedSong);
            navigate("/songs");
        } catch (error) {
            console.error("Error updating song: ", error);
            alert("Failed to update song");
        }
    };
    useEffect(() => {
        if (song && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [song, isAdmin]);
    if (loading) return <div><h1>Loading...</h1></div>;

    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Edit Song</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={song.title}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">File Path:</label>
                        <input
                            type="text"
                            name="filePath"
                            value={song.filePath}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Length (Seconds):</label>
                        <input
                            type="number"
                            name="lengthSeconds"
                            value={song.lengthSeconds}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Album:</label>
                        <select
                            name="albumId"
                            value={song.albumId}
                            onChange={handleChange}
                            className="form-select bg-dark text-white border-secondary"
                            required
                        >
                            <option value="" disabled>Select album</option>
                            {albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Artist:</label>
                        <select
                            name="artistId"
                            value={song.artistId}
                            onChange={handleChange}
                            className="form-select bg-dark text-white border-secondary"
                            required
                        >
                            <option value="" disabled>Select artist</option>
                            {artists.map((artist) => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Update Song</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default EditSong;
