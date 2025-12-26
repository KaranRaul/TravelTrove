import api from "./axios";
import { IGroup } from "../types/group";

export const createGroup = async (group: Partial<IGroup>) => {
    const response = await api.post("/groups", group);
    return response.data;
};

export const getMyGroups = async () => {
    const response = await api.get("/groups/my");
    return response.data;
};

export const getPublicGroups = async () => {
    const response = await api.get("/groups/public");
    return response.data;
};

export const getGroupById = async (id: string) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
};

export const joinGroup = async (id: string) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
};

export const inviteUser = async (id: string, userId: string) => {
    const response = await api.post(`/groups/${id}/invite`, { userId });
    return response.data;
};

export const getGroupMembers = async (id: string) => {
    const response = await api.get(`/groups/${id}/members`);
    return response.data;
};

export const deleteGroup = async (id: string) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
};

export const leaveGroup = async (id: string) => {
    const response = await api.post(`/groups/${id}/leave`);
    return response.data;
};

export const getGroupConversationId = async (id: string) => {
    const response = await api.get(`/groups/${id}/conversation`);
    return response.data;
};
