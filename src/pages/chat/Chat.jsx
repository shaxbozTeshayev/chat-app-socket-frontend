import React, { useState } from "react";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import './chat.css';

const Chat = ({ socket, addUser }) => {
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notice, setNotice] = useState([]);

    return (
        <div className="chat_container">
            <div className="chat_wrapper">
                <Topbar socket={socket} />
                <div className="chat_wrapper_position">
                    <Sidebar
                        setCurrentChat={setCurrentChat}
                        setMessages={setMessages}
                        socket={socket}
                        notice={notice}
                        setNotice={setNotice}
                        addUser={addUser}
                    />
                    <Main
                        currentChat={currentChat}
                        setMessages={setMessages}
                        messages={messages}
                        socket={socket}
                        setNotice={setNotice}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(Chat);