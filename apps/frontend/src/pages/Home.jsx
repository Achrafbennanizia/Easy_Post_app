import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost } from "../api/posts.js";
import PostCard from "../components/PostCard.jsx";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`))
      return;
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status alert alert-error">{error}</p>;

  return (
    <section>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/add" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="status">
          No posts yet. <Link to="/add">Create one</Link>.
        </p>
      ) : (
        <div className="grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
