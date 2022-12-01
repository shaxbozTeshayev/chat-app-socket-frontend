import React from "react";
import { format } from 'timeago.js';

const Messages = ({ own, msg }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <div className="messages">
            <div className="messages_container">
                <div className={`messagesPosition ${own ? "messagesRight" : "messagesLeft"}`}>
                    <div className="message_top">
                        <p className={`messageText ${own ? "messageTextRight" : "messageTextLeft"}`}>
                            <div className="messageText_top">
                                <img src="/assets/avatar.png" alt="" />
                                <strong>{msg.sender.username}</strong>
                            </div>
                            {msg.text}
                            {msg.img && (
                                <img src={PF + msg.img} alt="" className="imgMsg" />
                            )}
                            <div className="date">
                                <span>{format(msg.createdAt)}</span>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Messages);