import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
    id: number;
    name: string;
}

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchCategories = () => {
        fetch("http://localhost:8080/categories", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setCategories);
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            await fetchCategories();
        };

        fetchData();
    }, [navigate, token]);


    const handleAdd = () => {
        fetch("http://localhost:8080/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newCategory }),
        })
            .then(() => {
                setNewCategory("");
                fetchCategories();
            });
    };

    const handleDelete = (id: number) => {
        if (!window.confirm("Сіз шынымен өшіргіңіз келе ме?")) return;
        fetch(`http://localhost:8080/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }).then(fetchCategories);
    };

    const handleEdit = (id: number, name: string) => {
        setEditId(id);
        setEditName(name);
    };

    const handleUpdate = () => {
        fetch(`http://localhost:8080/categories/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: editName }),
        })
            .then(() => {
                setEditId(null);
                setEditName("");
                fetchCategories();
            });
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h2>Категорияларды басқару</h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Жаңа категория..."
                    style={{ flex: 1, padding: "0.5rem" }}
                />
                <button onClick={handleAdd} style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: "6px" }}>
                    Қосу
                </button>
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {categories.map((cat) => (
                    <li key={cat.id} style={{ marginBottom: "0.5rem", background: "#f1f1f1", padding: "0.5rem 1rem", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {editId === cat.id ? (
                            <>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    style={{ flex: 1, marginRight: "0.5rem" }}
                                />
                                <button onClick={handleUpdate} style={{ marginRight: "0.5rem", background: "green", color: "white", border: "none", borderRadius: "4px", padding: "0.3rem 0.6rem" }}>Сақтау</button>
                                <button onClick={() => setEditId(null)} style={{ background: "#888", color: "white", border: "none", borderRadius: "4px", padding: "0.3rem 0.6rem" }}>Бас тарту</button>
                            </>
                        ) : (
                            <>
                                <span>{cat.name}</span>
                                <div>
                                    <button onClick={() => handleEdit(cat.id, cat.name)} style={{ marginRight: "0.5rem", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", padding: "0.3rem 0.6rem" }}>Өзгерту</button>
                                    <button onClick={() => handleDelete(cat.id)} style={{ background: "red", color: "white", border: "none", borderRadius: "4px", padding: "0.3rem 0.6rem" }}>Өшіру</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCategoryPage;
