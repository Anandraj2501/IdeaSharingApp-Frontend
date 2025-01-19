import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utils/userContext";
import IdeaDetailsModal from "../IdeaDetailsModal";
import EditIdeaModal from "../Pages/EditIdeaModal" // New Edit Modal
import { ListAlt, PlayCircle, DoneAll, Edit } from "@mui/icons-material"; // Icons

const IdeaCards = ({ initialIdeas }) => {
    const { user } = useContext(userContext);
    const [ideas, setIdeas] = useState(initialIdeas);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        setIdeas(initialIdeas);
    }, [initialIdeas]);

    const openDetailsModal = (idea) => {
        setSelectedIdea(idea);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setSelectedIdea(null);
        setIsDetailsModalOpen(false);
    };

    const openEditModal = (idea) => {
        setSelectedIdea(idea);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedIdea(null);
        setIsEditModalOpen(false);
    };

    const handleUpdateIdea = (updatedIdea) => {
        setIdeas((prevIdeas) =>
            prevIdeas.map((idea) =>
                idea._id === updatedIdea._id ? updatedIdea : idea
            )
        );
    };

    const renderStateIcon = (state) => {
        switch (state) {
            case "Todo":
                return <ListAlt className="text-blue-500" />;
            case "Inprogress":
                return <PlayCircle className="text-yellow-500" />;
            case "Completed":
                return <DoneAll className="text-green-500" />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {ideas.map((idea) => (
                    <div
                        key={idea._id}
                        className="border rounded-lg p-6 cursor-pointer bg-white drop-shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow relative"
                        onClick={() => openDetailsModal(idea)}
                    >
                        {/* Edit Icon */}{
                            idea.status === "Pending" && user?._id === idea?.owner._id &&
                            <div
                                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering card click
                                    openEditModal(idea);
                                }}
                            >
                                <Edit />
                            </div>
                        }

                        {/* State Icon for Approved Ideas */}
                        {idea.status === "Approved" && (
                            <div className="absolute top-4 right-4">
                                {renderStateIcon(idea?.state)}
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{idea?.title}</h2>
                            <p className="text-gray-600 mb-4">{idea?.shortDescription}</p>
                            {idea.remarks && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Remarks: <span className="italic">{idea?.remarks}</span>
                                </p>
                            )}
                            <p className="text-sm mt-2 text-gray-500">
                                Status:{" "}
                                <span
                                    className={`font-bold ${idea.status === "Pending"
                                            ? "text-blue-500"
                                            : idea.status === "Approved"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                >
                                    {idea.status}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Modal */}
            <IdeaDetailsModal
                open={isDetailsModalOpen}
                onClose={closeDetailsModal}
                idea={selectedIdea}
                onUpdate={handleUpdateIdea}
            />

            {/* Edit Modal */}
            <EditIdeaModal
                open={isEditModalOpen}
                onClose={closeEditModal}
                idea={selectedIdea}
                onUpdate={handleUpdateIdea}
            />
        </>
    );
};

export default IdeaCards;
