import React, { useState, useEffect } from 'react';

// Retrieve topics from localStorage
const getStoredTopics = () => {
    const storedTopics = localStorage.getItem('topics');
    return storedTopics ? JSON.parse(storedTopics) : [];
};

// Save topics to localStorage
const saveTopics = (topics) => {
    localStorage.setItem('topics', JSON.stringify(topics));
};

const DiscussionTopic = ({ topic, onReply, onDeleteTopic, onDeleteReply }) => {
    const [replyText, setReplyText] = useState('');
    const [replyParentId, setReplyParentId] = useState(null);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = (parentId = null) => {
        if (replyText.trim()) {
            onReply(topic.id, replyText, parentId);
            setReplyText('');
            setReplyParentId(null);
        }
    };

    const renderReplies = (replies, parentId = null) => {
        return replies
            .filter(reply => reply.parentId === parentId)
            .map((reply) => (
                <div key={reply.id} className="reply">
                    <div className="reply-content">
                        <p className={reply.deleted ? 'deleted-reply' : ''}>
                            {reply.deleted ? 'This reply has been deleted' : reply.text}
                        </p>
                    </div>
                    <div className="reply-buttons">
                        {!reply.deleted && (
                            <>
                                <button className="delete-reply-button" onClick={() => onDeleteReply(topic.id, reply.id)}>Delete Reply</button>
                                <button className="reply-button" onClick={() => setReplyParentId(reply.id)}>Reply</button>
                            </>
                        )}
                    </div>
                    {renderReplies(replies, reply.id)}
                </div>
            ));
    };

    return (
        <div className="discussion-topic">
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <button className="delete-button" onClick={() => onDeleteTopic(topic.id)}>Delete Topic</button>
            <div className="replies">
                {topic.replies.length > 0 ? (
                    renderReplies(topic.replies)
                ) : (
                    <p>No replies yet.</p>
                )}
            </div>
            <textarea
                value={replyText}
                onChange={handleReplyChange}
                placeholder="Write a reply..."
            />
            <button className="reply-button" onClick={() => handleReplySubmit(replyParentId)}>Reply</button>
        </div>
    );
};

const NewTopicForm = ({ onAddTopic }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = () => {
        if (title.trim() && content.trim()) {
            onAddTopic(title, content);
            setTitle('');
            setContent('');
        }
    };

    return (
        <div className="new-topic-form">
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Topic Title"
            />
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Write your topic content..."
            />
            <button onClick={handleSubmit}>Add Topic</button>
        </div>
    );
};

const DiscussionForum = ({ setShowDiscussionForum }) => {
    const [topics, setTopics] = useState(getStoredTopics());
    const [showNewTopicForm, setShowNewTopicForm] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        saveTopics(topics);
    }, [topics]);

    const handleAddTopic = (title, content) => {
        const newTopic = { id: Date.now(), title, content, replies: [] };
        setTopics(prevTopics => [...prevTopics, newTopic]);
        setShowNewTopicForm(false);
    };

    const handleReply = (topicId, replyText, parentId) => {
        const newReply = { id: Date.now(), text: replyText, parentId, deleted: false };
        setTopics(prevTopics =>
            prevTopics.map(topic =>
                topic.id === topicId
                    ? { ...topic, replies: [...topic.replies, newReply] }
                    : topic
            )
        );
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic.id === topicId
                ? { ...prevTopic, replies: [...prevTopic.replies, newReply] }
                : prevTopic
        );
    };

    const handleDeleteTopic = (topicId) => {
        setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
        if (selectedTopic && selectedTopic.id === topicId) {
            setSelectedTopic(null);
        }
    };

    const handleDeleteReply = (topicId, replyId) => {
        setTopics(prevTopics =>
            prevTopics.map(topic =>
                topic.id === topicId
                    ? {
                        ...topic,
                        replies: topic.replies.map(reply =>
                            reply.id === replyId ? { ...reply, deleted: true } : reply
                        )
                    }
                    : topic
            )
        );
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic.id === topicId
                ? {
                    ...prevTopic,
                    replies: prevTopic.replies.map(reply =>
                        reply.id === replyId ? { ...reply, deleted: true } : reply
                    )
                }
                : prevTopic
        );
    };

    const handleViewTopic = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowDiscussionForum(false)}>X</button>
            <div className="popup-content">
                {topics.length > 0 ? (
                    topics.map(topic => (
                        <div key={topic.id} className="topic-preview" onClick={() => handleViewTopic(topic)}>
                            <h3>{topic.title}</h3>
                            <p>{topic.content.substring(0, 100)}...</p>
                        </div>
                    ))
                ) : (
                    <p>No topics available. Start by adding a new topic!</p>
                )}
                <button className="new-topic-button" onClick={() => setShowNewTopicForm(true)}>New Topic</button>
                {showNewTopicForm && <NewTopicForm onAddTopic={handleAddTopic} />}
            </div>
            {selectedTopic && (
                <DiscussionTopic
                    topic={selectedTopic}
                    onReply={handleReply}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteReply={handleDeleteReply}
                />
            )}
        </div>
    );
};

export default DiscussionForum;
