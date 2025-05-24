// CommentThread.js
import React, { useState } from "react";

const CommentThread = ({ comment, onReply }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReply = (e) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onReply(comment.id, replyContent);
            setReplyContent("");
            setShowReply(false);
        }
    };

    return (
        <div className="comment" style={{ marginLeft: comment.parent ? 24 : 0, marginTop: 12 }}>
            <p>
                <strong>{comment.author_username}:</strong> {comment.content}
            </p>
            <button className="reply-btn" onClick={() => setShowReply((prev) => !prev)}>
                Trả lời
            </button>
            {showReply && (
                <form onSubmit={handleReply} className="reply-form">
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Trả lời bình luận này..."
                        autoFocus
                    />
                    <button type="submit">Gửi</button>
                </form>
            )}
            {/* Đệ quy các reply */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                    {comment.replies.map((reply) => (
                        <CommentThread key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentThread;
