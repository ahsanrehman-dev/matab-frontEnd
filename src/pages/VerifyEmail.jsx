import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Styles/style.css";

const VerifyEmail = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, resendOTP } = useAuth();

    // Get email from location state (passed from register page)
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/admin/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === "Backspace") {
            if (otp[index] === "" && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const result = await verifyEmail(email, otpValue);

            if (result.success) {
                setSuccess("Email verified successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const result = await resendOTP(email);
            if (result.success) {
                setSuccess("Verification code sent again!");
                setTimer(60);
                setCanResend(false);
            } else {
                setError(result.error || "Failed to resend code");
            }
        } catch (err) {
            setError("Failed to resend code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form" style={{ maxWidth: "450px" }}>
                <h2>Verify Email</h2>
                <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
                    We've sent a code to <strong>{email}</strong>
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
                    <div className="otp-container" style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginBottom: "20px"
                    }}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name="otp"
                                maxLength="1"
                                className="otp-input"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                style={{
                                    width: "45px",
                                    height: "50px",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px"
                                }}
                            />
                        ))}
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Didn't receive code?{" "}
                        <button
                            onClick={handleResend}
                            disabled={!canResend || isLoading}
                            className="resend-button"
                            style={{
                                background: "none",
                                border: "none",
                                color: canResend ? "var(--primary-color, #007bff)" : "#999",
                                cursor: canResend ? "pointer" : "not-allowed",
                                textDecoration: canResend ? "underline" : "none",
                                fontWeight: "bold"
                            }}
                        >
                            {canResend ? "Resend" : `Resend in ${timer}s`}
                        </button>
                    </p>
                    <div style={{ marginTop: "15px" }}>
                        <Link to="/admin/register" className="auth-link">
                            Change Email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
