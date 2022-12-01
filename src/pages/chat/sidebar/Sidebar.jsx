import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineMail } from 'react-icons/ai';
import { DecodeToken } from "../../../components/decodeToken";
import { axiosInstance } from "../../../config";
import { AuthContext } from "../../../context/AuthContext";

const Sidebar = ({ setCurrentChat, addUser, setMessages, socket, notice, setNotice }) => {
    const { user } = useContext(AuthContext);
    const currentUser = DecodeToken(user);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({});
    const users_ref = useRef([]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            socket?.on("not_opened_message_notification", data => {
                // console.log(data);
                setNotice([...notice, data]);
            })
            socket.on("added_user", data => {
                const receiverUser = DecodeToken(data);
                setNewUser(receiverUser);
            })
        }
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notice, addUser])

    // update users array
    useEffect(() => {
        let isMounted = true;

        if (isMounted && newUser) {
            setUsers([...users, newUser]);
        }
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newUser])

    // get all users
    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            try {
                const res = await axiosInstance.get("auth");
                if (isMounted) {
                    setUsers(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData();
        return () => isMounted = false;
    }, [addUser]);

    const clickUserHandler = async (user) => {
        // create conversation
        try {
            const res = await axiosInstance.post("/conversation", {
                senderId: currentUser._id,
                receiverId: user._id
            });
            setCurrentChat({ currentChat: res.data, user: user });

            // search via conversationId messages
            const msgs = await axiosInstance.get(`message/${res.data._id}`);
            setMessages(msgs.data)
            setNotice([]);
        } catch (error) {
            console.log(error);
        }
    }

    // search users
    const searchUsers = (value) => {
        users_ref.current.forEach(li => {
            let username = li.querySelector('.userName').textContent;
            if (username.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                li.style.display = "flex";
            } else {
                li.style.display = "none";
            }
        });
    }

    return (
        <div className="sidebar">
            <div className="sidebar_wrapper">
                <div className="sidebar_input">
                    <input type="text" className="search_input" placeholder="Search username" onChange={e => searchUsers(e.target.value)} />
                </div>
                <ul>
                    {users?.length > 0 && users.map((user, index) => (
                        <li key={user._id} ref={element => users_ref.current[index] = element} onClick={() => clickUserHandler(user)}>
                            <span>
                                <img src="/assets/avatar.png" alt="" />
                                <span className="userName">{user.username}</span>
                            </span>
                            {(notice?.length > 0 && notice.some(u => u.senderId === user._id)) && (
                                <span className="badge"><AiOutlineMail /></span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default React.memo(Sidebar);