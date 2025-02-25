import axios from 'axios';

const songService = {
    getAllSongs: async () => {
        try {
            const response = await axios.get('https://musicapplicationbackend-production.up.railway.app/api/songs');
            return response.data;
        } catch (error) {
            console.error('Error fetching songs', error);
            throw error;
        }
    },

    getSongById: async (id) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/songs/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching song with id ${id}`, error);
            throw error;
        }
    },

    createSong: async (song) => {
        try {
            const response = await axios.post('https://musicapplicationbackend-production.up.railway.app/api/songs', song);
            return response.data;
        } catch (error) {
            console.error('Error creating song', error);
            throw error;
        }
    },

    updateSong: async (id, song) => {
        try {
            const response = await axios.put(`https://musicapplicationbackend-production.up.railway.app/api/songs/${id}`, song);
            return response.data;
        } catch (error) {
            console.error(`Error updating song ${id}`, error);
            throw error;
        }
    },

    deleteSong: async (id) => {
        try {
            await axios.delete(`https://musicapplicationbackend-production.up.railway.app/api/songs/delete/${id}`);
        } catch (error) {
            console.error(`Error deleting song ${id}`, error);
            throw error;
        }
    },

    likeSong: async (userEmail,songId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend-production.up.railway.app/api/songs/${userEmail}/${songId}/like`);
            return response.data;
        } catch (error) {
            console.error(`Error liking album ${songId}`, error);
            throw error;
        }
    },

    unlikeSong: async (userEmail,songId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend-production.up.railway.app/api/songs/${userEmail}/${songId}/unlike`);
            return response.data;
        } catch (error) {
            console.error(`Error unliking album ${songId}`, error);
            throw error;
        }
    },

    getLikedSongsByUserId: async (userEmail) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/songs/${userEmail}/liked-songs`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching liked songs for user ${userEmail}`, error);
            throw error;
        }
    }

};
export default songService;
