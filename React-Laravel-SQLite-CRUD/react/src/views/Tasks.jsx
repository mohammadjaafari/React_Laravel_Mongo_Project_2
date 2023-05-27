import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = () => {
        setLoading(true);
        axiosClient
            .get("/tasks")
            .then(({ data }) => {
                setLoading(false);
                setTasks(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (t) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }
        axiosClient.delete(`/tasks/${t.id}`).then(() => {
            getTasks();
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Tasks</h1>
                <Link to="/tasks/new/" className="btn-add">
                    Task
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Added At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}

                    {!loading && (
                        <tbody>
                            {tasks.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.name}</td>
                                    <td>{t.description}</td>
                                    <td>{t.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit "
                                            to={"/tasks/" + t.id}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={(ev) => onDelete(t)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
