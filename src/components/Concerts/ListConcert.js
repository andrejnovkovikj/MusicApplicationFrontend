import React, { useState, useEffect } from "react";
import concertService from "../Services/concertService";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ListConcert = ({ user }) => {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await concertService.getAllConcerts();
                setConcerts(response);
            } catch (error) {
                console.error("Error fetching concerts", error);
            }
        };

        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    if (!response.ok) throw new Error("Failed to fetch admin status");
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === "ADMIN");
                } catch (error) {
                    console.error("Error fetching admin status", error);
                }
            }
        };

        fetchConcerts();
        fetchIsAdmin();
    }, [user]);

    const filteredConcerts = concerts.filter((concert) =>
        concert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        concert.artist.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (concerts.length > 0 && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [concerts, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Concerts</h2>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for a concert..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ul className="list-group">
                    {filteredConcerts.length > 0 ? (
                        filteredConcerts.map((concert) => {
                            const formattedDate = concert.startTime ? format(new Date(concert.startTime), "d MMMM yyyy") : "Date not available";

                            return (
                                <li
                                    key={concert.id}
                                    className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white"
                                    style={{
                                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                        transform: "scale(1)",
                                        cursor: "pointer",
                                        position: "relative",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <Link to={`/concerts/${concert.id}`} className="text-white text-decoration-none w-100">
                                        <div className="row text-center">
                                            <div className="col-md-3">
                                                <strong>{concert.name}</strong>
                                            </div>
                                            <div className="col-md-3">
                                                {concert.artist.name}
                                            </div>
                                            <div className="col-md-3">
                                                {formattedDate}
                                            </div>
                                            <div className="col-md-3">
                                                {concert.location}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No concerts found</li>
                    )}
                </ul>

                <div className="d-flex justify-content-center mt-3">
                    {isAdmin && (
                        <Link to="/concerts/create" className="btn btn-primary col-md-6">
                            Create New Concert
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListConcert;
