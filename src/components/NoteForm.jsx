import { useState, useContext } from "react"
import { X, Save } from "lucide-react"
import { db } from "../firebase/firebase.js"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext.jsx"


function NoteForm({setIsFormOpen, editingNote, setEditingNote}){
    const { user } = useContext(AuthContext);

    const [title, setTitle] = useState(
        editingNote ? editingNote.title : ""
    );
    const [content, setContent] = useState(
        editingNote ? editingNote.content : ""
    );
    const [error, setError] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if(!trimmedTitle){
            setError("Please enter a title.");
            return;
        }

        if(!trimmedContent){
            setError("Please enter some content");
            return;
        }

        try{
            if(editingNote){
                await updateDoc(doc(db, "notes", editingNote.id), {
                    title: trimmedTitle,
                    content: trimmedContent,
                    updatedAt: serverTimestamp()
                })
            }else{

                await addDoc(collection(db, "notes"), {
                    title: trimmedTitle,
                    content: trimmedContent,
                    userId: user.uid,
                    pinned: false,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            }

            setIsFormOpen(false);
            setEditingNote(null);
            setTitle("");
            setContent("")
        }catch(error){
            console.error("Error saving note:", error);
            setError("Failed to save a note. Please try again");
        }
    }

    function handleCancel(){
        setIsFormOpen(false);
        setEditingNote(null);
        setTitle("");
        setContent("");
        setError("");
    }

    return(
        <div 
            className="note-form-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-form-title"
        >
            <form className="note-form" onSubmit={handleSubmit}>
                <h2 id="note-form-title">{editingNote ? "Edit Note" : "Create Note"}</h2>

                <div className="note-form-content">

                    <label htmlFor="note-title">
                        <span>Title:</span>
                        <input
                            id="note-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="note-title-input input"
                            placeholder="Enter note title..."
                        />
                    </label>

                    <label htmlFor="note-content">
                        <span>Content:</span>
                        <textarea
                            id="note-content"
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="note-content-input input"
                            placeholder="Write your note here..."
                        />
                    </label>

                    {error &&
                        <p className="note-form-error" role="alert">{error}</p>
                    }

                    <div className="note-form-btns-container">
                        <button
                            type="button"
                            className="note-form-btn cancel-btn"
                            onClick={handleCancel}
                        >
                            <X className="cancel-icon" strokeWidth={2.5} />
                            <span>Cancel</span>
                        </button>

                        <button
                            type="submit"
                            className="note-form-btn save-btn"
                        >
                            <Save className="save-icon" strokeWidth={2.5} />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default NoteForm