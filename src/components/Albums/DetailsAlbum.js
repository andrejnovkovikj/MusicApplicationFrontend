import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import albumService from "../Services/albumService";

const DetailsAlbum = ({ user }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [liked, setLiked] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const albumData = await albumService.getAlbumsById(id);
                setAlbum(albumData);
            } catch (error) {
                console.error("Error fetching album details:", error);
            }
        };

        const fetchLikedAlbums = async () => {
            if (!user) return;

            try {
                const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/albums/${user.email}/liked-albums`);
                if (!response.ok) throw new Error("Failed to fetch liked albums");

                const likedAlbums = await response.json();
                const isLiked = likedAlbums.some((likedAlbum) => likedAlbum.id.toString() === id);
                setLiked(isLiked);
            } catch (error) {
                console.error("Error fetching liked albums:", error);
            }
        };

        const fetchData = async () => {
            await fetchAlbumData();
            await fetchLikedAlbums();
        };


        fetchData();

    }, [id, user]);

    useEffect(() => {
        const fetchSongsData = async () => {
            if (!album) return;
            try {
                const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/albums/${album.id}/songs`);
                const songsData = await response.json();
                setSongs(songsData);
            } catch (error) {
                console.error("Error fetching songs: ", error);
            }
        };

        fetchSongsData();
    }, [album]);
    useEffect(() => {
        const fetchIsAdmin = async () => {
            if(user){
                try {
                    const response = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/users/${user.uid}/role`);
                    const isAdminResponse = await response.json();
                    setIsAdmin(isAdminResponse === 'ADMIN');

                }catch (error){
                    console.error("Error fetching admin status: ",error);
                }
            }
        }
        fetchIsAdmin();
    }, [user]);

    const handleLike = async () => {
        if (!user) {
            alert("You need to be logged in to like an album.");
            return;
        }

        try {
            if (liked) {
                await albumService.unlikeAlbum(user.email, id);
            } else {
                await albumService.likeAlbum(user.email, id);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            try {
                await albumService.deleteAlbum(id);
                alert("Album deleted successfully!");
                navigate("/albums")
            } catch (error) {
                console.error("Error deleting album:", error);
                alert("Failed to delete the album.");
            }
        }
    };


    useEffect(() => {
        if (album && songs.length > 0 && isAdmin !== undefined) {
            setLoading(false);
        }
    }, [album, songs, isAdmin]);
    if (loading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;
    if (!album) return <div className="text-center text-danger">Error: Album not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff"}}>
                <h2 className="text-center flex-grow-1">{album.title}</h2>
                <Link to={`/artists/${album.artist.id}`}
                      className="list-group-item">
                    <h6 className="text-center mb-3"> by {album.artist.name}</h6>
                </Link>
                <div className="d-flex justify-content-center align-items-center mb-3">

                    {!isAdmin ? (
                        <div></div>
                    ) : (
                        <Dropdown>
                            <Dropdown.Toggle size="sm" id="album-options">
                                Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/albums/edit/${album.id}`}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(album.id)}
                                               className="text-danger">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                </div>


                <div className="d-flex justify-content-center">
                    <img
                        className="rounded"
                        src={album.imageUrl}
                        style={{width: "200px", height: "200px", objectFit: "cover"}}
                        alt={album.title}
                    />
                </div>

                <div className="d-flex justify-content-center p-3">
                    <button className={`btn ${liked ? "btn-danger" : "btn-outline-danger"}`} onClick={handleLike}>
                        {liked ? "Unlike ❤️" : "Like ♡"}
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="text-center mb-3">Songs in this Album</h3>
                    {songs.length > 0 ? (
                        <ul className="list-group">
                            {songs.map((song) => (
                                <li key={song.id}
                                    className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={song.album?.imageUrl}
                                            alt={song.title}
                                            className="rounded me-3"
                                            style={{width: "50px", height: "50px", objectFit: "cover"}}
                                        />
                                        <Link to={`/songs/${song.id}`} className="text-white text-decoration-none">
                                            {song.title}
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-white">No songs available for this album.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsAlbum;
