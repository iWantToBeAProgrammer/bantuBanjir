import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";

const Navbar = () => {
  const navigator = useNavigate();
  const { user } = useAuth();

  console.log(user)

  return (
    <>
      <div className="navbar bg-transparent absolute top-0">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">BantuBanjir</a>
        </div>
        <div className="flex-none">
          {!user ? (
            <ul className="menu menu-horizontal px-3 gap-4">
              <li>
                <button
                  className="btn btn-accent btn-sm h-8 px-7"
                  onClick={() => navigator("/login")}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="btn btn-primary btn-sm h-8 px-7"
                  onClick={() => navigator("/register")}
                >
                  Register
                </button>
              </li>
            </ul>
          ) : (
            <button
              className="p-3 bg-secondary rounded-full"
              type="button"
              onClick={() => navigator("/dashboard")}
            >
              <User className="h-10 w-10" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
