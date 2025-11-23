import { LogIn, CreditCard } from "lucide-react";
import { Link } from "react-router";
import "./Login.css";

export default function Login({
  loginForm,
  setLoginForm,
  handleLogin,
  error,
  success,
}) {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <div className="login-icon-wrapper">
            <CreditCard className="login-icon" />
          </div>
          <h1 className="login-title">GoonPay</h1>
          <p className="login-subtitle">Virtual Payment Simulator</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button className="btn-primary" onClick={handleLogin}>
            <LogIn className="icon-sm" />
            Login
          </button>
        </div>

        <div className="switch-section">
          <p>Don't have an account?</p>
          <Link to="/signup" className="switch-link">
            Create Account
          </Link>
        </div>

        <div className="demo-box">
          <p className="demo-title">Demo Account:</p>
          <p className="demo-line">Username: demo</p>
          <p className="demo-line">Password: demo123</p>
        </div>

      </div>

    </div>
  );
}
