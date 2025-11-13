import { useParams, Link } from "react-router-dom";
import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import "./news_detail.css";
import { newsDataDetail } from "../../../data/newData";

export default function NewsDetail() {
  const { id } = useParams();
  // Lấy bài theo ID
  const newsItem = newsDataDetail.find((n) => n.id === Number(id));

  if (!newsItem) {
    return (
      <>
        <Header />
        <div className="news-detail-container">
          <h2>Bài viết không tồn tại.</h2>
          <Link to="/news" className="btn-outline">
            Quay lại Tin tức
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="news-detail">
        <div className="container">
          <div className="news-content">
            <h3>{newsItem.title}</h3>
            <p>{newsItem.content}</p>
          </div>

          <div className="news-detail-img">
            <img src={newsItem.img} alt={newsItem.title} />
          </div>

          <div className="news-detail-actions">
            <Link to="/news" className="btn-outline">
              Quay lại
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
