import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const initialSubscriptions = [
  {
    id: 1,
    creatorName: 'Sarah Gaming',
    planType: 'Premium',
    price: 9.99,
    status: 'active',
    currentPeriodEnd: '2024-04-22T00:00:00Z',
    createdAt: '2023-10-15T00:00:00Z',
  },
  {
    id: 2,
    creatorName: 'Tech with Mike',
    planType: 'Basic',
    price: 4.99,
    status: 'expired',
    currentPeriodEnd: '2024-02-21T00:00:00Z',
    createdAt: '2023-08-21T00:00:00Z',
  },
  {
    id: 3,
    creatorName: 'ArtistAlley',
    planType: 'Premium',
    price: 9.99,
    status: 'canceled',
    currentPeriodEnd: '2024-03-15T00:00:00Z',
    createdAt: '2023-11-15T00:00:00Z',
  },
];

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('date');

  const handleCancel = (subscriptionId) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        toast.success(`Subscription to ${sub.creatorName} canceled`);
        return { ...sub, status: 'canceled' };
      }
      return sub;
    }));
  };

  const handleRenew = (subscriptionId) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        const newEndDate = new Date();
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        toast.success(`Subscription to ${sub.creatorName} renewed`);
        return {
          ...sub,
          status: 'active',
          currentPeriodEnd: newEndDate.toISOString(),
        };
      }
      return sub;
    }));
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
          {filteredSubscriptions.map(subscription => (
            <div key={subscription.id} className="subscription-entry">
              <div className="subscription-row">
                <div>
                  <h2 className="creator-label">{subscription.creatorName}</h2>
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
                        onClick={() => handleCancel(subscription.id)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    )}
                    {(subscription.status === 'expired' || subscription.status === 'canceled') && (
                      <button
                        onClick={() => handleRenew(subscription.id)}
                        className="renew-button"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
