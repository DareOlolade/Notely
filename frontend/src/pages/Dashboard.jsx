import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBars,
  FaSun,
  FaMoon,
  FaTrash,
  FaClock,
  FaLock,
} from "react-icons/fa";
import { encryptData, decryptData } from "../utils/encryption";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn-confirm" onClick={onConfirm}>
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ FIX 1: Decrypt all note bodies after fetching
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const decryptedNotes = response.data.map((note) => ({
        ...note,
        body: decryptData(note.body),
      }));

      setNotes(decryptedNotes);

      // Keep selectedNote in sync with fresh data
      if (selectedNote && selectedNote._id !== "new") {
        const updated = decryptedNotes.find((n) => n._id === selectedNote._id);
        if (updated) {
          setSelectedNote(updated);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNew = () => {
    setSelectedNote({ _id: "new", title: "", body: "" });
    setEditTitle("");
    setEditBody("");
    setShowEditor(true);
  };

  // ✅ FIX 2: handleSaveNewNote — encrypt before sending, decrypt response
  const handleSaveNewNote = async () => {
    if (!editTitle.trim() && !editBody.trim()) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const encryptedBody = encryptData(editBody);

      const response = await axios.post(
        `${API_URL}/api/note`,
        { title: editTitle, body: encryptedBody },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Handle response — if API returns the single saved note:
      if (Array.isArray(response.data)) {
        const decryptedNotes = response.data.map((note) => ({
          ...note,
          body: decryptData(note.body),
        }));
        setNotes(decryptedNotes);
        setSelectedNote(decryptedNotes[0]);
      } else {
        // API returns single note
        const savedNote = {
          ...response.data,
          body: decryptData(response.data.body),
        };
        setNotes((prev) => [savedNote, ...prev]);
        setSelectedNote(savedNote);
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditBody("");
      setEditTitle("");
      setSelectedNote(null);
      setShowEditor(false);
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

  // ✅ FIX 3: Encrypt body before sending in auto-save
  const autoSaveNote = async (titleToSave, bodyToSave) => {
    if (!selectedNote) return;
    if (selectedNote._id === "new") return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const encryptedBody = encryptData(bodyToSave); // ← Was missing!

      await axios.put(
        `${API_URL}/api/note/${selectedNote._id}`,
        { title: titleToSave, body: encryptedBody },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchNotes();
    } catch (error) {
      console.error("Auto-save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (
      !selectedNote ||
      (editTitle === selectedNote.title && editBody === selectedNote.body)
    ) {
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      autoSaveNote(editTitle, editBody);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [editTitle, editBody]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const triggerDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    handleDelete(selectedNote._id);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    if (showEditor && window.innerWidth <= 650) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditor]);

  return (
    <div className="dashboard">
      {/* =========SIDEBAR============= */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-body">
          <ul>
            <li>All notes</li>
            <li>Recent</li>
          </ul>
          <div className="sidebar-base">
            <div
              className={`theme-toggle-shutter ${theme}`}
              onClick={toggleTheme}
            >
              <div className="toggle-slider">
                {theme === "light" ? (
                  <FaSun size="14px" color="#ffb703" />
                ) : (
                  <FaMoon size="14px" color="#f1f1f1" />
                )}
              </div>
              <span className="toggle-text">
                {theme === "light" ? "Light" : "Dark"}
              </span>
            </div>
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
              <button onClick={handleCreateNew} className="header-new-note-btn">
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
                    <FaLock
                      size="10px"
                      style={{ marginLeft: "8px", opacity: 0.5 }}
                      title="AES-256 Encrypted"
                    />
                  </div>
                </div>
              ))}
            <button className="fab" onClick={handleCreateNew}>
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
                    className="editor-note-title-input"
                    placeholder="Note Title..."
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editBody}
                    className="editor-note-body-textarea"
                    placeholder="Start writing your thoughts..."
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                </div>

                <div className="editor-footer">
                  <div className="editor-footer-info">
                    <p>
                      Updated:{" "}
                      {selectedNote.updatedAt
                        ? new Date(selectedNote.updatedAt).toLocaleDateString()
                        : "Not saved yet"}
                    </p>
                    <div
                      className={`autosave-status ${isSaving ? "saving" : "saved"}`}
                    >
                      <FaClock size="12px" />
                      <span>{isSaving ? "Saving..." : "Synced"}</span>
                    </div>
                  </div>
                  <div className="editor-footer-actions">
                    {selectedNote._id === "new" ? (
                      <button
                        className="editor-save-btn-primary"
                        onClick={handleSaveNewNote}
                        disabled={!editTitle && !editBody}
                      >
                        Save Note
                      </button>
                    ) : (
                      <button
                        className="icon-btn delete"
                        data-tooltip="Delete Note"
                        onClick={triggerDelete}
                      >
                        <FaTrash size="15px" />
                      </button>
                    )}
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Note?"
        message="This action cannot be undone. This note will be permanently removed."
      />
    </div>
  );
};

export default Dashboard;