import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface News {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
    category_id: number;
}

const NewsDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchNews = fetch(`http://localhost:8080/news/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            if (!res.ok) throw new Error("Жаңалық табылмады");
            return res.json();
        });

        const fetchRole = fetch("http://localhost:8080/profile", {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            if (!res.ok) throw new Error("Қолданушы мәліметі алынбады");
            return res.json();
        });

        Promise.all([fetchNews, fetchRole])
            .then(([newsData, userData]) => {
                setNewsItem(newsData);
                setUserRole(userData.Role);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
                setRoleLoading(false);
            });
    }, [id, navigate]);

    const handleDelete = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        if (!window.confirm("Бұл жаңалықты өшіргіңіз келе ме?")) return;

        fetch(`http://localhost:8080/news/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error("Жаңалықты өшіру мүмкін болмады");
                alert("Жаңалық сәтті өшірілді");
                navigate("/news");
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const handleEdit = () => {
        navigate(`/admin/news/edit/${id}`);
    };

    if (loading) return <p style={{ textAlign: "center" }}>Жүктелуде...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
    if (!newsItem) return null;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)",
                padding: "2rem",
                fontFamily: "sans-serif"
            }}
        >
            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "2rem",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: "1.5rem",
                        background: "#f1f1f1",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "15px",
                        transition: "all 0.2s ease-in-out"
                    }}
                >
                    ← Артқа оралу
                </button>

                <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{newsItem.title}</h1>

                {newsItem.image_url && (
                    <img
                        src={`http://localhost:8080${newsItem.image_url}`}
                        alt={newsItem.title}
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                            marginBottom: "1.5rem",
                            objectFit: "cover",
                            maxHeight: "400px"
                        }}
                    />
                )}

                <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", marginBottom: "1rem" }}>
                    {newsItem.content}
                </p>

                <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    Жарияланған: {new Date(newsItem.created_at).toLocaleString()}
                </p>

                {!roleLoading && userRole === "admin" && (
                    <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                        <button
                            onClick={handleEdit}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Өзгерту
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Өшіру
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetail;
