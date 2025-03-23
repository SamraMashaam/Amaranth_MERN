import { useState } from 'react';
// import { Bell, BellOff } from 'lucide-react';
import toast from 'react-hot-toast';


// Mock data for initial state
const initialCreators = [
  {
    id: 1,
    name: 'Sarah Gaming',
    username: 'sarahgaming',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastStream: 'Just Chatting',
    lastStreamDate: '2024-03-22T15:00:00Z',
    isFollowing: true,
    notificationsEnabled: true,
  },
  {
    id: 2,
    name: 'Tech with Mike',
    username: 'techwithmike',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastStream: 'Coding a Game Engine',
    lastStreamDate: '2024-03-21T18:30:00Z',
    isFollowing: true,
    notificationsEnabled: false,
  },
  {
    id: 3,
    name: 'ArtistAlley',
    username: 'artistalley',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastStream: 'Digital Art Creation',
    lastStreamDate: '2024-03-22T12:00:00Z',
    isFollowing: true,
    notificationsEnabled: true,
  },
];

export function Following() {
  const [creators, setCreators] = useState(initialCreators);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const toggleFollow = (creatorId) => {
    setCreators(creators.map(creator => {
      if (creator.id === creatorId) {
        const newState = !creator.isFollowing;
        toast.success(newState ? `Following ${creator.name}` : `Unfollowed ${creator.name}`);
        return { ...creator, isFollowing: newState };
      }
      return creator;
    }));
  };

  const toggleNotifications = (creatorId) => {
    setCreators(creators.map(creator => {
      if (creator.id === creatorId) {
        const newState = !creator.notificationsEnabled;
        toast.success(
          newState 
            ? `Notifications enabled for ${creator.name}` 
            : `Notifications disabled for ${creator.name}`
        );
        return { ...creator, notificationsEnabled: newState };
      }
      return creator;
    }));
  };

  const filteredCreators = creators
    .filter(creator => 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastStreamDate) - new Date(a.lastStreamDate);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Following</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map(creator => (
          <div
            key={creator.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-full h-full object-cover"
                style={{height:100, width:100}}
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{creator.name}</h3>
                  <p className="text-gray-500">@{creator.username}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleNotifications(creator.id)}
                    className={`p-2 rounded-full ${
                      creator.notificationsEnabled
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {/* {creator.notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />} */}
                    {creator.notificationsEnabled ? 'Notifs On' : 'Notifs Off'}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Last streamed</p>
                <p className="font-medium text-gray-900">{creator.lastStream}</p>
              </div>
              <button
                onClick={() => toggleFollow(creator.id)}
                className={`w-full py-2 px-4 rounded-md ${
                  creator.isFollowing
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {creator.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}