import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddFoodPage from './pages/AddFood/AddFoodPage';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import EditFood from './pages/EditFood/EditFood';
import Login from './pages/AdminLogin/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import { StoreContext } from './context/StoreContext';

// A wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { token } = useContext(StoreContext);

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Login route (public) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ListFood />} />
          <Route path="add" element={<AddFoodPage />} />
          <Route path="list" element={<ListFood />} />
          <Route path="orders" element={<Orders />} />
          <Route path="edit-food/:id" element={<EditFood />} />
        </Route>

        {/* Catch-all: redirect to login */}
      
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;
