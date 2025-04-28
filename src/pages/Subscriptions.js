import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchSubscriptions(storedUsername);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSubscriptions = async (viewerUsername) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subscriptions/${viewerUsername}`);
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/subscriptions/${subscriptionId}/cancel`);
      setSubscriptions(subscriptions.map(sub =>
        sub._id === subscriptionId ? { ...sub, status: 'canceled' } : sub
      ));
      toast.success(`Subscription to ${res.data.creator} canceled`);
    } catch (err) {
      console.error('Error canceling subscription:', err);
      toast.error('Failed to cancel subscription');
    }
  };

  const handleRenew = async (subscriptionId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/subscriptions/${subscriptionId}/renew`);
      setSubscriptions(subscriptions.map(sub =>
        sub._id === subscriptionId ? { ...sub, status: 'active', currentPeriodEnd: res.data.currentPeriodEnd } : sub
      ));
      toast.success(`Subscription to ${res.data.creator} renewed`);
    } catch (err) {
      console.error('Error renewing subscription:', err);
      toast.error('Failed to renew subscription');
    }
  };

  const filteredSubscriptions = subscriptions
    .filter(sub => {
      if (activeTab === 'active') return sub.status === 'active';
      if (activeTab === 'expired') return sub.status === 'expired';
      if (activeTab === 'canceled') return sub.status === 'canceled';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.price - a.price;
    });

  if (loading) return <div>Loading subscriptions...</div>;

  return (
    <div className="Ccontainer">
      <div className="settings-container">
        <h2 className="settings-title">Subscriptions</h2>
        <div className="settings-grid">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="followSelect"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="tab-nav">
          {['active', 'expired', 'canceled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'tab-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="subscription-list">
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map(subscription => (
              <div key={subscription._id} className="subscription-entry">
                <div className="subscription-row">
                  <div>
                    <h2 className="creator-label">{subscription.creator}</h2>
                    <p className="settings-value">
                      {subscription.planType} - ${subscription.price}/month
                    </p>
                  </div>
                  <div className="subscription-actions">
                    <div className="settings-value">
                      {subscription.status === 'active' ? (
                        <p>
                          Renews on {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                        </p>
                      ) : (
                        <p>
                          Ended on {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    <div className="action-buttons">
                      {subscription.status === 'active' && (
                        <button
                          onClick={() => handleCancel(subscription._id)}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      )}
                      {(subscription.status === 'expired' || subscription.status === 'canceled') && (
                        <button
                          onClick={() => handleRenew(subscription._id)}
                          className="renew-button"
                        >
                          Renew
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No subscriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}