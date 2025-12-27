import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { createDestination } from "../api/destination.api";

const CreateDestination = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState("");
    const [history, setHistory] = useState("");
    const [culture, setCulture] = useState("");
    const [attractions, setAttractions] = useState("");
    const [lodging, setLodging] = useState("");
    const [dining, setDining] = useState("");
    const [activities, setActivities] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const destinationData = {
                title,
                summary,
                description,
                photos: photos.split(",").map((s) => s.trim()).filter(Boolean),
                history,
                culture,
                attractions: attractions.split(",").map((s) => s.trim()).filter(Boolean),
                recommendations: {
                    lodging: lodging.split(",").map((s) => s.trim()).filter(Boolean),
                    dining: dining.split(",").map((s) => s.trim()).filter(Boolean),
                    activities: activities.split(",").map((s) => s.trim()).filter(Boolean),
                },
            };
            await createDestination(destinationData);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create destination");
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create New Destination
                            </h1>
                            <p className="mt-2 text-gray-600 text-sm">
                                Add detailed information about a destination for travelers to explore.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to Destinations
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-8">
                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Core details */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Core Details
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            placeholder="e.g., Mysuru, Karnataka"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="summary"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Summary <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="summary"
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            required
                                            rows={3}
                                            placeholder="Short overview shown in lists and cards."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows={6}
                                            placeholder="Write a detailed description covering why this destination is special."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="photos"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Photos (comma-separated URLs)
                                        </label>
                                        <input
                                            id="photos"
                                            type="text"
                                            value={photos}
                                            onChange={(e) => setPhotos(e.target.value)}
                                            placeholder="https://..., https://..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Add one or more image URLs, separated by commas.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="history"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            History
                                        </label>
                                        <textarea
                                            id="history"
                                            value={history}
                                            onChange={(e) => setHistory(e.target.value)}
                                            rows={3}
                                            placeholder="Key historical background and events."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="culture"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Culture
                                        </label>
                                        <textarea
                                            id="culture"
                                            value={culture}
                                            onChange={(e) => setCulture(e.target.value)}
                                            rows={3}
                                            placeholder="Local culture, festivals, traditions, and lifestyle."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="attractions"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Attractions (comma-separated)
                                        </label>
                                        <input
                                            id="attractions"
                                            type="text"
                                            value={attractions}
                                            onChange={(e) => setAttractions(e.target.value)}
                                            placeholder="Palace, Museum, Park, ..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Example: Mysore Palace, Brindavan Gardens, Chamundi Hill.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Recommendations */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Recommendations
                                </h2>
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="md:col-span-1">
                                        <label
                                            htmlFor="lodging"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Lodging (comma-separated)
                                        </label>
                                        <input
                                            id="lodging"
                                            type="text"
                                            value={lodging}
                                            onChange={(e) => setLodging(e.target.value)}
                                            placeholder="Hotels, homestays, etc."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Example: Hotel A, Boutique Stay B.
                                        </p>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label
                                            htmlFor="dining"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Dining (comma-separated)
                                        </label>
                                        <input
                                            id="dining"
                                            type="text"
                                            value={dining}
                                            onChange={(e) => setDining(e.target.value)}
                                            placeholder="Popular restaurants or food spots."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Example: Restaurant X, Cafe Y.
                                        </p>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label
                                            htmlFor="activities"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Activities (comma-separated)
                                        </label>
                                        <input
                                            id="activities"
                                            type="text"
                                            value={activities}
                                            onChange={(e) => setActivities(e.target.value)}
                                            placeholder="Guided tours, treks, experiences."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Example: City walk, food tour, trek.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/destinations")}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            Creating...
                                        </span>
                                    ) : (
                                        "Create Destination"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateDestination;
