import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MyGroups from './MyGroups';
import PublicGroups from './PublicGroups';

const Groups: React.FC = () => {
    const [activeTab, setActiveTab] = useState('my-groups');

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">Groups</h1>
                <Link to="/groups/create" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Create Group
                </Link>
            </div>
            <div className="flex border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'my-groups' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('my-groups')}
                >
                    My Groups
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'public-groups' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('public-groups')}
                >
                    Public Groups
                </button>
            </div>
            <div className="mt-4">
                {activeTab === 'my-groups' && <MyGroups />}
                {activeTab === 'public-groups' && <PublicGroups />}
            </div>
        </div>
    );
};

export default Groups;
