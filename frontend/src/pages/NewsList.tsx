// src/pages/NewsList.tsx
import { useEffect, useState } from "react";

interface News {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

const NewsList = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/news")
            .then((res) => res.json())
            .then((data) => {
                setNews(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Жаңалықтарды алу қатесі:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Жүктелуде...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                Жаңалықтар тізімі
            </h1>
            {news.length === 0 ? (
                <p style={{ textAlign: "center" }}>Әзірге жаңалықтар жоқ.</p>
            ) : (
                news.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            padding: "1.5rem",
                            marginBottom: "1.5rem",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h2 style={{ marginBottom: "0.5rem" }}>{item.title}</h2>
                        <p style={{ color: "#555" }}>{item.content}</p>
                        <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "1rem" }}>
                            Жарияланған күні: {new Date(item.created_at).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default NewsList;
