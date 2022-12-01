import React, { useState, useEffect, useRef, useContext } from "react";
import Messages from "./Messages";
import { DecodeToken } from "../../../components/decodeToken";
import { AuthContext } from "../../../context/AuthContext";
import ChatBottom from "./ChatBottom";

const Main = ({ currentChat, setMessages, messages, socket, setNotice }) => {
    const { user } = useContext(AuthContext);
    const currentUser = DecodeToken(user);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    // using socket
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            socket?.on("sended_private_message", data => {
                // let { receiverId, ...others } = data;
                setArrivalMessage(data);
            })
        }
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    // to see a message to the user
    useEffect(() => {
        // console.log(arrivalMessage);
        // console.log(currentChat?.currentChat);
        if (arrivalMessage && currentChat?.currentChat?.members?.includes(arrivalMessage.sender._id)) {
            let { receiverId, ...others } = arrivalMessage;
            setMessages([...messages, others])
        } else {
            // notification
            if (arrivalMessage) {
                socket.emit("not_opened_message", {
                    receiverId: arrivalMessage.receiverId,
                    senderId: arrivalMessage.sender._id
                })
                setNotice([{
                    receiverId: arrivalMessage.receiverId,
                    senderId: arrivalMessage.sender._id
                }]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivalMessage]);


    // automatically scroll messages
    useEffect(() => {
        let isMounted = true;
        if (isMounted)
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        return () => isMounted = false;
    }, [messages]);

    return (
        <div className="main">
            <div className="main_wrapper">
                {currentChat ? (
                    <>
                        <div className="chat_top">
                            <img src="/assets/avatar.png" alt="" />
                            <span>{currentChat.user.username}</span>
                        </div>
                        <div className="chat_center">
                            <div className="chatsPage">
                                {messages?.length > 0 && messages.map((msg) => (
                                    <div key={msg._id} ref={scrollRef} className="position_main_message">
                                        <Messages
                                            own={msg.sender._id === currentUser._id}
                                            msg={msg}
                                            currentUser={currentUser}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="chat_bottom">
                            <ChatBottom
                                currentUser={currentUser}
                                setMessages={setMessages}
                                currentChat={currentChat}
                                socket={socket}
                                messages={messages}
                            />
                        </div>
                    </>
                ) : (
                    <span className="no_chats">Open a conversation to start a chat.</span>
                )}
            </div>
        </div>
    )
}

export default React.memo(Main);