import { useEffect, useState } from "react";
import Layout from "../components/common/Layout";
import { getMyItineraries, deleteItinerary } from "../api/itinerary.api";
import { TripItinerary } from "../types/itinerary";
import { useNavigate } from "react-router-dom";

const MyItineraries = () => {
    const [data, setData] = useState<TripItinerary[]>([]);
    const navigate = useNavigate();

    const load = async () => {
        const res = await getMyItineraries();
        setData(res.data.itineraries);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this itinerary?")) return;
        await deleteItinerary(id);
        load();
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">My Itineraries</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.map((i) => (
                            <div
                                key={i._id}
                                className="bg-white p-6 rounded-lg shadow"
                            >
                                <h3 className="text-lg font-medium">{i.destination}</h3>
                                <p className="text-gray-600">{i.duration}</p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => navigate(`/itinerary/${i._id}`)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/itinerary/edit/${i._id}`)}
                                        className="text-yellow-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(i._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.length === 0 && (
                        <p className="text-gray-500 text-center mt-10">
                            No itineraries created yet.
                        </p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyItineraries;
