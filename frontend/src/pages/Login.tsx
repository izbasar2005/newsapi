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

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            navigate("/news");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const goToRegister = () => {
        navigate("/register");
    };

    // Стильдерді React.CSSProperties типімен жазамыз
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "1rem",
        },
        form: {
            width: "100%",
            maxWidth: 400,
            background: "#fff",
            padding: "2.5rem 3rem",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
        },
        title: {
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "700",
            color: "#333",
            marginBottom: 10,
        },
        input: {
            padding: "12px 16px",
            fontSize: "1rem",
            borderRadius: 8,
            border: "1.5px solid #ddd",
            outline: "none",
            transition: "border-color 0.3s",
        },
        inputFocus: {
            borderColor: "#764ba2",
        },
        button: {
            padding: "14px 0",
            fontSize: "1.1rem",
            borderRadius: 12,
            border: "none",
            backgroundColor: "#764ba2",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 6px 15px rgba(118,75,162,0.4)",
            transition: "background-color 0.3s",
        },
        buttonHover: {
            backgroundColor: "#5b367d",
        },
        errorText: {
            color: "#d32f2f",
            fontWeight: "600",
            textAlign: "center",
            marginTop: 10,
        },
        linkButton: {
            marginTop: 15,
            backgroundColor: "transparent",
            border: "none",
            color: "#764ba2",
            cursor: "pointer",
            fontSize: "1rem",
            textDecoration: "underline",
            alignSelf: "center",
        },
    };

    return (
        <div style={styles.container}>
            <form
                onSubmit={handleLogin}
                style={styles.form}
                autoComplete="off"
            >
                <h2 style={styles.title}>Кіру</h2>
                <input
                    type="text"
                    placeholder="Пайдаланушы аты"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                    autoFocus
                />
                <input
                    type="password"
                    placeholder="Құпия сөз"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#5b367d")
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#764ba2")
                    }
                >
                    Кіру
                </button>
                {error && <p style={styles.errorText}>{error}</p>}
                <button type="button" onClick={goToRegister} style={styles.linkButton}>
                    Тіркелуге өту
                </button>
            </form>
        </div>
    );
};

export default Login;
