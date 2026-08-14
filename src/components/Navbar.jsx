import { useContext } from "react"
import { NotebookPen, LogOut } from "lucide-react"
import { AuthContext } from "../context/AuthContext.jsx"
import { auth } from "../firebase/firebase.js"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function Navbar(){
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLogout(){
        try{
            await signOut(auth);
            navigate("/login");
        }catch(error){
            console.error("Logout error: ", error);
        }
    }

    return(
        <div className="navbar-container">
            <div className="navbar">
                <div className="logo">
                    <NotebookPen className="logo-icon" />
                    <span className="logo-text">NoteFlow</span>
                </div>

                <div className="navbar-content">

                    <span className="navbar-user">
                        {user?.email}
                    </span>
                    <button
                        className="logout-btn"
                        type="button"
                        onClick={handleLogout}
                    >
                        <LogOut className="logout-icon" />
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Navbar