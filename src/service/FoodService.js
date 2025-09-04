import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/foods";

// Add food
export const addFood = async (token, foodData, image) => {
  const formData = new FormData();
  formData.append("food", JSON.stringify(foodData));
  formData.append("file", image);

  try {
    await axios.post(API_URL, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error adding food:", error.response?.data || error.message);
    throw error;
  }
};

// Get food by ID
export const getFoodById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ add token
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching food by ID:", error.response?.data || error.message);
    throw error;
  }
};

// Update food
export const updateFood = async (token, id, foodData, image) => {
  const formData = new FormData();
  formData.append("food", JSON.stringify(foodData));
  if (image) {
    formData.append("file", image);
  }

  try {
    await axios.put(`${API_URL}/${id}`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // ✅ add token
      },
    });
  } catch (error) {
    console.error("Error updating food:", error.response?.data || error.message);
    throw error;
  }
};

// Get all foods
export const getAllFoods = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ already correct
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching foods:", error.response?.data || error.message);
    throw error;
  }
};


//delete food by id
 export const deleteFoodById = async (token, id) => {
try {
      await axios.delete(`http://localhost:8080/api/admin/foods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
    } catch (error) {
      console.error(error);
    }
 };