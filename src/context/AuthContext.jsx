import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ========================================
  // CUSTOMER USER
  // ========================================

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });


  // ========================================
  // ADMIN USER
  // ========================================

  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");

    return storedAdmin
      ? JSON.parse(storedAdmin)
      : null;
  });


  // ========================================
  // CUSTOMER LOGIN
  // ========================================

  const login = (userData, token) => {

    // Store customer session
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };


  // ========================================
  // CUSTOMER LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };


  // ========================================
  // ADMIN LOGIN
  // ========================================

  const adminLogin = (adminData, token) => {

    // Store admin session
    localStorage.setItem(
      "adminToken",
      token
    );

    localStorage.setItem(
      "admin",
      JSON.stringify(adminData)
    );

    setAdmin(adminData);
  };


  // ========================================
  // ADMIN LOGOUT
  // ========================================

  const adminLogout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setAdmin(null);
  };


  // ========================================
  // CONTEXT
  // ========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,

        admin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ========================================
// CUSTOM HOOK
// ========================================

export const useAuth = () => {
  return useContext(AuthContext);
};