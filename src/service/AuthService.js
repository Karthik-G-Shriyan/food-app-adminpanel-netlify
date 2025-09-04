import axios from "axios";

const API_URL = 'http://localhost:8080/api/admin/login';

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