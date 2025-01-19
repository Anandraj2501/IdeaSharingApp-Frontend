import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/url";
import { useNavigate } from "react-router";

const LeftContainer = () => {
    const [idea,setIdea] = useState([]);
    const navigate = useNavigate();

    const getTopIdea = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/idea/getTopIdea`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            console.log(response);
            setIdea(response?.data.data.ideas);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTopIdea();
    }, [])

    const navigateToDiscuss = (id)=>{
        navigate(`/discussions/${id}`);
    }

    return (
        <div className="left-container  col-span-3 bg-white rounded  flex flex-col min-h-full h-full">
            {/* Header */}
            <div className="p-2 text-center font-normal  text-lg border-b  border-gray-300">
                Top Ideas
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 ">
                {idea?.map((idea) => (
                    <div
                        key={idea.id}
                        className="mb-4 drop-shadow-lg p-4 border border-gray-300 rounded-lg cursor-pointer shadow-sm bg-white"
                        onClick={()=>navigateToDiscuss(idea?._id)}
                    >
                        <h3 className="font-semibold">{idea.title}</h3>
                        <p className="text-sm text-gray-600">{idea.shortDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftContainer;
