// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // localStorage에서 기존 사용자 확인
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u) => u.email === form.email);

    if (existingUser) {
      setError("이미 존재하는 이메일입니다");
      return;
    }

    // 새 사용자 추가
    const newUser = {
      id: Date.now(), // 간단한 ID 생성
      email: form.email,
      password: form.password, // 실제로는 해시해야 하지만 과제용으로 평문 저장
      nickname: form.nickname,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("회원가입 성공! 로그인해주세요.");
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label className="form-label">
            이메일
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>

          <label className="form-label">
            비밀번호
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
              minLength={6}
            />
          </label>

          <label className="form-label">
            닉네임
            <input
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            회원가입
          </button>
        </form>

        <div className="signup-footer">
          <span>이미 계정이 있으신가요?</span>
          <button className="login-link" onClick={() => navigate("/")}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;