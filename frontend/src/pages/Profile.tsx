import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    username: string;
    Role: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8080/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) {
                    navigate("/login");
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    setUser(data);
                    setUsername(data.username);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Профильді жүктеу қатесі:", err);
                setLoading(false);
            });
    }, [navigate]);

    const handleUpdate = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:8080/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username }),
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data);
                setMessage("Профиль сәтті жаңартылды");
                setIsEditing(false);
            })
            .catch((err) => {
                console.error("Жаңарту қатесі:", err);
                setMessage("Қате орын алды");
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <div>Жүктелуде...</div>;

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "0 auto",
                textAlign: "center",
                padding: 20,
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                position: "relative",
            }}
        >
            {/* Кішкентай артқа батырмасы үстіңгі сол жақ бұрышта */}
            <div
                onClick={() => navigate("/news")}
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "500",
                    fontSize: 14,
                    userSelect: "none",
                }}
                title="Новости бетіне қайту"
            >
                ← Артқа
            </div>

            <h2>Профиль</h2>

            {/* Аватар суреті */}
            <img
                src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
                alt="Аватар"
                style={{ borderRadius: "50%", marginBottom: 20, width: 120, height: 120 }}
            />


            {/* Имя пользователя и редактирование */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Логин:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            padding: 8,
                            width: "100%",
                            boxSizing: "border-box",
                            fontSize: 16,
                        }}
                    />
                ) : (
                    <span style={{ fontSize: 18, fontWeight: "bold" }}>{username}</span>
                )}
            </div>

            {/* Роль */}
            <div style={{ marginBottom: 20 }}>
                {user?.Role ? (
                    <p>
                        Рөлі: <b>{user.Role}</b>
                    </p>
                ) : (
                    <p>Рөлі көрсетілмеген</p>
                )}
            </div>

            {/* Изменить / Сохранить кнопка */}
            {isEditing ? (
                <button
                    onClick={handleUpdate}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        marginBottom: 20,
                    }}
                >
                    Сохранить
                </button>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        marginBottom: 20,
                    }}
                >
                    Изменить
                </button>
            )}

            {message && (
                <p
                    style={{
                        color: message.includes("Қате") ? "red" : "green",
                        marginBottom: 20,
                    }}
                >
                    {message}
                </p>
            )}

            {/* Шығу батырмасы */}
            <button
                onClick={handleLogout}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                Шығу
            </button>
        </div>
    );
};

export default Profile;
