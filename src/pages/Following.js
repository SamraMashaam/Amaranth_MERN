import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaBell, FaBellSlash } from 'react-icons/fa'; // Importing the icons

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
    <div className="Ccontainer">
      <div className="settings-container">
        <h2 className="settings-title">Following</h2>
        <div className="settings-grid">
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="settings-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="followSelect"
          >
            <option value="recent">Most Recent</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="creator-list">
        {filteredCreators.map(creator => (
          <div key={creator.id} className="creator-card">
            <div>
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                style={{ height: 100, width: 100, borderRadius: '50%' }}
              />
            </div>
            <div>
              <h3 className="creator-label">{creator.name}</h3>
              <p className="settings-value">@{creator.username}</p>
              <button
                onClick={() => toggleNotifications(creator.id)}
                className={creator.notificationsEnabled ? 'sub-button' : 'fllw-button'}
              >
                {creator.notificationsEnabled ? <FaBell /> : <FaBellSlash />} {/* Bell icons here */}
              </button>
              <div>
                <p className="settings-label">Last streamed:</p>
                <p className="settings-value">{creator.lastStream}</p>
              </div>
              <button
                onClick={() => toggleFollow(creator.id)}
                className={creator.isFollowing ? 'edit-btn' : 'edit-btn'}
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
