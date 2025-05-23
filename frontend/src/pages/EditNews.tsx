import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditNews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8080/news/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setTitle(data.title);
            setContent(data.content);
            setCategoryId(data.category_id);
        };

        const fetchCategories = async () => {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/categories", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCategories(data);
        };

        fetchNews();
        fetchCategories();
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category_id", categoryId.toString());
        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        fetch(`http://localhost:8080/news/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        })
            .then(res => {
                if (!res.ok) throw new Error("Сервер қатесі");
                return res.json();
            })
            .then(() => navigate("/news"))
            .catch(err => setError("Жаңарту кезінде қате пайда болды: " + err.message));
    };

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>
                Жаңалықты өзгерту
            </h2>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Тақырып:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Мазмұны:</label><br />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={5}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Санат:</label><br />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(parseInt(e.target.value))}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">Санатты таңдаңыз</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Жаңа сурет (қаласаңыз):</label><br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setSelectedImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Жаңарту
                </button>
            </form>
        </div>
    );
};

export default EditNews;
