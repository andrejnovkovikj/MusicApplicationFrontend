import React, {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import artistService from "../Services/artistService"; //

const CreateArtist = ({ user }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [imageUrl,setImageUrl]=useState("");
    const [isAdmin,setIsAdmin] = useState(false);

    useEffect(() => {
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
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newArtist = { name, bio, imageUrl };

        try {
            await artistService.createArtist(newArtist);
            navigate("/");
        } catch (error) {
            console.error("Error adding artist: ", error);
        }
    };

    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Create Artist</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        <label className="form-label">Bio:</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Create Artist</button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default CreateArtist;
