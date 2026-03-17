import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars } from "react-icons/fa";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/note`, {
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
        `${API_URL}/api/note`,
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
      await axios.delete(`${API_URL}/api/note/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditBody("");
      setEditTitle("");
      setSelectedNote(null);
      setShowEditor(false)
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
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/note/${selectedNote._id}`,
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
      setShowEditor(false)
      fetchNotes();
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="dashboard">
      {/* =========SIDEBAR============= */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
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
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

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
              <FaBars
                size="19px"
                className="header-hamburger"
                onClick={() => setIsOpen(!isOpen)}
              />
            </header>
            <input
              className="search-input"
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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

            {notes
              .filter((note) =>
                note.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((note) => (
                <div
                  onClick={() => {
                    setSelectedNote(note);
                    setShowEditor(true);
                  }}
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
            <button className="fab" onClick={() => setShowForm(!showForm)}>
              +
            </button>
          </div>

          <div className={`editor ${showEditor ? "editor-mobile-open" : ""}`}>
            {selectedNote && (
              <div className="editor-content">
                <div className="editor-top">
                  <button
                    className="editor-back-btn"
                    onClick={() => setShowEditor(false)}
                  >
                    <FaArrowLeft /> Back
                  </button>
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
                    Last Updated: {" "}{" "} 
                    {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="editor-footer-btn">
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
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
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
