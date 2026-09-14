import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const starterNotes = [
  {
    id: 1,
    title: 'A slower way to start',
    excerpt: 'The best ideas showed up after the first walk, not the first coffee.',
    category: 'Reflection',
    date: 'Today, 08:42',
    color: 'red',
  },
  {
    id: 2,
    title: 'Three useful questions',
    excerpt: 'What is the smallest version? What would make it delightful? What can wait?',
    category: 'Ideas',
    date: 'Yesterday, 16:20',
    color: 'blue',
  },
  {
    id: 3,
    title: 'Test MGR Materials for the studio',
    excerpt: 'Tracing paper, soft graphite, masking tape, and one very good playlist.',
    category: 'List',
    date: 'Sep 10, 10:05',
    color: 'yellow',
  },
]

function App() {
  const [notes, setNotes] = useState(starterNotes)
  const [activeFilter, setActiveFilter] = useState('All notes')
  const [search, setSearch] = useState('')
  const [isComposerOpen, setComposerOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const visibleNotes = useMemo(() => {
    const query = search.toLowerCase().trim()
    return notes.filter((note) => {
      const matchesFilter = activeFilter === 'All notes' || note.category === activeFilter
      const matchesSearch = !query || `${note.title} ${note.excerpt}`.toLowerCase().includes(query)
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, notes, search])

  function addNote(event) {
    event.preventDefault()
    if (!newTitle.trim()) return
    setNotes([
      {
        id: Date.now(),
        title: newTitle.trim(),
        excerpt: 'A new thought, ready to be filled in.',
        category: 'Ideas',
        date: 'Just now',
        color: 'blue',
      },
      ...notes,
    ])
    setNewTitle('')
    setComposerOpen(false)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-hidden="true">FN</div>
        <div>
          <p className="eyebrow">Personal archive</p>
          <h1>Field<br />Notes<span>.</span></h1>
        </div>
        <nav aria-label="Note filters">
          <p className="nav-label">Browse</p>
          {['All notes', 'Reflection', 'Ideas', 'List'].map((filter) => (
            <button
              className={`nav-item ${activeFilter === filter ? 'is-active' : ''}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              <span className="nav-dot" />{filter}
              {filter === 'All notes' && <span className="count">{notes.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> Sync is up to date
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="date-stamp">Monday, September 14, 2026 <span>/</span> 09:17</div>
          <button className="avatar" aria-label="Open profile">MG</button>
        </header>
        <div className="content-inner">
          <div className="intro-row">
            <div>
              <p className="eyebrow">A quiet place for loud ideas</p>
              <h2>Your notes <span>({visibleNotes.length})</span></h2>
            </div>
            <button className="primary-button" onClick={() => setComposerOpen(true)}>
              <span aria-hidden="true">+</span> New note
            </button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes" />
              <kbd>/</kbd>
            </label>
            <span className="sort-label">Sorted by <strong>Recent</strong> <span aria-hidden="true">⌄</span></span>
          </div>

          <div className="notes-grid">
            {visibleNotes.map((note, index) => (
              <article className={`note-card ${note.color}`} key={note.id} style={{ '--delay': `${index * 70}ms` }}>
                <div className="card-top"><span>{note.category}</span><button aria-label={`More options for ${note.title}`}>•••</button></div>
                <h3>{note.title}</h3>
                <p>{note.excerpt}</p>
                <footer>{note.date}<span className="arrow" aria-hidden="true">↗</span></footer>
              </article>
            ))}
          </div>
          {visibleNotes.length === 0 && <p className="empty-state">No notes match that search.</p>}
          <p className="collection-note">{notes.length} notes in your collection <span>·</span> Last edited just now</p>
        </div>
      </section>

      {isComposerOpen && (
        <div className="modal-backdrop" onMouseDown={() => setComposerOpen(false)}>
          <form className="composer" onSubmit={addNote} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setComposerOpen(false)} aria-label="Close">×</button>
            <p className="eyebrow">New entry</p>
            <h2>What is on your mind?</h2>
            <label htmlFor="note-title">Title</label>
            <input id="note-title" autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Give this thought a name" />
            <button className="primary-button" type="submit">Save note <span aria-hidden="true">↗</span></button>
          </form>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)