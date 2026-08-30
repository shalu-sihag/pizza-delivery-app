import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");

    return storedAdmin
      ? JSON.parse(storedAdmin)
      : null;
  });

  const adminLogin = (adminData, token) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem(
      "admin",
      JSON.stringify(adminData)
    );

    setAdmin(adminData);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};