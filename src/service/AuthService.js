import axios from "axios";

const API_URL = 'https://online-food-application-backend-railway-app-production.up.railway.app/api/admin/login';

export const login = async (data) => {

    try {
        const response =await axios.post(
            API_URL, data
        );
        return response;
    }
    catch (error) {
        console.log("error while log in");
        throw error;
    }

}