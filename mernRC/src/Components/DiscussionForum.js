import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios at the top of your file


// Retrieve topics from localStorage
const getStoredTopics = () => {
    const storedTopics = localStorage.getItem('topics');
    console.log('loading data to topic1',storedTopics);
    console.log('loading data to topic2',JSON.parse(storedTopics));
    return storedTopics ? JSON.parse(storedTopics) : [];
};

// Save topics to localStorage
const saveTopics = (topics) => {
    console.log('saving data to topic1',topics);
    console.log('saving data to topic2',JSON.stringify(topics));
    localStorage.setItem('topics', JSON.stringify(topics));
};

// Styles for the discussion forum background
const style = {
    background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(184,217,242,1) 35%, rgba(61,143,208,1) 100%)'
};

// Component to display and manage a single discussion topic
const DiscussionTopic = ({ topic, onReply, onDeleteTopic, onDeleteReply }) => {
    const [replyText, setReplyText] = useState(''); // State for holding the reply text
    const [replyParentId, setReplyParentId] = useState(null); // State to track which reply the new reply is a child of

    // Handle changes to the reply input
    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    // Handle submission of a new reply
    const handleReplySubmit = (parentId = null) => {
        if (replyText.trim()) {
            onReply(topic.id, replyText, parentId);
            setReplyText(''); // Clear the reply text
            setReplyParentId(null); // Reset the parent ID
        }
    };

    // Recursively render replies to create a threaded structure
    const renderReplies = (replies, parentId = null, level = 0) => {
        return replies
            .filter(reply => reply.parentId === parentId)
            .map((reply) => (
                <div key={reply.id} className={`reply reply-level-${level % 2 === 0 ? 'even' : 'odd'}`}>
                    <div className="reply-content">
                        <p className={reply.deleted ? 'deleted-reply' : ''}>
                            {reply.deleted ? 'This reply has been deleted' : reply.text}
                        </p>
                    </div>
                    <div className="reply-buttons">
                        {!reply.deleted && (
                            <>
                                <button className="trash-button" onClick={() => onDeleteReply(topic.id, reply.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                                <button className="reply-button" onClick={() => setReplyParentId(reply.id)}>Reply</button>
                            </>
                        )}
                    </div>
                    {renderReplies(replies, reply.id, level + 1)}
                </div>
            ));
    };

    return (
        <div className="discussion-topic">
            <h3>{topic.title}</h3>
            <p>{topic.content}</p>
            <button className="discussion-delete-button" onClick={() => onDeleteTopic(topic.id)}>Delete Topic</button>
            <div className="replies">
                {topic.replies.length > 0 ? (
                    renderReplies(topic.replies) // Render replies if any
                ) : (
                    <p>No replies yet.</p>
                )}
            </div>
            <textarea
                value={replyText}
                onChange={handleReplyChange}
                placeholder={replyParentId ? "Write a reply..." : "Write a comment..."}
            />
            <button className="reply-button" onClick={() => handleReplySubmit(replyParentId)}>Comment</button>
        </div>
    );
};

// Component for the form to add a new topic
const NewTopicForm = ({ onAddTopic }) => {
    const [title, setTitle] = useState(''); // State for the topic title
    const [content, setContent] = useState(''); // State for the topic content

    // Handle changes to the topic title input
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Handle changes to the topic content input
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // Handle the submission of the new topic form
    const handleSubmit = () => {
        if (title.trim() && content.trim()) {
            onAddTopic(title, content);
            setTitle(''); // Clear the title
            setContent(''); // Clear the content
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
    //const [topics, setTopics] = useState(getStoredTopics()); // State for the list of topics
    const [topics, setTopics] = useState([]); // State for the list of topics
    const [showNewTopicForm, setShowNewTopicForm] = useState(false); // State to control visibility of the new topic form
    const [selectedTopic, setSelectedTopic] = useState(null); // State for the currently selected topic

    // Save topics to localStorage whenever the topics state changes
    //useEffect(() => {
    //    saveTopics(topics);
    //}, [topics]);
    useEffect(() => {
        if (!topics || topics.length === 0) {
            console.log('should load from backend:', topics);
            // Fetch comments/reviews for the selected meal from the backend
            const fetchdiscuession = async () => {
                try {
                    //const response = await axios.get(`http://localhost:5001/recipes/${selectedMealDetails.idMeal}/comments`);
                    //setReviews(response.data); // Assuming the response is an array of comments
                    const response = await axios.get('http://localhost:5001/string');
                    const storedString = response.data.value;
                    console.log('loading data to topic1', storedString);

                    // If storedString is null, initialize it with an empty array
                    const parsedTopics = storedString ? JSON.parse(storedString) : [];
                    console.log('loading data to topic2', parsedTopics);
                    setTopics(parsedTopics);
                } catch (error) {
                    console.error('Error loading discuession:', error);
                }
        };

        fetchdiscuession();
        }else{
            console.log('should update the current forum to backend:', topics);
        }
    }, [setShowDiscussionForum]);

    // Handle adding a new topic
    const handleAddTopic = (title, content) => {
        const newTopic = { id: Date.now(), title, content, replies: [] };

        console.log("adding a new topic", newTopic);
        const result =  [...topics, newTopic];
        console.log("result for adding a new topic", result);
        const stringifiedTopics = JSON.stringify(result);
        console.log('Saving topics2 to backend:', stringifiedTopics);

        axios.post('http://localhost:5001/string', { value: stringifiedTopics })
        .then(response => {
            if (response.status === 200) {
                console.log('Topics saved successfully');
            } else {
                console.error(`Failed to save topics, status code: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error saving topics to backend:', error);
        });

        setTopics(prevTopics => [...prevTopics, newTopic]);
        setShowNewTopicForm(false); // Hide the new topic form

    };

    // Handle adding a reply to a topic
    const handleReply = (topicId, replyText, parentId) => {
        const newReply = { id: Date.now(), text: replyText, parentId, deleted: false };

        // Manually generate a new result array with the updated topics
        const updatedReplys = topics.map(topic =>
        topic.id === topicId
            ? { ...topic, replies: [...topic.replies, newReply] }
            : topic
        );
        // Log the updated result array
        console.log("Updated topics array:", updatedReplys);
        const stringifiedTopics = JSON.stringify(updatedReplys);
        console.log('Saving topics2 to backend:', stringifiedTopics);


        axios.post('http://localhost:5001/string', { value: stringifiedTopics })
        .then(response => {
            if (response.status === 200) {
                console.log('Replys saved successfully');
            } else {
                console.error(`Failed to save replys, status code: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error saving replys to backend:', error);
        });



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
        //console.log("adding a new reply", topics);
    };

    // Handle deleting a topic
    const handleDeleteTopic = (topicId) => {
        setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));
        if (selectedTopic && selectedTopic.id === topicId) {
            setSelectedTopic(null); // Clear the selected topic if it was deleted
        }
    };

    // Handle deleting a reply
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

    // Handle selecting a topic to view
    const handleViewTopic = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <div className="discussion-popup">
            <button className="discussion-exit-button" onClick={() => setShowDiscussionForum(false)}>X</button>
            <div className="discussion-popup-content">
                {topics.length > 0 ? (
                    topics.map(topic => (
                        <div key={topic.id} className="topic-preview" onClick={() => handleViewTopic(topic)}>
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
