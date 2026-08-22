import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication Failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        padding: "2rem",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>
        {isRegister ? "Create Account" : "DevNotes Login"}
      </h1>
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={handleSubmit}
      >
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{
          marginTop: "1rem",
          color: "var(--slate)",
          textDecoration: "underline",
        }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </div>
  );
}
