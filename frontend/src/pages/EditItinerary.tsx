import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { getItineraryById, updateItinerary } from "../api/itinerary.api";

const EditItinerary = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        destination: "",
        duration: "",
        activities: "",
        lodging: "",
        dining: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load existing itinerary
    useEffect(() => {
        if (!id) return;

        getItineraryById(id)
            .then((res) => {
                const data = res.data;
                setForm({
                    destination: data.destination || "",
                    duration: data.duration || "",
                    activities: data.activities?.join(", ") || "",
                    lodging: data.lodging || "",
                    dining: data.dining || "",
                });
            })
            .catch(() => setError("Failed to load itinerary"));
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        setError("");

        try {
            await updateItinerary(id, {
                destination: form.destination,
                duration: form.duration,
                activities: form.activities
                    .split(",")
                    .map((a) => a.trim())
                    .filter(Boolean),
                lodging: form.lodging,
                dining: form.dining,
            });

            navigate("/my-itineraries");
        } catch (err: any) {
            setError(err.response?.data?.error || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Edit Itinerary
                    </h2>

                    {error && (
                        <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="destination"
                            placeholder="Destination"
                            value={form.destination}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="duration"
                            placeholder="Duration (e.g. 5 days)"
                            value={form.duration}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            name="activities"
                            placeholder="Activities (comma separated)"
                            value={form.activities}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="lodging"
                            placeholder="Lodging"
                            value={form.lodging}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="dining"
                            placeholder="Dining preference"
                            value={form.dining}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Itinerary"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default EditItinerary;
