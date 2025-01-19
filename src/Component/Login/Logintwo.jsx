import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { userContext } from '../../utils/userContext';
import {toast, ToastContainer} from "react-toastify"
import { useNavigate } from 'react-router';



const Logintwo = () => {
    const [isLogIn, setIsLogIn] = useState(false);
    const { authenticate } = useAuth();
    const { message, setMessage, error, setError } = useContext(userContext);
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleAuth = () => {
        authenticate(userData, isLogIn);
    }

    // useEffect(() => {
    //     if (message) {
    //         toast.success(message,{autoClose: 1300});
    //         setMessage();
    //     }
    // }, [message]);

    useEffect(() => {
        if (error) {
            toast.error(error,{autoClose: 1300});
            setError();
        }
    }, [error]);

    return (
        <>
            <div className="flex h-[100vh] w-full bg-gray-100 md:p-4">
                {/* Main Container */}
                <div className="flex flex-col md:flex-row w-full">
                    {/* Left Content */}
                    <div className="w-full md:w-[60%] flex flex-col justify-center px-4 md:px-8 my-4">
                        <h1 className="text-4xl md:text-6xl font-bold my-2 md:my-5">
                            Share Ideas, <br />
                            <span className="text-blue-600">Spark Innovation, Connect People</span>
                        </h1>
                        <p className=" text-xs md:text-base text-gray-600">
                            An interactive platform designed for sharing, discovering, and collaborating on ideas. Connect with creative minds, brainstorm solutions, and inspire innovation. Whether you're looking to solve problems, get feedback, or explore new concepts, our app fosters collaboration and empowers users to turn ideas into impactful actions and solutions.
                        </p>
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-[40%] flex items-center justify-center px-4 md:px-0">
                        <div className="logincard bg-white p-6 border rounded-lg w-full md:w-[90%]">
                            <div className="formcontainer">
                                {/* Name Fields */}
                                {!isLogIn &&
                                    <div className="namecontainer flex justify-between mb-4 gap-4">
                                        <TextField
                                            className="w-full"
                                            id="outlined-error-helper-text"
                                            label="First Name"
                                            name="firstName"
                                            value={userData.firstName}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            className="w-full"
                                            id="outlined-error-helper-text"
                                            label="Last Name"
                                            name="lastName"
                                            value={userData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                }
                                {/* Email Field */}
                                <div className="emailcontainer mb-4 md:mb-6">
                                    <TextField
                                        className="w-full"
                                        id="outlined-error-helper-text"
                                        label="Email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="passwordcontainer mb-4 md:mb-6">
                                    <TextField
                                        className="w-full"
                                        id="outlined-error-helper-text"
                                        label="Password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="mb-4 md:mb-6">
                                    <Button
                                        className="w-full"
                                        sx={{
                                            backgroundColor: 'rgba(13, 110, 253, 1)',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#0a58ca',
                                            },
                                        }}
                                        onClick={handleAuth}
                                    >
                                        {isLogIn ? "LOG IN" : "Sign up"}
                                    </Button>
                                </div>
                                <div>
                                    <p>Already have an account? <span className='text-[rgba(13,110,253,1)] cursor-pointer text-base font-semibold hover:text-[#0a58ca]' onClick={() => setIsLogIn(!isLogIn)}>{!isLogIn ? "Login" : "Signup"}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Logintwo;
