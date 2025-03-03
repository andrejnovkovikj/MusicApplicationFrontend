import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import concertService from "../Services/concertService";
import artistService from "../Services/artistService";
import ConcertService from "../Services/concertService";

const CreateConcert = ({ user }) => {
    const navigate = useNavigate();
    const [artistId, setArtistId] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [artists, setArtists] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      artistService.getAllArtists()
          .then((data) => setArtists(data))
          .catch((error) => console.error('Error fetching artists: ',error));
    },[]);
    useEffect(() => {
        const fetchIsAdmin = async () => {
            if(user){
               try {
                   const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                   const isAdminResponse = await response.json();
                   setIsAdmin(isAdminResponse === "ADMIN");

               } catch (error){
                   console.error("Error fetching admin status: ",error);
               }
            }
        };
        fetchIsAdmin();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedStartTime = `${startTime}:00`;
        const newConcert = { artistId, name, location, startTime: formattedStartTime };

        console.log("Sending concert data:", newConcert);

        try {
            await ConcertService.createConcert(newConcert);
            navigate('/concerts');
        } catch (error) {
            console.error('Error adding concert:', error);
        }
    };


    if(!isAdmin) return <div className="d-flex justify-content-center"><h4> You dont have an access for this page!</h4> </div>

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Create Concert</h2>

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
                        <label className="form-label">Location (Country, City, Arena) :</label>
                        <input
                            placeholder="Country/City/Arena"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="form-control bg-dark text-white border-secondary"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Date & Time Created:</label>
                        <input
                            type="datetime-local"
                            value={startTime?.slice(0, 16)}
                            onChange={(e) => setStartTime(e.target.value)}
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

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Create Concert</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreateConcert;