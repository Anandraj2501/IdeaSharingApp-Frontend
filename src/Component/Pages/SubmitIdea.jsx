import React, { useState } from "react";
import axios from "axios";
import FileUpload from "../FileUpload/FileUpload";
import IdeaSubmissionForm from "../IdeaSubmissionForm/IdeaSubmissionForm";
import { BACKEND_URL } from "../../utils/url";
import { toast, ToastContainer } from "react-toastify";

const SubmitIdea = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]); // For file upload
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        shortDescription: "",
    }); // For form data
    const [loading, setLoading] = useState(false); // For loading state

    const handleFileUpload = (files) => {
        console.log(files);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // Append new files
    };
    

    const handleFormChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("shortDescription", formData.shortDescription);
    
        // Append each file to the FormData
        uploadedFiles.forEach((file, index) => {
            data.append(`postImages`, file);
        });
    
        try {
            const response = await axios.post(`${BACKEND_URL}/idea/create`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
    
            toast.success(response.data.message, { autoClose: 2000 });
            setFormData({ title: "", description: "", shortDescription: "" });
            setUploadedFiles([]); // Reset the files
        } catch (error) {
            console.error("Error submitting idea:", error);
            toast.error(
                error.response?.data?.message || "Failed to submit idea.",
                { autoClose: 2000 }
            );
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800">Unleash Your Creativity!</h1>
            <p className="text-gray-600">Create and Share your brilliant Ideas.</p>
            <div className="mt-8 grid grid-cols-6 gap-2 w-full">


                {/* Pass handleFormChange to IdeaSubmissionForm */}
                <IdeaSubmissionForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    onSubmit={handleSubmit}
                />
                {/* Pass handleFileUpload to FileUpload */}
                <FileUpload onFileUpload={handleFileUpload} />
            </div>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            )}
            <ToastContainer />
        </>
    );
};

export default SubmitIdea;
