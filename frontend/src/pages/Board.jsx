import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';

export default function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [newList, setNewList] = useState('');
  const [newCards, setNewCards] = useState({});

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

      // Update backend (optional improvement)
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

  const createList = async () => {
    if (!newList) return;
    const res = await axios.post('/lists', {
      name: newList,
      boardId: board._id,
    });
    setBoard({
      ...board,
      listIds: [...board.listIds, { ...res.data, cardIds: [] }],
    });
    setNewList('');
  };

  const addCard = async (listId) => {
    const title = newCards[listId];
    if (!title) return;

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
    // Remove from backend
    await axios.delete(`/cards/${cardId}`);

    // Remove from frontend
    const updatedLists = board.listIds.map((list) =>
      list._id === listId
        ? { ...list, cardIds: list.cardIds.filter((card) => card._id !== cardId) }
        : list
    );

    setBoard({ ...board, listIds: updatedLists });
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-4 overflow-auto h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">{board.name}</h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {board.listIds.map((list) => (
              <Droppable droppableId={list._id} key={list._id}>
                {(provided) => (
                  <div
                    className="bg-white p-3 rounded shadow min-w-[250px] max-h-[80vh] overflow-y-auto"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="font-semibold mb-2">{list.name}</h3>
                    {list.cardIds.map((card, index) => (
                      <Draggable draggableId={card._id} index={index} key={card._id}>
                        {(provided) => (
                          <div
                            className="bg-blue-100 p-2 rounded mb-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex justify-between">
                              <span>{card.title}</span>
                              <button
                                onClick={() => deleteCard(card._id, list._id)}
                                className="bg-red-500 text-white rounded px-2 py-1 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="New card title"
                        className="w-full p-1 border rounded text-sm"
                        value={newCards[list._id] || ''}
                        onChange={(e) =>
                          setNewCards({ ...newCards, [list._id]: e.target.value })
                        }
                      />
                      <button
                        className="mt-1 w-full bg-blue-500 text-white py-1 rounded text-sm"
                        onClick={() => addCard(list._id)}
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
        <div className="mt-4">
          <input
            type="text"
            placeholder="New list name"
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            className="input px-2 py-1 border rounded mr-2"
          />
          <button
            onClick={createList}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add List
          </button>
        </div>
      </div>
    </div>
  );
}
