import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    axios.get('/boards').then((res) => setBoards(res.data));
  }, []);

  const createBoard = async () => {
    const res = await axios.post('/boards', { name: boardName });
    setBoards([...boards, res.data]);
    setBoardName('');
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Your Boards</h1>
        <div className="space-y-2">
          {boards.map((b) => (
            <Link key={b._id} to={`/board/${b._id}`} className="block p-2 bg-gray-200 rounded">
              {b.name}
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <input
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="New board name"
            className="input mr-2"
          />
          <button onClick={createBoard} className="bg-green-600 text-white px-3 py-1 rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
