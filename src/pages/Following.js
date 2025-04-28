import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import axios from 'axios';

export function Following() {
  const [creators, setCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchFollows(storedUsername);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFollows = async (viewerUsername) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/follows/${viewerUsername}`);
      setCreators(res.data);
    } catch (err) {
      console.error('Error fetching follows:', err);
      toast.error('Failed to load followed creators');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (followId, creatorName) => {
    try {
      const creator = creators.find(c => c._id === followId);
      const isFollowing = creator.isFollowing;

      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/follows/${followId}`);
        setCreators(creators.map(c =>
          c._id === followId ? { ...c, isFollowing: false } : c
        ));
        toast.success(`Unfollowed ${creatorName}`);
      } else {
        const res = await axios.post(`http://localhost:5000/api/follows`, {
          viewerUsername: username,
          creatorUsername: creatorName,
        });
        setCreators(creators.map(c =>
          c._id === followId
            ? { ...c, _id: res.data._id, isFollowing: true, notificationsEnabled: true }
            : c
        ));
        toast.success(`Following ${creatorName}`);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error('Failed to update follow status');
    }
  };

  const toggleNotifications = async (followId, creatorName) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/follows/${followId}/notifications`);
      setCreators(creators.map(creator =>
        creator._id === followId
          ? { ...creator, notificationsEnabled: res.data.notificationsEnabled }
          : creator
      ));
      toast.success(
        res.data.notificationsEnabled
          ? `Notifications enabled for ${creatorName}`
          : `Notifications disabled for ${creatorName}`
      );
    } catch (err) {
      console.error('Error toggling notifications:', err);
      toast.error('Failed to toggle notifications');
    }
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

  if (loading) return <div>Loading followed creators...</div>;

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
        {filteredCreators.length > 0 ? (
          filteredCreators.map(creator => (
            <div key={creator._id} className="creator-card">
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
                  onClick={() => toggleNotifications(creator._id, creator.name)}
                  className={creator.notificationsEnabled ? 'sub-button' : 'fllw-button'}
                >
                  {creator.notificationsEnabled ? <FaBell /> : <FaBellSlash />}
                </button>
                <div>
                  <p className="settings-label">Last streamed:</p>
                  <p className="settings-value">{creator.lastStream}</p>
                </div>
                <button
                  onClick={() => toggleFollow(creator._id, creator.name)}
                  className={creator.isFollowing ? 'edit-btn' : 'edit-btn'}
                >
                  {creator.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No followed creators found.</p>
        )}
      </div>
    </div>
  );
}