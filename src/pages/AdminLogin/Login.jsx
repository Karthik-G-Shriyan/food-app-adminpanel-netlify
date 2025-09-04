import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from '../../service/AuthService';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import './login.css'; 

const Login = () => {
    const navigate = useNavigate();
    const { setToken } = useContext(StoreContext);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const onchangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await login(data);
            if (response.status === 200) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful!');
                navigate("/");
            } else {
                toast.error('Unable to login. Please try again!');
            }
        } catch (error) {
            console.log('error while logging in', error);
            toast.error('Unable to login. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="loginCard">
                <div className="header">
                    <h2 className="title">Admin Login</h2>
                    <p className="subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={onSubmitHandler}>
                    <div className="formGroup">
                        <label className="label">Email</label>
                        <div className="inputGroup">
                            <MdEmail className="inputIcon" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={onchangeHandler}
                                required
                                disabled={isLoading}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="formGroup">
                        <label className="label">Password</label>
                        <div className="inputGroup">
                            <MdLock className="inputIcon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={onchangeHandler}
                                required
                                disabled={isLoading}
                                className="passwordInput"
                            />
                            <div 
                                className="eyeIcon"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`submitBtn ${isLoading ? 'submitBtnDisabled' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="forgotPassword">
                    <a href="#" className="forgotLink">
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
