import React from "react";
import LeftContainer from "./LeftContainer";
import MainContent from "./MainContent";
import RightContainer from "./RightContainer";

const HomePage = () => {
    // Dummy data for Top Ideas
    const topIdeas = [
        { id: 1, title: "Top Idea 1", description: "This is a description of Top Idea 1." },
        { id: 2, title: "Top Idea 2", description: "This is a description of Top Idea 2." },
        { id: 3, title: "Top Idea 3", description: "This is a description of Top Idea 3." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
        { id: 4, title: "Top Idea 4", description: "This is a description of Top Idea 4." },
    ];

    return (
        <div className="main-container grid grid-cols-12 gap-4  h-[calc(100vh-140px)] mt-8 p-2" >
            <MainContent/>
            <LeftContainer/>
            
            {/* <RightContainer/> */}
        </div>
    )
};

export default HomePage;

