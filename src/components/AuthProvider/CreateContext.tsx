import type { JwtPayload } from "jwt-decode";
import { createContext, type Dispatch, type SetStateAction } from "react";

interface CustomJwtPayload extends JwtPayload {
    role?: string;
}

export interface AuthContextType {
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    user: CustomJwtPayload | null;
    role: string | undefined;
    loading: boolean;
}

export const AuthProvider = createContext<AuthContextType | null>(null);