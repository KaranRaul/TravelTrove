import { IUser } from "./user";

export interface IGroup {
    _id: string;
    name: string;
    description: string;
    owner: IUser;
    members: IUser[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}
