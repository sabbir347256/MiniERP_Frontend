import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { AuthProvider, type AuthContextType } from "./CreateContext";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    role?: string;
}


interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(() =>
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    );

    const user = useMemo<CustomJwtPayload | null>(() => {
        if (!token) return null;
        try {
            return jwtDecode<CustomJwtPayload>(token);
        } catch (error) {
            console.error("JWT Decode Error:", error);
            return null;
        }
    }, [token]);

    const loading = false;

    const authInfo: AuthContextType = {
        setToken,
        token,
        user,
        role: user?.role,
        loading,
    };

    return (
        <AuthProvider.Provider value={authInfo}>
            {children}
        </AuthProvider.Provider>
    );
};

export default AuthContext;