import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
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

      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content absolute bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link to="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>

          <li>
            <a>Settings</a>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
