import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        TravelTrove
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Destinations
                        </button>

                        <button
                            onClick={() => navigate("/itinerary/create")}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Create Itinerary
                        </button>

                        <button
                            onClick={() => navigate("/my-itineraries")}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            My Itineraries
                        </button>
                        <button
                            onClick={() => navigate("/favorites")}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Favorites
                        </button>
                        <button
                            onClick={() => navigate("/chat")}
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Chat
                        </button>


                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        </div>
    );
};

export default Layout;
