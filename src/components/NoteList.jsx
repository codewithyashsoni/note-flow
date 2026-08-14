import NoteCard from "./NoteCard.jsx"

function NoteList({notes, onEdit, onDelete}){
    return(
        <div className="notes-grid">
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
export default NoteList