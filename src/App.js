import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import { DecodeToken } from './components/decodeToken';
import { AuthContext } from './context/AuthContext';
import Chat from './pages/chat/Chat';
import Login from './pages/login/Login';

function App() {
  const { user } = useContext(AuthContext);
  const currentUser = user ? DecodeToken(user) : null;
  const [socket] = useState(io(process.env.REACT_APP_SOCKET_SERVER));
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [addUser, setAddUser] = useState(false);

  // using socket.io
  useEffect(() => {
    let isMounted = true;

    if (isMounted && currentUser) {
      socket?.emit("addUser", currentUser?._id);
      socket?.on("getUsers", data => {
        // setOnlineUsers(data);
      })
    }

    return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Chat addUser={addUser} socket={socket} /> : <Login socket={socket} setAddUser={setAddUser} />} />
        <Route path='/chat' element={user ? <Chat addUser={addUser} socket={socket} /> : <Login socket={socket} setAddUser={setAddUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
