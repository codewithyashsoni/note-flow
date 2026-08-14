import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.js"
import { NotebookPen, LoaderCircle } from "lucide-react";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            navigate("/")

        }catch(error){
            setError(getAuthErrorMessage(error));
            console.log(error)
        }finally{
            setLoading(false);
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
        <div className="login-container">
            <div className="auth-logo logo">
                <NotebookPen className="auth-logo-icon logo-icon" />
                <span className="auth-logo-text logo-text">NoteFlow</span>
            </div>

            <div className="auth-hero">
                <h1>Welcome Back</h1>
                <p>Log in to access and manage your notes.</p>
            </div>

            <div className="auth-form-container">
                <form 
                    onSubmit={handleSubmit}
                    className="auth-form"
                >
                    <label>
                        <span>Email:</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="auth-input input"
                            placeholder="mail@website.com"
                        />
                    </label>

                    <label>
                        <span>Password:</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input input"
                            placeholder="Enter password"
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
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                    
                </form>

                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <NavLink className="auth-nav-link" to="/signup">Sign up</NavLink>
                </div>
            </div>
        </div>
    )
}
export default Login