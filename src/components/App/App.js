import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Register from "../Authorization/Register";
import Login from "../Authorization/Login";
import Logout from "../Authorization/Logout";
import { useState, useEffect } from "react";
import { auth } from "../FireBase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {AuthProvider} from "../Authorization/AuthContext";
import Home from "../Home/Home";
import CreateAlbum from "../Albums/CreateAlbum";
import CreateArtist from "../Artists/CreateArtist";
import DetailsArtist from "../Artists/DetailsArtist";
import ListArtist from "../Artists/ListArtist";
import EditArtist from "../Artists/EditArtist";
import ListAlbum from "../Albums/ListAlbum";
import DetailsAlbum from "../Albums/DetailsAlbum";
import EditAlbum from "../Albums/EditAlbum";
import CreateSong from "../Songs/CreateSong";
import ListSong from "../Songs/ListSong";
import EditSong from "../Songs/EditSong";
import DetailsSong from "../Songs/DetailsSong";
import ListUser from "../Users/ListUser";
import DetailsUser from "../Users/DetailsUser";
import CreatePlaylist from "../Playlists/CreatePlaylist";
import ListPlaylist from "../Playlists/ListPlaylist";
import DetailsPlaylist from "../Playlists/DetailsPlaylist";
import EditPlaylist from "../Playlists/EditPlaylist";
import CreateConcert from "../Concerts/CreateConcert";
import ListConcert from "../Concerts/ListConcert";
import DetailsConcert from "../Concerts/DetailsConcert";
import EditConcert from "../Concerts/EditConcert";
import Navbar from "../Navbar/Navbar";
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
      <AuthProvider>
            <Router>

                <div className="d-flex">
                    <Navbar user={user} />

                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<Home user={user}/>} />

                            <Route path="/albums/create" element={<CreateAlbum user={user} />} />
                            <Route path="/albums" element={<ListAlbum user={user} />} />
                            <Route path="/albums/:id" element={<DetailsAlbum user={user} />} />
                            <Route path="/albums/edit/:id" element={<EditAlbum user={user} />} />

                            <Route path="/songs/create" element={<CreateSong user={user} /> }/>
                            <Route path="/songs" element={<ListSong user={user}/>} />
                            <Route path="/songs/edit/:id" element={<EditSong user={user} />} />
                            <Route path="/songs/:id" element={<DetailsSong user={user} /> } />

                            <Route path="/users" element={<ListUser />} />
                            <Route path="/users/:id" element={<DetailsUser user={user} />} />


                            <Route path="/artists/create" element={<CreateArtist user={user} />} />
                            <Route path="/artists" element={<ListArtist user={user} />} />
                            <Route path="/artists/:id" element={<DetailsArtist user={user}/>} />
                            <Route path="/artists/edit/:id" element={<EditArtist user={user} />} />

                            <Route path="/playlists/create" element={<CreatePlaylist user={user} />} />
                            <Route path="/playlists" element={<ListPlaylist user={user} />} />
                            <Route path="/playlists/:id" element={<DetailsPlaylist user={user} /> } />
                            <Route path="/playlists/edit/:id" element={<EditPlaylist user={user} />} />

                            <Route path="/concerts/create" element={<CreateConcert user={user} />} />
                            <Route path="/concerts" element={<ListConcert user={user} />} />
                            <Route path="/concerts/:id" element={<DetailsConcert user={user} /> } />
                            <Route path="/concerts/edit/:id" element={<EditConcert user={user} />} />



                            <Route path="/register" element={<Register />}/>
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
