import React, { useEffect, useState } from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import artistService from "../Services/artistService";

const EditArtist = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin,setIsAdmin] = useState(false);
    const [loading,setLoading] = useState(true);
    const [artist, setArtist] = useState({
        name: "",
        bio: "",
        imageUrl: "",
    });

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const data = await artistService.getArtistById(id);
                setArtist(data);
            } catch (error) {
                console.error("Error fetching artist: ", error);
            }
        };
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
        fetchArtistData();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtist((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await artistService.updateArtist(id, artist);
            navigate(`/artists`);
        } catch (error) {
            console.error("Error updating artist: ", error);
            alert("Failed to update artist");
        }
    };

    useEffect(() => {
        if (artist && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [artist, isAdmin]);
    if (loading) return <div><h1>Loading...</h1></div>;

    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Edit Artist</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={artist.name}
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
                            value={artist.imageUrl}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Bio:</label>
                        <textarea
                            name="bio"
                            value={artist.bio}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Update Artist</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default EditArtist;
