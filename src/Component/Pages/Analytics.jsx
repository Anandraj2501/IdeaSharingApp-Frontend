import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PieController, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { BACKEND_URL } from "../../utils/url";
import axios from "axios";
import IdeaCards from "../IdeaCards/IdeaCards";

// Register required components from Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PieController,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [selectedIdeas, setSelectedIdeas] = useState([]);
    const [ideaCountByMonth, setIdeaCountByMonth] = useState([]);
    const [ideaCountByStatus, setIdeaCountByStatus] = useState({});

    const fetchIdeaStatistics = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/idea/getIdeaStatistics`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const data = response?.data?.data;
            const countByMonth = data.find((item) => item.type === "countByMonth")?.data || [];
            const countByStatus = data.find((item) => item.type === "countByStatus")?.data || {};

            setIdeaCountByMonth(countByMonth);
            setIdeaCountByStatus(countByStatus);
        } catch (error) {
            console.error("Error fetching idea statistics:", error);
        }
    };

    useEffect(() => {
        fetchIdeaStatistics();
    }, []);

    // Data for the Pie Chart (Approval Status)
    const pieData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [
            {
                label: "Approval Status",
                data: [
                    ideaCountByStatus.Approved || 0,
                    ideaCountByStatus.Pending || 0,
                    ideaCountByStatus.Rejected || 0,
                ], // Use dynamic data
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                borderWidth: 1,
                hoverOffset: 5,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Idea Approval Status" },
        },
        onClick: async (event, elements) => {
            if (elements.length > 0) {
                const chartIndex = elements[0].index; // Get the index of the clicked segment
                const status = pieData.labels[chartIndex]; // Get the corresponding status label

                try {
                    // Fetch ideas dynamically based on the status
                    const response = await axios.get(`${BACKEND_URL}/idea/getIdeasByStatus?status=${status}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    });
                    // Update selectedIdeas with fetched ideas
                    setSelectedIdeas(response?.data?.data?.ideas); // Assuming API returns an array of ideas
                } catch (error) {
                    console.error("Error fetching ideas by status:", error);
                }
            }
        },
    };


    // Data for the Line Chart (Total Idea Submissions by Month)
    const lineData = {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ], // Months
        datasets: [
            {
                label: "Total Submissions",
                data: ideaCountByMonth, // Use dynamic data
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Total Idea Submissions Over Time" },
        },
        scales: {
            x: {
                title: { display: true, text: "Time" },
            },
            y: {
                title: { display: true, text: "Number of Submissions" },
                beginAtZero: true,
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const chartIndex = elements[0].index; // Get the index of the clicked point
                const month = lineData.labels[chartIndex]; // Get the corresponding month
                setSelectedIdeas([`Ideas submitted in ${month}`]); // Mock data for clicked month
            }
        },
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600">
                Gain insights into idea submissions, approval trends, and user engagement to drive informed decisions.
            </p>

            <div className="flex justify-between mt-8">
                {/* Pie Chart Container (Smaller) */}
                <div className="w-1/3 p-5 bg-white shadow-md rounded-lg">
                    <Pie data={pieData} options={pieOptions} />
                </div>

                {/* Line Chart Container (Larger) */}
                <div className="w-2/3 p-5 bg-white shadow-md rounded-lg">
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>

            {/* Section to display selected ideas */}
            <div className="mt-10 p-5 bg-gray-100 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800">Selected Ideas</h2>
                {selectedIdeas.length > 0 ? (

                    <IdeaCards initialIdeas={selectedIdeas} /> 
                ) : (
                    <p className="text-gray-600 mt-2">Click on a chart to see the ideas.</p>
                )}
            </div>
        </>
    );
};

export default Analytics;
