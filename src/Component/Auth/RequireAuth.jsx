import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utils/userContext";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../../utils/Loader";

const RequireAuth = ({ children }) => {
    const { isValidaAccessToken } = useContext(userContext);
    const {verifyaccesstoken} = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            
            setLoading(true); 
            await verifyaccesstoken(); 
            setLoading(false); 
        };

        validateToken();
    }, []);
    


    if (loading) {
        return <Loader/>;
    }

    return isValidaAccessToken ? children : <Navigate to="/login" replace />;
}
export default RequireAuth;