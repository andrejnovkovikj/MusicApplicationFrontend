import axios from "axios";
import albumService from "./albumService";

const playlistService = {
    getAllPlaylists : async () => {
        try {
            const response = await axios.get('https://musicapplicationbackend-production.up.railway.app/api/playlists');
            return response.data;
        }catch (error){
            console.error('Error fetching playlists',error);
            throw error;
        }
    },
    getPlaylistById : async (id) => {
      try {
          const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/playlists/${id}`);
          return response.data;
      }  catch (error){
          console.error('Error fetching playlist with that id',error);
          throw error;
      }
    },
    createPlaylist: async (playlist) => {
        try {
            const response = await axios.post('https://musicapplicationbackend-production.up.railway.app/api/playlists', playlist);
            return response.data;
        } catch (error) {
            console.error('Error creating Playlist', error);
            throw error;
        }
    },

    updatePlaylist: async (id, playlist) => {
        try {
            await axios.put(`https://musicapplicationbackend-production.up.railway.app/api/playlists/update/${id}`, playlist);
        } catch (error) {
            console.error(`Error updating Playlist ${id}`, error);
            throw error;
        }
    },
    deletePlaylist: async (id) => {
        try {
            await axios.delete(`https://musicapplicationbackend-production.up.railway.app/api/playlists/delete/${id}`);
        }catch (error){
            console.error(`Error deleting Playlist ${id}`,error);
            throw error;
        }
    },
    addSongToPlaylist: async (playlistId, songId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend-production.up.railway.app/api/playlists/addSongToPlaylist/${playlistId}/${songId}`);
            return response.data;
        } catch (error) {
            console.error(`Error adding song ${songId} to playlist ${playlistId}`, error);
            throw error;
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend-production.up.railway.app/api/playlists/removeSongFromPlaylist/${playlistId}/${songId}`);
            return response.data;
        } catch (error) {
            console.error(`Error removing song ${songId} from playlist ${playlistId}`, error);
            throw error;
        }
    },
    getUserPlaylists: async (userEmail) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/playlists/userPlaylists/${userEmail}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching playlists for user ${userEmail}`, error);
            throw error;
        }
    }



}
export default playlistService;
