import React from 'react';
import { Link } from 'react-router-dom';
import { IGroup } from '../../types/group';

interface GroupCardProps {
    group: IGroup;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
            <p className="text-gray-700 mb-4">{group.description}</p>
            <div className="flex justify-between items-center">
                <p className="text-gray-600">{group.members.length} members</p>
                <Link to={`/groups/${group._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    View
                </Link>
            </div>
        </div>
    );
};

export default GroupCard;
