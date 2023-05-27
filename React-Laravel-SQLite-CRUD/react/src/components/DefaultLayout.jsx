import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context";
import { useEffect } from "react";
import axiosClient from "../axiosClient";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/tasks").then(({ data }) => {
            setUser(data);
        });
    }, []);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/tasks">Tasks</Link>
            </aside>
            <div className="content">
                <header>
                    <div>{user.name}</div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
