import React, { useState } from 'react';
import './Chat.css';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Form, Button, Nav, Navbar } from 'react-bootstrap';

function App() {
  const [selectedGroup, setSelectedGroup] = useState('My Cloud');
  const [groups, setGroups] = useState(['My Cloud']);
  const [newGroup, setNewGroup] = useState('');
  const [messages, setMessages] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [showTaskbar, setShowTaskbar] = useState(false);

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
  };

   const handleCreateGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups((prevGroups) => [...prevGroups.slice(0, 1), newGroup, ...prevGroups.slice(1)]);
      setMessages({ ...messages, [newGroup]: [] });
      setNewGroup('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessages) {
      const updatedMessages = { ...messages };
      if (Array.isArray(updatedMessages[selectedGroup])) {
        updatedMessages[selectedGroup] = [...updatedMessages[selectedGroup], chatMessages];
      } else {
        updatedMessages[selectedGroup] = [chatMessages];
      }
      setMessages(updatedMessages);
      setChatMessages('');
      const chatBody = document.querySelector('.chat-body');
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };

   const handleClick = () => {
    setShowTaskbar(!showTaskbar);
  };

  // const handleDeleteMessage = (index) => {
  //   const updatedMessages = { ...messages };
  //   updatedMessages[selectedGroup].splice(index, 1);
  //   setMessages(updatedMessages);
  // };

  const handleDeleteGroup = () => {
    const updatedGroups = groups.filter((group) => group !== selectedGroup);
    setGroups(updatedGroups);
    const updatedMessages = { ...messages };
    delete updatedMessages[selectedGroup];
    setMessages(updatedMessages);
    setSelectedGroup(updatedGroups[0]); 
  };

  return (
    <div className="app">
      <Container>
        <Row>
          <Col md={4}>
            {/* Left section */}
            <Card>
              <Card.Body className="d-flex flex-column">
                <div className="user-info">
                  <img src="user-avatar.jpg" alt="User Avatar" className="avatar" onClick={handleClick}/>
                  <h5>User Name</h5>
                  <div className={`taskbar${showTaskbar ? " active" : ""}`}>
                    <Navbar bg="light" expand="lg">
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" style={{ flexDirection: "column" }}>
                          <Nav.Link href="#account">Account</Nav.Link>
                          <Nav.Link href="#setting">Setting</Nav.Link>
                          <Nav.Link href="#account">Logout</Nav.Link>
                        </Nav>
                      </Navbar.Collapse>
                    </Navbar>
                    <div className="close-btn" onClick={handleClick}>
                      X
                    </div>
                  </div>
                </div>
                <ListGroup className="flex-grow">
                  {groups.map((group, index) => (
                    <ListGroup.Item
                      key={index}
                      active={selectedGroup === group}
                      onClick={() => handleGroupSelection(group)}
                    >
                      {group}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="text-center">
                  <div className="d-flex">
                    <Form className="col-8">
                      <Form.Group>
                        <Form.Control
                          type="text"
                          placeholder="New Group"
                          value={newGroup}
                          onChange={(e) => setNewGroup(e.target.value)} 
                        />
                      </Form.Group>
                    </Form>
                    <div className="col-4">
                      <Button variant="primary" onClick={handleCreateGroup}>Create Group</Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            {/* Right section */}
            
            {selectedGroup && (
              <Card>
                <div className="d-flex justify-content-between align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    
                  />
                  <Button variant="outline-secondary">Find</Button>
                </div>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>{selectedGroup}</h4>
                    {selectedGroup !== 'My Cloud' && (
                      <Button variant="danger" onClick={handleDeleteGroup}>
                        Out Group
                      </Button>
                    )}
                  </div>
                </Card.Header>
                <Card.Body className="chat-body d-flex flex-column">
                  <div className="chat-messages">
                    {messages[selectedGroup]?.map((msg, index) => (
                      <div key={index} className="message">
                        <p>{msg}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Form onSubmit={handleSendMessage}>
                      <Form.Group className="d-flex">
                        <Form.Control 
                          type="text"
                          placeholder=""
                          value={chatMessages}
                          onChange={(e) => setChatMessages(e.target.value)}
                          className="flex-grow-1"
                        />
                        <Button variant="primary" type="submit">Send</Button>
                      </Form.Group>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;