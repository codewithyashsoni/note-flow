import { Pin, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase.js"
import { useState, useEffect, useRef } from "react"

function NoteCard({note, onEdit, onDelete}){
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event){
            if(
                menuRef.current && 
                !menuRef.current.contains(event.target)
            ){
                setMenuOpen(false);
            }
        }

        if(menuOpen){
            document.addEventListener("mousedown", handleClickOutside);
        };

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen])

    async function handlePin(){
        try{
            await updateDoc(doc(db, "notes", note.id), {
                pinned: !note.pinned
            });
        }catch(error){
            console.error("Error updating pin", error);
        }
    }

    function formatDate(timestamp){
        if(!timestamp) return "Just now";

        return timestamp.toDate().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    return(
        <div className="note-card">
            <div className="note-card-header">

                <h3 className="note-card-title">{note.title}</h3>

                <div className="note-card-actions">
            
                    <button
                        type="button"
                        className={`note-pin-btn ${note.pinned ? "pinned" : ""}`}
                        onClick={handlePin}
                        title={note.pinned ? "Unpin note" : "Pin note"}
                    >
                        <Pin
                            className="note-pin-icon"
                            fill={note.pinned ? "currentColor" : "none"}
                        />
                    </button>

                    <div className="note-menu-wrapper" ref={menuRef}>

                        <button
                            type="button"
                            className="note-menu-btn"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            title="More options"
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                        >
                            <MoreVertical
                                className="more-icon"
                                strokeWidth={2.5}
                            />

                        </button>

                        {menuOpen && 
                            <div className="note-menu" role="menu">
                                <button
                                    type="button"
                                    role="menuitem"
                                    className="edit-menu-item"
                                    onClick={() => {
                                        onEdit(note)
                                        setMenuOpen(false)
                                    }}
                                >
                                    <Pencil className="edit-icon" />
                                    <span>Edit</span>
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="delete-menu-item"
                                    onClick={() => {
                                        onDelete(note);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <Trash2 className="delete-icon" />
                                    <span>Delete</span>

                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <p className="note-card-content">
                {note.content}
            </p>

            <div className="note-card-footer">
                <span>
                    Last edited · {formatDate(note.updatedAt)}
                </span>
            </div>
        </div>
    )
}
export default NoteCard