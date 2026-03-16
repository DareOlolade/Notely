import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/note", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/note",
        { title: title, body: body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTitle("");
      setBody("");
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/note/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditBody("")
      setEditTitle("")
      fetchNotes();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditBody(selectedNote.body);
    }
  }, [selectedNote]);

  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/note/${selectedNote._id}`,
      {
        title: editTitle,
        body: editBody,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    fetchNotes();
  };
  return (
    <div className="dashboard">
      {/* =========SIDEBAR============= */}
      <div className="sidebar">
        <div className="sidebar-heading">
          <div className="logo"></div>
          <h1>Notely</h1>
        </div>

        <div className="sidebar-body">
          <ul>
            <li>All notes</li>
            <li>Recent</li>
            <li>Favourite</li>
          </ul>

          <div className="sidebar-base">
            <p>Settings</p>
            <p onClick={() => handleLogout()} className="logout">
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* ==================MAIN================ */}
      <div className="main">
        <div className="main-split">
          <div className="notes-list">
            <header>
              <h1>Notes</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="header-new-note-btn"
              >
                + New
              </button>
            </header>
            {showForm && (
              <form className="note-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  placeholder="Note title..."
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  type="text"
                  value={body}
                  placeholder="Write your note here..."
                  onChange={(e) => setBody(e.target.value)}
                />
                <button className="editor-save-btn">Save note</button>
              </form>
            )}

            {notes.map((note) => (
              <div
                onClick={() => setSelectedNote(note)}
                className={`note-card ${selectedNote?._id === note._id ? "note-card-active" : ""}`}
                key={note._id}
              >
                <h1>{note.title}</h1>
                <p className="note-card-body">{note.body.slice(0, 60)}...</p>

                <div className="note-card-last-line">
                  <p className="note-card-timestamps">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="editor">
            {selectedNote && (
              <div className="editor-content">
                <div className="editor-top">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                </div>
                <div className="editor-footer">
                  <p>
                    last updated at
                    {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>

                  <button
                    className="editor-delete-btn"
                    onClick={() => handleDelete(selectedNote._id)}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit()}
                    className="editor-save-btn"
                  >
                    Save note
                  </button>
                </div>
              </div>
            )}

            {!selectedNote && (
              <div className="editor-empty">
                <p>Select a note to view it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
