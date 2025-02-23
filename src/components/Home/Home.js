import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import albumService from "../Services/albumService";
import artistService from "../Services/artistService";
import songService from "../Services/songService";

const Home = ({ user }) => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const albumsData = await albumService.getAllAlbums();
                setAlbums(albumsData.sort(() => Math.random() - 0.5).slice(0, 4));

                const artistsData = await artistService.getAllArtists();
                setArtists(artistsData.sort(() => Math.random() - 0.3).slice(0, 3));

                const songsData = await songService.getAllSongs();
                setSongs(songsData.sort(() => Math.random() - 0.5).slice(0, 5));

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container d-flex justify-content-center align-items-center mb-4 mt-5" style={{ maxWidth: "885px" }}>
            <div className="card shadow-lg p-4" style={{ width: "600px", background: "rgba(34, 34, 34, 0.8)", color: "#fff" }}>
                {/* Welcome section */}
                <h1 className="text-center text-white mb-4">Welcome to the Music App</h1>
                <p className="text-center text-white mb-4">Explore recent content:</p>

                {/* Songs Section */}
                <h2 className="text-center mb-4">Songs</h2>
                <ul className="list-group mb-4">
                    {songs.length > 0 ? (
                        songs.map((song) => (
                            <li
                                key={song.id}
                                className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white"
                                style={{
                                    transition: "transform 0.3s ease-in-out",
                                    transform: "scale(1)",
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        className="rounded"
                                        src={song.album.imageUrl}
                                        alt={song.title}
                                        style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                                    />
                                    <div>
                                        <Link to={`/songs/${song.id}`} className="text-white text-decoration-none">
                                            {song.title}
                                        </Link>
                                        <br />
                                        <small>{song.album.title}</small>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-center text-white bg-dark">No songs available</li>
                    )}
                </ul>


                {/* Albums Section */}
                <h3 className="text-center text-white mb-4">Albums</h3>
                {albums.length > 0 ? (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 mb-4">
                        {albums.map((album) => (
                            <div key={album.id} className="col">
                                <div
                                    className="card shadow-lg rounded-3"
                                    style={{
                                        background: "linear-gradient(145deg, rgba(50, 50, 50, 0.8), rgba(34, 34, 34, 0.9))",
                                        transform: "scale(1)",
                                        transition: "transform 0.3s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >

                                    <Link to={`/albums/${album.id}`} className="text-white text-decoration-none">
                                        <img
                                            className="card-img-top rounded-3"
                                            src={album.imageUrl}
                                            alt={album.title}
                                            style={{
                                                height: "200px",
                                                objectFit: "cover",
                                                borderTopLeftRadius: "10px",
                                                borderTopRightRadius: "10px",
                                                transition: "all 0.4s ease",
                                            }}
                                        />
                                    </Link>
                                    <Link to={`/albums/${album.id}`} className="text-white text-decoration-none">
                                    <div className="card-body" style={{padding: "1rem", textAlign: "center"}}>
                                        <h5 className="card-title text-white" style={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden"
                                        }}>
                                            {album.title}
                                        </h5>
                                        <p className="card-text text-light"
                                           style={{fontSize: "0.8rem", marginBottom: "0.5rem",textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}>
                                            {album.artist?.name || "Unknown Artist"}
                                        </p>
                                    </div>
                                    </Link>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-white">No albums available</p>
                )}

                {/* Artists Section */}
                <h3 className="text-center text-white mb-4">Artists</h3>
                {artists.length > 0 ? (
                    <div className="row">
                        {artists.map((artist) => (
                            <div key={artist.id} className="col-12 col-sm-6 col-md-4 mb-4">
                                <div
                                    className="card bg-dark text-white border-0"
                                    style={{
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
                                        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)"; // Scaling effect on hover
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)"; // Deep shadow on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)"; // Reset scale
                                        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.5)"; // Reset shadow
                                    }}
                                >
                                    <Link to={`/artists/${artist.id}`}>
                                    <div className="card-body p-0">
                                        <img
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                            className="card-img-top"
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    </Link>

                                    <div
                                        className="card-footer text-center p-3"
                                        style={{
                                            position: "absolute",
                                            bottom: "0",
                                            left: "0",
                                            right: "0",
                                            background: "rgba(0, 0, 0, 0.7)",
                                            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                                        }}
                                    >
                                        <Link
                                            to={`/artists/${artist.id}`}
                                            className="text-white text-decoration-none"
                                            style={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                display: "block",
                                                transition: "color 0.3s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = "#ff4081"; // Hover effect color change
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = "#fff"; // Default color
                                            }}
                                        >
                                            {artist.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-white">No artists available</p>
                )}

            </div>
        </div>
    );

};

export default Home;
