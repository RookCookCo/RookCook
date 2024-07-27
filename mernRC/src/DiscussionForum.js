import React, { useState } from 'react';

// Component to display a single discussion topic and its replies
const DiscussionTopic = ({ topic, onReply, onDeleteTopic, onDeleteReply }) => {
    const [replyText, setReplyText] = useState('');

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(topic.id, replyText);
            setReplyText('');
        }
    };

    return (
        <div className="discussion-topic">
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <button className="delete-button" onClick={() => onDeleteTopic(topic.id)}>Delete Topic</button>
            <div className="replies">
                {topic.replies.map((reply, index) => (
                    <div key={index} className="reply">
                        <p>{reply.text}</p>
                        <button className="delete-reply-button" onClick={() => onDeleteReply(topic.id, index)}>Delete Reply</button>
                    </div>
                ))}
            </div>
            <textarea 
                value={replyText}
                onChange={handleReplyChange}
                placeholder="Write a reply..."
            />
            <button onClick={handleReplySubmit}>Reply</button>
        </div>
    );
};

// Component to create a new discussion topic
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

// Main component for the discussion forum
const DiscussionForum = ({ setShowDiscussionForum }) => {
    const [topics, setTopics] = useState([]);
    const [showNewTopicForm, setShowNewTopicForm] = useState(false);

    const handleAddTopic = (title, content) => {
        setTopics([...topics, { id: Date.now(), title, content, replies: [] }]);
    };

    const handleReply = (topicId, reply) => {
        setTopics(topics.map(topic => 
            topic.id === topicId 
                ? { ...topic, replies: [...topic.replies, { text: reply }] } 
                : topic
        ));
    };

    const handleDeleteTopic = (topicId) => {
        setTopics(topics.filter(topic => topic.id !== topicId));
    };

    const handleDeleteReply = (topicId, replyIndex) => {
        setTopics(topics.map(topic => 
            topic.id === topicId 
                ? { ...topic, replies: topic.replies.filter((_, index) => index !== replyIndex) } 
                : topic
        ));
    };

    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowDiscussionForum(false)}>X</button>
            <h2>Discussion Forum</h2>
            {showNewTopicForm ? (
                <NewTopicForm onAddTopic={handleAddTopic} />
            ) : (
                <button onClick={() => setShowNewTopicForm(true)}>New Topic</button>
            )}
            <div className="popup-content">
                {topics.map(topic => (
                    <DiscussionTopic 
                        key={topic.id} 
                        topic={topic} 
                        onReply={handleReply} 
                        onDeleteTopic={handleDeleteTopic}
                        onDeleteReply={handleDeleteReply}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiscussionForum;
