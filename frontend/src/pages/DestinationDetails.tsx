import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/common/Layout";
import { getDestinationById } from "../api/destination.api";
import { DestinationGuide } from "../types/destination";
import { addFavorite } from "../api/favorite.api";
import { getReviews, addReview } from "../api/review.api";
import { Review } from "../types/review";
import { getOrCreateConversation } from "../api/chat.api";
import { AuthContext } from "../context/AuthContext";

const isValidImageUrl = (url: string) => {
    try {
        const u = new URL(url);
        // Basic check for common image extensions
        return /\.(png|jpe?g|webp|gif|avif)$/i.test(u.pathname);
    } catch {
        return false;
    }
};

const DestinationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId, role } = useContext(AuthContext);
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

        Promise.all([getDestinationById(id), loadReviews()])
            .then(([destRes]) => setData(destRes.data))
            .finally(() => setLoading(false));
    }, [id]);

    const submitReview = async () => {
        if (!id || !comment.trim()) return;
        await addReview(id, rating, comment);
        setComment("");
        setRating(5);
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

    const handleChatWithReviewer = async (reviewer: any) => {
        try {
            const res = await getOrCreateConversation(reviewer._id);
            navigate("/chat", {
                state: {
                    conversationId: res.data.conversationId,
                    selectedUser: reviewer,
                },
            });
        } catch (error) {
            console.error("Error creating conversation:", error);
            alert("Could not start chat. Please make sure you are logged in.");
        }
    };

    const renderStars = (
        count: number,
        interactive = false,
        onSelect?: (n: number) => void
    ) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        onClick={() => interactive && onSelect && onSelect(star)}
                        className={`w-5 h-5 ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""
                            }`}
                        fill={star <= count ? "#FCD34D" : "#E5E7EB"}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading destination...</p>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center py-32">
                    <svg
                        className="w-16 h-16 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-gray-600">Destination not found</p>
                </div>
            </Layout>
        );
    }

    const validPhotos = (data.photos || []).filter((p) => isValidImageUrl(p));
    const heroPhoto = validPhotos[0];

    return (
        <Layout>
            <div className="min-h-screen bg-white">
                {/* HERO IMAGE */}
                {heroPhoto && (
                    <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100">
                        <img
                            src={heroPhoto}
                            alt={data.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="max-w-4xl mx-auto px-4 py-10">
                    {/* TITLE + META + ACTIONS */}
                    <div className="mb-8">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                    {data.title}
                                </h1>
                                <p className="mt-3 text-sm text-gray-500 max-w-xl">
                                    {data.summary}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <button
                                    onClick={handleFavorite}
                                    disabled={favoriteLoading}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">
                                        {favoriteLoading ? "Adding..." : "Save"}
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        const url = window.location.href;
                                        navigator.clipboard.writeText(url).then(() => {
                                            alert('Copied to clipboard!');
                                        });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                    </svg>
                                    <span className="text-sm font-medium">Share</span>
                                </button>

                                {role === "admin" && id && (
                                    <Link to={`/destinations/edit/${id}`}>
                                        <button className="flex items-center gap-2 px-4 py-2 border border-transparent bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shrink-0 text-sm">
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
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"
                                                />
                                            </svg>
                                            <span>Edit</span>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            {data.description}
                        </p>
                    </div>

                    {/* IMAGE GALLERY */}
                    {validPhotos.length > 1 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Photos
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {validPhotos.slice(1).map((photo, idx) => (
                                    <div
                                        key={idx}
                                        className="overflow-hidden rounded-lg bg-gray-100"
                                    >
                                        <img
                                            src={photo}
                                            alt={`${data.title} photo ${idx + 2}`}
                                            className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HISTORY & CULTURE (optional, from schema) */}
                    {(data.history || data.culture) && (
                        <div className="mb-10 grid gap-6 md:grid-cols-2 border-t border-gray-200 pt-8">
                            {data.history && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        History
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {data.history}
                                    </p>
                                </div>
                            )}
                            {data.culture && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Culture
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {data.culture}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ATTRACTIONS */}
                    {data.attractions && data.attractions.length > 0 && (
                        <div className="mb-12 pb-12 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Top Attractions
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {data.attractions.map((attraction, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span className="text-gray-700">{attraction}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* RECOMMENDATIONS (lodging / dining / activities) */}
                    {data.recommendations &&
                        (data.recommendations.lodging?.length ||
                            data.recommendations.dining?.length ||
                            data.recommendations.activities?.length) && (
                            <div className="mb-12 pb-12 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                    Recommendations
                                </h2>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {data.recommendations.lodging?.length ? (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                Lodging
                                            </h3>
                                            <ul className="space-y-1.5 text-sm text-gray-700">
                                                {data.recommendations.lodging.map((item, i) => (
                                                    <li key={i}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}

                                    {data.recommendations.dining?.length ? (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                Dining
                                            </h3>
                                            <ul className="space-y-1.5 text-sm text-gray-700">
                                                {data.recommendations.dining.map((item, i) => (
                                                    <li key={i}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}

                                    {data.recommendations.activities?.length ? (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                                Activities
                                            </h3>
                                            <ul className="space-y-1.5 text-sm text-gray-700">
                                                {data.recommendations.activities.map((item, i) => (
                                                    <li key={i}>• {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}

                    {/* REVIEWS (unchanged layout, just kept with your improved styles) */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                Reviews
                            </h2>
                            <div className="flex items-center gap-3">
                                {renderStars(Math.round(avgRating))}
                                <span className="text-lg font-medium text-gray-900">
                                    {avgRating.toFixed(1)}
                                </span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-600">
                                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Write a Review
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Rating
                                    </label>
                                    {renderStars(rating, true, setRating)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
                                    />
                                </div>
                                <button
                                    onClick={submitReview}
                                    disabled={!comment.trim()}
                                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg
                                        className="w-12 h-12 text-gray-300 mx-auto mb-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                    <p className="text-gray-500">
                                        No reviews yet. Be the first to share your experience!
                                    </p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review._id}
                                        className="pb-6 border-b border-gray-200 last:border-0"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                                                    {review.user
                                                        ? review.user.email.charAt(0).toUpperCase()
                                                        : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {review.user ? review.user.email : "Unknown User"}
                                                    </p>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>

                                            {review.user && review.user._id !== userId && (
                                                <button
                                                    onClick={() => handleChatWithReviewer(review.user)}
                                                    className="text-gray-500 hover:text-gray-800"
                                                >
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 leading-relaxed ml-13">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DestinationDetails;
