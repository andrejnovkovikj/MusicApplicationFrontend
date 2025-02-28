import React, { useEffect, useState } from "react";
import albumService from "../Services/albumService";
import { Link } from 'react-router-dom';

const ListAlbum = ({ user }) => {
    const [albums, setAlbums] = useState([]);
    const [likedAlbums, setLikedAlbums] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const albumData = await albumService.getAllAlbums();
                setAlbums(albumData);
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };

        const fetchLikedAlbums = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/albums/${user.email}/liked-albums`);
                    if (!response.ok) throw new Error("Failed to fetch liked albums");
                    const likedAlbumsData = await response.json();
                    setLikedAlbums(likedAlbumsData.map(album => album.id));
                } catch (error) {
                    console.error("Error fetching liked albums:", error);
                }
            }
        };

        const fetchIsAdmin = async () => {
            if (user) {
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === 'ADMIN');
                } catch (error) {
                    console.error("Error fetching admin status:", error);
                }
            }
        };

        fetchAlbums();
        fetchLikedAlbums();
        fetchIsAdmin();
    }, [user]);

    const handleLike = async (albumId) => {
        if (!user) {
            alert("You need to be logged in to like an album.");
            return;
        }

        try {
            await albumService.likeAlbum(user.email, albumId);
            setLikedAlbums([...likedAlbums, albumId]);
        } catch (error) {
            console.error("Error liking the album:", error);
        }
    };

    const handleUnlike = async (albumId) => {
        if (!user) {
            alert("You need to be logged in to unlike an album.");
            return;
        }

        try {
            await albumService.unlikeAlbum(user.email, albumId);
            setLikedAlbums(likedAlbums.filter(id => id !== albumId));
        } catch (error) {
            console.error("Error unliking the album:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            try {
                await albumService.deleteAlbum(id);
                setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== id));
                alert("Album deleted successfully!");
            } catch (error) {
                console.error("Error deleting album:", error);
                alert("Failed to delete the album.");
            }
        }
    };

    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        if (albums.length > 0 && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [albums, isAdmin]);
    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                <h2 className="text-center mb-4">Albums</h2>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for an album..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <ul className="list-group">
                    {filteredAlbums.length > 0 ? (
                        filteredAlbums.map((album) => (
                            <li
                                key={album.id}
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
                                <Link to={`/albums/${album.id}`} className="text-white text-decoration-none">

                            <div className="d-flex align-items-center">
                                    <img
                                        src={album.imageUrl}
                                        alt={album.title}
                                        className="rounded"
                                        style={{width: "40px", height: "40px", objectFit: "cover", marginRight: "10px"}}
                                    />
                                    <div>
                                            {album.title}
                                    </div>
                                </div>
                                </Link>

                                <div className="d-flex justify-content-center p-3">
                                    <button
                                        className={`btn ${likedAlbums.includes(album.id) ? "btn-danger" : "btn-outline-danger"}`}
                                        onClick={() => likedAlbums.includes(album.id) ? handleUnlike(album.id) : handleLike(album.id)}
                                    >
                                        {likedAlbums.includes(album.id) ? "Unlike ❤️" : "Like ♡"}
                                    </button>
                                </div>

                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No albums available</li>
                    )}
                </ul>

                <div className="d-flex justify-content-center">
                    {isAdmin &&
                        <Link to="/albums/create" className="btn btn-primary mt-3 col-md-6">Create New Album</Link>}
                </div>
            </div>
        </div>
    );
};

export default ListAlbum;
