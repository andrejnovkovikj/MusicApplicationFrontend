import axios from 'axios';

const userService = {
    getAllUsers: async () => {
        try {
            const response = await axios.get('https://musicapplicationbackend-production.up.railway.app/api/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with id ${id}`, error);
            throw error;
        }
    },
    getCurrentUser: async () => {
        try {
            const response = await axios.get('https://musicapplicationbackend-production.up.railway.app/api/users/current-user')
            return response.data;
        }catch (error){
            console.error('Error fetching current user');
            throw error;
        }
    },

    createUser: async (user) => {
        try {
            const response = await axios.post('https://musicapplicationbackend-production.up.railway.app/api/users/register', user);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    updateUser: async (id, user) => {
        try {
            const response = await axios.put(`https://musicapplicationbackend-production.up.railway.app/api/users/${id}`, user);
            return response.data;
        } catch (error) {
            console.error(`Error updating user with id ${id}`, error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await axios.delete(`https://musicapplicationbackend-production.up.railway.app/api/users/${id}`);
        } catch (error) {
            console.error(`Error deleting user with id ${id}`, error);
            throw error;
        }
    },
};

export default userService;
