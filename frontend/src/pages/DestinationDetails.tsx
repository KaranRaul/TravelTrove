import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { getDestinationById } from "../api/destination.api";
import { DestinationGuide } from "../types/destination";
import { addFavorite } from "../api/favorite.api";
import { getReviews, addReview } from "../api/review.api";
import { Review } from "../types/review";

const DestinationDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState<DestinationGuide | null>(null);
    const [loading, setLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [avgRating, setAvgRating] = useState(0);

    const loadReviews = async () => {
        if (!id) return;
        const res = await getReviews(id);
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
    };

    useEffect(() => {
        if (!id) return;

        Promise.all([
            getDestinationById(id),
            loadReviews(),
        ])
            .then(([destRes]) => setData(destRes.data))
            .finally(() => setLoading(false));
    }, [id]);

    const submitReview = async () => {
        if (!id || !comment.trim()) return;
        await addReview(id, rating, comment);
        setComment("");
        loadReviews();
    };

    const handleFavorite = async () => {
        if (!id) return;
        setFavoriteLoading(true);
        try {
            await addFavorite("destination-guide", id);
            alert("Added to favorites");
        } catch {
            alert("Already added or failed");
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-20 text-gray-500">
                    Loading destination...
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="flex justify-center py-20 text-red-500">
                    Destination not found
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen px-4 py-10">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* DESTINATION CARD */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {data.title}
                            </h1>

                            <button
                                onClick={handleFavorite}
                                disabled={favoriteLoading}
                                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {favoriteLoading ? "Adding..." : "Add to Favorites"}
                            </button>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-8">
                            {data.description}
                        </p>

                        {data.attractions?.length > 0 && (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Top Attractions
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {data.attractions.map((a, i) => (
                                        <li
                                            key={i}
                                            className="bg-gray-100 rounded-md px-4 py-2 text-gray-700"
                                        >
                                            {a}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            Reviews ({reviews.length})
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Average Rating: ⭐ {avgRating}
                        </p>

                        {/* ADD REVIEW */}
                        <div className="bg-gray-100 rounded-md p-4 mb-8 space-y-3">
                            <div className="flex gap-3">
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="border rounded px-3 py-2"
                                >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>
                                            {n} ⭐
                                        </option>
                                    ))}
                                </select>

                                <input
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your review..."
                                    className="flex-1 border rounded px-4 py-2"
                                />
                            </div>

                            <button
                                onClick={submitReview}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Submit Review
                            </button>
                        </div>

                        {/* REVIEWS LIST */}
                        <div className="space-y-4">
                            {reviews.length === 0 && (
                                <p className="text-gray-500">
                                    No reviews yet. Be the first to review!
                                </p>
                            )}

                            {reviews.map((r) => (
                                <div
                                    key={r._id}
                                    className="border rounded-md p-4"
                                >
                                    <p className="font-medium text-gray-800">
                                        {r.user.email} · ⭐ {r.rating}
                                    </p>
                                    <p className="text-gray-700 mt-1">
                                        {r.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default DestinationDetails;
