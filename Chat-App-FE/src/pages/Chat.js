import React, { useState, useEffect } from 'react';
import './Chat.css';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Form, Button, Nav, Navbar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function App() {
  const [showTaskbar, setShowTaskbar] = useState(false);
  const [users, setUsers] = useState({});
  const { id } = useParams();
  const [foundUser, setFoundUser] = useState(null);
  const [find, setFind] = useState('');
  const [userList, setUserList] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const listAccountResponse = await axios.get('/api/listAccount');
      const userResponse = await axios.get(`/api/${id}`);
      setUsers(userResponse.data);
      setUserList(listAccountResponse.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFindUser = async () => {
    try {
      const response = await axios.post('/api/find', { username: find });
      setFoundUser(response.data);
    } catch (error) {
      console.log('Không thể tìm thấy người dùng:', error);
    }
  };

  const handleClick = () => {
    setShowTaskbar(!showTaskbar);
  };
  
  const handleChatClick = () => {
    setChatVisible(true);
  };

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
    setFoundUser(user);
    setChatVisible(false);
  }

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
                    <img src={users.avatar} alt="" className="avatar" onClick={handleClick} />
                    <h5>{users.username}</h5>
                  </div>
                  <div className={`taskbar${showTaskbar ? ' active' : ''}`}>
                    <Navbar bg="light" expand="lg">
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" style={{ flexDirection: 'column' }}>
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
                      {chatVisible && 
                      <div className="chat-box">
                        {/* Khung chat */}
                      </div>}
                    </div>
                  )}
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      value={find}
                      onChange={(e) => setFind(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleFindUser}>
                      Find
                    </Button>
                  </div>
                  <ListGroup className="flex-grow">
                    {userList.map((user) => (
                      <ListGroup.Item
                        key={user.id}
                        active={selectedUser && selectedUser.id === user.id}
                        onClick={() => handleSelectedUser(user)}>
                        {user.username}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            {/* Right section */}
            {/* Hiển thị thông tin người dùng trong Left section */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;