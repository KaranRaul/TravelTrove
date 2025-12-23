import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { getItineraryById } from "../api/itinerary.api";
import { addFavorite } from "../api/favorite.api";
import { TripItinerary } from "../types/itinerary";

const ViewItinerary = () => {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
    const [loading, setLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFavorite = async () => {
        if (!itinerary?._id) return;
        setFavoriteLoading(true);
        try {
            await addFavorite("trip-itinerary", itinerary._id);
            alert("Added to favorites");
        } catch {
            alert("Already added or failed");
        } finally {
            setFavoriteLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        getItineraryById(id)
            .then((res) => setItinerary(res.data))
            .catch(() => setError("Itinerary not found"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-20 text-gray-500">
                    Loading itinerary...
                </div>
            </Layout>
        );
    }

    if (!itinerary || error) {
        return (
            <Layout>
                <div className="flex justify-center py-20 text-red-500">
                    {error || "Itinerary not found"}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen px-6 py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {itinerary.destination}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Duration: <span className="font-medium">{itinerary.duration}</span>
                            </p>
                            {itinerary.user?.email && (
                                <p className="text-sm text-gray-500">
                                    Created by {itinerary.user.email}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleFavorite}
                            disabled={favoriteLoading}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {favoriteLoading ? "Adding..." : "Add to Favorites"}
                        </button>
                    </div>

                    {/* Activities */}
                    {itinerary.activities?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                Activities
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {itinerary.activities.map((a, i) => (
                                    <li
                                        key={i}
                                        className="bg-gray-100 rounded-md px-4 py-2 text-gray-700"
                                    >
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Lodging */}
                    {itinerary.lodging && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">Lodging</h3>
                            <p className="text-gray-700">{itinerary.lodging}</p>
                        </div>
                    )}

                    {/* Dining */}
                    {itinerary.dining && (
                        <div>
                            <h3 className="font-semibold text-gray-800">Dining</h3>
                            <p className="text-gray-700">{itinerary.dining}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ViewItinerary;
