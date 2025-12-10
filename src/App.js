// src/App.js
import "./HomePage.css";
import "./MovieDetail.css";
import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";  // useParams 추가
import { AuthContext, AuthProvider } from "./AuthContext";
import "./Header.css";
import mainLogo from "./main_logo.jpg";
import SignUpPage from "./SignUpPage";
import "./TierList.css";
import "./WorldCup.css";
import { getReviewsByMovie, saveReview, getMovieStats } from "./storage";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tierlist" element={<TierListPage />} />
          <Route path="/worldcup" element={<WorldCupPage />} />
        </Routes>
    </>
  );
}

function HomePage() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title'); 

  const [movies, setMovies] = useState([
    { 
      id: 1, 
      title: '인셉션', 
      year: 2010, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 
      rating: 0.0,
      overview: '꿈 속에서 일어나는 미션을 수행하는 도미니크 코브는 특별한 기술을 가진 도둑이다. 그의 능력은 꿈 속에서 정보를 훔치는 것. 그에게 불가능한 임무가 주어진다.'
    },
    { 
      id: 2, 
      title: '다크 나이트', 
      year: 2008, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
      rating: 0.0,
      overview: '배트맨은 고담 시티의 범죄와 싸우지만, 새로운 악당 조커가 나타나 도시를 혼란에 빠뜨린다.'
    },
    { 
      id: 3, 
      title: '인터스텔라', 
      year: 2014, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/zDNAeWU0PxKol1dw3a3Q6n55AHx.jpg', 
      rating: 0.0,
      overview: '지구의 미래가 위험에 처하자 한 팀의 탐험가들이 인류를 구하기 위해 새로운 행성을 찾아 우주로 떠난다.'
    },
    { 
      id: 4, 
      title: '매트릭스', 
      year: 1999, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 
      rating: 0.0,
      overview: '컴퓨터 프로그래머 네오는 현실이 사실은 컴퓨터 시뮬레이션이라는 충격적인 진실을 발견한다.'
    },
    { 
      id: 5, 
      title: '어벤져스', 
      year: 2012, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', 
      rating: 0.0,
      overview: '지구를 위협하는 외계인 침략에 맞서 어벤져스가 뭉친다.'
    },
    { 
      id: 6, 
      title: '토이 스토리', 
      year: 1995, 
      genre: 'Animation', 
      poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 
      rating: 0.0,
      overview: '장난감들이 살아있고, 주인을 위해 살아간다는 이야기.'
    },
    { 
      id: 7, 
      title: '포레스트 검프', 
      year: 1994, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/arw2vcBvePOVz6xIH4bh4w9MSz4.jpg', 
      rating: 0.0,
      overview: 'IQ 75인 포레스트 검프가 인생의 여러 순간을 겪으며 성장하는 이야기.'
    },
    { 
      id: 8, 
      title: '셰인', 
      year: 2013, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/4Yz2b4qL2YjNDQvLpLQv1vVqF5.jpg', 
      rating: 0.0,
      overview: '한 가족의 삶을 그린 드라마.'
    },
    { 
      id: 9, 
      title: '파이트 클럽', 
      year: 1999, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 
      rating: 0.0,
      overview: '불면증에 시달리는 화이트컬러 직장인이 타이렐 더든과 만나 파이트 클럽을 만든다.'
    },
    { 
      id: 10, 
      title: '글래디에이터', 
      year: 2000, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 
      rating: 0.0,
      overview: '로마 제국의 장군 막시무스가 노예 검투사가 되어 복수를 꿈꾸는 이야기.'
    },
  ]);

const sortedMovies = [...movies].sort((a, b) => {
  if (sortBy === 'title') return a.title.localeCompare(b.title);
  if (sortBy === 'rating') return b.rating - a.rating;
  if (sortBy === 'year') return b.year - a.year;
  return 0;
});

