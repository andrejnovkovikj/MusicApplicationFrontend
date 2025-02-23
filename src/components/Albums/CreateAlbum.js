import React, { useState, useEffect } from "react";
import {Navigate, useNavigate} from 'react-router-dom';
import AlbumService from "../Services/albumService";
import artistService from "../Services/artistService";

const CreateAlbum = ({ user }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [artistId, setArtistId] = useState('');
    const [genre, setGenre] = useState('');
    const [artists, setArtists] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        artistService.getAllArtists()
            .then((data) => setArtists(data))
            .catch((error) => console.error('Error fetching artists: ', error));

    }, [user]);

    useEffect(() => {
       const fetchIsAdmin = async () => {
           if(user){
               try {
                   const response = await fetch(`https://musicapplicationbackend.onrender.com/api/users/${user.uid}/role`);
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
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAlbum = { title, dateCreated, artistId, genre, imageUrl };

        AlbumService.createAlbum(newAlbum)
            .then(() => navigate('/albums'))
            .catch(error => console.error('Error adding album: ', error));
    };
    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Create Album</h2>

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
                        <label className="form-label">Image Url:</label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Date Created:</label>
                        <input
                            type="date"
                            value={dateCreated}
                            onChange={(e) => setDateCreated(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Artist:</label>
                        <select
                            value={artistId}
                            onChange={(e) => setArtistId(e.target.value)}
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

                    <div className="mb-3 text-start">
                        <label className="form-label">Genre:</label>
                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="form-select bg-dark text-white border-secondary"
                            required
                        >
                            <option value="" disabled>Select genre</option>
                            <option value="HIPHOP">Hip Hop</option>
                            <option value="ROCK">Rock</option>
                            <option value="EDM">EDM</option>
                            <option value="DANCE">Dance</option>
                            <option value="POP">Pop</option>
                            <option value="RNB">R&B</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Create Album</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default CreateAlbum;
