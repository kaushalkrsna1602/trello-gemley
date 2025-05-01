import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [boardName, setBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    axios.get('/boards').then((res) => setBoards(res.data));
  }, []);

  const handleCreateBoardClick = () => setIsCreating(true);
  const handleCancelCreate = () => {
    setIsCreating(false);
    setBoardName('');
  };

  const createBoard = async () => {
    if (boardName.trim()) {
      const res = await axios.post('/boards', { name: boardName });
      setBoards([...boards, res.data]);
      setBoardName('');
      setIsCreating(false);
    } else {
      alert('Board name cannot be empty.');
    }
  };

  const deleteBoard = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this board?');
    if (!confirm) return;

    try {
      await axios.delete(`/boards/${id}`);
      setBoards((prev) => prev.filter((board) => board._id !== id));
    } catch (err) {
      alert('Failed to delete board');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
          {!isCreating && (
            <button
              onClick={handleCreateBoardClick}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm"
            >
              <PlusIcon className="h-5 w-5 inline-block mr-1 -mt-0.5" /> Create New Board
            </button>
          )}
        </div>

        {isCreating && (
          <div className="mb-6 flex items-center space-x-2">
            <input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto sm:max-w-xs border-gray-300 rounded-md py-2 px-3"
            />
            <button
              onClick={createBoard}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Create
            </button>
            <button
              onClick={handleCancelCreate}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board._id}
              className="relative p-4 bg-white rounded-md shadow-md hover:shadow-lg transition duration-200"
            >
              <Link to={`/board/${board._id}`} className="block">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{board.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Last updated: {/* Timestamp if available */}</p>
              </Link>
              <button
                onClick={() => deleteBoard(board._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete board"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          {boards.length === 0 && !isCreating && (
            <div className="text-gray-500 col-span-full text-center py-6">
              No boards created yet. Click "Create New Board" to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
