import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { NotebookPen, LoaderCircle } from "lucide-react";

function Signup(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try{
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            
            navigate("/")
        } catch(error) {
            console.log("Signup error:", error);
            setError(getAuthErrorMessage(error));
        }finally{
            setLoading(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }

    function getAuthErrorMessage(error) {
        switch(error.code) {
            case "auth/email-already-in-use":
                return "An account with this email already exists.";

            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/invalid-credential":
                return "Incorrect email or password.";

            case "auth/weak-password":
                return "Password must be at least 6 characters.";

            default:
                return "Something went wrong. Please try again.";
        }
    }

    return(
        <div className="signup-container">
            <div className="auth-logo logo">
                <NotebookPen className="auth-logo-icon logo-icon" />
                <span className="auth-logo-text logo-text">NoteFlow</span>
            </div>

            <div className="auth-hero">
                <h1>Create Account</h1>
                <p>Create your account and start organizing your thoughts.</p>
            </div>

            <div className="auth-form-container">
                <form 
                    onSubmit={handleSubmit}
                    className="auth-form"
                >
                    <label className="auth-label">
                        <span>Email:</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input input"
                            placeholder="mail@website.com"
                        />
                    </label>

                    <label className="auth-label">
                        <span>Password:</span>
                        <input
                            type="password"
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input input"
                            placeholder="Enter password"
                        />
                    </label>

                    <label className="auth-label">
                        <span>Confirm Password:</span>
                        <input
                            type="password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="auth-input input"
                            placeholder="Re-enter your password"
                        />
                    </label>
                    {error &&
                        <p className="auth-error-msg">{error}</p>
                    }

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <LoaderCircle className="loader" />
                        ): (
                            <span>Create Account</span>
                        )
                        }
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <NavLink className="auth-nav-link" to="/login">Login</NavLink>
                </div>
            </div>
        </div>
    )
}
export default Signup