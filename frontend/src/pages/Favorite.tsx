import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { getFavorites, removeFavorite } from "../api/favorite.api";
import { FavoriteItem } from "../types/favorite";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        const res = await getFavorites();
        setFavorites(res.data.favorites);
    };

    const handleRemove = async (favId: string) => {
        await removeFavorite(favId);
        load();
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">My Favorites</h2>

                    {favorites.length === 0 && (
                        <p className="text-gray-500 text-center">
                            No favorites added yet.
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((fav) => (
                            <div
                                key={fav._id}
                                className="bg-white rounded-lg shadow p-5 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {fav.type === "destination-guide"
                                            ? "Destination Guide"
                                            : "Trip Itinerary"}
                                    </p>

                                    <p className="font-medium text-gray-800">
                                        {fav.type === "destination-guide"
                                            ? fav.destinationGuide?.title
                                            : fav.tripItinerary?.destination}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                fav.type === "destination-guide"
                                                    ? `/destinations/${fav.destinationGuide?._id}`
                                                    : `/itinerary/${fav.tripItinerary?._id}`
                                            )
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </button>


                                    <button
                                        onClick={() => handleRemove(fav._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Favorites;
