import React, { useState, useEffect } from "react";
import "./Chat.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Form,
  Button,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function App() {
  const [selectedGroup, setSelectedGroup] = useState("My Cloud");
  const [groups, setGroups] = useState(["My Cloud"]);
  const [newGroup, setNewGroup] = useState("");
  const [messages, setMessages] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [showTaskbar, setShowTaskbar] = useState(false);
  const [users, setUsers] = useState({});
  const { id } = useParams();
  const [foundUser, setFoundUser] = useState(null);
  const [find, setFind] = useState("");
  const [userList, setUserList] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  //add online user
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", id);
    socket.on("getOnlineUser", (res) => {
      setOnlineUser(res);
    });

    return () => {
      socket.off("getOnlineUser");
    };
  }, [socket]);

  const fetchUsers = async () => {
    try {
      const listAccountResponse = await axios.get("/api/listAccount");
      const userResponse = await axios.get(`/api/${id}`);
      setUsers(userResponse.data);
      setUserList(listAccountResponse.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups((prevGroups) => [
        ...prevGroups.slice(0, 1),
        newGroup,
        ...prevGroups.slice(1),
      ]);
      setMessages({ ...messages, [newGroup]: [] });
      setNewGroup("");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessages) {
      const updatedMessages = { ...messages };
      if (Array.isArray(updatedMessages[selectedGroup])) {
        updatedMessages[selectedGroup] = [
          ...updatedMessages[selectedGroup],
          chatMessages,
        ];
      } else {
        updatedMessages[selectedGroup] = [chatMessages];
      }
      setMessages(updatedMessages);
      setChatMessages("");
      const chatBody = document.querySelector(".chat-body");
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  };

  const handleFindUser = async () => {
    try {
      const response = await axios.post("/api/find", { username: find });
      setFoundUser(response.data);
    } catch (error) {
      console.log("Không thể tìm thấy người dùng:", error);
    }
  };

  const handleClick = () => {
    setShowTaskbar(!showTaskbar);
  };

  const handleChatClick = () => {
    setChatVisible(true);
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
  const handleSelectedUser = (user) => {
    setSelectedUser(user);
    setFoundUser(user);
    setChatVisible(false);
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
                  <div key={users.id}>
                    <img
                      src={users.avatar}
                      alt=""
                      className="avatar"
                      onClick={handleClick}
                    />
                    <h5>{users.username}</h5>
                  </div>
                  <div className={`taskbar${showTaskbar ? " active" : ""}`}>
                    <Navbar bg="light" expand="lg">
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav
                          className="mr-auto"
                          style={{ flexDirection: "column" }}
                        >
                          <Nav.Link href="#account">Account</Nav.Link>
                          <Nav.Link href="#setting">Setting</Nav.Link>
                          <Nav.Link href="/">LogOut</Nav.Link>
                        </Nav>
                      </Navbar.Collapse>
                    </Navbar>
                    <div className="close-btn" onClick={handleClick}>
                      X
                    </div>
                  </div>
                </div>
                <div className="found-user">
                  {foundUser && (
                    <div className="found-user-info">
                      <img src={foundUser.avatar} alt="" className="avatar" />
                      <h3>{foundUser.username}</h3>
                      <p>Email: {foundUser.email}</p>
                      <Button onClick={handleChatClick}>Chat</Button>
                      {chatVisible && (
                        <div className="chat-box">{/* Khung chat */}</div>
                      )}
                    </div>
                  )}
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
                      <Button variant="primary" onClick={handleCreateGroup}>
                        Create Group
                      </Button>
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
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      value={find}
                      onChange={(e) => setFind(e.target.value)}
                    />

                    <Button
                      variant="outline-secondary"
                      onClick={handleFindUser}
                    >
                      Find
                    </Button>
                  </div>
                  {foundUser && (
                    <div>
                      <h5>Search Results:</h5>
                      <p>{foundUser.username}</p>
                    </div>
                  )}
                </div>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>{selectedGroup}</h4>
                    {selectedGroup !== "My Cloud" && (
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
                        <Button variant="primary" type="submit">
                          Send
                        </Button>
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
