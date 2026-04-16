import { useState } from "react";
import { authAPI, setAuthToken, getAuthToken } from "../utils/api";

export default function AuthView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.username, formData.password);
      } else {
        response = await authAPI.register(
          formData.username,
          formData.email,
          formData.password,
          formData.displayName || formData.username
        );
      }

      setAuthToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      onAuthSuccess(response.user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;font-family:'DM Mono',monospace;color:#fff;}
      `}</style>

      <div
        style={{
          background: "#080808",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
          padding: "48px 40px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: 400,
            marginBottom: 12,
            letterSpacing: "-0.01em",
          }}
        >
          Fight Club<span style={{ color: "#8B5CF6" }}>.</span>
        </h1>

        <p
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            color: "#888",
            marginBottom: 32,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "#666",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              style={{
                width: "100%",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                padding: "12px 16px",
                fontSize: 14,
                fontFamily: "'DM Mono',monospace",
                outline: "none",
              }}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "#666",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required={!isLogin}
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 8,
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontFamily: "'DM Mono',monospace",
                  outline: "none",
                }}
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "#666",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Display Name (optional)
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your display name"
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 8,
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontFamily: "'DM Mono',monospace",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "#666",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                padding: "12px 16px",
                fontSize: 14,
                fontFamily: "'DM Mono',monospace",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#330000",
                border: "1px solid #661111",
                borderRadius: 8,
                padding: "12px",
                fontSize: 12,
                color: "#ff6666",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg,#6D28D9 0%,#8B5CF6 50%,#A78BFA 100%)",
              border: "none",
              borderRadius: 8,
              color: "#000",
              padding: "12px 24px",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "#666",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setFormData({ username: "", email: "", password: "", displayName: "" });
            }}
            style={{
              background: "none",
              border: "none",
              color: "#8B5CF6",
              cursor: "pointer",
              textDecoration: "underline",
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
            }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
