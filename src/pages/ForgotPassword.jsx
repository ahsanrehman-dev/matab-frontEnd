import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../utils/api";
import "../Styles/style.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const response = await authApi.forgotPassword(email);
            if (response.success) {
                setSuccess("Password reset link sent to your email.");
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Forgot Password</h2>
                <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success" style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "15px",
                    textAlign: "center"
                }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="auth-footer">
                    Remember your password?{" "}
                    <Link to="/admin/login" className="auth-link">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
