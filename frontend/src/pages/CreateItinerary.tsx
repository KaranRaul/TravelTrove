import { useState } from "react";
import { createItinerary } from "../api/itinerary.api";
import Layout from "../components/common/Layout";
import { useNavigate } from "react-router-dom";

const CreateItinerary = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        destination: "",
        duration: "",
        activities: "",
        lodging: "",
        dining: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createItinerary({
                destination: form.destination,
                duration: form.duration,
                activities: form.activities.split(",").map((a) => a.trim()),
                lodging: form.lodging,
                dining: form.dining,
            });

            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create itinerary");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Create Trip Itinerary
                    </h2>

                    {error && (
                        <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="destination"
                            placeholder="Destination (e.g. Bali)"
                            value={form.destination}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="duration"
                            placeholder="Duration (e.g. 5 days)"
                            value={form.duration}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            name="activities"
                            placeholder="Activities (comma separated)"
                            value={form.activities}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="lodging"
                            placeholder="Lodging (e.g. Resort)"
                            value={form.lodging}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            name="dining"
                            placeholder="Dining preference"
                            value={form.dining}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Itinerary"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateItinerary;
