import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home";

// Admin pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AddUser from "./pages/Admin/AddUser";
import AddStore from "./pages/Admin/AddStore";
import UsersList from "./pages/Admin/UsersList"; // Add this import
import StoresList from "./pages/Admin/StoresList"; // Add this import
import EditUser from "./pages/Admin/EditUser";
import EditStore from "./pages/Admin/EditStore";

// Store Owner pages
import StoreOwnerDashboard from "./pages/StoreOwner/Dashboard";
import StoreOwnerProfile from "./pages/StoreOwner/Profile";

// User pages
import Stores from "./pages/User/Stores";
import UserProfile from "./pages/User/Profile";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/admin/stores/add" element={<AddStore />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/stores" element={<StoresList />} />
            <Route path="/admin/profile" element={<UserProfile />} />
            <Route path="/admin/users/:id/edit" element={<EditUser />} />
            <Route path="/admin/stores/edit/:id" element={<EditStore />} />
          </Route>

          {/* Store Owner routes */}
          <Route element={<ProtectedRoute allowedRoles={["storeOwner"]} />}>
            <Route
              path="/store-owner/dashboard"
              element={<StoreOwnerDashboard />}
            />
            <Route
              path="/store-owner/profile"
              element={<StoreOwnerProfile />}
            />
          </Route>

          {/* User routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user/stores" element={<Stores />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
