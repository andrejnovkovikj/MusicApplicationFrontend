import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { format } from "date-fns";
import concertService from "../Services/concertService";

const DetailsConcert = ({ user }) => {
    const { id } = useParams();
    const [concert, setConcert] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConcertData = async () => {
            try {
                const concertData = await concertService.getConcertById(id);
                setConcert(concertData);
            } catch (error) {
                console.error("Error fetching concert details:", error);
            }
        };
        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(
                        `https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`
                    );
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === "ADMIN");
                } catch (error) {
                    console.error("Error fetching admin status:", error);
                }
            }
        };
        fetchIsAdmin();
        fetchConcertData();
    }, [id, user]);



    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this concert?")) {
            try {
                await concertService.deleteConcert(id);
                alert("Concert deleted successfully!");
                navigate("/concerts");
            } catch (error) {
                console.error("Error deleting concert:", error);
                alert("Failed to delete the concert.");
            }
        }
    };

    useEffect(() => {
        if (concert && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [concert, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;
    if (!concert) return <div className="text-center text-danger">Error: Concert not found</div>;

    // Format the date and time
    const formattedDate = concert.startTime ? new Date(concert.startTime) : null;

    const day = formattedDate ? format(formattedDate, "d") : "";
    const month = formattedDate ? format(formattedDate, "MMMM") : "";
    const year = formattedDate ? format(formattedDate, "yyyy") : "";
    const time = formattedDate ? format(formattedDate, "hh:mm a") : ""; // Time in AM/PM format

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{
                     width: "600px",
                     background: "rgba(34, 34, 34, 0.8)",
                     color: "#fff",
                     borderRadius: "20px",
                     overflow: "hidden",
                     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                 }}>
                <h2 className="text-center" style={{ fontWeight: "bold" }}>
                    {concert.name}
                </h2>
                <h5 className="text-center mb-3" style={{ fontWeight: "600", color: "#BDC3C7" }}>
                    {concert.location}
                </h5>

                <Link to={`/artists/${concert.artist.id}`} className="list-group-item"
                      style={{ color: "#3498DB", textDecoration: "none", fontWeight: "500" }}>
                    <h6 className="text-center mb-3">{concert.artist.name}</h6>
                </Link>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    {!isAdmin ? (
                        <div></div>
                    ) : (
                        <Dropdown>
                            <Dropdown.Toggle size="sm" id="concert-options">
                                Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/concerts/edit/${concert.id}`}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(concert.id)}
                                               className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    <img
                        className="rounded-circle"
                        src={concert.artist.imageUrl}
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            border: "4px solid #fff"
                        }}
                        alt={concert.name}
                    />
                </div>

                {/* Date and Time Container */}
                <div className="card p-3 mt-4 text-center mx-auto"
                     style={{ width: "200px", backgroundColor: "#34495E", borderRadius: "15px" }}>
                    <div className="display-4" style={{ color: "#fff", fontWeight: "700" }}>
                        {day}
                    </div>
                    <div className="small" style={{ color: "#fff", fontWeight: "500" }}>
                        {month} {year}
                    </div>
                    <div className="mt-2" style={{ color: "#fff", fontWeight: "600", fontSize: "18px" }}>
                        {time}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsConcert;
