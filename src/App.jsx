import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Send from "./pages/Send/Send.jsx";
import HistoryPage from "./pages/History/History.jsx";
import Profile from "./pages/Profile/Profile.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [sendForm, setSendForm] = useState({
    recipient: "",
    amount: "",
    note: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setUsers([
      {
        id: "1",
        username: "demo",
        email: "demo@goonpay.com",
        password: "demo123",
        balance: 1500.0,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleSignup = () => {
    setError("");
    setSuccess("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (users.find((u) => u.username === signupForm.username)) {
      setError("Username already exists");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
      balance: 1000.0,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setSuccess("Account created successfully! Please login.");

    setSignupForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleLogin = () => {
    setError("");

    const user = users.find(
      (u) =>
        u.username === loginForm.username &&
        u.password === loginForm.password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    setCurrentUser(user);
    setLoginForm({ username: "", password: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setError("");
    setSuccess("");
  };

  const handleSendMoney = () => {
    setError("");
    setSuccess("");

    const amount = parseFloat(sendForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amount > currentUser.balance) {
      setError("Insufficient balance");
      return;
    }

    const recipient = users.find((u) => u.username === sendForm.recipient);
    if (!recipient) {
      setError("Recipient not found");
      return;
    }

    if (recipient.id === currentUser.id) {
      setError("Cannot send money to yourself");
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      from: currentUser.id,
      to: recipient.id,
      amount: amount,
      note: sendForm.note,
      timestamp: new Date().toISOString(),
      fromUsername: currentUser.username,
      toUsername: recipient.username,
    };

    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id)
        return { ...u, balance: u.balance - amount };
      if (u.id === recipient.id)
        return { ...u, balance: u.balance + amount };
      return u;
    });

    setUsers(updatedUsers);
    setTransactions([transaction, ...transactions]);
    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance - amount,
    });
    setSuccess(
      `Successfully sent $${amount.toFixed(2)} to ${recipient.username}`
    );
    setSendForm({ recipient: "", amount: "", note: "" });
  };

  const getUserTransactions = () => {
    if (!currentUser) return [];
    return transactions.filter(
      (t) => t.from === currentUser.id || t.to === currentUser.id
    );
  };

  return (
    <Routes>
      {!currentUser && (
        <>
          <Route
            path="/"
            element={
              <Login
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                handleLogin={handleLogin}
                error={error}
                success={success}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                signupForm={signupForm}
                setSignupForm={setSignupForm}
                handleSignup={handleSignup}
                error={error}
                success={success}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {currentUser && (
        <>
          <Route
            path="/"
            element={
              <Dashboard
                currentUser={currentUser}
                getUserTransactions={getUserTransactions}
                handleLogout={handleLogout}
              />
            }
          />

          <Route
            path="/send"
            element={
              <Send
                currentUser={currentUser}
                sendForm={sendForm}
                setSendForm={setSendForm}
                handleSendMoney={handleSendMoney}
                error={error}
                success={success}
                handleLogout={handleLogout}
              />
            }
          />

          <Route
            path="/history"
            element={
              <HistoryPage
                currentUser={currentUser}
                getUserTransactions={getUserTransactions}
                handleLogout={handleLogout}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile
                currentUser={currentUser}
                getUserTransactions={getUserTransactions}
                handleLogout={handleLogout}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}
