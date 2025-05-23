import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface News {
    ID: number;
    title: string;
    image_url?: string;
    created_at: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}

const NewsList = () => {
    const [news, setNews] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>({ id: 0, name: "Барлығы" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        Promise.all([
            fetch("http://localhost:8080/categories", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 401) {
                        navigate("/login");
                        throw new Error("Unauthorized");
                    }
                    return res.json();
                }),
            fetch("http://localhost:8080/news", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 401) {
                        navigate("/login");
                        throw new Error("Unauthorized");
                    }
                    return res.json();
                }),
            fetch("http://localhost:8080/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.status === 401) {
                        navigate("/login");
                        throw new Error("Unauthorized");
                    }
                    return res.json();
                }),
        ])
            .then(([categoriesData, newsData, profile]) => {
                setCategories([{ id: 0, name: "Барлығы" }, ...categoriesData]);
                setNews(newsData);
                setFilteredNews(newsData);
                setIsAdmin(profile.Role === "admin");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Қате:", err);
                setError("Деректерді жүктеу мүмкін болмады");
                setLoading(false);
            });
    }, [navigate]);

    useEffect(() => {
        if (selectedCategory.id === 0) {
            setFilteredNews(news);
        } else {
            setFilteredNews(news.filter((item) => item.category_id === selectedCategory.id));
        }
    }, [selectedCategory, news]);

    if (loading) return <p className="loading-text">Жүктелуде...</p>;
    if (error) return <p className="error-text">{error}</p>;

    const mainNews = filteredNews.length > 0 ? filteredNews[0] : null;
    const otherNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

    return (
        <div className="container">
            <div className="account-button">
                <Link to="/profile" title="Аккаунт" className="account-link">
                    U
                </Link>
            </div>

            <h1 className="page-title">Жаңалықтар тізімі</h1>

            {isAdmin && (
                <div className="admin-controls">
                    <Link to="/add-news" className="btn-primary">+ Жаңалық қосу</Link>
                    <Link to="/admin/categories" className="btn-primary">Категорияларды басқару</Link>
                </div>
            )}

            <div className="categories">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`category-btn ${selectedCategory.id === cat.id ? "active" : ""}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {filteredNews.length === 0 && (
                <p className="no-news">Бұл категорияда жаңалықтар жоқ.</p>
            )}

            <div className="main-and-aside">
                {mainNews && (
                    <Link
                        to={`/news/${mainNews.ID}`}
                        className="main-news"
                    >
                        <div className="main-news-content">
                            <h2>{mainNews.title}</h2>
                            {mainNews.image_url && (
                                <img
                                    src={`http://localhost:8080${mainNews.image_url}`}
                                    alt={mainNews.title}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            )}
                            <p className="date-category">
                                Жарияланған күні: {new Date(mainNews.created_at).toLocaleString()} —{" "}
                                <b>{categories.find((c) => c.id === mainNews.category_id)?.name || "Белгісіз"}</b>
                            </p>
                        </div>
                    </Link>
                )}

                <aside className="additional-info">
                    <h3>Ең өзекті жаңалықтар бізде!</h3>
                    <p>Біз сізге жылдам және сенімді ақпарат ұсынамыз. Ең маңызды және шұғыл жаңалықтарды бірінші болып біліп отырыңыз.</p>
                    <ul>
                        <li>Жаңалықтар күн сайын жаңарып, әлемдегі басты оқиғаларға бағытталады.</li>
                        <li>Эксперттер тобы таңдаған тек сенімді және нақты ақпарат.</li>
                        <li>Сіз өзіңізге қызықты тақырыптарды бақылап, уақытылы хабардар боласыз.</li>
                        <li>Жылдам жаңарту арқасында ешбір маңызды оқиғаны жіберіп алмайсыз.</li>
                    </ul>
                </aside>

            </div>

            {otherNews.length > 0 && (
                <div className="other-news-grid">
                    {otherNews.map((item) => (
                        <Link to={`/news/${item.ID}`} key={item.ID} className="news-card">
                            <div>
                                <h3>{item.title}</h3>
                                {item.image_url && (
                                    <img
                                        src={`http://localhost:8080${item.image_url}`}
                                        alt={item.title}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                        }}
                                    />
                                )}
                                <p className="date-category">
                                    {new Date(item.created_at).toLocaleDateString()} —{" "}
                                    <b>{categories.find((c) => c.id === item.category_id)?.name || "Белгісіз"}</b>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
    body, html {
        margin: 0; padding: 0; height: 100%;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #222;
        background-image: url('https://www.transparenttextures.com/patterns/asfalt-light.png');
        background-repeat: repeat;
        background-size: 100px 100px;
        background-position: center;
        background-color: #f0f4ff;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }
    .loading-text, .error-text {
        text-align: center;
        margin-top: 2rem;
        font-weight: 600;
        font-size: 1.2rem;
    }
    .error-text {
        color: #d32f2f;
    }
    .account-button {
        position: fixed;
        top: 1rem;
        right: 1.5rem;
        z-index: 100;
    }
    .account-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        font-weight: 700;
        font-size: 1.2rem;
        user-select: none;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        text-decoration: none;
        transition: background-color 0.3s ease;
    }
    .account-link:hover {
        background-color: #1e40af;
    }
    .page-title {
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 700;
        font-size: 2.2rem;
    }
    .admin-controls {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .btn-primary {
        padding: 0.6rem 1.5rem;
        background-color: #2563eb;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: background-color 0.3s ease;
    }
    .btn-primary:hover {
        background-color: #1e40af;
    }
    .categories {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2.5rem;
    }
    .category-btn {
        padding: 0.5rem 1.2rem;
        border-radius: 20px;
        border: 1.5px solid #ccc;
        background-color: #fff;
        color: #555;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
    }
    .category-btn:hover {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
    }
    .category-btn.active {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
        box-shadow: 0 0 8px #2563ebaa;
    }
    .no-news {
        text-align: center;
        font-style: italic;
        color: #777;
    }
    .main-and-aside {
        display: flex;
        gap: 2rem;
        margin-bottom: 3rem;
    }
    .main-news {
        flex: 3;
        background: white;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        color: inherit;
        text-decoration: none;
        transition: transform 0.2s ease;
    }
    .main-news:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    .main-news-content h2 {
        margin: 0 0 0.8rem 0;
        font-size: 1.9rem;
        font-weight: 700;
        line-height: 1.2;
        color: #111;
    }
    .main-news-content img {
        width: 100%;
        height: auto;
        margin-bottom: 1rem;
        border-radius: 12px;
        object-fit: cover;
        max-height: 350px;
    }
    .date-category {
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
    }
    aside.additional-info {
        flex: 1;
        background-color: #eef4ff;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        font-size: 0.95rem;
        color: #1e40af;
        user-select: none;
        line-height: 1.4;
        min-width: 230px;
    }
    aside.additional-info h3 {
        margin-top: 0;
        font-weight: 700;
        margin-bottom: 0.6rem;
        font-size: 1.3rem;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 0.3rem;
    }
    aside.additional-info ul {
        padding-left: 1.2rem;
        margin-top: 0.5rem;
    }
    aside.additional-info ul li {
        margin-bottom: 0.4rem;
    }
    .other-news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.3rem;
    }
    .news-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.07);
        color: inherit;
        text-decoration: none;
        padding: 0.8rem 1rem 1.1rem 1rem;
        transition: box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .news-card:hover {
        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }
    .news-card h3 {
        margin: 0 0 0.6rem 0;
        font-weight: 700;
        font-size: 1.1rem;
        color: #222;
        line-height: 1.15;
    }
    .news-card img {
        width: 100%;
        height: 130px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 0.7rem;
        user-select: none;
    }
    .news-card .date-category {
        font-size: 0.8rem;
        color: #555;
        font-weight: 600;
        margin-top: auto;
    }

    @media (max-width: 768px) {
        .main-and-aside {
            flex-direction: column;
        }
        aside.additional-info {
            min-width: auto;
            margin-top: 1.8rem;
        }
    }
`}</style>
        </div>
    );
};

export default NewsList;
