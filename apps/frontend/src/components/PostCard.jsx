import { Link } from "react-router-dom";

export default function PostCard({ post, onDelete }) {
  return (
    <div
      className="card"
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.6rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <div className="card-avatar">{post.title[0]?.toUpperCase()}</div>
        <div className="card-body">
          <p className="card-name">{post.title}</p>
          <p className="card-id">#{post.id}</p>
        </div>
        <Link
          to={`/edit/${post.id}`}
          state={{ post }}
          className="btn btn-secondary btn-sm"
        >
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(post)}
        >
          ✕
        </button>
      </div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#475569",
          lineHeight: 1.5,
          padding: "0 0.25rem",
        }}
      >
        {post.content}
      </p>
    </div>
  );
}
