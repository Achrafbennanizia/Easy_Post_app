import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { updatePost, deletePost } from "../api/posts.js";

export default function EditPost() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(state?.post?.title ?? "");
  const [content, setContent] = useState(state?.post?.content ?? "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await updatePost(id, title.trim(), content.trim());
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <div className="page-header">
        <h1>Edit Post</h1>
      </div>

      <form onSubmit={handleSave} className="form-card">
        {error && <p className="alert alert-error">{error}</p>}

        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post…"
            rows={5}
            style={{
              padding: "0.6rem 0.9rem",
              border: "1.5px solid var(--border)",
              borderRadius: "8px",
              fontSize: "0.95rem",
              color: "var(--text)",
              background: "var(--bg)",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </button>

          <div className="form-actions-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim() || !content.trim() || loading}
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
