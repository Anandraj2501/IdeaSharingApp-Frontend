import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileUpload }) => {
    const [selectedFiles, setSelectedFiles] = useState([]); // State for multiple files

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Append new files to the existing ones
                onFileUpload(acceptedFiles); // Trigger the parent callback with new files
            }
        },
        [onFileUpload]
    );

    const removeFile = (indexToRemove) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true, // Allow multiple files
        accept: { "application/*": [], "image/*": [] }, // Accept images and application files
    });

    return (
        <div
            {...getRootProps()}
            className={`flex col-span-2 flex-col items-center justify-center p-6 rounded-lg cursor-pointer text-center bg-gray-50 drop-shadow-lg 
                ${isDragActive ? "border-blue-600" : "border-gray-300"} transition-colors duration-200 `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <div
                    className="flex items-center justify-center rounded-full bg-blue-100 text-blue-500"
                    style={{ width: "50px", height: "50px" }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
                <p className="mt-4 text-blue-500 font-semibold">Click to choose files or drag and drop.</p>
                <p className="text-sm text-gray-500">Your ideas will be private until approved by manager.</p>
                <p className="text-sm text-red-400">Currently JPEG and JPG format are supported</p>

                {selectedFiles.length > 0 && (
                    <div className="mt-4 text-gray-600 w-full">
                        <p className="font-semibold">Selected Files:</p>
                        <ul>
                            {selectedFiles.map((file, index) => (
                                <li
                                    key={index}
                                    className="mt-2 flex items-center justify-between border-b pb-2"
                                >
                                    <div>
                                        <span>{file.name}</span>
                                        {file.type.startsWith("image/") && (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="ml-4 max-w-[50px] h-[50px] object-contain rounded-md"
                                                onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up object URL
                                            />
                                        )}
                                    </div>
                                    <button
                                        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        onClick={() => removeFile(index)}
                                    >
                                        Cancel
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
