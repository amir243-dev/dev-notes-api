import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="app">
      <div
        className="screen"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="logo" style={{ margin: "0 auto 12px" }}>
            &gt;_
          </div>
          <div className="wordmark-name" style={{ textAlign: "center" }}>
            DevNotes
          </div>
          <div className="wordmark-sub" style={{ textAlign: "center" }}>
            BUILD LOG
          </div>
        </div>

        <h1 className="h1" style={{ textAlign: "center", marginBottom: "8px" }}>
          {isRegister ? "Start logging." : "Welcome back."}
        </h1>
        <p
          className="sub"
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          {isRegister
            ? "Your engineering decisions, captured as they happen."
            : "Pick up where your last entry left off."}
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            justifyContent: "center",
          }}
        >
          <button
            className={`fchip ${!isRegister ? "on" : ""}`}
            onClick={() => setIsRegister(false)}
          >
            Sign in
          </button>
          <button
            className={`fchip ${isRegister ? "on" : ""}`}
            onClick={() => setIsRegister(true)}
          >
            Create account
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {isRegister && (
            <div className="field">
              <label className="field-label">NAME</label>
              <input
                type="text"
                className="input"
                placeholder="Jaysh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label className="field-label">EMAIL</label>
            <input
              type="email"
              className="input"
              placeholder="jaysh@devnotes.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="field-label">PASSWORD</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: "8px" }}
          >
            {isRegister ? "Create account" : "Sign in"}
            <span className="kbd">↵</span>
          </button>
        </form>

        {/* {!isRegister && (
          <p className="sub" style={{ textAlign: "center", marginTop: "16px" }}>
            <p>OR</p>
            <a href="#" style={{ textDecoration: "underline" }}>
              Forgot your password?
            </a>
          </p>
        )} */}
      </div>
    </div>
  );
}
