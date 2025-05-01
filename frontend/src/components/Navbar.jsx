import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between shadow-md">
      <Link  to="/dashboard" className="font-bold text-xl tracking-tight">TaskFlow</Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}