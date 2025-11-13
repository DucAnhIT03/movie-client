import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../../shared/layout/Header/Header.jsx";
import Footer from "../../../shared/layout/Footer/Footer.jsx";
import FilmList from "../components/FilmList/FilmList";
import MovieSelector from "../components/MovieSelector/MovieSelector";
import Promo from "../components/Promotion/Promo";
import Event from "../components/Event/Event";
import Space from "../../../shared/layout/Space/Space";
import Banner from "../components/Banner/Banner";
import { promos, events } from "../../../data/filmData";
import movieService from "../../../services/movie/movieService";

export default function Home() {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(true); // Toggle để sử dụng API hoặc static data

  useEffect(() => {
    const loadMovies = async () => {
      if (!useApi) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Load phim đang chiếu
        const nowShowingResponse = await movieService.getNowShowing();
        if (nowShowingResponse.status === 200 && nowShowingResponse.data) {
          setNowShowingMovies(
            Array.isArray(nowShowingResponse.data) 
              ? nowShowingResponse.data 
              : nowShowingResponse.data.items || []
          );
        }

        // Load phim sắp chiếu
        const comingSoonResponse = await movieService.getComingSoon();
        if (comingSoonResponse.status === 200 && comingSoonResponse.data) {
          setComingSoonMovies(
            Array.isArray(comingSoonResponse.data) 
              ? comingSoonResponse.data 
              : comingSoonResponse.data.items || []
          );
        }
      } catch (error) {
        console.error("Error loading movies:", error);
        // Fallback: không hiển thị lỗi, chỉ log
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [useApi]);

  return (
    <div>
      <Header />
      <Banner banner={"/banner.jpg"} />
      <div className="content">
        <div className="left">
          {useApi ? (
            <>
              <MovieSelector 
                title="Phim đang chiếu" 
                type="now-showing"
              />
              <Space />
              <MovieSelector 
                title="Phim sắp chiếu" 
                type="coming-soon"
              />
            </>
          ) : (
            <>
              <FilmList 
                title="Phim đang chiếu" 
                films={nowShowingMovies}
                useApi={useApi}
                type="now-showing"
              />
              <Space />
              <FilmList 
                title="Phim sắp chiếu" 
                films={comingSoonMovies}
                useApi={useApi}
                type="coming-soon"
              />
            </>
          )}
        </div>
        <div className="right">
          <Promo promos={promos} />
          <Event events={events} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
