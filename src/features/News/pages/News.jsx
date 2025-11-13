import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import { Link } from "react-router-dom";
import "./news.css";
import { newsData } from "../../../data/newData";

export default function News() {
  return (
    <>
      <Header />
      <section className="news-section">
        <div className="container">
          <h1 className="news-title">Tin tức</h1>

          <div className="news-grid">
            {newsData.map((item) => (
              <Link to={`/news/${item.id}`} className="news-card" key={item.id}>
                <div className="news-img">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="news-container">
                  <p className="news-date">{item.date}</p>
                  <h3 className="news-text">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <button className="btn-outline back">Quay lại</button>
            <button className="btn-outline">Tiếp theo</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
  
}
