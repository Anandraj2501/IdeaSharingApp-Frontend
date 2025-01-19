import axios from "axios";
import { BACKEND_URL } from "../utils/url";
import { useContext } from "react";
import { userContext } from "../utils/userContext";
import { useNavigate } from "react-router";
const useAuth = ()=>{
    const {setUser,setError,setMessage,setIsValidaAccessToken} = useContext(userContext);
    const navigate = useNavigate();

    const authenticate = async(userData, isLogIn)=>{

        if(isLogIn){
            try{
                const response = await axios.post(`${BACKEND_URL}/users/login` ,userData);
                console.log(response);
                setMessage(response?.data?.message);
                localStorage.setItem("user",JSON.stringify(response?.data?.data?.user));
                localStorage.setItem("accessToken",response?.data?.data?.accessToken);
                setUser(response?.data?.data?.user);
                navigate("/home");
            }catch(error){
                console.log(error?.response?.data?.message);
                setError(error?.response?.data?.message);
            }
        }else{
            try{
                const response = await axios.post(`${BACKEND_URL}/users/register` ,userData);
                console.log(response);
                setMessage(response?.data?.message);
            }catch(error){
                console.log(error?.response?.data?.message);
                setError(error?.response?.data?.message);
            }
        }
    }

    const verifyaccesstoken = async()=>{
        try{
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(`${BACKEND_URL}/verifyaccessstoken`,{},{
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
            });
            if(response.data.statusCode === 200){
                setIsValidaAccessToken(true);
            }else{
                setIsValidaAccessToken(false);
            }
        }catch(error){
            setIsValidaAccessToken(false);
        }
    }

    return {authenticate,verifyaccesstoken};

}

export default useAuth;