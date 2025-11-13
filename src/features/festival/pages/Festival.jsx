import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import "./Festival.css";
import { festivals } from "../../../data/festivalData";
import { Link } from "react-router-dom";

export default function Festival() {
  return (
    <>
      <Header />
      <section className="festival-section">
        <div className="container">
          <div className="festival-header">
            {festivals.map((item, index) => {
              if (index === 0) {
                return (
                  <div className="festival-hero" key={index}>
                    <Link to={`/festival/${index}`}>
                      <img
                        src={item.image}
                        alt={item.title || "festival"}
                        className="festival-hero-image"
                      />
                    </Link>
                  </div>
                );
              }
            })}
          </div>

          <div className="festival-list">
            {festivals.map((item, index) => {
              return (
                <>
                  <div className="reponsive-title">
                    <h3>{item.title}</h3>
                  </div>
                  <div className="festival-item" key={index}>
                    <Link to={`/festival/${index}`}>
                      <img src={item.image} alt={item.title || "festival"} />
                    </Link>
                    <div className="festival-item-body">
                      <p className="reponsive-item-time">{item.time}</p>
                      <h3 className="festival-item-title">{item.title}</h3>
                      {item.content && (
                        <p className="festival-item-content">{item.content}</p>
                      )}
                    </div>
                    <div className="festival-item-meta">
                      <p className="festival-item-time">{item.time}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="pagination">
            <button className="btn-outline">Quay lại</button>
            <button className="btn-outline">Tiếp theo</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
