import { UserPlus } from "lucide-react";
import { Link } from "react-router";
import "./Signup.css";

export default function Signup({
  signupForm,
  setSignupForm,
  handleSignup,
  error,
  success,
}) {
  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="signup-header">
          <div className="signup-icon-wrapper">
            <UserPlus className="signup-icon" />
          </div>
          <h1 className="signup-title">Create Account</h1>
          <p className="signup-subtitle">Join GoonPay today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={signupForm.username}
              onChange={(e) =>
                setSignupForm({ ...signupForm, username: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={signupForm.email}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={signupForm.confirmPassword}
              onChange={(e) =>
                setSignupForm({
                  ...signupForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <button className="btn-primary" onClick={handleSignup}>
            <UserPlus className="icon-sm" />
            Create Account
          </button>

        </div>

        <div className="switch-section">
          <p>Already have an account?</p>
          <Link to="/" className="switch-link">
            Login
          </Link>
        </div>

        <div className="info-box">
          <p><strong>Note:</strong> New accounts start with $1,000.00 virtual balance</p>
        </div>

      </div>

    </div>
  );
}
