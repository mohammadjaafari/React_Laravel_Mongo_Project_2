import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context";
import axiosClient from "../axiosClient";

export default function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [task, setTask] = useState({
        id: null,
        name: "",
        description: "",
    });

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/tasks/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setTask(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (task.id) {
            axiosClient
                .put(`/tasks/${task.id}`, task)
                .then(() => {
                    navigate("/tasks");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/tasks", task)
                .then(() => {
                    console.log("asadsadasdsa");
                    navigate("/tasks");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {task.id && <h1>Update Task: {task.name}</h1>}
            {!task.id && <h1>New Task</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}

                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            value={task.name}
                            onChange={(ev) =>
                                setTask({ ...task, name: ev.target.value })
                            }
                            placeholder="name"
                        ></input>
                        <input
                            value={task.description}
                            onChange={(ev) =>
                                setTask({
                                    ...task,
                                    description: ev.target.value,
                                })
                            }
                            placeholder="description"
                        ></input>
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
