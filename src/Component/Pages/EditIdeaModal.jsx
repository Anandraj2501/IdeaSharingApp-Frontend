import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileUpload from "../FileUpload/FileUpload";
import IdeaSubmissionForm from "../IdeaSubmissionForm/IdeaSubmissionForm";
import { BACKEND_URL } from "../../utils/url";

const EditIdeaModal = ({ open, onClose, idea, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        shortDescription: "",
    });
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Populate form data and files when the modal opens with an existing idea
        if (idea) {
            setFormData({
                title: idea.title || "",
                description: idea.description || "",
                shortDescription: idea.shortDescription || "",
            });
            setUploadedFiles(idea.images || []); // Assuming `images` field holds existing file URLs
        }
    }, [idea]);

    const handleFormChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFileUpload = (files) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // Append new files
    };

    const handleSubmit = async () => {
        setLoading(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("shortDescription", formData.shortDescription);

        // Append new files to the FormData
        uploadedFiles.forEach((file, index) => {
            if (file instanceof File) {
                data.append(`postImages`, file); // Only append newly uploaded files
            }
        });

        try {
            const response = await axios.put(`${BACKEND_URL}/idea/update/${idea._id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            toast.success(response.data.message, { autoClose: 2000 });
            onUpdate(response.data.data); // Update the parent with the new idea data
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating idea:", error);
            toast.error(
                error.response?.data?.message || "Failed to update idea.",
                { autoClose: 2000 }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[70%]">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Your Idea</h1>
                <div className="mt-8 grid grid-cols-6 gap-2 w-full">
                    {/* Idea Submission Form */}
                    <IdeaSubmissionForm
                        formData={formData}
                        onFormChange={handleFormChange}
                        onSubmit={handleSubmit}
                    />

                    {/* File Upload Component */}
                    <FileUpload onFileUpload={handleFileUpload} />
                </div>

                {loading && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                )}

                <ToastContainer />
            </div>
        </Modal>
    );
};

export default EditIdeaModal;
