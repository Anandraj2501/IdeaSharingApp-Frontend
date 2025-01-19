import { useState, useEffect } from "react";
import axios from "axios";
import IdeaCards from "../IdeaCards/IdeaCards";
import { BACKEND_URL } from "../../utils/url";
import Loader from "../../utils/Loader";

const Moderation = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true); // For loading state
    const [error, setError] = useState(null); // For error state
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages

    const fetchIdeas = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/idea/get`, {
                params: {
                    pages: page,
                    limit: 9, // Number of ideas per page
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
                },
            });
            console.log(response);
            const { ideas, pagination } = response.data.data;

            setIdeas(ideas); // Set fetched ideas
            setTotalPages(pagination.totalPages); // Update total pages
            setLoading(false);
        } catch (err) {
            console.error("Error fetching ideas:", err);
            setError(err?.response?.data?.message || "Failed to fetch ideas.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas(currentPage); // Fetch ideas for the current page
    }, [currentPage]);

    if (loading) {
        return <Loader />; // Show loading message
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>; // Show error message
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800">Moderate Ideas, Shape the Future!</h1>
            <p className="text-gray-600">
                Review, approve, or reject ideas to drive innovation and maintain quality standards.
            </p>
            {ideas.length > 0 ? (
                <>
                    <IdeaCards initialIdeas={ideas} setIdeas={setIdeas} />
                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-6 space-x-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded ${
                                currentPage === 1 ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded ${
                                currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 mt-4">No ideas available for moderation.</p>
            )}
        </>
    );
};

export default Moderation;
