import React, { useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../config";
import { AuthContext } from '../../context/AuthContext';
import './login.css';

const Login = ({ socket, setAddUser }) => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const usernameref = useRef();

    const openChat = async (e) => {
        e.preventDefault();

        // to do server
        try {
            const res = await axiosInstance.post("auth", {
                username: usernameref.current.value
            });
            socket.emit("add_user", res.data);
            setAddUser(prev => !prev);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate('/chat');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="login_container">
            <div className="login_wrapper">
                <h3>Chat anonime</h3>
                <form className="login_form" onSubmit={openChat} >
                    <input type="text" ref={usernameref} placeholder="Username" required />
                    <input type="submit" value="Login" className="btn" />
                </form>
            </div>
        </div>
    )
}

export default React.memo(Login);