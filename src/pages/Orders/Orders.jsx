import { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { getAllOrders, updateFoodStatus } from '../../service/OrderService';

const Orders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await getAllOrders(token);
      setData(Array.isArray(orders) ? orders : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    
    try {
      // Optimistically update the UI first
      setData(prevData => 
        prevData.map(order => 
          order.id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      const response = await updateFoodStatus(newStatus, orderId, token);
      
      // If the API call fails, revert the change
      if (response.status !== 200) {
        // Revert the optimistic update by fetching fresh data
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert the optimistic update on error
      await fetchOrders();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Food Preparing':
        return 'badge bg-warning text-dark';
      case 'Out For Delivery':
        return 'badge bg-info text-white';
      case 'Delivered':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  const getSelectClass = (status) => {
    switch (status) {
      case 'Food Preparing':
        return 'form-select border-warning';
      case 'Out For Delivery':
        return 'form-select border-info';
      case 'Delivered':
        return 'form-select border-success';
      default:
        return 'form-select';
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-3 py-5" style={{ marginTop: '2rem !important' }}>
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark mb-0">
              <i className="bi bi-clipboard-check me-2"></i>
              Orders Management
            </h2>
            <span className="badge bg-primary rounded-pill fs-6">
              {data.length} Total Orders
            </span>
          </div>

          {/* Orders Table */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 text-secondary">Recent Orders</h5>
            </div>
            <div className="card-body p-0">
              {data.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No orders found</h4>
                  <p className="text-muted">Orders will appear here once customers place them.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="border-0 ps-4">
                          <i className="bi bi-truck me-2"></i>Order
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-list-ul me-2"></i>Items & Address
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-currency-rupee me-2"></i>Amount
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-hash me-2"></i>Quantity
                        </th>
                        <th scope="col" className="border-0">
                          <i className="bi bi-clock-history me-2"></i>Status
                        </th>
                        <th scope="col" className="border-0 pe-4">
                          <i className="bi bi-gear me-2"></i>Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((order, index) => (
                        <tr key={index} className="align-middle">
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <img 
                                  src={assets.delivery} 
                                  alt="Delivery" 
                                  height={32} 
                                  width={32}
                                  className="rounded"
                                />
                              </div>
                              <div>
                                <h6 className="mb-0 fw-semibold">Order #{index + 1}</h6>
                                <small className="text-muted">ID: {order.id}</small>
                              </div>
                            </div>
                          </td>
                          
                          <td style={{ maxWidth: '300px' }}>
                            <div className="mb-2">
                              <strong className="text-dark">Items:</strong>
                              <div className="text-muted small mt-1">
                                {order.orderedItems.map((item, idx) => (
                                  <span key={idx} className="d-inline-block me-2 mb-1">
                                    <span className="badge bg-light text-dark border">
                                      {item.name} × {item.quantity}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <strong className="text-dark">Address:</strong>
                              <div className="text-muted small mt-1">
                                <i className="bi bi-geo-alt me-1"></i>
                                {order.userAddress}
                              </div>
                            </div>
                          </td>
                          
                          <td>
                            <div className="fw-bold text-success fs-5">
                              ₹{(order.amount / 100).toFixed(2)}
                            </div>
                          </td>
                          
                          <td>
                            <span className="badge bg-info text-white rounded-pill">
                              {order.orderedItems.length} items
                            </span>
                          </td>
                          
                          <td>
                            <span className={getStatusBadgeClass(order.orderStatus)}>
                              {order.orderStatus}
                            </span>
                          </td>
                          
                          <td className="pe-4">
                            <select 
                              className={`${getSelectClass(order.orderStatus)} form-select-sm`}
                              onChange={(event) => updateStatus(event, order.id)} 
                              value={order.orderStatus}
                              style={{ minWidth: '160px' }}
                            >
                              <option value="Food Preparing">🍳 Food Preparing</option>
                              <option value="Out For Delivery">🚚 Out For Delivery</option>
                              <option value="Delivered">✅ Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          {data.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <h5 className="card-title text-warning">
                      {data.filter(order => order.orderStatus === 'Food Preparing').length}
                    </h5>
                    <p className="card-text text-muted mb-0">Preparing</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <h5 className="card-title text-info">
                      {data.filter(order => order.orderStatus === 'Out For Delivery').length}
                    </h5>
                    <p className="card-text text-muted mb-0">Out for Delivery</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <h5 className="card-title text-success">
                      {data.filter(order => order.orderStatus === 'Delivered').length}
                    </h5>
                    <p className="card-text text-muted mb-0">Delivered</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary">
                      ₹{data.reduce((sum, order) => sum + (order.amount / 100), 0).toFixed(2)}
                    </h5>
                    <p className="card-text text-muted mb-0">Total Revenue</p>
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

export default Orders;