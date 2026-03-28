import React, { useState, useEffect } from "react";
import api from "../utils/api";
import ApiRoutes from "../shared/constants/apiRoutes";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading] = useState(false);

  useEffect(() => {}, []);

  const login = async (email, password) => {
    const { data } = await api.post(ApiRoutes.AUTH.LOGIN, { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (email, password, name) => {
    const { data } = await api.post(ApiRoutes.AUTH.SIGNUP, {
      email,
      password,
      name,
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post(ApiRoutes.AUTH.GOOGLE, { credential });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, googleLogin, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
