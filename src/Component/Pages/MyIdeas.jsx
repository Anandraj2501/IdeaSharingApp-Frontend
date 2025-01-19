import { useState, useEffect } from "react";
import axios from "axios";
import IdeaCards from "../IdeaCards/IdeaCards";
import Loader from "../../utils/Loader";
import { BACKEND_URL } from "../../utils/url";

const MyIdeas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages

    const fetchIdeas = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/idea/getIdeas`, {
                params: {
                    pages: page,
                    limit: 9, // Adjust limit as needed
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const { ideas, pagination } = response.data.data;

            setIdeas(ideas);
            setTotalPages(pagination.totalPages); // Set total pages from API response
            setLoading(false);
        } catch (err) {
            console.error("Error fetching ideas:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas(currentPage); // Fetch ideas for the current page
    }, [currentPage]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800">Your Brilliant Ideas, All in One Place!</h1>
            <p className="text-gray-600 mt-2">
                Manage and refine your creativity. Track, edit, and showcase all the ideas you've shared.
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
                <p className="text-gray-500 mt-4">No ideas found. Start creating your first idea!</p>
            )}
        </>
    );
};

export default MyIdeas;
