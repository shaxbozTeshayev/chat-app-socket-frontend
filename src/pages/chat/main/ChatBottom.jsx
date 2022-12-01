import React, { useState } from "react";
import { GrFormClose } from "react-icons/gr";
import { ImImage } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import InputEmoji from "react-input-emoji";
import { axiosInstance } from "../../../config";

const ChatBottom = ({ currentUser, setMessages, currentChat, socket, messages }) => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    const clickHandler = () => {
        if (text || file) {
            handleOnEnter(text);
        }
    }

    const handleOnEnter = async (text) => {
        if (text || file) {
            let filename = "";
            if (file) {
                let formData = new FormData();
                filename = String(Date.now()) + String(file.lastModified) + file.name;
                formData.append("name", filename);
                formData.append("file", file);

                await axiosInstance.post("upload", formData);
            }

            try {
                const res = await axiosInstance.post(`message/${currentUser._id}`, {
                    conversationId: currentChat.currentChat._id,
                    sender: currentUser._id,
                    text: text,
                    img: filename
                })
                // using socket
                socket.emit("send_private_message", {
                    receiverId: currentChat.currentChat.members.find(id => id !== currentUser._id),
                    ...res.data
                });

                setMessages([...messages, res.data]);

                setFile(null);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <label htmlFor="pickImage">
                <ImImage className="ImImage" />
                <input
                    type="file"
                    id="pickImage"
                    onClick={(e) => e.target.value = null}
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                />
            </label>
            {file && (
                <div className="choose_image_top">
                    <img src={URL.createObjectURL(file)} alt="" />
                    <span>{file.name}</span>
                    <GrFormClose onClick={() => setFile(null)} />
                </div>
            )}
            <InputEmoji
                value={text}
                onChange={setText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
            />
            <IoMdSend className="IoMdSend" onClick={clickHandler} />
        </>
    )
}

export default React.memo(ChatBottom);