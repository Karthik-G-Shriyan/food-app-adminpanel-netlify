import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getAllFoods, deleteFoodById } from '../../service/FoodService';
import { StoreContext } from '../../context/StoreContext';

const ListFood = () => {
  const { token } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getAllFoods(token);
      setList(data);
    } catch (error) {
      toast.error("Error while fetching the saved foods");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await deleteFoodById(token, id);
        toast.success('Food deleted successfully');
        fetchList(); // Refresh the list
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete the food');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-food/${id}`);
  };

  // Get unique categories
  const categories = ['All', ...new Set(list.map(item => item.category))];

  // Filter foods based on search and category
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading food items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 mx-5" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="row">
        <div className="col-12">
          {/* Header Section */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Food Management
              </h2>
              <p className="text-muted mb-0">Manage your restaurant's food items</p>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-primary rounded-pill fs-6 me-3">
                {filteredList.length} Items
              </span>
              <button 
                className="btn btn-success d-flex align-items-center"
                onClick={() => navigate('/add')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Food
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search food items by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'All' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Food Items Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-secondary">
                  <i className="bi bi-table me-2"></i>
                  Food Items
                </h5>
                {searchTerm && (
                  <small className="text-muted">
                    Showing results for "{searchTerm}"
                  </small>
                )}
              </div>
            </div>
            
            <div className="card-body p-0">
              {filteredList.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-basket display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">
                    {searchTerm ? 'No matching food items found' : 'No food items found'}
                  </h4>
                  <p className="text-muted">
                    {searchTerm 
                      ? 'Try adjusting your search criteria'
                      : 'Start by adding your first food item'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      className="btn btn-primary mt-3"
                      onClick={() => navigate('/add-food')}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add First Food Item
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="border-0 ps-4">
                          <i className="bi bi-image me-2"></i>Image
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-card-text me-2"></i>Name
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-tag me-2"></i>Category
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-currency-rupee me-2"></i>Price
                        </th>
                        <th scope="col" className="border-0 pe-4">
                          <i className="bi bi-gear me-2"></i>Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.map((item, index) => (
                        <tr key={item.id ?? index} className="align-middle">
                          <td className="ps-4">
                            <div className="position-relative">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-3 shadow-sm"
                                style={{ 
                                  objectFit: "cover",
                                  border: "2px solid #f8f9fa"
                                }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNERUUyRTYiLz4KPC9zdmc+';
                                }}
                              />
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" 
                                    style={{ fontSize: '0.6rem' }}>
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          
                          <td>
                            <div>
                              <h6 className="mb-1 fw-semibold text-dark">{item.name}</h6>
                              {item.description && (
                                <small className="text-muted">
                                  {item.description.length > 50 
                                    ? item.description.substring(0, 50) + '...'
                                    : item.description
                                  }
                                </small>
                              )}
                            </div>
                          </td>
                          
                          <td>
                            <span className="badge bg-light text-dark border px-3 py-2">
                              <i className="bi bi-tag-fill me-1"></i>
                              {item.category}
                            </span>
                          </td>
                          
                          <td>
                            <div className="fw-bold text-success fs-5">
                              ₹{item.price}.00
                            </div>
                          </td>
                          
                          <td className="pe-4">
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                onClick={() => handleEdit(item.id)}
                                title="Edit food item"
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                onClick={() => handleDelete(item.id ?? index)}
                                title="Delete food item"
                              >
                                <i className="bi bi-trash3 me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          {filteredList.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <i className="bi bi-basket2 display-6 text-primary mb-2"></i>
                    <h5 className="card-title text-primary mb-1">{list.length}</h5>
                    <p className="card-text text-muted mb-0 small">Total Items</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <i className="bi bi-tags display-6 text-success mb-2"></i>
                    <h5 className="card-title text-success mb-1">{categories.length - 1}</h5>
                    <p className="card-text text-muted mb-0 small">Categories</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <i className="bi bi-currency-rupee display-6 text-warning mb-2"></i>
                    <h5 className="card-title text-warning mb-1">
                      ₹{Math.min(...list.map(item => item.price))}
                    </h5>
                    <p className="card-text text-muted mb-0 small">Min Price</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <i className="bi bi-currency-rupee display-6 text-info mb-2"></i>
                    <h5 className="card-title text-info mb-1">
                      ₹{Math.max(...list.map(item => item.price))}
                    </h5>
                    <p className="card-text text-muted mb-0 small">Max Price</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListFood;