import { Link } from 'react-router-dom';
// import { Users, CreditCard, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              {/* <Users className="w-5 h-5 text-white" /> */}
            </div>
            <span className="text-xl font-bold text-gray-900">StreamHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/following"
              className="text-gray-600 hover:text-purple-600 flex items-center space-x-2"
            >
              {/* <Users className="w-5 h-5" /> */}
              <span>Following</span>
            </Link>
            <Link
              to="/subs"
              className="text-gray-600 hover:text-purple-600 flex items-center space-x-2"
            >
              {/* <CreditCard className="w-5 h-5" /> */}
              <span>Subscriptions</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-purple-600"
            >
              {/* <Menu className="w-6 h-6" /> */}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/following"
              className="block py-2 text-gray-600 hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Following
            </Link>
            <Link
              to="/subs"
              className="block py-2 text-gray-600 hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Subscriptions
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}