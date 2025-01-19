import React, { useContext, useState } from "react";
import { Modal, Box, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { BACKEND_URL } from "../utils/url";
import axios from "axios";
import { userContext } from "../utils/userContext";
import DOMPurify from 'dompurify';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const IdeaDetailsModal = ({ open, onClose, idea, onUpdate }) => {
    const { user } = useContext(userContext);
    const [remark, setRemark] = useState("");
    const [state, setState] = useState(idea?.state);
    const [showAttachments, setShowAttachments] = useState(false);

    if (!idea) return null; // Return null if no idea is selected
    console.log(idea);
    const handleAdminAction = async (action) => {
        if (!remark.trim()) {
            alert("Please add a remark before proceeding.");
            return;
        }

        try {
            const response = await axios.put(
                `${BACKEND_URL}/idea/updatestatus/${idea._id}`,
                {
                    status: action,
                    remarks: remark,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Pass the admin token for authorization
                    },
                }
            );

            if (response.status === 200) {
                onUpdate(response?.data?.data);
                setRemark(""); // Clear the remark field
                onClose(); // Close the modal
            } else {
                alert("Failed to update the idea");
            }
        } catch (error) {
            console.error("Error updating idea:", error);
            alert("An error occurred while updating the idea");
        }
    };

    const handleUserStateChange = async () => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/idea/updateState/${idea._id}`, // Endpoint to update user-controlled state
                {
                    state,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // User token for authorization
                    },
                }
            );
            console.log(response);

            if (response.status === 200) {
                onUpdate(response?.data?.data);
                onClose(); // Close the modal
            } else {
                alert("Failed to update the state");
            }
        } catch (error) {
            console.error("Error updating user state:", error);
            alert("An error occurred while updating the state");
        }
    };

    const createMarkup = (html) => {
        const sanitizedHtml = DOMPurify.sanitize(html);
        return { __html: sanitizedHtml };
    };


    return (
        <>
            {/* Admin Modal */}
            {idea?.status !== "Approved" && idea?.status !== "Rejected" && (
                <Modal open={open} onClose={onClose} aria-labelledby="idea-details-title">
                    <Box
                        className="bg-white rounded-lg p-6 w-[70%] mx-auto mt-20"
                        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                    >
                        <div className="header flex items-center justify-between mb-4">
                            <h2 id="idea-details-title" className="text-2xl font-bold text-gray-800 ">
                                {idea.title}
                            </h2>
                            <div className="rounded-full flex justify-center items-center bg-gray-300 w-8 h-8 hover:bg-gray-200">
                                <img src="/images/ellipsis.svg" alt="Ellipsis" />
                            </div>
                        </div>
                        {/* <p className="text-gray-600 mb-4">{idea.description}</p> */}
                        {/* <div dangerouslySetInnerHTML={createMarkup(idea.description)} /> */}
                        <ReactQuill
                            value={idea.description}
                            readOnly={true} // Set the editor to read-only mode
                            modules={{ toolbar: false }}
                            className="bg-gray-200 rounded"
                            style={{
                                height: "150px", // Fixed height for the editor
                                overflow: "auto", // Enable scrolling within the editor
                            }}
                        />

                        {/* Remark Field */}
                        {user?.isAdmin && (
                            <div className="mt-6">
                                <TextField
                                    label="Add Remark"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                />
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-8">Created On: {new Date(idea.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Created By: {idea.owner?.username}</p>

                        <div className="flex justify-end mt-6 space-x-4">
                            {/* Action Buttons */}
                            {user?.isAdmin && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleAdminAction("Approved")}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleAdminAction("Rejected")}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                className="text-gray-600 hover:bg-gray-100"
                            >
                                Close
                            </Button>
                        </div>
                    </Box>
                </Modal>
            )}

            {/* User State Management Modal */}
            {idea?.status === "Approved" && user?._id === idea?.owner._id && (
                <Modal open={open} onClose={onClose} aria-labelledby="user-state-title">
                    <Box
                        className="bg-white rounded-lg p-6 w-[70%] mx-auto mt-20"
                        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
                    >

                        <div className="header flex items-center justify-between mb-4">
                            <h2 id="user-state-title" className="text-2xl font-bold text-gray-800 ">
                                {idea.title}
                            </h2>
                            {/* Attachments Dropdown */}
                            <div
                                className="rounded-full flex justify-center items-center bg-gray-300 w-8 h-8 hover:bg-gray-200 relative"
                                onClick={() => setShowAttachments(!showAttachments)}
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
                        {/* <p className="text-gray-600 mb-4">{idea.shortDescription}</p> */}

                        <ReactQuill
                            value={idea.description}
                            readOnly={true} // Set the editor to read-only mode
                            modules={{ toolbar: false }}
                            className="bg-gray-200 rounded"
                            style={{
                                height: "150px", // Fixed height for the editor
                                overflow: "auto", // Enable scrolling within the editor
                            }}
                        />

                        {/* State Dropdown */}
                        <FormControl fullWidth variant="outlined" className="mt-4">
                            <InputLabel id="user-state-select-label">Change State</InputLabel>
                            <Select
                                labelId="user-state-select-label"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                label="Change State"
                            >
                                <MenuItem value="Todo">Todo</MenuItem>
                                <MenuItem value="Inprogress">Inprogress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="flex justify-end mt-6 space-x-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUserStateChange}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Update State
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                className="text-gray-600 hover:bg-gray-100"
                            >
                                Close
                            </Button>
                        </div>
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default IdeaDetailsModal;
