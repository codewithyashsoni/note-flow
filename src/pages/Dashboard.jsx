import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext.jsx"
import { db } from "../firebase/firebase.js"
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore"
import Navbar from "../components/Navbar.jsx"
import SearchBar from "../components/SearchBar.jsx"
import NewNoteButton from "../components/NewNoteButton.jsx"
import NoteForm from "../components/NoteForm.jsx"
import NoteList from "../components/NoteList.jsx"
import SmallLoader from "../components/SmallLoader.jsx"
import DeleteConfirm from "../components/DeleteConfirm.jsx"


function Dashboard(){
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [editingNote, setEditingNote] = useState(null);
    const [deletingNote, setDeletingNote] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(!user) return;

        const notesQuery = query(
            collection(db, "notes"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            notesQuery,
            (snapshot) => {
                const notesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setNotes(notesData);
                setNotesLoading(false);
            },
            (error) => {
                console.error("Error fetching notes:", error);
                setNotesLoading(false);
            }
        );
        return unsubscribe;

    }, [user]);

    const isSearching = searchTerm.trim().length > 0;

    const filteredNotes = notes.filter((note) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        )
    })

    const pinnedNotes = filteredNotes.filter((note) => note.pinned);
    const allNotes = filteredNotes.filter((note) => !note.pinned);

    function handleEditNote(note){
        setEditingNote(note);
        setIsFormOpen(true);
    }

    function handleDeleteNote(note){
        setDeletingNote(note);
    }

    async function handleConfirmDelete(){
        if(!deletingNote) return;

        setDeleting(true);

        try{
            await deleteDoc(doc(db, "notes", deletingNote.id));
            setDeletingNote(null);
        }catch(error){
            console.error("Error deleting note: ", error);
        }finally{
            setDeleting(false)
        }
    }

    return(
        <div className="dashboard-container">
            <Navbar />

            <div className="dashboard">

                <div className="dashboard-tools">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <NewNoteButton onClick={() => {
                        setEditingNote(null);
                        setIsFormOpen(true)
                    }} />
                </div>

                {isFormOpen &&
                    <NoteForm 
                        setIsFormOpen={setIsFormOpen}
                        editingNote={editingNote}
                        setEditingNote={setEditingNote} 
                    />
                }

                {deletingNote && (
                    <DeleteConfirm
                        note={deletingNote}
                        onCancel={() => setDeletingNote(null)}
                        onConfirm={handleConfirmDelete}
                        deleting={deleting}
                    />
                )}

                <div className="notes-section">
                    <h2 className="notes-section-title">
                        Pinned Notes
                    </h2>

                    {notesLoading ? (
                        <SmallLoader />
                    ) : (
                        pinnedNotes.length === 0 ? (
                            <p className="no-notes-msg">
                                {isSearching 
                                    ? "No pinned notes match your search."
                                    : "No pinned notes yet"
                                }
                            </p>
                        ) : (
                            <NoteList 
                                onEdit={handleEditNote}
                                notes={pinnedNotes}
                                onDelete={handleDeleteNote}
                            />
                        )
                    )
                    }
                </div>

                <div className="notes-section">
                    <h2 className="notes-section-title">
                        All Notes
                    </h2>

                    {notesLoading ? (
                        <SmallLoader />
                    ) : (
                        allNotes.length === 0 ? (
                            <p className="no-notes-msg">
                                {isSearching
                                    ? "No notes match your search."
                                    : "No notes yet. Create your first note!"
                                }
                            </p>
                        ) : (
                            <NoteList 
                                onEdit={handleEditNote}
                                notes={allNotes} 
                                onDelete={handleDeleteNote}
                            />
                        )
                    )}
                </div>
            </div>     
        </div>
    )
}
export default Dashboard