import React from "react";
import Header from "../../../shared/layout/Header/Header";
import Footer from "../../../shared/layout/Footer/Footer";
import img1 from "../../../assets/1.jpg";
import img12 from "../../../assets/12.png";
import "./FestivalDetail.css";

export default function FestivalDetail() {
  return (
    <>
      <Header />

      <main className="festival-detail">
        <section className="content container">
          <div className="text-content">
            <h1>Liên hoan phim Châu Âu tại Trung tâm Chiếu phim Quốc gia</h1>

            <p className="lead">
              Từ 14–27.11.2024, Liên hoan phim Châu Âu (EUFF) bởi Phái đoàn EU
              tại Việt Nam, hợp tác cùng các Đại sứ quán và viện văn hóa của các
              Quốc gia Thành viên EU, cùng khách mời đặc biệt Đại sứ quán
              Ukraine tại Việt Nam sẽ diễn ra tại Trung tâm Chiếu phim Quốc gia,
              Hà Nội. Khai mạc Liên hoan phim sẽ được tổ chức vào 20h ngày
              14/11/2024 (Thứ 5) với bộ phim “The Peasants” (Nông dân).
            </p>

            <p>
              Liên hoan phim Châu Âu năm nay sẽ trình chiếu 18 bộ phim, là 18
              cuộc gặp gỡ với những nhân vật đời thường trong những cảnh huống
              bất thường. Rong ruổi theo chân họ, khán giả sẽ được đi vào hành
              trình khám phá sâu thẳm nội tâm, tới những làng quê, các cung điện
              phong kiến, tới một thành phố mê cung, một thành phố hậu chiến,
              một thành phố cổ tích, và rất nhiều các khung cảnh khác. Tựa như
              truyền thống của điện ảnh là tấm gương phản chiếu đời sống, các bộ
              phim giúp chúng ta nhìn về chính cuộc đời của mình, mơ tới chân
              trời khác, hay ngẫm suy về những quyết định lớn.
            </p>

            <ul>
              <p>
                Vé mời MIỄN PHÍ tại Hà Nội sẽ được phát từ ngày 05/11/2024 tại
                những địa điểm dưới đây:
              </p>
              <li>
                - Phái đoàn EU tại Việt Nam – Tầng 24, Tòa Tây (Sảnh Văn phòng),
                Trung tâm Lotte, 54 Liễu Giai, Ba Đình
              </li>
              <p>Giờ mở cửa: 09:00–12:30; 13:30–17:00 (thứ Hai - thứ Sáu)</p>
              <li>- Viện Goethe Hà Nội – 56-58-60 Nguyễn Thái Học, Ba Đình</li>
              <p>Giờ mở cửa: 08:30–12:00; 13:00–18:00 (thứ Hai - thứ Sáu)</p>
            </ul>

            <p>
              Mỗi khán giả được nhận bốn vé tự chọn. Khán giả khi tới nhận vé
              không cần đăng ký trước. Thông tin về lịch chiếu, nội dung phim
              xem tại website chính thức.
            </p>
          </div>
        </section>

        <section className="gallery container">
          <img src={img1} alt="Gallery 1" />
          <img src={img12} alt="Gallery 12" />
        </section>
      </main>

      <Footer />
    </>
  );
}
