import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Құпия сөздер сәйкес емес");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            if (!res.ok) {
                throw new Error("Тіркелу кезінде қате пайда болды");
            }

            alert("Тіркелу сәтті өтті! Енді кіріңіз.");
            navigate("/login");
        } catch (err) {
            setError((err as Error).message);
        }
    };

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
        errorText: {
            color: "#d32f2f",
            fontWeight: "600",
            textAlign: "center",
            marginTop: 10,
        },
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
                <h2 style={styles.title}>Тіркелу</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Пайдаланушы аты"
                    value={form.username}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    autoFocus
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Құпия сөз"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Құпия сөзді растау"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                {error && <p style={styles.errorText}>{error}</p>}

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
                    Тіркелу
                </button>
            </form>
        </div>
    );
};

export default Register;
