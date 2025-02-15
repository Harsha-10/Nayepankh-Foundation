import { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { LayoutDashboard, Receipt, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(false); 
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`sidebar ${isVisible ? 'sidebar-visible' : ''}`}>
      <nav className="mt-8">
        <Link
          to="/dashboard"
          className={`flex items-center px-6 py-3 hover:text-gray-300 text-gray-50`}
          // onClick={(e) => {
          //   e.preventDefault();
          //   window.location.reload();
          // }}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          <span className="text">Dashboard</span>
        </Link>
        <Link
          to="/transactions"
          className={`flex items-center px-6 py-3 hover:text-gray-300 text-gray-50`}
        >
          <Receipt className="w-5 h-5 mr-3" />
          <span className="text">Transactions</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center px-6 py-3 hover:text-gray-300 text-gray-50 w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
