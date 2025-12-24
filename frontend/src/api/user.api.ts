import api from "./axios";

export const getAllUsers = () => {
    return api.get("/users");
};
