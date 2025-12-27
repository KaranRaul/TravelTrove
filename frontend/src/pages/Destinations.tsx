import { useState, useEffect, useContext } from "react";
import { getDestinations } from "../api/destination.api";
import { DestinationGuide } from "../types/destination";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/common/Layout";
import { AuthContext } from "../context/AuthContext";

export const Destinations = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DestinationGuide[]>([]);
    const [loading, setLoading] = useState(false);
    const [manageMode, setManageMode] = useState(false); // admin view toggle
    const navigate = useNavigate();
    const { role } = useContext(AuthContext);

    const isAdmin = role === "admin";

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            const res = await getDestinations();
            setResults(res.data.destinationGuides);
            setLoading(false);
        };
        fetchTrending();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        const res = await getDestinations(query);
        setResults(res.data.destinationGuides);
        setLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Layout>
            <div
                className={
                    isAdmin
                        ? "min-h-screen bg-gray-50"
                        : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
                }
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4 mb-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                        {isAdmin ? "Manage Destinations" : "Explore Destinations"}
                                    </h1>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isAdmin
                                            ? "bg-gray-900 text-white"
                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                            }`}
                                    >
                                        {isAdmin ? "Admin" : "Traveler"}
                                    </span>
                                </div>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
                                    {isAdmin
                                        ? "Create, update, and organize destination guides for your users."
                                        : "Discover amazing places around the world and plan your next adventure."}
                                </p>
                            </div>

                            {/* Admin toolbar */}
                            {isAdmin && (
                                <div className="flex items-center justify-center md:justify-end gap-3">
                                    {/* <button
                                        onClick={() => setManageMode((m) => !m)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${manageMode
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {manageMode ? "Exit manage view" : "Manage view"}
                                    </button> */}
                                    <Link to="/destinations/create">
                                        <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Add destination
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Small meta for admin */}
                        {isAdmin && (
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    {results.length} destinations in system
                                </span>
                                {query && (
                                    <span className="px-2 py-1 rounded-full bg-gray-100">
                                        Filter: “{query}”
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto mb-10">
                        <div
                            className={`flex gap-3 rounded-full overflow-hidden bg-white p-2 shadow ${isAdmin ? "shadow-sm border border-gray-200" : "shadow-lg"
                                }`}
                        >
                            <input
                                type="text"
                                placeholder={
                                    isAdmin
                                        ? "Search destinations by title or keyword..."
                                        : "Search for destinations..."
                                }
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-6 py-3 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className={`px-6 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isAdmin
                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-xl"
                                    }`}
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div
                                className={`animate-spin rounded-full h-12 w-12 border-4 ${isAdmin
                                    ? "border-gray-400 border-t-gray-900"
                                    : "border-blue-600 border-t-transparent"
                                    }`}
                            ></div>
                        </div>
                    ) : (
                        <div
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isAdmin ? "pb-6" : ""
                                }`}
                        >
                            {results.map((d) => (
                                <div
                                    key={d._id}
                                    className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isAdmin
                                        ? "bg-white border border-gray-200 hover:shadow-md"
                                        : "bg-white shadow-md hover:shadow-2xl transform hover:-translate-y-2"
                                        }`}
                                    onClick={() =>
                                        navigate(`/destinations/${d._id}`, {
                                            state: { fromAdmin: isAdmin },
                                        })
                                    }
                                >
                                    {/* Optional admin badge/label strip */}
                                    {isAdmin && (
                                        <div className="px-4 pt-4 flex items-center justify-between text-[11px] text-gray-500">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Published
                                            </span>
                                            <span className="uppercase tracking-wide">
                                                ID: {d._id.slice(-6)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h3
                                            className={`text-lg md:text-xl font-bold mb-3 ${isAdmin
                                                ? "text-gray-900"
                                                : "text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                                                }`}
                                        >
                                            {d.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 text-sm md:text-base">
                                            {d.summary}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            {/* Share Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const url = `${window.location.origin}/destinations/${d._id}`;
                                                    navigator.clipboard.writeText(url);
                                                    alert("Copied to clipboard!");
                                                }}
                                                className="p-2 rounded-full hover:bg-gray-200"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                                </svg>
                                            </button>

                                            <div
                                                className={`flex items-center gap-1 font-semibold ${isAdmin ? "text-gray-700" : "text-blue-600"
                                                    } group-hover:gap-2 transition-all duration-300`}
                                            >
                                                <span className="text-xs md:text-sm">
                                                    {isAdmin ? "Open details" : "View details"}
                                                </span>
                                                <svg
                                                    className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && results.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="w-24 h-24 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                No destinations found
                            </h3>
                            <p className="text-gray-500">
                                {isAdmin
                                    ? "Adjust your filters or create a new destination."
                                    : "Try adjusting your search query."}
                            </p>
                            {isAdmin && (
                                <div className="mt-6">
                                    <Link to="/destinations/create">
                                        <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                                            Create first destination
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
