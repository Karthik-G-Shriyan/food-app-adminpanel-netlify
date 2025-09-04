import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/orders";

export const getAllOrders = async (token) => {

    try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }

}


export const updateFoodStatus = async (status, orderId, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/status/${orderId}?status=${status}`, 
      null, // PATCH body is empty;  sending status via URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Status updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating order status:",
      error.response?.data || error.message
    );
    throw error; // re-throw if you want to handle it further
  }
};
