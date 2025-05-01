import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [newList, setNewList] = useState('');
  const [newCards, setNewCards] = useState({});
  const [isAddingList, setIsAddingList] = useState(false);

  const [editingListId, setEditingListId] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState('');

  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardTitle, setEditingCardTitle] = useState('');

  useEffect(() => {
    axios.get(`/boards/${id}`).then((res) => setBoard(res.data));
  }, [id]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceList = board.listIds.find((l) => l._id === source.droppableId);
      const destList = board.listIds.find((l) => l._id === destination.droppableId);

      const movedCard = sourceList.cardIds.splice(source.index, 1)[0];
      destList.cardIds.splice(destination.index, 0, movedCard);

      await axios.patch(`/cards/${draggableId}`, {
        listId: destList._id,
      });
    } else {
      const list = board.listIds.find((l) => l._id === source.droppableId);
      const [movedCard] = list.cardIds.splice(source.index, 1);
      list.cardIds.splice(destination.index, 0, movedCard);
    }

    setBoard({ ...board });
  };

  const handleAddListClick = () => setIsAddingList(true);
  const handleCancelListClick = () => {
    setIsAddingList(false);
    setNewList('');
  };

  const createList = async () => {
    if (!newList.trim()) {
      setIsAddingList(false);
      return;
    }
    const res = await axios.post('/lists', {
      name: newList,
      boardId: board._id,
    });
    setBoard({
      ...board,
      listIds: [...board.listIds, { ...res.data, cardIds: [] }],
    });
    setNewList('');
    setIsAddingList(false);
  };

  const handleAddCardClick = (listId) => {
    setNewCards({ ...newCards, [listId]: '' });
  };

  const handleCardInputChange = (listId, value) => {
    setNewCards({ ...newCards, [listId]: value });
  };

  const addCard = async (listId) => {
    const title = newCards[listId];
    if (!title || !title.trim()) return;

    const res = await axios.post('/cards', {
      title,
      description: '',
      listId,
    });

    const updatedLists = board.listIds.map((list) =>
      list._id === listId
        ? { ...list, cardIds: [...list.cardIds, res.data] }
        : list
    );

    setBoard({ ...board, listIds: updatedLists });
    setNewCards({ ...newCards, [listId]: '' });
  };

  const deleteCard = async (cardId, listId) => {
    await axios.delete(`/cards/${cardId}`);
    const updatedLists = board.listIds.map((list) =>
      list._id === listId
        ? { ...list, cardIds: list.cardIds.filter((card) => card._id !== cardId) }
        : list
    );
    setBoard({ ...board, listIds: updatedLists });
  };

  const deleteList = async (listId) => {
    try {
      await axios.delete(`/lists/${listId}`);
      const updatedLists = board.listIds.filter((list) => list._id !== listId);
      setBoard({ ...board, listIds: updatedLists });
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const handleListTitleUpdate = async (listId) => {
    try {
      await axios.patch(`/lists/${listId}`, { name: editingListTitle });
      const updatedLists = board.listIds.map((list) =>
        list._id === listId ? { ...list, name: editingListTitle } : list
      );
      setBoard({ ...board, listIds: updatedLists });
    } catch (err) {
      console.error(err);
    }
    setEditingListId(null);
    setEditingListTitle('');
  };

  const handleCardTitleUpdate = async (cardId, listId) => {
    try {
      await axios.patch(`/cards/${cardId}`, { title: editingCardTitle });
      const updatedLists = board.listIds.map((list) =>
        list._id === listId
          ? {
              ...list,
              cardIds: list.cardIds.map((card) =>
                card._id === cardId ? { ...card, title: editingCardTitle } : card
              ),
            }
          : list
      );
      setBoard({ ...board, listIds: updatedLists });
    } catch (err) {
      console.error(err);
    }
    setEditingCardId(null);
    setEditingCardTitle('');
  };

  if (!board)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading board...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 pb-8 h-[calc(100vh-56px)] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 sm:text-3xl">{board.name}</h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {board.listIds.map((list) => (
              <Droppable droppableId={list._id} key={list._id}>
                {(provided) => (
                  <div
                    className="bg-white p-3 rounded-md shadow-md w-full md:w-72 min-w-full md:min-w-72 max-h-[calc(75vh - 3rem)] overflow-y-auto flex flex-col"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="flex justify-between items-center mb-3">
                      {editingListId === list._id ? (
                        <input
                          value={editingListTitle}
                          onChange={(e) => setEditingListTitle(e.target.value)}
                          onBlur={() => handleListTitleUpdate(list._id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleListTitleUpdate(list._id)}
                          autoFocus
                          className="p-2 text-sm border border-gray-300 rounded w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <h3
                          className="font-semibold text-gray-800 cursor-pointer text-lg"
                          onClick={() => {
                            setEditingListId(list._id);
                            setEditingListTitle(list.name);
                          }}
                        >
                          {list.name}
                        </h3>
                      )}
                      <button
                        onClick={() => deleteList(list._id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        title="Delete List"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {list.cardIds.map((card, index) => (
                      <Draggable draggableId={card._id} index={index} key={card._id}>
                        {(provided) => (
                          <div
                            className="bg-white rounded-md shadow-sm mb-2 p-2 border border-gray-200 cursor-grab hover:shadow-lg transition-shadow duration-200 ease-in-out"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex justify-between items-start">
                              {editingCardId === card._id ? (
                                <input
                                  value={editingCardTitle}
                                  onChange={(e) => setEditingCardTitle(e.target.value)}
                                  onBlur={() => handleCardTitleUpdate(card._id, list._id)}
                                  onKeyDown={(e) =>
                                    e.key === 'Enter' && handleCardTitleUpdate(card._id, list._id)
                                  }
                                  autoFocus
                                  className="text-sm w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              ) : (
                                <span
                                  onClick={() => {
                                    setEditingCardId(card._id);
                                    setEditingCardTitle(card.title);
                                  }}
                                  className="text-sm text-gray-700 cursor-pointer"
                                >
                                  {card.title}
                                </span>
                              )}
                              <button
                                onClick={() => deleteCard(card._id, list._id)}
                                className="text-gray-400 hover:text-gray-600 text-xs focus:outline-none"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <div className="mt-2">
                      {newCards[list._id] !== undefined ? (
                        <div className="flex flex-col space-y-2">
                          <input
                            type="text"
                            placeholder="Enter card title"
                            className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={newCards[list._id] || ''}
                            onChange={(e) => handleCardInputChange(list._id, e.target.value)}
                          />
                          <div className="flex space-x-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150 ease-in-out"
                              onClick={() => addCard(list._id)}
                            >
                              Add Card
                            </button>
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-150 ease-in-out"
                              onClick={() => setNewCards({ ...newCards, [list._id]: undefined })}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddCardClick(list._id)}
                          className="w-full text-left text-sm text-gray-500 hover:text-gray-700 py-2 rounded-md transition-colors duration-150 ease-in-out focus:outline-none"
                        >
                          <PlusIcon className="h-4 w-4 inline-block mr-1 -mt-0.5" /> Add a card
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
            {isAddingList ? (
              <div className="bg-white p-3 rounded-md shadow-md w-full md:w-72 min-w-full md:min-w-72 flex flex-col">
                <input
                  type="text"
                  placeholder="Enter list title"
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={createList}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-150 ease-in-out"
                  >
                    Add List
                  </button>
                  <button
                    onClick={handleCancelListClick}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddListClick}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-150 ease-in-out focus:outline-none w-full md:w-auto"
              >
                <PlusIcon className="h-4 w-4 inline-block mr-1 -mt-0.5" /> Add another list
              </button>
            )}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
