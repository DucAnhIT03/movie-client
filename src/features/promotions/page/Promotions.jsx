import React from 'react';
import './Promotions.css';
import Header from "../../../shared/layout/Header/Header.jsx";
import Footer from "../../../shared/layout/Footer/Footer.jsx";

const promotionsData = [
  {
    id: 1,
    image: '/event.jpg',
    title: 'RA MẮT BỎNG MIX VỊ - GIÁ KHÔNG ĐỔI',
    date: '01/08/2024'
  },
  {
    id: 2,
    image: '/event.jpg',
    title: 'SIÊU ƯU ĐÃI ĐỒNG GIÁ BỎNG, NƯỚC NGÀY THỨ 3, THỨ 4',
    date: '29/07/2024'
  },
  {
    id: 3,
    image: '/event.jpg',
    title: 'ƯU ĐÃI ĐẶC BIỆT THỨ 2 - THỨ 3 - THỨ 4 HÀNG THÁNG',
    date: '19/07/2024'
  },
  {
    id: 4,
    image: '/event.jpg',
    title: 'BẢNG GIÁ BỎNG, NƯỚC MỚI NHẤT 2024',
    date: '01/07/2024'
  },
  {
    id: 5,
    image: '/event.jpg',
    title: 'THẺ U22 ƯU ĐÃI GIÁ VÉ CHO HỌC SINH, SINH VIÊN 55.000Đ/VÉ 2D',
    date: '31/01/2024'
  },
  {
    id: 6,
    image: '/event.jpg',
    title: 'SPECIAL MONDAY - ĐỒNG GIÁ 50.000Đ/VÉ 2D THỨ 2 CUỐI THÁNG',
    date: '28/09/2022'
  },
  {
    id: 7,
    image: '/event.jpg',
    title: 'SIÊU ƯU ĐÃI "PHIM THẬT HAY - COMBO THẬT ĐÃ" CHÍNH THỨC TRỞ LẠI',
    date: '04/09/2019'
  },
  {
    id: 8,
    image: '/event.jpg',
    title: 'Đồng giá 49k bộ phim hoạt hình "Những chú chó hoàng gia"',
    date: '17/05/2019'
  }
];

const Promotions = () => {
  return (
    <div className="promotions-wrapper">
      <Header />

      <main className="promotions-content">
        <h1 className="promotions-title">Khuyến mãi</h1>

        <div className="promotions-grid">
          {promotionsData.map((promo) => (
            <div key={promo.id} className="promotion-card">
              <img src={promo.image} alt={promo.title} className="promo-image" />
              <div className="promo-info">
                <div className="promo-date">{promo.date}</div>
                <h3 className="promo-title">{promo.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="btn-outline back">Quay lại</button>
          <button className="btn-outline">Tiếp theo</button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Promotions;