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
                background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", color: "#333" }}>
                Қош келдіңіз!
            </h1>
            <button
                onClick={handleClick}
                style={{
                    padding: "1rem 2rem",
                    fontSize: "1.2rem",
                    backgroundColor: "#0077cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "0.3s",
                }}
                onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#005fa3")
                }
                onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0077cc")
                }
            >
                Жаңалықтарды көру
            </button>
        </div>
    );
};

export default Home;
