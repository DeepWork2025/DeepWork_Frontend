import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAvatar } from "../../content/AvatarContext";

function Navbar() {
  const navigate = useNavigate();
  const { avatarUrl } = useAvatar();

  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("isFirstLogin");
    if (firstLogin === "true") {
      setIsFirstLogin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    alert("You have been logged out.");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <button
          onClick={() => navigate("/home")}
          className="btn btn-ghost text-xl flex justify-start"
        >
          Deep Work
        </button>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={
                  avatarUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
