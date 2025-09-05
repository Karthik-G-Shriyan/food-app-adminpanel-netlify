import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { HiMenu, HiUser, HiLogout, HiX, HiHome, HiClipboardList, HiUsers, HiPlus } from 'react-icons/hi';

import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';


const AdminDashboard = () => {

  const { setToken } = useContext(StoreContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    sessionStorage.removeItem('token');
    setToken("");
    navigate('/login');
  };

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);  // Debug log
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm position-fixed w-100" style={{ zIndex: 1050, top: 0 }}>
        <div className="container-fluid px-5">
          {/* Left: Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="btn btn-outline-secondary me-3"
            type="button"
          >
            <HiMenu size={25} />
          </button>

          {/* Center: App Name */}
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <img
                src={assets.logo}
                alt="Restaurant Logo"
                className="rounded shadow-sm"
                style={{
                  height: '52px',
                  width: '52px',
                  objectFit: 'contain',
                  transition: 'all 0.3s ease'
                }}
                onError={(e) => {
                  // Fallback if logo doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.classList.remove('shadow-sm');
                  e.target.classList.add('shadow');
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.classList.remove('shadow');
                  e.target.classList.add('shadow-sm');
                }}
              />
              {/* Fallback logo */}
              <div
                className="d-none align-items-center justify-content-center bg-primary rounded shadow-sm"
                style={{ height: '52px', width: '52px' }}
              >
                <span className="text-white fw-bold fs-1">R</span>
              </div>
            </div>
            <span
              className="fw-bold text-center"
              style={{
                fontSize: '28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                e.target.style.WebkitBackgroundClip = 'text';
                e.target.style.backgroundClip = 'text';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.WebkitBackgroundClip = 'text';
                e.target.style.backgroundClip = 'text';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Admin Dashboard
            </span>
          </div>

          {/* Right: User Menu */}
          <div className="dropdown mx-5">
            <button
              onClick={toggleUserDropdown}
              className="btn btn-outline-primary"
              type="button"
              style={{
                border: '3px solid #007bff',
  
              }}
            >
              <HiUser size={30} />
            </button>

            {/* User Dropdown */}
            <div className={`dropdown-menu dropdown-menu-end ${isUserDropdownOpen ? 'show' : ''}`} style={{ minWidth: '150px', marginTop: '10px' }}>
              <button
                onClick={handleLogout}
                className=" dropdown-item text-danger d-flex align-items-center"
                type="button"
              >
                <HiLogout className="me-2" size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg ${isSidebarOpen ? 'd-block' : 'd-none'}`}
        style={{
          width: '300px',
          zIndex: 1050,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Sidebar Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom" >
          <div className="sidebar-heading text-center border-bottom py-3">
            <div className="d-flex justify-content-center align-items-center mb-2 position-relative">
              <img src={assets.logo} alt="App Logo" width={38} height={38} />
              <div className="status-indicator"></div>
            </div>
            <h5 className="mb-1">Admin Panel</h5>
            <small className="text-muted d-block mb-2">Food Management &amp; Operations</small>

            <div className="d-flex justify-content-center flex-wrap gap-1">
              <span className="badge rounded-pill text-primary bg-primary-subtle">
                Operations
              </span>
              <span className="badge rounded-pill text-success bg-success-subtle">
                Management
              </span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="btn btn-sm btn-outline-secondary"
            type="button"
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-3">
          <ul className="list-unstyled mb-0">
            <li className="mb-2">
              <Link
                to="/list"
                className={`btn w-100 text-start d-flex align-items-center p-3 ${location.pathname === '/list' || location.pathname === '/'
                  ? 'btn-warning text-white'
                  : 'btn-outline-secondary'
                  }`}
                onClick={() => setIsSidebarOpen(false)} // close sidebar on mobile
              >
                <HiClipboardList className="me-3" size={20} />
                Food List
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/add"
                className={`btn w-100 text-start d-flex align-items-center p-3 ${location.pathname === '/add'
                  ? 'btn-warning text-white'
                  : 'btn-outline-secondary'
                  }`}
                onClick={() => { setIsSidebarOpen(false); handleNavigation("/add") }}
              >
                <HiPlus className="me-3" size={20} />
                Add Food
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/orders"
                className={`btn w-100 text-start d-flex align-items-center p-3 ${location.pathname === '/orders'
                  ? 'btn-warning text-white'
                  : 'btn-outline-secondary'
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <HiUsers className="me-3" size={20} />
                Orders
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/edit-food"
                className={`btn w-100 text-start d-flex align-items-center p-3 ${location.pathname.startsWith('/edit-food')
                  ? 'btn-warning text-white'
                  : 'btn-outline-secondary'
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <HiHome className="me-3" size={20} />
                Edit Food
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Click outside to close dropdown */}
      {isUserDropdownOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1030 }}
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
      {/* ✅ Main Content where nested pages render */}
      <main className="pt-5 mt-5 container-fluid">
        <Outlet />
      </main>
    </>
  );
};

export default AdminDashboard;