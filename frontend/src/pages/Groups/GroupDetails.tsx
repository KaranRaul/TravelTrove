import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupById, joinGroup, leaveGroup, inviteUser } from '../../api/group.api';
import { getAllUsers } from '../../api/user.api';
import { IGroup } from '../../types/group';
import { IUser } from '../../types/user';
import GroupChat from './GroupChat';
import { AuthContext } from '../../context/AuthContext';

const GroupDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<IGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const { userId } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<IUser[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    useEffect(() => {
        const fetchGroup = async () => {
            try {
                if (id) {
                    const groupData = await getGroupById(id);
                    setGroup(groupData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await getAllUsers();
                setAllUsers(res.data.users);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };

        fetchGroup();
        fetchUsers();
    }, [id]);

    const handleJoinGroup = async () => {
        try {
            if (id) {
                await joinGroup(id);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            if (id) {
                await leaveGroup(id);
                navigate('/groups');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!inviteEmail) {
            setError("Please enter an email address.");
            return;
        }

        const userToInvite = allUsers.find(user => user.email === inviteEmail);

        if (!userToInvite) {
            setError("User with this email not found.");
            return;
        }

        if (group?.members.some(member => member._id === userToInvite._id)) {
            setError("This user is already a member of the group.");
            return;
        }

        try {
            if (id) {
                await inviteUser(id, userToInvite._id);
                setSuccess(`${inviteEmail} has been invited.`);
                setInviteEmail('');
                // Refresh group data to show the new member
                const groupData = await getGroupById(id);
                setGroup(groupData);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to invite user.");
            console.error(err);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!group) {
        return <div>Group not found</div>;
    }

    const isMember = group.members.some((member: IUser) => member._id === userId);
    const isOwner = group.owner._id === userId;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-4xl font-bold">{group.name}</h1>
                    <div>
                        {isMember ? (
                            <button onClick={handleLeaveGroup} className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Leave Group
                            </button>
                        ) : (
                            group.isPublic && (
                                <button onClick={handleJoinGroup} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                    Join Group
                                </button>
                            )
                        )}
                    </div>
                </div>
                <p className="text-gray-700 mb-4">{group.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        {isMember ? <GroupChat groupId={group._id} /> : <p>You must be a member to view the chat.</p>}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Members ({group.members.length})</h2>
                        <ul>
                            {group.members.map((member: IUser) => (
                                <li key={member._id} className="flex items-center mb-2">
                                    <span className="text-gray-800">{member.username || member.email}</span>
                                    {member._id === group.owner._id && <span className="ml-2 text-sm text-gray-500">(Owner)</span>}
                                </li>
                            ))}
                        </ul>
                        {isOwner && (
                            <div className="mt-4">
                                <h3 className="text-lg font-bold mb-2">Invite User</h3>
                                <form onSubmit={handleInvite}>
                                    <div className="flex flex-col space-y-2">
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="Enter user's email"
                                            className="px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        >
                                            Invite
                                        </button>
                                    </div>
                                </form>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                {success && <p className="text-green-500 mt-2">{success}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;

