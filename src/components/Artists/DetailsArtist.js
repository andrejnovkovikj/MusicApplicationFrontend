import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import artistService from "../Services/artistService";
import {format} from "date-fns";

const DetailsArtist = ({ user }) => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [concerts, setConcerts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistData = await artistService.getArtistById(id);
                setArtist(artistData);
            } catch (error) {
                console.error("Error fetching artist details:", error);
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

        fetchArtistData();
        fetchIsAdmin();
    }, [id, user]);

    useEffect(() => {
        const fetchConcertsByArtist = async () => {
            if (!artist) return;
            try {
                const response = await fetch(`http://localhost:8080/api/concerts/sort/${artist.name}`);
                if (!response.ok) throw new Error("Failed to fetch concerts");
                let data = await response.json();

                data = data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                setConcerts(data);
            } catch (error) {
                console.error("Error fetching concerts for this artist:", error);
            }
        };

        fetchConcertsByArtist();
    }, [artist]);

    useEffect(() => {
        const fetchAlbumsData = async () => {
            if (!artist) return;
            try {
                const response = await fetch(
                    `https://musicapplicationbackend-production.up.railway.app/api/artists/${artist.id}/albums`
                );
                if (!response.ok) throw new Error("Failed to fetch albums");
                const albumsData = await response.json();
                setAlbums(albumsData);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchAlbumsData();
    }, [artist]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this artist?")) {
            try {
                await artistService.deleteArtist(id);
                alert("Artist deleted successfully!");
                navigate("/artists");
            } catch (error) {
                console.error("Error deleting artist:", error);
                alert("Failed to delete the artist.");
            }
        }
    };

    useEffect(() => {
        if (artist && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [artist, isAdmin]);

    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;
    if (!artist) return <div className="text-center text-danger">Error: Artist not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center flex-grow-1">{artist.name}</h2>
                <p className="text-center">{artist.bio}</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    {isAdmin && (
                        <Dropdown>
                            <Dropdown.Toggle size="sm" id="artist-options">
                                Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/artists/edit/${artist.id}`}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={handleDelete} className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>

                <div className="d-flex justify-content-center">
                    <img className="img-fluid rounded" src={artist.imageUrl}
                         style={{ width: "200px", height: "200px", objectFit: "cover" }} alt={artist.name}/>
                </div>

                <div className="mt-4">
                    <h3 className="text-center mb-3">Albums by {artist.name}:</h3>
                    {albums.length > 0 ? (
                        <ul className="list-group">
                            {albums.map((album) => (
                                <Link to={`/albums/${album.id}`} key={album.id}
                                      className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                                    <div className="d-flex align-items-center">
                                        <img src={album.imageUrl} alt={album.title} className="rounded me-3"
                                             style={{ width: "50px", height: "50px", objectFit: "cover" }}/>
                                        <h5 className="mb-0">{album.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-white">No albums available for this artist.</p>
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="text-center mb-3">Upcoming concerts by {artist.name}:</h3>
                    {concerts.length > 0 ? (
                        <ul className="list-group">
                            {concerts.map((concert) => {
                                const formattedDate = concert.startTime
                                    ? format(new Date(concert.startTime), "d MMMM yyyy")
                                    : "Date not available";

                                return (
                                    <Link to={`/concerts/${concert.id}`} key={concert.id}
                                          className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                                        <div className="d-flex align-items-center">
                                            <h5 className="mb-0">{concert.name}</h5>
                                        </div>
                                        <div className="text-end">
                                            {formattedDate}
                                            <p className="mb-0">{concert.location}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-center text-white">No concerts available for this artist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsArtist;
