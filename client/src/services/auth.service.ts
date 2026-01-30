import { apiRequest } from "../hooks/useAPI";
import type { AuthUser, LoginPayload, LoginResponse, } from "../types/auth";

export const authService = {
    login: (payload: LoginPayload) =>
        apiRequest<LoginResponse>(
            "/auth/log-in",
            {
                method: "POST",
                body: payload,
            },
            "Invalid email or password"
        ),
};
