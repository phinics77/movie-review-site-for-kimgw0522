// src/utils/storage.js
// localStorage 관리 유틸리티 함수들

// 영화 데이터 관리
export const getMovies = () => {
    return JSON.parse(localStorage.getItem("movies") || "[]");
  };
  
  export const saveMovie = (movie) => {
    const movies = getMovies();
    const newMovie = {
      id: Date.now(),
      ...movie,
      createdAt: new Date().toISOString(),
    };
    movies.push(newMovie);
    localStorage.setItem("movies", JSON.stringify(movies));
    return newMovie;
  };
  
  // 리뷰 데이터 관리
  export const getReviews = () => {
    return JSON.parse(localStorage.getItem("reviews") || "[]");
  };
  
  export const getReviewsByMovie = (movieId) => {
    const reviews = getReviews();
    return reviews.filter((r) => r.movieId === movieId);
  };
  
  export const getReviewByUserAndMovie = (userId, movieId) => {
    const reviews = getReviews();
    return reviews.find((r) => r.userId === userId && r.movieId === movieId);
  };
  
  export const saveReview = (review) => {
    const reviews = getReviews();
    const existingIndex = reviews.findIndex(
      (r) => r.userId === review.userId && r.movieId === review.movieId
    );
  
    if (existingIndex >= 0) {
      // 수정
      reviews[existingIndex] = {
        ...reviews[existingIndex],
        ...review,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 새로 생성
      const newReview = {
        id: Date.now(),
        ...review,
        createdAt: new Date().toISOString(),
      };
      reviews.push(newReview);
    }
  
    localStorage.setItem("reviews", JSON.stringify(reviews));
    return reviews[existingIndex >= 0 ? existingIndex : reviews.length - 1];
  };
  
  export const deleteReview = (reviewId) => {
    const reviews = getReviews();
    const filtered = reviews.filter((r) => r.id !== reviewId);
    localStorage.setItem("reviews", JSON.stringify(filtered));
  };
  
  // 영화 평균 평점 계산
  export const getMovieStats = (movieId) => {
    const reviews = getReviewsByMovie(movieId);
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
  
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      averageRating: (sum / reviews.length).toFixed(1),
      reviewCount: reviews.length,
    };
  };

  // src/storage.js 파일 끝에 추가

// 티어 리스트 데이터 관리
export const getTierLists = (userId) => {
  const allTierLists = JSON.parse(localStorage.getItem("tierlists") || "[]");
  return allTierLists.filter(tl => tl.userId === userId);
};

export const saveTierList = (tierList) => {
  const allTierLists = JSON.parse(localStorage.getItem("tierlists") || "[]");
  
  if (tierList.id) {
    // 수정
    const index = allTierLists.findIndex(tl => tl.id === tierList.id);
    if (index >= 0) {
      allTierLists[index] = {
        ...allTierLists[index],
        ...tierList,
        updatedAt: new Date().toISOString(),
      };
    }
  } else {
    // 새로 생성
    const newTierList = {
      id: Date.now(),
      ...tierList,
      createdAt: new Date().toISOString(),
    };
    allTierLists.push(newTierList);
  }
  
  localStorage.setItem("tierlists", JSON.stringify(allTierLists));
  return allTierLists.find(tl => tl.id === (tierList.id || allTierLists[allTierLists.length - 1].id));
};

export const deleteTierList = (tierListId) => {
  const allTierLists = JSON.parse(localStorage.getItem("tierlists") || "[]");
  const filtered = allTierLists.filter(tl => tl.id !== tierListId);
  localStorage.setItem("tierlists", JSON.stringify(filtered));
};

// 사용자가 리뷰를 남긴 영화 목록 가져오기
export const getReviewedMoviesByUser = (userId) => {
  const reviews = getReviews();
  const userReviews = reviews.filter(r => r.userId === userId);
  const movieIds = [...new Set(userReviews.map(r => r.movieId))];
  
  // 실제로는 movies 배열에서 가져와야 하지만, 여기서는 간단하게
  // HomePage의 movies 배열을 공유하거나 별도로 관리해야 함
  return movieIds;
};