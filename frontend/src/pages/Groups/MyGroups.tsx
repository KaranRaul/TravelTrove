import React, { useEffect, useState } from 'react';
import { getMyGroups } from '../../api/group.api';
import { IGroup } from '../../types/group';
import GroupCard from './GroupCard';

const MyGroups: React.FC = () => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const myGroups = await getMyGroups();
                setGroups(myGroups);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">My Groups</h2>
            <div className="flex flex-wrap">
                {groups.map((group) => (
                    <GroupCard key={group._id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default MyGroups;
