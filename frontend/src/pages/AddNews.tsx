// src/pages/AddNews.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
    id: number;
    name: string;
}

const AddNews = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [successMessage, setSuccessMessage] = useState(""); // ✅ Жаңа хабарлама күйі
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://localhost:8080/categories", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                if (data.length > 0) setSelectedCategory(data[0].id);
            });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category_id", selectedCategory.toString());
        if (image) formData.append("image", image);

        const res = await fetch("http://localhost:8080/news", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (res.ok) {
            setSuccessMessage("Жаңалық сәтті тіркелді!");
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/news");
            }, 1000); // ✅ 2 секундтан кейін бағыттайды
        } else {
            alert("Қате: жаңалық қосылмады");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Жаңа жаңалық қосу</h2>

            {/* ✅ Хабарлама блок */}
            {successMessage && (
                <div
                    style={{
                        backgroundColor: "#d1fae5",
                        color: "#065f46",
                        padding: "1rem",
                        borderRadius: "6px",
                        textAlign: "center",
                        marginBottom: "1rem",
                    }}
                >
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Тақырып</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>Мазмұны</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={5}
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>Санат</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        style={{ width: "100%", padding: "0.5rem" }}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>Сурет</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "0.7rem 1.5rem",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Қосу
                </button>
            </form>
        </div>
    );
};

export default AddNews;
