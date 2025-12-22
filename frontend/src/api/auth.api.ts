import api from "./axios";

export const loginUser = (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
};

export const registerUser = (email: string, password: string) => {
    return api.post("/auth/register", { email, password });
};
