import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { BACKEND_URL } from "../../utils/url";
import Loader from "../../utils/Loader";
import DOMPurify from "dompurify";

const Discussions = () => {
    const { ideaId } = useParams(); // Get the idea ID from the URL
    const [idea, setIdea] = useState(null); // State to store the fetched idea
    const [comments, setComments] = useState([]); // State to store comments
    const [newComment, setNewComment] = useState(""); // State to store new comment
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    // Fetch idea by ID
    const getIdeaById = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/idea/getIdeaById/${ideaId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setIdea(response.data.data); // Set the fetched idea data
        } catch (err) {
            console.error("Error fetching idea:", err);
            setError("Failed to fetch the idea. Please try again.");
        }
    };

    // Fetch comments by Idea ID
    const getComments = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/comment/getComment/${ideaId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setComments(response.data.data); // Set the fetched comments
            console.log(response,"get");
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError("Failed to fetch comments. Please try again.");
        }
    };

    // Add new comment
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${BACKEND_URL}/comment/addComment`,
                {
                    ideaId,
                    text: newComment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setNewComment(""); // Clear the input field
            console.log(response,"add");
            setComments((prevComments) => [...prevComments, response.data.data]); // Add new comment
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment. Please try again.");
        }
    };

    // Add reply to a comment
    const handleAddReply = async (commentId, replyText) => {
        if (!replyText.trim()) return;

        try {
            const response = await axios.post(
                `${BACKEND_URL}/comment/addComment`,
                {
                    ideaId,
                    text: replyText,
                    parent: commentId, // Specify parent comment ID
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            console.log(response,"reply");
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, replies: [...comment.replies, response.data.data] }
                        : comment
                )
            );
        } catch (err) {
            console.error("Error adding reply:", err);
            setError("Failed to add reply. Please try again.");
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([getIdeaById(), getComments()]).finally(() => setLoading(false));
    }, [ideaId]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!idea) {
        return <div className="text-gray-500">Idea not found.</div>;
    }

    const sanitizedDescription = DOMPurify.sanitize(idea.description);

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800">Engage in Meaningful Discussions</h1>
            <p className="text-gray-600 mt-2">Share your thoughts, exchange ideas.</p>

            {/* Display Idea Details */}
            <div className="mt-8 border p-4 rounded-lg shadow-sm bg-white">
                <h2 className="text-2xl font-semibold text-gray-800">{idea.title}</h2>
                <p className="text-gray-600 mt-2">{idea.shortDescription}</p>
                <div
                    className="text-gray-800 mt-4"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                ></div>

                {/* Owner Details */}
                <div className="mt-4 text-sm text-gray-500">
                    <span>Shared by: </span>
                    <strong>{idea.owner?.username || "Unknown"}</strong>
                    <br />
                    <span>Email: </span>
                    <strong>{idea.owner?.email || "Unknown"}</strong>
                </div>
            </div>

            {/* Discussion Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800">Discussions</h2>
                <div className="mt-4">
                    {/* Comment Input */}
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="3"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Comment
                    </button>

                    {/* Comments List */}
                    <div className="mt-4">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                onReply={(replyText) => handleAddReply(comment._id, replyText)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// Comment Item Component
const CommentItem = ({ comment, onReply }) => {
    const [replyText, setReplyText] = useState("");

    return (
        <div className="border p-3 rounded-lg mb-4 bg-white">
            <p>
                <strong>{comment.name}:</strong> {comment.text}
            </p>
            <div className="mt-2">
                {comment.replies?.map((reply) => (
                    <div key={reply._id} className="ml-4 border-l pl-4">
                        <p>
                            <strong>{reply.name}:</strong> {reply.text}
                        </p>
                    </div>
                ))}
            </div>
            <textarea
                className="w-full p-2 border rounded mt-2"
                rows="2"
                placeholder="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <button
                onClick={() => {
                    onReply(replyText);
                    setReplyText("");
                }}
                className="bg-gray-500 text-white px-3 py-1 mt-2 rounded hover:bg-gray-600"
            >
                Reply
            </button>
        </div>
    );
};

export default Discussions;
