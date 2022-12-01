import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DecodeToken } from "../../../components/decodeToken";
import { AuthContext } from "../../../context/AuthContext";

const Topbar = ({ socket }) => {
    const { user, dispatch } = useContext(AuthContext);
    const currentUser = DecodeToken(user);
    const navigate = useNavigate();

    const exit = () => {
        console.log(currentUser);
        socket.emit("deleteUser", { userId: currentUser._id });
        dispatch({ type: "EXIT", payload: null });
        navigate("/");
    }

    return (
        <div className="topbar">
            <div className="topbar_wrapper">
                <h3>Chat anonime</h3>
                <span className="chatUsername">
                    <img src="/assets/avatar.png" alt="" />
                    <strong>{currentUser.username}</strong>
                    <p className="exit" onClick={exit}>Exit</p>
                </span>
            </div>
        </div>
    )
}

export default React.memo(Topbar);