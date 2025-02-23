import axios from 'axios';

const albumService = {
    getAllAlbums: async () => {
        try {
            const response = await axios.get('https://musicapplicationbackend.onrender.com/api/albums');
            return response.data;
        } catch (error) {
            console.error('Error fetching albums', error);
            throw error;
        }
    },

    getAlbumsById: async (id) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend.onrender.com/api/albums/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching album with id ${id}`, error);
            throw error;
        }
    },

    createAlbum: async (album) => {
        try {
            const response = await axios.post('https://musicapplicationbackend.onrender.com/api/albums/create', album);
            return response.data;
        } catch (error) {
            console.error('Error creating album', error);
            throw error;
        }
    },

    updateAlbum: async (id, album) => {
        try {
            const response = await axios.put(`https://musicapplicationbackend.onrender.com/api/albums/update/${id}`, album);
            return response.data;
        } catch (error) {
            console.error(`Error updating album ${id}`, error);
            throw error;
        }
    },

    deleteAlbum: async (id) => {
        try {
            await axios.delete(`https://musicapplicationbackend.onrender.com/api/albums/delete/${id}`);
        } catch (error) {
            console.error(`Error deleting album ${id}`, error);
            throw error;
        }
    },

    likeAlbum: async (userEmail,albumId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend.onrender.com/api/albums/${userEmail}/${albumId}/like`);
            return response.data;
        } catch (error) {
            console.error(`Error liking album ${albumId}`, error);
            throw error;
        }
    },

    unlikeAlbum: async (userEmail,albumId) => {
        try {
            const response = await axios.post(`https://musicapplicationbackend.onrender.com/api/albums/${userEmail}/${albumId}/unlike`);
            return response.data;
        } catch (error) {
            console.error(`Error unliking album ${albumId}`, error);
            throw error;
        }
    },

    getLikedAlbumsByUserId: async (userEmail) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend.onrender.com/api/albums/${userEmail}/liked-albums`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching liked albums for User ${userEmail}`, error);
            throw error;
        }
    },
    getSongsFromAlbum : async (albumId) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend.onrender.com/api/albums/get/${albumId}`,{withCredentials: true });
            return response.data;
        }catch (error){
            console.error('Error fatching songs from album',error);
            throw error;
        }
    }

};

export default albumService;
