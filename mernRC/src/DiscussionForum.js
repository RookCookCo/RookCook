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

const DiscussionTopic = ({ topic, onReply, onDeleteTopic, onDeleteReply, onBack }) => {
    const [replyText, setReplyText] = useState('');

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            console.log('Submitting reply:', replyText); // Debug: Log the reply text
            onReply(topic.id, replyText);
            setReplyText('');
        }
    };

    return (
        <div className="discussion-topic">
            <button className="back-button" onClick={onBack}>Back to Topics</button>
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <button className="delete-button" onClick={() => onDeleteTopic(topic.id)}>Delete Topic</button>
            <div className="replies">
                {topic.replies.length > 0 ? (
                    <>
                        <div className="recent-reply">
                            <p><strong>Latest Reply:</strong></p>
                            <p>{topic.replies[topic.replies.length - 1].text}</p>
                        </div>
                        {topic.replies.map((reply, index) => (
                            <div key={index} className="reply">
                                <p>{reply.text}</p>
                                <button className="delete-reply-button" onClick={() => onDeleteReply(topic.id, index)}>Delete Reply</button>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No replies yet.</p>
                )}
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
            console.log('Adding new topic:', title, content); // Debug: Log new topic data
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
        // Save topics to localStorage whenever topics change
        saveTopics(topics);
    }, [topics]);

    const handleAddTopic = (title, content) => {
        const newTopic = { id: Date.now(), title, content, replies: [] };
        console.log('Adding topic:', newTopic); // Debug: Log new topic
        setTopics(prevTopics => [...prevTopics, newTopic]);
        setShowNewTopicForm(false); // Hide the form after adding a topic
    };

    const handleReply = (topicId, reply) => {
        console.log('Replying to topic ID:', topicId, 'with reply:', reply); // Debug: Log reply action
        setTopics(prevTopics =>
            prevTopics.map(topic =>
                topic.id === topicId
                    ? { ...topic, replies: [...topic.replies, { text: reply }] }
                    : topic
            )
        );
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic.id === topicId
                ? { ...prevTopic, replies: [...prevTopic.replies, { text: reply }] }
                : prevTopic
        );
    };

    const handleDeleteTopic = (topicId) => {
        console.log('Deleting topic ID:', topicId); // Debug: Log delete action
        setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
        if (selectedTopic && selectedTopic.id === topicId) {
            setSelectedTopic(null);
        }
    };

    const handleDeleteReply = (topicId, replyIndex) => {
        console.log('Deleting reply index:', replyIndex, 'from topic ID:', topicId); // Debug: Log delete reply action
        setTopics(prevTopics =>
            prevTopics.map(topic =>
                topic.id === topicId
                    ? { ...topic, replies: topic.replies.filter((_, index) => index !== replyIndex) }
                    : topic
            )
        );
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic.id === topicId
                ? { ...prevTopic, replies: prevTopic.replies.filter((_, index) => index !== replyIndex) }
                : prevTopic
        );
    };

    const handleViewTopic = (topic) => {
        console.log('Viewing topic:', topic); // Debug: Log view topic action
        setSelectedTopic(topic);
    };

    const handleBackToTopics = () => {
        setSelectedTopic(null);
    };

    return (
        <div className="popup">
            <button className="exit-button" onClick={() => setShowDiscussionForum(false)}>X</button>
            <h2>Discussion Forum</h2>
            {selectedTopic ? (
                <DiscussionTopic 
                    topic={selectedTopic}
                    onReply={handleReply}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteReply={handleDeleteReply}
                    onBack={handleBackToTopics}
                />
            ) : showNewTopicForm ? (
                <NewTopicForm onAddTopic={handleAddTopic} />
            ) : (
                <>
                    <button onClick={() => setShowNewTopicForm(true)}>New Topic</button>
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
                    </div>
                </>
            )}
        </div>
    );
};

export default DiscussionForum;