return (
  <div className="home-page">
    {/* 상단 툴바 */}
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="item-count">{sortedMovies.length}개의 영화</span>
      </div>
      <div className="toolbar-center">
        <button 
          className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="그리드 뷰"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="6" height="6" rx="1"/>
            <rect x="12" y="2" width="6" height="6" rx="1"/>
            <rect x="2" y="12" width="6" height="6" rx="1"/>
            <rect x="12" y="12" width="6" height="6" rx="1"/>
          </svg>
        </button>
        <button 
          className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="리스트 뷰"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="2" width="16" height="2" rx="1"/>
            <rect x="2" y="6" width="16" height="2" rx="1"/>
            <rect x="2" y="10" width="16" height="2" rx="1"/>
            <rect x="2" y="14" width="16" height="2" rx="1"/>
          </svg>
        </button>
      </div>
      <div className="toolbar-right">
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">제목순</option>
          <option value="rating">평점순</option>
          <option value="year">연도순</option>
        </select>
      </div>
    </div>

    {/* 영화 그리드 */}
    <div className={`movie-grid ${viewMode}`}>
      {sortedMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </div>
);
}
function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const movies = [
    { 
      id: 1, 
      title: '인셉션', 
      year: 2010, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 
      rating: 0.0,
      overview: '꿈 속에서 일어나는 미션을 수행하는 도미니크 코브는 특별한 기술을 가진 도둑이다. 그의 능력은 꿈 속에서 정보를 훔치는 것. 그에게 불가능한 임무가 주어진다.'
    },
    { 
      id: 2, 
      title: '다크 나이트', 
      year: 2008, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 
      rating: 0.0,
      overview: '배트맨은 고담 시티의 범죄와 싸우지만, 새로운 악당 조커가 나타나 도시를 혼란에 빠뜨린다.'
    },
    { 
      id: 3, 
      title: '인터스텔라', 
      year: 2014, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/zDNAeWU0PxKol1dw3a3Q6n55AHx.jpg', 
      rating: 0.0,
      overview: '지구의 미래가 위험에 처하자 한 팀의 탐험가들이 인류를 구하기 위해 새로운 행성을 찾아 우주로 떠난다.'
    },
    { 
      id: 4, 
      title: '매트릭스', 
      year: 1999, 
      genre: 'Sci-Fi', 
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 
      rating: 0.0,
      overview: '컴퓨터 프로그래머 네오는 현실이 사실은 컴퓨터 시뮬레이션이라는 충격적인 진실을 발견한다.'
    },
    { 
      id: 5, 
      title: '어벤져스', 
      year: 2012, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', 
      rating: 0.0,
      overview: '지구를 위협하는 외계인 침략에 맞서 어벤져스가 뭉친다.'
    },
    { 
      id: 6, 
      title: '토이 스토리', 
      year: 1995, 
      genre: 'Animation', 
      poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 
      rating: 0.0,
      overview: '장난감들이 살아있고, 주인을 위해 살아간다는 이야기.'
    },
    { 
      id: 7, 
      title: '포레스트 검프', 
      year: 1994, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/arw2vcBvePOVz6xIH4bh4w9MSz4.jpg', 
      rating: 0.0,
      overview: 'IQ 75인 포레스트 검프가 인생의 여러 순간을 겪으며 성장하는 이야기.'
    },
    { 
      id: 8, 
      title: '셰인', 
      year: 2013, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/4Yz2b4qL2YjNDQvLpLQv1vVqF5.jpg', 
      rating: 0.0,
      overview: '한 가족의 삶을 그린 드라마.'
    },
    { 
      id: 9, 
      title: '파이트 클럽', 
      year: 1999, 
      genre: 'Drama', 
      poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 
      rating: 0.0,
      overview: '불면증에 시달리는 화이트컬러 직장인이 타이렐 더든과 만나 파이트 클럽을 만든다.'
    },
    { 
      id: 10, 
      title: '글래디에이터', 
      year: 2000, 
      genre: 'Action', 
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 
      rating: 0.0,
      overview: '로마 제국의 장군 막시무스가 노예 검투사가 되어 복수를 꿈꾸는 이야기.'
    },
  ];
  
  const movie = movies.find(m => m.id === parseInt(id));
  const [reviews, setReviews] = useState(() => getReviewsByMovie(parseInt(id)));
  const stats = getMovieStats(parseInt(id));
  const [myReview, setMyReview] = useState(
    user ? reviews.find(r => r.userId === user.id) : null
  );
  const [rating, setRating] = useState(myReview?.rating || 10);
  const [content, setContent] = useState(myReview?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!movie) {
    return <div className="movie-detail-page">영화를 찾을 수 없습니다.</div>;
  }

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    const review = {
      userId: user.id,
      movieId: parseInt(id),
      rating,
      content,
    };

    saveReview(review);
    setMyReview(review);
    const updatedReviews = getReviewsByMovie(parseInt(id));
    setReviews(updatedReviews);
    setIsSubmitting(false);
    alert("리뷰가 등록되었습니다!");
  };

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-hero">
        <img src={movie.poster} alt={movie.title} className="detail-poster" />
        <div className="movie-detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>
          
          {/* 평균 평점 표시 (항상 보임) */}
          <div className="detail-rating-section">
            <div className="rating-box">
              <div className="rating-label">평균 평점</div>
              <div className="rating-value">
                {stats.averageRating || movie.rating}
                <span className="rating-max"> / 10</span>
              </div>
              <div className="rating-count">{stats.reviewCount || 0}개의 리뷰</div>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-detail-content">
        {/* 영화 줄거리 */}
        <section className="detail-section">
          <h2 className="section-title">줄거리</h2>
          <p className="movie-overview">{movie.overview}</p>
        </section>

        {/* 리뷰 섹션 */}
        <section className="detail-section">
          <div className="reviews-header">
            <h2 className="section-title">
              리뷰 {reviews.length > 0 && <span className="review-count">({reviews.length})</span>}
            </h2>
          </div>

          {/* 로그인하지 않은 경우 */}
          {!user && (
            <div className="login-prompt">
              <p className="login-message">더 많은 리뷰를 보려면 로그인해 주세요!</p>
              <button 
                className="login-prompt-button"
                onClick={() => {
                  // 로그인 모달 열기 (Header의 로그인 버튼 클릭과 동일하게)
                  const event = new CustomEvent('openLogin');
                  window.dispatchEvent(event);
                }}
              >
                로그인 하기
              </button>
            </div>
          )}

          {/* 로그인한 경우 - 리뷰 작성 폼 */}
          {user && (
            <div className="review-form-section">
              <h3 className="form-title">리뷰 작성</h3>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label className="form-label">평점</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rating-select"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => (
                      <option key={v} value={v}>{v}점</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">리뷰 내용</label>
                  <textarea
                    className="review-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="영화에 대한 생각을 자유롭게 적어주세요."
                    rows={4}
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-review-button"
                  disabled={isSubmitting}
                >
                  {myReview ? "리뷰 수정" : "리뷰 등록"}
                </button>
              </form>
            </div>
          )}

          {/* 리뷰 목록 (로그인한 경우만) */}
          {user && reviews.length > 0 && (
            <div className="reviews-list">
              {reviews.map((review) => {
                const reviewUser = JSON.parse(localStorage.getItem("users") || "[]")
                  .find(u => u.id === review.userId);
                return (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{reviewUser?.nickname || "익명"}</span>
                      <span className="review-rating">{review.rating}점</span>
                    </div>
                    <p className="review-content">{review.content}</p>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {user && reviews.length === 0 && (
            <p className="no-reviews">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
          )}
        </section>
      </div>
    </div>
  );
}

// src/App.js에 추가 (MovieDetailPage 다음에)

function TierListPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tierList, setTierList] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  });
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [draggedMovie, setDraggedMovie] = useState(null);

  // 모든 영화 데이터 (HomePage와 동일)
  const allMovies = [
    { id: 1, title: '인셉션', year: 2010, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 9.3, overview: '...' },
    { id: 2, title: '다크 나이트', year: 2008, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, overview: '...' },
    { id: 3, title: '인터스텔라', year: 2014, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/zDNAeWU0PxKol1dw3a3Q6n55AHx.jpg', rating: 8.6, overview: '...' },
    { id: 4, title: '매트릭스', year: 1999, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7, overview: '...' },
    { id: 5, title: '어벤져스', year: 2012, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', rating: 8.0, overview: '...' },
    { id: 6, title: '토이 스토리', year: 1995, genre: 'Animation', poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', rating: 8.3, overview: '...' },
    { id: 7, title: '포레스트 검프', year: 1994, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBvePOVz6xIH4bh4w9MSz4.jpg', rating: 8.8, overview: '...' },
    { id: 8, title: '셰인', year: 2013, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/4Yz2b4qL2YjNDQvLpLQv1vVqF5.jpg', rating: 7.5, overview: '...' },
    { id: 9, title: '파이트 클럽', year: 1999, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8, overview: '...' },
    { id: 10, title: '글래디에이터', year: 2000, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', rating: 8.5, overview: '...' },
  ];

  React.useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // 사용자가 리뷰를 남긴 영화 목록 가져오기
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const userReviews = reviews.filter(r => r.userId === user.id);
    const reviewedMovieIds = [...new Set(userReviews.map(r => r.movieId))];
    const movies = allMovies.filter(m => reviewedMovieIds.includes(m.id));
    setReviewedMovies(movies);

    // 저장된 티어 리스트 불러오기
    const savedTierLists = JSON.parse(localStorage.getItem("tierlists") || "[]");
    const userTierList = savedTierLists.find(tl => tl.userId === user.id);
    if (userTierList) {
      setTierList(userTierList.tiers || { S: [], A: [], B: [], C: [], D: [] });
    }
  }, [user, navigate]);

  const handleDragStart = (movie) => {
    setDraggedMovie(movie);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, tier) => {
    e.preventDefault();
    if (!draggedMovie) return;

    // 기존 티어에서 제거
    const newTierList = { ...tierList };
    Object.keys(newTierList).forEach(key => {
      newTierList[key] = newTierList[key].filter(m => m.id !== draggedMovie.id);
    });

    // 새 티어에 추가
    newTierList[tier] = [...newTierList[tier], draggedMovie];
    setTierList(newTierList);
    setDraggedMovie(null);
  };

  const handleSave = () => {
    if (!user) return;
    
    const tierListData = {
      userId: user.id,
      tiers: tierList,
      title: "내 영화 티어 리스트",
      createdAt: new Date().toISOString(),
    };

    const allTierLists = JSON.parse(localStorage.getItem("tierlists") || "[]");
    const existingIndex = allTierLists.findIndex(tl => tl.userId === user.id);
    
    if (existingIndex >= 0) {
      tierListData.id = allTierLists[existingIndex].id;
      tierListData.updatedAt = new Date().toISOString();
      allTierLists[existingIndex] = tierListData;
    } else {
      tierListData.id = Date.now();
      allTierLists.push(tierListData);
    }

    localStorage.setItem("tierlists", JSON.stringify(allTierLists));
    alert("티어 리스트가 저장되었습니다!");
  };

  const getUnplacedMovies = () => {
    const placedMovieIds = Object.values(tierList).flat().map(m => m.id);
    return reviewedMovies.filter(m => !placedMovieIds.includes(m.id));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="tierlist-page">
      <div className="tierlist-header">
        <h1>영화 티어 리스트</h1>
        <p>리뷰를 남긴 영화들을 티어로 정리해보세요</p>
        <button className="save-tierlist-button" onClick={handleSave}>
          저장하기
        </button>
      </div>

      <div className="tierlist-container">
        {['S', 'A', 'B', 'C', 'D'].map((tier) => (
          <div
            key={tier}
            className={`tier-row tier-${tier}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tier)}
          >
            <div className="tier-label">{tier}</div>
            <div className="tier-content">
              {tierList[tier].map((movie) => (
                <div
                  key={movie.id}
                  className="tier-movie-item"
                  draggable
                  onDragStart={() => handleDragStart(movie)}
                >
                  <img src={movie.poster} alt={movie.title} />
                  <span className="movie-title-small">{movie.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="unplaced-movies">
        <h3>➤ 배치할 영화</h3>
        <div className="movie-gallery">
          {getUnplacedMovies().map((movie) => (
            <div
              key={movie.id}
              className="gallery-movie-item"
              draggable
              onDragStart={() => handleDragStart(movie)}
            >
              <img src={movie.poster} alt={movie.title} />
              <span className="movie-title-small">{movie.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 영화 월드컵 페이지
function WorldCupPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [worldCupMatches, setWorldCupMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [worldCupStarted, setWorldCupStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  // 모든 영화 데이터 (HomePage와 동일)
  const allMovies = [
    { id: 1, title: '인셉션', year: 2010, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 9.3, overview: '...' },
    { id: 2, title: '다크 나이트', year: 2008, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, overview: '...' },
    { id: 3, title: '인터스텔라', year: 2014, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/zDNAeWU0PxKol1dw3a3Q6n55AHx.jpg', rating: 8.6, overview: '...' },
    { id: 4, title: '매트릭스', year: 1999, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7, overview: '...' },
    { id: 5, title: '어벤져스', year: 2012, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', rating: 8.0, overview: '...' },
    { id: 6, title: '토이 스토리', year: 1995, genre: 'Animation', poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', rating: 8.3, overview: '...' },
    { id: 7, title: '포레스트 검프', year: 1994, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBvePOVz6xIH4bh4w9MSz4.jpg', rating: 8.8, overview: '...' },
    { id: 8, title: '셰인', year: 2013, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/4Yz2b4qL2YjNDQvLpLQv1vVqF5.jpg', rating: 7.5, overview: '...' },
    { id: 9, title: '파이트 클럽', year: 1999, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8, overview: '...' },
    { id: 10, title: '글래디에이터', year: 2000, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', rating: 8.5, overview: '...' },
  ];

  React.useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // 사용자가 리뷰를 남긴 영화 목록 가져오기
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const userReviews = reviews.filter(r => r.userId === user.id);
    const reviewedMovieIds = [...new Set(userReviews.map(r => r.movieId))];
    const movies = allMovies.filter(m => reviewedMovieIds.includes(m.id));
    setReviewedMovies(movies);
  }, [user, navigate]);

  // 영화 배열 셔플 함수
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 월드컵 시작
  const startWorldCup = () => {
    if (reviewedMovies.length < 2) {
      alert("리뷰한 영화가 2개 이상 필요합니다!");
      return;
    }

    const shuffled = shuffleArray(reviewedMovies);
    const matches = [];
    
    // 매치 생성 (홀수일 경우 마지막은 부전승)
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        matches.push({
          id: matches.length,
          movie1: shuffled[i],
          movie2: shuffled[i + 1],
          winner: null,
        });
      } else {
        // 홀수일 경우 부전승
        matches.push({
          id: matches.length,
          movie1: shuffled[i],
          movie2: null,
          winner: shuffled[i],
        });
      }
    }

    setWorldCupMatches(matches);
    setCurrentRound(0);
    setWorldCupStarted(true);
    setWinner(null);
  };

  // 매치에서 승자 선택
  const selectWinner = (matchId, selectedMovie) => {
    const newMatches = worldCupMatches.map(match => {
      if (match.id === matchId) {
        return { ...match, winner: selectedMovie };
      }
      return match;
    });
    setWorldCupMatches(newMatches);
  };

  // 다음 라운드로 진행
  const proceedToNextRound = () => {
    const currentMatches = worldCupMatches.filter(m => m.winner);
    const allWinners = currentMatches.map(m => m.winner);
    
    // 우승자 결정 (1명만 남음)
    if (allWinners.length === 1) {
      setWinner(allWinners[0]);
      setWorldCupStarted(false);
      return;
    }

    // 다음 라운드 매치 생성
    const nextMatches = [];
    for (let i = 0; i < allWinners.length; i += 2) {
      if (i + 1 < allWinners.length) {
        nextMatches.push({
          id: nextMatches.length,
          movie1: allWinners[i],
          movie2: allWinners[i + 1],
          winner: null,
        });
      } else {
        // 홀수일 경우 부전승
        nextMatches.push({
          id: nextMatches.length,
          movie1: allWinners[i],
          movie2: null,
          winner: allWinners[i],
        });
      }
    }

    setWorldCupMatches(nextMatches);
    setCurrentRound(currentRound + 1);
  };

  // 현재 라운드의 모든 매치가 완료되었는지 확인
  const isRoundComplete = () => {
    return worldCupMatches.every(match => match.winner !== null);
  };

  // 라운드 이름 계산
  const getRoundName = () => {
    const totalRounds = Math.ceil(Math.log2(reviewedMovies.length));
    const roundNames = ['결승', '준결승', '4강', '8강', '16강', '32강'];
    const roundIndex = totalRounds - currentRound - 1;
    return roundNames[roundIndex] || `${currentRound + 1}라운드`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="worldcup-page">
      <div className="worldcup-header">
        <h1>영화 월드컵</h1>
        <p>리뷰한 영화들로 토너먼트를 진행해보세요</p>
        {!worldCupStarted && !winner && (
          <button className="start-worldcup-button" onClick={startWorldCup}>
            시작하기
          </button>
        )}
        {winner && (
          <button className="start-worldcup-button" onClick={startWorldCup}>
            다시 시작
          </button>
        )}
      </div>

      {winner ? (
        <div className="worldcup-winner">
          <h3>🏆 우승 영화 🏆</h3>
          <div className="winner-movie">
            <img src={winner.poster} alt={winner.title} />
            <h4>{winner.title}</h4>
          </div>
        </div>
      ) : worldCupStarted ? (
        <div className="worldcup-matches">
          <h3 className="round-title">{getRoundName()}</h3>
          {worldCupMatches.map((match) => (
            <div key={match.id} className="worldcup-match">
              {match.movie2 ? (
                <>
                  <div
                    className={`match-movie ${match.winner?.id === match.movie1.id ? 'selected' : ''}`}
                    onClick={() => !match.winner && selectWinner(match.id, match.movie1)}
                  >
                    <img src={match.movie1.poster} alt={match.movie1.title} />
                    <span>{match.movie1.title}</span>
                  </div>
                  <div className="vs-divider">VS</div>
                  <div
                    className={`match-movie ${match.winner?.id === match.movie2.id ? 'selected' : ''}`}
                    onClick={() => !match.winner && selectWinner(match.id, match.movie2)}
                  >
                    <img src={match.movie2.poster} alt={match.movie2.title} />
                    <span>{match.movie2.title}</span>
                  </div>
                </>
              ) : (
                <div className="match-movie selected">
                  <img src={match.movie1.poster} alt={match.movie1.title} />
                  <span>{match.movie1.title} (부전승)</span>
                </div>
              )}
            </div>
          ))}
          {isRoundComplete() && (
            <button className="next-round-button" onClick={proceedToNextRound}>
              다음 라운드
            </button>
          )}
        </div>
      ) : (
        <div className="worldcup-placeholder">
          <p>리뷰한 영화들로 월드컵을 시작해보세요!</p>
          <p className="worldcup-info">랜덤으로 매칭된 영화 중 선택하여 최고의 영화를 찾아보세요.</p>
        </div>
      )}
    </div>
  );
}
// 영화 카드 컴포넌트
function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div 
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="rating-badge">{movie.rating.toFixed(1)}</div>
      </div>
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-year">{movie.year}</div>
      </div>
    </div>
  );
}

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  // 이벤트 리스너 추가
  React.useEffect(() => {
    const handleOpenLogin = () => {
      setIsLoginOpen(true);
    };
    window.addEventListener('openLogin', handleOpenLogin);
    return () => window.removeEventListener('openLogin', handleOpenLogin);
  }, []);

  return (
    <>
      <header className="main-header">
        <div
          className="logo-area"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={mainLogo} alt="로고" className="logo-image" />
        </div>
        <div className="header-right">
          {user ? (
            <>
              <button 
                className="worldcup-button"
                onClick={() => navigate("/worldcup")}
                style={{ marginRight: "8px" }}
              >
                영화 월드컵
              </button>
              <button 
                className="tierlist-button"
                onClick={() => navigate("/tierlist")}
                style={{ marginRight: "8px" }}
              >
                티어 리스트
              </button>
              <span className="user-name">{user.nickname}</span>
              <button className="logout-button" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="login-button" onClick={openLogin}>
              로그인
            </button>
          )}
        </div>
        </header>

      {isLoginOpen && (
        <LoginModal
          onClose={closeLogin}
          onGoSignUp={() => {
            closeLogin();
            navigate("/signup");
          }}
        />
      )}
    </>
  );
}

function LoginModal({ onClose, onGoSignUp }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // localStorage에서 사용자 찾기
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      // 비밀번호는 제외하고 저장
      const { password, ...userData } = user;
      login(userData);
      onClose();
    } else {
      setError("이메일 또는 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">로그인</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            아이디(이메일)
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </label>

          <label className="modal-label">
            비밀번호
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="modal-submit">
            로그인
          </button>
        </form>

        <div className="modal-footer">
          <span>아직 회원이 아니신가요?</span>
          <button className="signup-link" onClick={onGoSignUp}>
            회원가입
          </button>
        </div>

        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default App;