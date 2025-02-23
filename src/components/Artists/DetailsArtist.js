import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import artistService from "../Services/artistService";

const DetailsArtist = ({ user }) => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
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
                    const response = await fetch(`https://musicapplicationbackend.onrender.com/api/users/${user.uid}/role`);
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
        const fetchAlbumsData = async () => {
            if (!artist) return;
            try {
                const response = await fetch(`https://musicapplicationbackend.onrender.com/api/artists/${artist.id}/albums`);
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

    if (!artist) return <div className="text-center text-danger">Error: Artist not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff"}}>
                <h2 className="text-center flex-grow-1">{artist.name}</h2>
                <p className="text-center">{artist.bio}</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    {isAdmin && (
                        <Dropdown>
                            <Dropdown.Toggle  size="sm" id="artist-options">
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
                         style={{width: "200px", height: "200px", objectFit: "cover"}} alt={artist.name}/>
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
                                             style={{width: "50px", height: "50px", objectFit: "cover"}}/>
                                        <h5 className="mb-0">{album.title}</h5>
                                    </div>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-white">No albums available for this artist.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsArtist;
