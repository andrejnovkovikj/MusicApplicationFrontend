import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import concertService from "../Services/concertService";
import artistService from "../Services/artistService";

const EditConcert = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const [concert, setConcert] = useState({
        name: "",
        startTime: "",
        location: "",
        artistId: "",
    });

    const [artists, setArtists] = useState([]);

    useEffect(() => {
        concertService.getConcertById(id)
            .then((data) => {
                setConcert({
                    name: data.name,
                    startTime: data.startTime,
                    location: data.location,
                    artistId: data.artist.id,
                });
            })
            .catch((error) => console.error("Error fetching concert: ", error));

        artistService.getAllArtists()
            .then((data) => setArtists(data))
            .catch((error) => console.error("Error fetching artists: ", error));

        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminStatus = await response.json();

                    if (isAdminStatus === "ADMIN") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Error fetching admin status: ", error);
                }
            }
        };
        fetchIsAdmin();
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConcert((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedConcert = {
            name: concert.name,
            startTime: concert.startTime,
            location: concert.location,
            artist: { id: concert.artistId },
        };

        concertService.updateConcert(id, updatedConcert)
            .then(() => navigate("/concerts"))
            .catch((error) => {
                console.error("Error updating concert: ", error);
                alert("Failed to update concert");
            });
    };

    useEffect(() => {
        if (concert && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [concert, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;
    if (!isAdmin) return <div className="d-flex justify-content-center"><h4>You don't have access to this page!</h4></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Edit Concert</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3 text-start">
                        <label className="form-label">Concert Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={concert.name}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Start Time:</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={concert.startTime}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Location (Country, City, Arena):</label>
                        <input
                            type="text"
                            name="location"
                            value={concert.location}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Artist:</label>
                        <select
                            name="artistId"
                            value={concert.artistId}
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
                        <button type="submit" className="btn btn-primary">Update Concert</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditConcert;
