import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionTopic = ({ topic, onReply, onDeleteTopic, onDeleteReply }) => {
    const [replyText, setReplyText] = useState('');
    const [replyParentId, setReplyParentId] = useState(null);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(topic._id, { text: replyText, parentId: replyParentId, deleted: false });
            setReplyText('');
            setReplyParentId(null);
        }
    };

    const renderReplies = (replies, parentId = null, level = 0) => {
        return replies
            .filter(reply => reply.parentId === parentId)
            .map((reply) => (
                <div key={reply._id} className={`reply reply-level-${level % 2 === 0 ? 'even' : 'odd'}`}>
                    <div className="reply-content">
                        <p className={reply.deleted ? 'deleted-reply' : ''}>
                            {reply.deleted ? 'This reply has been deleted' : reply.text}
                        </p>
                    </div>
                    <div className="reply-buttons">
                        {!reply.deleted && (
                            <>
                                <button className="trash-button" onClick={() => onDeleteReply(topic._id, reply._id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                                <button className="reply-button" onClick={() => setReplyParentId(reply._id)}>Reply</button>
                            </>
                        )}
                    </div>
                    {renderReplies(replies, reply._id, level + 1)}
                </div>
            ));
    };

    return (
        <div className="discussion-topic">
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <button className="discussion-delete-button" onClick={() => onDeleteTopic(topic._id)}>Delete Topic</button>
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
                placeholder={replyParentId ? "Write a reply..." : "Write a comment..."}
            />
            <button className="reply-button" onClick={handleReplySubmit}>Comment</button>
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

    const handleSubmit = async () => {
        if (title.trim() && content.trim()) {
            await axios.post('http://localhost:5000/api/topics', { title, content, replies: [] });
            onAddTopic();
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
    const [topics, setTopics] = useState([]);
    const [showNewTopicForm, setShowNewTopicForm] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [rssFeed, setRssFeed] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            const response = await axios.get('http://localhost:5000/api/topics');
            setTopics(response.data);
        };

        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchRssFeed = async () => {
            try {
                const feed = await parser.parseURL('https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/food/rss.xml');
                setRssFeed(feed.items);
            } catch (error) {
                console.error('Failed to fetch RSS feed:', error);
            }
        };

        fetchRssFeed();
    }, []);

    const handleAddTopic = async () => {
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
        setShowNewTopicForm(false);
    };

    const handleReply = async (topicId, reply) => {
        await axios.post(`http://localhost:5000/api/topics/${topicId}/replies`, reply);
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic._id === topicId
                ? { ...prevTopic, replies: [...prevTopic.replies, reply] }
                : prevTopic
        );
    };

    const handleDeleteTopic = async (topicId) => {
        await axios.delete(`http://localhost:5000/api/topics/${topicId}`);
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
        if (selectedTopic && selectedTopic._id === topicId) {
            setSelectedTopic(null);
        }
    };

    const handleDeleteReply = async (topicId, replyId) => {
        await axios.delete(`http://localhost:5000/api/topics/${topicId}/replies/${replyId}`);
        const response = await axios.get('http://localhost:5000/api/topics');
        setTopics(response.data);
        setSelectedTopic(prevTopic =>
            prevTopic && prevTopic._id === topicId
                ? {
                    ...prevTopic,
                    replies: prevTopic.replies.map(reply =>
                        reply._id === replyId ? { ...reply, deleted: true } : reply
                    )
                }
                : prevTopic
        );
    };

    const handleViewTopic = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="discussion-popup">
            <button className="discussion-exit-button" onClick={() => setShowDiscussionForum(false)}>X</button>
            <div className="discussion-popup-content">
                {topics.length > 0 ? (
                    topics.map(topic => (
                        <div key={topic._id} className="topic-preview" onClick={() => handleViewTopic(topic)}>
                            <h3>{topic.title}</h3>
                            <p>{topic.content.substring(0, 100)}...</p>
                        </div>
                    ))
                ) : (
                    <div className="topic-preview" style={style}>
                        <h3>Discussion Forum</h3>
                        <p>No topics available. Start by adding a new topic!</p>
                    </div>
                )}
                <button className="new-topic-button" onClick={() => setShowNewTopicForm(true)}>New Topic</button>
                {showNewTopicForm && <NewTopicForm onAddTopic={handleAddTopic} />}
            </div>
            {selectedTopic ? (
                <DiscussionTopic
                    topic={selectedTopic}
                    onReply={handleReply}
                    onDeleteTopic={handleDeleteTopic}
                    onDeleteReply={handleDeleteReply}
                />
            ) : (
                topics.length === 0 && (
                    <div className="rss-feed">
                        <h3>RSS Feed</h3>
                        {rssFeed.length === 0 ? (
                            <p>Loading RSS feed...</p>
                        ) : (
                            rssFeed.map(item => (
                                <div key={item.guid} className="rss-item">
                                    <h4><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h4>
                                    <p>{item.contentSnippet}</p>
                                </div>
                            ))
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default DiscussionForum;

//https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/food/rss.xml