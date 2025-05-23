// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <div
            style={{
                height: "100vh",
                background: "linear-gradient(rgba(255,255,255,0.9), rgba(240,240,240,0.9)), url('https://www.transparenttextures.com/patterns/newsprint.png')",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                padding: "1rem",
            }}
        >
            <h1 style={{
                fontSize: "3.5rem",
                marginBottom: "1.5rem",
                color: "#1a1a1a",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}>
                Қош келдіңіз!
            </h1>
            <p style={{
                fontSize: "1.2rem",
                color: "#555",
                marginBottom: "2rem",
                maxWidth: "600px",
                textAlign: "center"
            }}>
                Соңғы жаңалықтардан хабардар болғыңыз келе ме? Қазақстан мен әлемдегі ең өзекті оқиғаларды бірге бақылаңыз.
            </p>
            <button
                onClick={handleClick}
                style={{
                    padding: "1rem 2.5rem",
                    fontSize: "1.1rem",
                    background: "linear-gradient(135deg, #ff4e50, #f9d423)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                }}
            >
                Жаңалықтарды көру
            </button>
        </div>
    );
};

export default Home;
