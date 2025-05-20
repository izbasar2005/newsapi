// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Кіру сәтсіз аяқталды");
            }

            const data = await response.json();
            console.log("Logged in:", data);

            navigate("/news");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "50px auto",
                padding: 20,
                border: "1px solid #ccc",
                borderRadius: 8,
                backgroundColor: "#f9f9f9",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Кіру</h2>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <input
                    type="text"
                    placeholder="Атыңыз"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: 10, fontSize: 16, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <input
                    type="password"
                    placeholder="Құпия сөз"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: 10, fontSize: 16, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <button
                    type="submit"
                    style={{
                        padding: 12,
                        fontSize: 16,
                        borderRadius: 6,
                        border: "none",
                        backgroundColor: "#0077cc",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Кіру
                </button>
            </form>

            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

            <button
                onClick={goToRegister}
                style={{
                    marginTop: 20,
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#0077cc",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "1rem",
                    alignSelf: "center",
                }}
            >
                Тіркелуге өту
            </button>
        </div>
    );
};

export default Login;
