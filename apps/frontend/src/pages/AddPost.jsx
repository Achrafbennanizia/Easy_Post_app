import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts.js";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createPost(title.trim(), content.trim());
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <div className="page-header">
        <h1>New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
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
            {loading ? "Saving…" : "Publish"}
          </button>
        </div>
      </form>
    </section>
  );
}
