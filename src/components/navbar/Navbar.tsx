import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex h-[56px] justify-between px-6 py-4 bg-gray-100 shadow">
      <Link to="/home" className="text-xl font-bold">
        Deep Work
      </Link>
      {user ? (
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      ) : (
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
