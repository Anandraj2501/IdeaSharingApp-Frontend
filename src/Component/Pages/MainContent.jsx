import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/url";
import Loader from "../../utils/Loader";
import { userContext } from "../../utils/userContext";
import { useNavigate } from "react-router";

const MainContent = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(userContext); // Get logged-in user from context
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/idea/getIdeaByState`, {
                    params: {
                        state: "Inprogress",
                        pages: 1,
                        limit: 10,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setIdeas(response.data.data.ideas);
            } catch (error) {
                console.error("Error fetching ideas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    const navigateToDiscuss = (id)=>{
        navigate(`/discussions/${id}`);
    }

    return (
        <div className="col-span-9 cursor-pointer min-h-full h-full overflow-y-auto" >
            {loading ? (
                <Loader />
            ) : ideas.length > 0 ? (
                ideas.map((idea) => (
                    <TruncatedCard key={idea?._id} idea={idea} user={user} navigateToDiscuss={navigateToDiscuss}/>
                ))
            ) : (
                <div className="text-center text-gray-500">Submit Ideas to see them.</div>
            )}
        </div>
    );
};

const TruncatedCard = ({ idea, user ,navigateToDiscuss }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(idea.likes || { count: 0, users: [] });
    const [showAttachments, setShowAttachments] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleLike = async () => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/idea/like/${idea?._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setLikes(response.data.likes);
        } catch (error) {
            console.error("Error liking the idea:", error);
        }
    };

    const hasUserLiked = likes.users.includes(user?._id);

    const descriptionWords = idea.shortDescription.split(" ");
    const truncatedDescription =
        descriptionWords.length > 40
            ? descriptionWords.slice(0, 40).join(" ") + "..."
            : idea.shortDescription;

    return (
        <div
            key={idea?._id}
            className="mb-4 p-3 border border-gray-300 rounded-lg shadow-sm bg-white "
            onClick={()=>navigateToDiscuss(idea?._id)}
        >
            {/* Header */}
            <div className="header flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{idea.title}</span>
                    <span className="text-xs font-semibold text-gray-400">
                        Shared By: {idea.owner?.username || "Unknown"}
                    </span>
                </div>

                {/* Attachments Dropdown */}
                <div
                    className="rounded-full flex justify-center items-center bg-gray-300 w-8 h-8 hover:bg-gray-200 relative"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent onClick from being triggered3
                        setShowAttachments(!showAttachments);
                    }}
                >
                    <img src="/images/ellipsis.svg" alt="Ellipsis" />
                    {showAttachments && (
                        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg border p-2 w-48 z-10">
                            {idea.images && idea.images.length > 0 ? (
                                idea.images.map((image, index) => (
                                    <a
                                        key={index}
                                        href={image}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-500 hover:underline mb-2"
                                    >
                                        {`Attachment ${index + 1}`}
                                    </a>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No attachments available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="desc mt-4">
                <p className="text-gray-600 text-sm font-semibold">
                    {isExpanded ? (
                        idea.shortDescription
                    ) : (
                        <>
                            {truncatedDescription}{" "}
                            {descriptionWords.length > 40 && (
                                <button
                                    onClick={toggleExpanded}
                                    className="text-blue-500 text-sm "
                                >
                                    Read more
                                </button>
                            )}
                        </>
                    )}
                </p>
                {isExpanded && descriptionWords.length > 40 && (
                    <button
                        onClick={toggleExpanded}
                        className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                        Read less
                    </button>
                )}
            </div>

            {/* Like and Comment */}
            <div className="like-comment mt-4 flex justify-between items-center">
                <button
                    onClick={()=>{
                        e.stopPropagation();
                        handleLike;
                    }}
                    className="flex items-center gap-1"
                >
                    {hasUserLiked ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 text-red-500"
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="currentColor"
                            />
                        </svg>
                    ) : (
                        <img
                            src="/images/heart.svg"
                            alt="Heart"
                            className="w-6 h-6"
                        />
                    )}

                    <span className="text-gray-800">{likes.count}</span>
                </button>
            </div>
        </div>
    );
};

export default MainContent;
