import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Mock data for initial state
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
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Subscriptions</h2>
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['active', 'expired', 'canceled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredSubscriptions.map(subscription => (
            <div key={subscription.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 >
                    {subscription.creatorName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {subscription.planType} - ${subscription.price}/month
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {subscription.status === 'active' ? (
                      <p>
                        Renews on{' '}
                        {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                      </p>
                    ) : (
                      <p>
                        Ended on{' '}
                        {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handleCancel(subscription.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    )}
                    {(subscription.status === 'expired' || subscription.status === 'canceled') && (
                      <button
                        onClick={() => handleRenew(subscription.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
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

