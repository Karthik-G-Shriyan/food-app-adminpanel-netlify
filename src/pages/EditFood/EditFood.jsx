import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodById, updateFood } from '../../service/FoodService.js';
import { ToastContainer, toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext.jsx';

const EditFood = () => {
   const { token } = useContext(StoreContext);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
  const { id } = useParams(); // get food ID from route

  const [data, setData] = useState({
    name: '',
    description: '',
    category: '',
    price: ''
  });




  // Fetch existing food data on mount
  useEffect(() => {
  if (!token) return; // wait for token

  const fetchData = async () => {
    try {
      const food = await getFoodById(token, id);
      setData({
        name: food.name,
        description: food.description,
        category: food.category,
        price: food.price,
      });
      if (food.imageUrl) {
        setImage(food.imageUrl);
        setImagePreview(food.imageUrl);
      }
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to fetch food details");
    }
  };

  fetchData();
}, [id, token]);





   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file');
          return;
        }
  
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };


      const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    // Clear the file input
    document.getElementById('image').value = '';
  };



  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

   const onSubmitHandler = async (event) => {
      event.preventDefault();
      
      // Validation
      if (!image) {
        toast.error('Please select an image');
        return;
      }
      
      if (!data.name.trim()) {
        toast.error('Please enter food name');
        return;
      }
      
      if (!data.description.trim()) {
        toast.error('Please enter food description');
        return;
      }
      
      if (!data.category) {
        toast.error('Please select a category');
        return;
      }
      
      if (!data.price || data.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
  
      setLoading(true);
      try {
        await updateFood(token, id, data, image);
        toast.success('Food updated successfully!');
        
        // Reset form
        setData({ name: '', description: '', category: '', price: '' });
        setImage(null);
        setImagePreview(null);
        document.getElementById('image').value = '';
        
        // Optional: Navigate back to list after success
        setTimeout(() => {
          navigate('/food-list');
        }, 2000);
        
      } catch (error) {
        console.error('Error while updating food:', error);
        toast.error('Error while updating food');
      } finally {
        setLoading(false);
      }
    };




   const categories = [
    { value: 'pizza', label: 'Pizza', icon: '🍕' },
    { value: 'burger', label: 'Burger', icon: '🍔' },
    { value: 'french-fries', label: 'French Fries', icon: '🍟' },
    { value: 'rolls', label: 'Rolls', icon: '🌯' },
    { value: 'sandwich', label: 'Sandwich', icon: '🥪' },
    { value: 'salad', label: 'Salad', icon: '🥗' },
    { value: 'pasta', label: 'Pasta', icon: '🍝' },
    { value: 'biriyani', label: 'Biriyani', icon: '🍛' },
    { value: 'rice', label: 'Rice', icon: '🍚' },
    { value: 'cake', label: 'Cake', icon: '🎂' },
    { value: 'icecream', label: 'Ice Cream', icon: '🍨' },
    { value: 'juice', label: 'Juice', icon: '🧃' },
    { value: 'beverages', label: 'Beverages', icon: '🥤' }
  ];

  return (
    <div className="my-4" style={{ paddingTop: '2rem', paddingBottom: '2rem'  }}>
      <div className="row justify-content-center">
         <div className="col-12 col-md-10 col-lg-8" style={{ maxWidth: '900px', width: '100%' }}>
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/food-list')}
              type="button"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <i className="bi bi-plus-circle me-2 text-success"></i>
                Update Food Item
              </h2>
              <p className="text-muted mb-0">Edit an existing food item for your menu</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 text-secondary">
                <i className="bi bi-card-text me-2"></i>
                Food Details
              </h5>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={onSubmitHandler}>
                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-image me-2"></i>Food Image *
                  </label>
                  <div className="text-center">
                    <div 
                      className="border border-2 border-dashed rounded-3 p-4 position-relative"
                      style={{ 
                        borderColor: imagePreview ? '#198754' : '#dee2e6',
                        backgroundColor: imagePreview ? '#f8f9fa' : '#fbfcfd'
                      }}
                    >
                      {imagePreview ? (
                        <div className="position-relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded-3 shadow-sm"
                            style={{ maxHeight: '250px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle"
                            onClick={removeImage}
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                          <div className="mt-3">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Image Selected
                            </span>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="image" className="cursor-pointer w-100">
                          <div className="d-flex flex-column align-items-center justify-content-center py-4">
                            <i className="bi bi-cloud-upload display-4 text-muted mb-3"></i>
                            <h6 className="text-dark mb-2">Click to upload food image</h6>
                            <p className="text-muted small mb-0">
                              Supports: JPG, PNG • Max size: 5MB
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <i className="bi bi-card-text me-2"></i>Food Name *
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      placeholder="Enter food name..."
                      value={data.name}
                      onChange={onChangeHandler}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label fw-semibold">
                      <i className="bi bi-currency-rupee me-2"></i>Price *
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        value={data.price}
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label fw-semibold">
                    <i className="bi bi-tag me-2"></i>Category *
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="category"
                    name="category"
                    value={data.category}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">
                    <i className="bi bi-text-paragraph me-2"></i>Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Describe your food item..."
                    value={data.description}
                    onChange={onChangeHandler}
                    required
                  />
                  <div className="form-text">
                    {data.description.length}/500 characters
                  </div>
                </div>

                {/* Form Actions */}
                <div className="d-flex gap-3 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/food-list')}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-success px-4 flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating Food...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Update Food Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Help Card */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body">
              <h6 className="text-primary mb-3">
                <i className="bi bi-lightbulb me-2"></i>
                Tips for better results
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled small text-muted">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Use high-quality, well-lit images
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Write detailed, appetizing descriptions
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled small text-muted">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Choose appropriate categories
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Set competitive pricing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFood;
