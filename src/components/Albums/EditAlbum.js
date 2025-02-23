import React, { useState, useEffect } from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import albumService from "../Services/albumService";
import artistService from "../Services/artistService";

const EditAlbum = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
    const [loading,setLoading] = useState(true);

    const [album, setAlbum] = useState({
        title: "",
        dateCreated: "",
        artistId: "",
        genre: "",
        imageUrl: ""
    });

    const [artists, setArtists] = useState([]);

    useEffect(() => {

        albumService.getAlbumsById(id)
            .then((data) => {
                setAlbum({
                    title: data.title,
                    dateCreated: data.dateCreated,
                    artistId: data.artist.id,
                    genre: data.genre,
                    imageUrl: data.imageUrl
                });
            })
            .catch((error) => console.error("Error fetching album: ", error));

        artistService.getAllArtists()
            .then((data) => setArtists(data))
            .catch((error) => console.error("Error fetching artists: ", error));

        const fetchIsAdmin = async () => {
          if(user){
              try {
                  const response = await fetch(`https://musicapplicationbackend.onrender.com/api/users/${user.uid}/role`);
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

    }, [id,user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlbum((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedAlbum = {
            title: album.title,
            dateCreated: album.dateCreated,
            artist: { id: album.artistId },
            genre: album.genre,
            imageUrl: album.imageUrl
        };

        albumService.updateAlbum(id, updatedAlbum)
            .then(() => navigate("/albums"))
            .catch((error) => {
                console.error("Error updating album: ", error);
                alert("Failed to update album");
            });
    };
    useEffect(() => {
        if (album && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [album, isAdmin]);
    if (loading) return <div><h1>Loading...</h1></div>;
    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>


    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Edit Album</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={album.title}
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
                            value={album.imageUrl}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Date Created:</label>
                        <input
                            type="date"
                            name="dateCreated"
                            value={album.dateCreated}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Artist:</label>
                        <select
                            name="artistId"
                            value={album.artistId}
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
                    <div className="mb-3 text-start">
                        <label className="form-label">Genre:</label>
                        <select
                            name="genre"
                            value={album.genre}
                            onChange={handleChange}
                            className="form-select bg-dark text-white border-secondary"
                            required
                        >
                            <option value="" disabled>Select genre</option>
                            <option value="HIPHOP">Hip-Hop</option>
                            <option value="ROCK">Rock</option>
                            <option value="EDM">EDM</option>
                            <option value="DANCE">Dance</option>
                            <option value="POP">Pop</option>
                            <option value="RNB">R&B</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Update Album</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAlbum;
