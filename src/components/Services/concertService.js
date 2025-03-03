import axios from "axios";

const concertService = {
    getAllConcerts : async () => {
        try {
            const response = await axios.get("https://musicapplicationbackend-production.up.railway.app/api/concerts");
            return response.data;
        }catch (error){
            console.error("Error fetching all concerts",error)
            throw error;
        }
    },
    getConcertById : async (id) => {
        try {
            const response = await axios.get(`https://musicapplicationbackend-production.up.railway.app/api/concerts/${id}`);
            return response.data;
        }catch (error){
            console.error("Error fetching the concert" ,error);
            throw error;
        }
    },
    createConcert: async (concert) => {
        try {
            const response = await axios.post('https://musicapplicationbackend-production.up.railway.app/api/concerts', concert, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        }catch (error){
            console.error("Error creating a concert",error);
            throw error;
        }
    },
    updateConcert: async (id, concert) => {
        try {
            await axios.put(`https://musicapplicationbackend-production.up.railway.app/api/concerts/update/${id}`, concert);
        } catch (error) {
            console.error(`Error updating Concert ${id}`, error);
            throw error;
        }
    },
    deleteConcert: async (id) => {
        try {
            await axios.delete(`https://musicapplicationbackend-production.up.railway.app/api/concerts/delete/${id}`);
        }catch (error){
            console.error(`Error deleting Concert ${id}`,error);
            throw error;
        }
    }
}
export default concertService;