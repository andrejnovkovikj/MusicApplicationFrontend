import React, { useEffect, useState } from "react";
import {useParams, Link, Navigate} from "react-router-dom";
import userService from "../Services/userService";  // User service for fetching user data

const DetailsUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [likedSongs, setLikedSongs] = useState([]);
    const [likedAlbums, setLikedAlbums] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log(`Fetching user data for ID: ${id}`);
                const userData = await userService.getUserById(id);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                if (user && user.email) {
                    console.log(`Fetching liked songs for ${user.email}`);
                    const songsResponse = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/songs/${user.email}/liked-songs`);
                    if (!songsResponse.ok) throw new Error("Failed to fetch liked songs");
                    const songs = await songsResponse.json();
                    setLikedSongs(songs);
                    console.log("Liked Songs:", songs);
                }
            } catch (error) {
                console.error("Error fetching liked songs:", error);
            }
        };

        if (user) {
            fetchLikedSongs();
        }
    }, [user]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                if (user && user.email) {
                    console.log(`Fetching playlists for ${user.email}`);
                    const playlistResponse = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/playlists/userPlaylists/${user.email}`);
                    if (!playlistResponse.ok) throw new Error("Failed to fetch playlists");
                    const playlists = await playlistResponse.json();
                    setUserPlaylists(playlists);
                    console.log("Playlists:", playlists);
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        if (user) {
            fetchPlaylists();
        }
    }, [user]);

    useEffect(() => {
        const fetchLikedAlbums = async () => {
            try {
                if (user && user.email) {
                    console.log(`Fetching liked albums for ${user.email}`);
                    const albumsResponse = await fetch(`https://musicapplicationbackend-production.up.railway.app/api/albums/${user.email}/liked-albums`);
                    if (!albumsResponse.ok) throw new Error("Failed to fetch liked albums");
                    const albums = await albumsResponse.json();
                    setLikedAlbums(albums);
                    console.log("Liked Albums:", albums);
                }
            } catch (error) {
                console.error("Error fetching liked albums:", error);
            }
        };

        if (user) {
            fetchLikedAlbums();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);
    if (isLoading) return <div className="d-flex justify-content-center"><h1>Loading...</h1></div>;

    if (!user) return <div className="text-center mt-5 text-danger">Error: User not found</div>;

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 text-center"
                 style={{width: "900px", background: "rgba(34, 34, 34, 0.8)", color: "#fff"}}>
                <h2 className="mb-4">{user.email}</h2>
                <h5 className="text-white mb-4">{user.role}</h5>

                <div className="card shadow-sm p-3 mb-4" style={{background: "rgba(34, 34, 34, 0.9)"}}>
                    <h3 className="text-center text-white">Liked Songs</h3>
                    {likedSongs.length > 0 ? (
                        <div className="row">
                            {likedSongs.map((song) => (
                                <div key={song.id} className="col-12 mb-3">
                                    <Link to={`/songs/${song.id}`} className="list-group-item text-decoration-none">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={song.album?.imageUrl || "/default-song.jpg"}
                                                alt={song.title}
                                                className="rounded me-3"
                                                style={{width: "50px", height: "50px", objectFit: "cover"}}
                                            />
                                            <div className="text-start">
                                                <h6 className="mb-0 text-white">{song.title}</h6>
                                                <small
                                                    className="text-white">{song.album?.title || "Unknown Artist"}</small>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No liked songs.</p>
                    )}
                </div>


                <div className="card shadow-sm p-3 mb-4" style={{background: "rgba(34, 34, 34, 0.9)"}}>
                    <h3 className="text-center text-white">Liked Albums</h3>
                    {likedAlbums.length > 0 ? (
                        <div className="row">
                            {likedAlbums.map((album) => (
                                <div key={album.id} className="col-12 mb-3">
                                    <Link to={`/albums/${album.id}`} className="list-group-item text-decoration-none">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={album.imageUrl || "/default-album.jpg"}
                                                alt={album.title}
                                                className="rounded me-3"
                                                style={{width: "50px", height: "50px", objectFit: "cover"}}
                                            />
                                            <div className="text-start">
                                                <h6 className="mb-0 text-white">{album.title}</h6>
                                                <small
                                                    className="text-white">{album.artist?.name || "Unknown Artist"}</small>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No liked albums.</p>
                    )}
                </div>
                <div className="card shadow-sm p-3 mb-4" style={{background: "rgba(34, 34, 34, 0.9)"}}>
                    <h3 className="text-center text-white">Playlists</h3>
                    {userPlaylists.length > 0 ? (
                        <div className="row">
                            {userPlaylists.map((playlist) => (
                                <div key={playlist.id} className="col-12 mb-3">
                                    <Link to={`/playlists/${playlist.id}`}
                                          className="list-group-item text-decoration-none">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={playlist.imageUrl || "/default-playlist.jpg"}
                                                alt={playlist.title}
                                                className="rounded me-3"
                                                style={{width: "50px", height: "50px", objectFit: "cover"}}
                                            />
                                            <div className="text-start">
                                                <h6 className="mb-0 text-white">{playlist.name}</h6>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No playlists.</p>
                    )}
                </div>

            </div>
        </div>
    );

};

export default DetailsUser;
