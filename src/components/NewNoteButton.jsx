import { Plus } from "lucide-react"

function NewNoteButton({onClick}){
    return(
        <button
            className="new-note-btn"
            type="button"
            onClick={onClick}
        >
            <Plus className="plus-icon" strokeWidth={3} />
            <span>New Note</span>
        </button>
    )
}
export default NewNoteButton