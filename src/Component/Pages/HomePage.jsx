import React from "react";
import LeftContainer from "./LeftContainer";
import MainContent from "./MainContent";

const HomePage = () => {
   

    return (
        <div className="main-container grid grid-cols-12 gap-4  h-[calc(100vh-140px)] mt-8 p-2" >
            <MainContent/>
            <LeftContainer/>
            
            {/* <RightContainer/> */}
        </div>
    )
};

export default HomePage;

