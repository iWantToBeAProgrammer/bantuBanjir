import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout, registerUser } from "../redux/slices/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, token, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      await dispatch(loginUser(email, password));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      await dispatch(registerUser(name, email, password));
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.message || error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout: handleLogout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
