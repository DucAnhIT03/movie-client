import "./movie_schedule.css";

export default function MovieSchedule({ goToChooseTicket }) {
  const times = ["18:00", "19:35", "20:05", "21:00", "22:10", "23:15"];

  return (
    <section className="schedule">
      <div className="container">
        <div className="dates">
          <div className="date active">
            <p className="month">Th. 11</p>
            <h3>13</h3>
            <p className="day">Thứ tư</p>
          </div>
          <div className="date">
            <p className="month">Th. 11</p>
            <h3>14</h3>
            <p className="day">Thứ năm</p>
          </div>
        </div>

        <p className="note">
          <strong>Lưu ý:</strong> Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết
          thúc trước 22h và khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc
          trước 23h.
        </p>

        <div className="ticket-times">
          {times.map((t) => (
            <button key={t} onClick={() => goToChooseTicket(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
