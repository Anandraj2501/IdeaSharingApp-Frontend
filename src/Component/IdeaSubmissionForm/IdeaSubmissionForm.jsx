import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const IdeaSubmissionForm = ({ formData, onFormChange, onSubmit }) => {
    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['clean'] // remove formatting button
    ];
    return (
        <form
            className="p-6 col-span-4 rounded-lg shadow-sm  bg-white  "
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(); // Call parent's submit handler
            }}
        >
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Idea</h1>

            <div className="mb-4">
                <label htmlFor="title" className="block mb-1">
                    Name:
                </label>
                <input
                    id="title"
                    placeholder="Enter Name"
                    value={formData.title}
                    onChange={(e) => onFormChange("title", e.target.value)}
                    className="w-full border p-2 rounded bg-gray-200"
                />
            </div>



            <div className="mb-4">
                <label htmlFor="description" className="block mb-1">
                    Description:
                </label>
                <ReactQuill
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(value) => onFormChange("description", value)}
                    className="bg-gray-200 rounded"
                    style={{
                        height: "150px", // Fixed height for the editor
                        overflow: "auto", // Enable scrolling within the editor
                    }}

                    modules={{ toolbar: toolbarOptions }}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="shortDescription" className="block mb-1">
                    Short Description of your Idea:
                </label>
                <textarea
                    id="shortDescription"
                    placeholder="Enter short description of your Idea for other users"
                    value={formData.shortDescription}
                    onChange={(e) => onFormChange("shortDescription", e.target.value)}
                    className="w-full border p-2 rounded bg-gray-200"
                    style={{
                        height: "100px", // Fixed height for the textarea
                        overflow: "auto", // Enable scrolling if content overflows
                    }}
                />
            </div>




            <div className="flex justify-between">
                {/* <button type="button" className="text-gray-500 hover:text-gray-800" onClick={() => alert("Preview clicked!")}>
                    Preview
                </button> */}
                <button type="submit" className="bg-green-600 items-end text-white px-4 py-2 rounded hover:bg-green-700">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default IdeaSubmissionForm;
