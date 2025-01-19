import { useContext } from "react";
import { Outlet, useLocation, Link } from "react-router-dom"; // Import Link from react-router-dom
import { userContext } from "../../utils/userContext";

const Navbar = () => {
    const location = useLocation();
    const { user, setUser } = useContext(userContext);


    const handleLogout = () => {
        // Clear user and access token
        localStorage.removeItem("accessToken");
        setUser(null); // Clear user context
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-600 text-white flex flex-col fixed h-full">
                <div className="p-4 text-2xl font-bold border-b border-blue-500">
                    Idea Sharing
                </div>
                <ul className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <li>
                        <Link
                            to="/home"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/home" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/my-ideas"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/my-ideas" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            My Ideas
                        </Link>
                    </li>
                    {user?.isAdmin && (
                        <>
                            <li>
                                <Link
                                    to="/moderation"
                                    className={`block py-2 px-4 rounded transition ${location.pathname === "/moderation"
                                        ? "bg-blue-500"
                                        : "hover:bg-blue-500"
                                        }`}
                                >
                                    Moderation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/analytics"
                                    className={`block py-2 px-4 rounded transition ${location.pathname === "/analytics"
                                        ? "bg-blue-500"
                                        : "hover:bg-blue-500"
                                        }`}
                                >
                                    Analytics
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link
                            to="/submit"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/submit" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            Submit Idea
                        </Link>
                    </li>
                    <li>
                        <Link
                            // to="/favorites"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/favorites" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            Favorites
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/discussions/000"
                            className={`block py-2 px-4 rounded transition ${location.pathname.startsWith("/discussions") ? "bg-blue-500 text-white" : "hover:bg-blue-500"
                                }`}
                        >
                            Discussions
                        </Link>
                    </li>

                    <li>
                        <Link
                            // to="/profile"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/profile" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            Profile
                        </Link>
                    </li>

                    <li>
                        <Link
                            onClick={handleLogout}
                            to="/login"
                            className={`block py-2 px-4 rounded transition ${location.pathname === "/logout" ? "bg-blue-500" : "hover:bg-blue-500"
                                }`}
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
                <div className="p-4 border-t border-blue-500 text-sm text-center">
                    © 2024 Idea Sharing
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-1 p-6 ml-64 overflow-y-auto"

            >
                {/* Dynamic content goes here */}
                <Outlet />
            </div>
        </div>
    );
};

export default Navbar;
