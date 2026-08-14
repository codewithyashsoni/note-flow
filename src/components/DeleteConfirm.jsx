import { AlertTriangle, Trash2, X } from "lucide-react"

function DeleteConfirm({note, onCancel, onConfirm, deleting}){
    return(
        <div 
            className="delete-modal-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <div className="delete-modal">

                <div className="delete-modal-icon-container">
                    <AlertTriangle className="delete-modal-icon" />
                </div>

                
                <div className="delete-modal-content">
                    <h2 id="delete-modal-title">Delete Note?</h2>

                    <p id="delete-modal-description">
                        Are you sure you want to delete
                        <strong>"{note.title}"</strong>?
                    </p>

                    <span className="delete-warning">
                        This action cannot be undone.
                    </span>
                </div>

                <div className="delete-modal-actions">
                    <button
                        type="button"
                        className="delete-cancel-btn"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        <X className="cancel-icon" />
                        <span>Cancel</span>
                    </button>

                    <button
                        type="button"
                        className="delete-confirm-btn"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        <Trash2 className="trash-icon" />
                        <span>
                            {deleting 
                                ? "Deleting..."
                                : "Delete note"
                            }
                        </span>
                    </button>
                </div>

            </div>
        </div>
    )
}
export default DeleteConfirm