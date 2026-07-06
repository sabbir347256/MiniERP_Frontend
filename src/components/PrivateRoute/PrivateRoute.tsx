import { useContext } from "react";
import { AuthProvider } from "../AuthProvider/CreateContext";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    const auth = useContext(AuthProvider);
    
    if (auth?.loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

        console.log(auth)


    if (!auth?.token) {
        return <Navigate to="/user-login" replace />;
    }

    if (allowedRoles && (!auth.user?.role || !allowedRoles.includes(auth.user.role))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};


export default PrivateRoute;