import { Search } from "lucide-react"

function SearchBar({searchTerm, setSearchTerm}){
    return(
        <div className="searchbar-container">
            <Search className="search-icon" />
            <input 
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input input"
                placeholder="Search notes..."
            />
        </div>
    )
}
export default SearchBar