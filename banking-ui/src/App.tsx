import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function RequireRole({
  role,
  children,
}: {
  role: "ADMIN" | "CUSTOMER";
  children: React.ReactElement;
}) {
  const current = sessionStorage.getItem("role");
  if (current !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/customer"
          element={
            <RequireRole role="CUSTOMER">
              <CustomerDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminDashboard />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
