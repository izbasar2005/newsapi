import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
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
            navigate("/login"); // Тіркелгеннен кейін кіру бетіне өту
        } catch (err: any) {
            setError(err.message);
        }
    };

    const styles = {
        form: {
            maxWidth: "400px",
            margin: "100px auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
        } as React.CSSProperties,
        input: {
            padding: "0.6em 1em",
            fontSize: "1em",
            borderRadius: "4px",
            border: "1px solid #ccc",
        } as React.CSSProperties,
        button: {
            padding: "0.8em 1.2em",
            backgroundColor: "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
        } as React.CSSProperties,
        error: {
            color: "red",
        },
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2>Тіркелу</h2>
            <input
                type="text"
                name="username"
                placeholder="Пайдаланушы аты"
                value={form.username}
                onChange={handleChange}
                style={styles.input}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Құпия сөз"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Құпия сөзді растау"
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>
                Тіркелу
            </button>
        </form>
    );
};

export default Register;
