// State Management
let notes = [];
let selectedNoteId = null;
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
let currentResizingNote = null;

// Toolbar State
let toolbarState = {
    fontFamily: 'sans-serif',
    fontSize: '14',
    lineHeight: '1.5',
    bold: false,
    italic: false,
    underline: false,
    color: '#FFF9C4'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadFromLocalStorage();
    setupEventListeners();
    applyThemePreference();
});

// App Initialization
function initializeApp() {
    // Check for saved notes
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        renderNotes();
    } else {
        // Create default note
        addNewNote();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Floating add button
    document.getElementById('floatingAddBtn').addEventListener('click', addNewNote);
    document.getElementById('addNoteBtn').addEventListener('click', addNewNote);

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Download all
    document.getElementById('downloadAllBtn').addEventListener('click', downloadAllNotes);

    // Toolbar controls
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        toolbarState.fontFamily = e.target.value;
        updateSelectedNote();
    });

    document.getElementById('fontSize').addEventListener('change', (e) => {
        toolbarState.fontSize = e.target.value;
        updateSelectedNote();
    });

    document.getElementById('lineHeight').addEventListener('change', (e) => {
        toolbarState.lineHeight = e.target.value;
        updateSelectedNote();
    });

    document.getElementById('boldBtn').addEventListener('click', () => {
        toolbarState.bold = !toolbarState.bold;
        document.getElementById('boldBtn').classList.toggle('active');
        updateSelectedNote();
    });

    document.getElementById('italicBtn').addEventListener('click', () => {
        toolbarState.italic = !toolbarState.italic;
        document.getElementById('italicBtn').classList.toggle('active');
        updateSelectedNote();
    });

    document.getElementById('underlineBtn').addEventListener('click', () => {
        toolbarState.underline = !toolbarState.underline;
        document.getElementById('underlineBtn').classList.toggle('active');
        updateSelectedNote();
    });

    document.getElementById('colorPicker').addEventListener('change', (e) => {
        toolbarState.color = e.target.value;
        if (selectedNoteId) {
            const note = notes.find(n => n.id === selectedNoteId);
            if (note) {
                note.color = toolbarState.color;
                updateNoteElement(note);
                saveToLocalStorage();
            }
        }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', handleGlobalKeydown);
}

// Add New Note
function addNewNote() {
    const newNote = {
        id: Date.now(),
        content: '',
        color: toolbarState.color || '#FFF9C4',
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        size: { width: 300, height: 300 },
        fontFamily: 'sans-serif',
        fontSize: '14',
        lineHeight: '1.5',
        bold: false,
        italic: false,
        underline: false,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    renderNotes();
    selectNote(newNote.id);
    saveToLocalStorage();

    // Animate entrance
    setTimeout(() => {
        const noteElement = document.querySelector(`[data-id="${newNote.id}"]`);
        if (noteElement) {
            noteElement.classList.add('note-enter');
        }
    }, 0);
}

// Delete Note
function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    if (selectedNoteId === id) {
        selectedNoteId = null;
    }
    renderNotes();
    saveToLocalStorage();
}

// Select Note
function selectNote(id) {
    selectedNoteId = id;
    const note = notes.find(n => n.id === id);
    
    if (note) {
        // Update toolbar to match note styles
        document.getElementById('fontFamily').value = note.fontFamily;
        document.getElementById('fontSize').value = note.fontSize;
        document.getElementById('lineHeight').value = note.lineHeight;
        document.getElementById('colorPicker').value = note.color;

        // Update toolbar buttons
        document.getElementById('boldBtn').classList.toggle('active', note.bold);
        document.getElementById('italicBtn').classList.toggle('active', note.italic);
        document.getElementById('underlineBtn').classList.toggle('active', note.underline);

        // Update toolbar state
        toolbarState = { ...note };
    }

    // Update visual selection
    document.querySelectorAll('.sticky-note').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedElement = document.querySelector(`[data-id="${id}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

// Update Selected Note
function updateSelectedNote() {
    if (!selectedNoteId) return;

    const note = notes.find(n => n.id === selectedNoteId);
    if (note) {
        note.fontFamily = toolbarState.fontFamily;
        note.fontSize = toolbarState.fontSize;
        note.lineHeight = toolbarState.lineHeight;
        note.bold = toolbarState.bold;
        note.italic = toolbarState.italic;
        note.underline = toolbarState.underline;
        note.color = toolbarState.color;

        updateNoteElement(note);
        saveToLocalStorage();
    }
}

// Update Note Element
function updateNoteElement(note) {
    const noteElement = document.querySelector(`[data-id="${note.id}"]`);
    if (noteElement) {
        // Update color
        noteElement.style.backgroundColor = note.color;
        
        // Update textarea styling
        const textarea = noteElement.querySelector('.note-textarea');
        if (textarea) {
            textarea.style.fontFamily = note.fontFamily;
            textarea.style.fontSize = note.fontSize + 'px';
            textarea.style.lineHeight = note.lineHeight;
            
            // Update text formatting
            textarea.classList.toggle('bold', note.bold);
            textarea.classList.toggle('italic', note.italic);
            textarea.classList.toggle('underline', note.underline);
        }
    }
}

// Render Notes
function renderNotes() {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';

    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

// Create Note Element
function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'sticky-note';
    noteDiv.dataset.id = note.id;
    noteDiv.style.backgroundColor = note.color;
    noteDiv.style.left = note.position.x + '%';
    noteDiv.style.top = note.position.y + '%';
    noteDiv.style.width = note.size.width + 'px';
    noteDiv.style.height = note.size.height + 'px';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'note-header';

    const timestamp = document.createElement('span');
    timestamp.className = 'note-timestamp';
    timestamp.textContent = note.createdAt;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'note-actions';

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'note-action-btn';
    downloadBtn.innerHTML = '↓';
    downloadBtn.title = 'Download note';
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadNote(note);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'note-action-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Delete note';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteNote(note.id);
    });

    actionsDiv.appendChild(downloadBtn);
    actionsDiv.appendChild(deleteBtn);
    headerDiv.appendChild(timestamp);
    headerDiv.appendChild(actionsDiv);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const textarea = document.createElement('textarea');
    textarea.className = 'note-textarea';
    textarea.placeholder = 'Start typing...';
    textarea.value = note.content;
    textarea.style.fontFamily = note.fontFamily;
    textarea.style.fontSize = note.fontSize + 'px';
    textarea.style.lineHeight = note.lineHeight;
    textarea.classList.toggle('bold', note.bold);
    textarea.classList.toggle('italic', note.italic);
    textarea.classList.toggle('underline', note.underline);

    textarea.addEventListener('input', (e) => {
        note.content = e.target.value;
        saveToLocalStorage();
    });

    textarea.addEventListener('focus', () => {
        selectNote(note.id);
    });

    contentDiv.appendChild(textarea);

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'note-resize-handle';

    noteDiv.appendChild(headerDiv);
    noteDiv.appendChild(contentDiv);
    noteDiv.appendChild(resizeHandle);

    // Event listeners
    noteDiv.addEventListener('mousedown', (e) => handleNoteMouseDown(e, note));
    resizeHandle.addEventListener('mousedown', (e) => handleResizeStart(e, note));

    // Touch support
    noteDiv.addEventListener('touchstart', (e) => handleNoteTouchStart(e, note));
    resizeHandle.addEventListener('touchstart', (e) => handleResizeTouchStart(e, note));

    return noteDiv;
}

// Handle Note Mouse Down
function handleNoteMouseDown(e, note) {
    // Don't drag if clicking on textarea or buttons
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('.note-action-btn')) {
        selectNote(note.id);
        return;
    }

    selectNote(note.id);
    isDragging = true;

    const noteElement = document.querySelector(`[data-id="${note.id}"]`);
    noteElement.classList.add('dragging');

    dragOffset.x = e.clientX - noteElement.offsetLeft;
    dragOffset.y = e.clientY - noteElement.offsetTop;

    document.addEventListener('mousemove', handleNoteDrag);
    document.addEventListener('mouseup', handleNoteDragEnd);
}

// Handle Note Drag
function handleNoteDrag(e) {
    if (!isDragging || !selectedNoteId) return;

    const noteElement = document.querySelector(`[data-id="${selectedNoteId}"]`);
    if (!noteElement) return;

    const container = document.getElementById('notesContainer');
    const x = Math.max(0, Math.min(e.clientX - dragOffset.x, container.clientWidth - noteElement.offsetWidth));
    const y = Math.max(0, Math.min(e.clientY - dragOffset.y, container.clientHeight - noteElement.offsetHeight));

    noteElement.style.left = (x / container.clientWidth) * 100 + '%';
    noteElement.style.top = (y / container.clientHeight) * 100 + '%';

    const note = notes.find(n => n.id === selectedNoteId);
    if (note) {
        note.position.x = (x / container.clientWidth) * 100;
        note.position.y = (y / container.clientHeight) * 100;
    }
}

// Handle Note Drag End
function handleNoteDragEnd() {
    isDragging = false;
    const noteElement = document.querySelector(`[data-id="${selectedNoteId}"]`);
    if (noteElement) {
        noteElement.classList.remove('dragging');
    }
    saveToLocalStorage();

    document.removeEventListener('mousemove', handleNoteDrag);
    document.removeEventListener('mouseup', handleNoteDragEnd);
}

// Handle Resize Start
function handleResizeStart(e, note) {
    e.preventDefault();
    e.stopPropagation();

    isResizing = true;
    currentResizingNote = note;

    const noteElement = document.querySelector(`[data-id="${note.id}"]`);
    noteElement.classList.add('resizing');

    resizeStart.x = e.clientX;
    resizeStart.y = e.clientY;
    resizeStart.width = noteElement.offsetWidth;
    resizeStart.height = noteElement.offsetHeight;

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
}

// Handle Resize
function handleResize(e) {
    if (!isResizing || !currentResizingNote) return;

    const noteElement = document.querySelector(`[data-id="${currentResizingNote.id}"]`);
    if (!noteElement) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    const newWidth = Math.max(250, resizeStart.width + deltaX);
    const newHeight = Math.max(250, resizeStart.height + deltaY);

    noteElement.style.width = newWidth + 'px';
    noteElement.style.height = newHeight + 'px';

    currentResizingNote.size.width = newWidth;
    currentResizingNote.size.height = newHeight;
}

// Handle Resize End
function handleResizeEnd() {
    isResizing = false;

    if (currentResizingNote) {
        const noteElement = document.querySelector(`[data-id="${currentResizingNote.id}"]`);
        if (noteElement) {
            noteElement.classList.remove('resizing');
        }
    }

    saveToLocalStorage();

    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
}

// Touch Support
function handleNoteTouchStart(e, note) {
    if (e.target.tagName === 'TEXTAREA') return;

    selectNote(note.id);
    isDragging = true;

    const noteElement = document.querySelector(`[data-id="${note.id}"]`);
    noteElement.classList.add('dragging');

    const touch = e.touches[0];
    dragOffset.x = touch.clientX - noteElement.offsetLeft;
    dragOffset.y = touch.clientY - noteElement.offsetTop;

    document.addEventListener('touchmove', handleNoteTouchMove);
    document.addEventListener('touchend', handleNoteTouchEnd);
}

function handleNoteTouchMove(e) {
    if (!isDragging || !selectedNoteId) return;

    const noteElement = document.querySelector(`[data-id="${selectedNoteId}"]`);
    if (!noteElement) return;

    const touch = e.touches[0];
    const container = document.getElementById('notesContainer');
    const x = Math.max(0, Math.min(touch.clientX - dragOffset.x, container.clientWidth - noteElement.offsetWidth));
    const y = Math.max(0, Math.min(touch.clientY - dragOffset.y, container.clientHeight - noteElement.offsetHeight));

    noteElement.style.left = (x / container.clientWidth) * 100 + '%';
    noteElement.style.top = (y / container.clientHeight) * 100 + '%';

    const note = notes.find(n => n.id === selectedNoteId);
    if (note) {
        note.position.x = (x / container.clientWidth) * 100;
        note.position.y = (y / container.clientHeight) * 100;
    }
}

function handleNoteTouchEnd() {
    isDragging = false;
    const noteElement = document.querySelector(`[data-id="${selectedNoteId}"]`);
    if (noteElement) {
        noteElement.classList.remove('dragging');
    }
    saveToLocalStorage();

    document.removeEventListener('touchmove', handleNoteTouchMove);
    document.removeEventListener('touchend', handleNoteTouchEnd);
}

function handleResizeTouchStart(e, note) {
    e.preventDefault();
    e.stopPropagation();

    isResizing = true;
    currentResizingNote = note;

    const noteElement = document.querySelector(`[data-id="${note.id}"]`);
    noteElement.classList.add('resizing');

    const touch = e.touches[0];
    resizeStart.x = touch.clientX;
    resizeStart.y = touch.clientY;
    resizeStart.width = noteElement.offsetWidth;
    resizeStart.height = noteElement.offsetHeight;

    document.addEventListener('touchmove', handleResizeTouch);
    document.addEventListener('touchend', handleResizeTouchEnd);
}

function handleResizeTouch(e) {
    if (!isResizing || !currentResizingNote) return;

    const noteElement = document.querySelector(`[data-id="${currentResizingNote.id}"]`);
    if (!noteElement) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - resizeStart.x;
    const deltaY = touch.clientY - resizeStart.y;

    const newWidth = Math.max(250, resizeStart.width + deltaX);
    const newHeight = Math.max(250, resizeStart.height + deltaY);

    noteElement.style.width = newWidth + 'px';
    noteElement.style.height = newHeight + 'px';

    currentResizingNote.size.width = newWidth;
    currentResizingNote.size.height = newHeight;
}

function handleResizeTouchEnd() {
    isResizing = false;

    if (currentResizingNote) {
        const noteElement = document.querySelector(`[data-id="${currentResizingNote.id}"]`);
        if (noteElement) {
            noteElement.classList.remove('resizing');
        }
    }

    saveToLocalStorage();

    document.removeEventListener('touchmove', handleResizeTouch);
    document.removeEventListener('touchend', handleResizeTouchEnd);
}

// Global Keyboard Shortcuts
function handleGlobalKeydown(e) {
    if (!selectedNoteId) return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toolbarState.bold = !toolbarState.bold;
        document.getElementById('boldBtn').classList.toggle('active');
        updateSelectedNote();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        toolbarState.italic = !toolbarState.italic;
        document.getElementById('italicBtn').classList.toggle('active');
        updateSelectedNote();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        toolbarState.underline = !toolbarState.underline;
        document.getElementById('underlineBtn').classList.toggle('active');
        updateSelectedNote();
    }
}

// Download Note
function downloadNote(note) {
    const content = `${note.content}`;
    const filename = `note-${new Date().getTime()}.txt`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Download All Notes
function downloadAllNotes() {
    if (notes.length === 0) {
        alert('No notes to download!');
        return;
    }

    // Option to download as TXT or PDF
    const format = confirm('Download as TXT? (OK for TXT, Cancel for PDF)');

    if (format) {
        // Download as TXT
        let content = 'Sticky Notes Export\n';
        content += '='.repeat(50) + '\n\n';

        notes.forEach((note, index) => {
            content += `Note ${index + 1}\n`;
            content += `Created: ${note.createdAt}\n`;
            content += '-'.repeat(50) + '\n';
            content += note.content + '\n';
            content += '\n\n';
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', `notes-${new Date().getTime()}.txt`);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else {
        // Download as PDF
        const element = document.createElement('div');
        element.innerHTML = '<h1 style="margin-bottom: 20px;">Sticky Notes Export</h1>';

        notes.forEach((note, index) => {
            element.innerHTML += `<h2>Note ${index + 1}</h2>`;
            element.innerHTML += `<p><small>Created: ${note.createdAt}</small></p>`;
            element.innerHTML += `<p>${note.content.replace(/\n/g, '<br>')}</p>`;
            element.innerHTML += '<hr style="margin: 20px 0;">';
        });

        const opt = {
            margin: 10,
            filename: `notes-${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        window.html2pdf().set(opt).from(element).save();
    }
}

// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    localStorage.setItem('theme', html.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Apply Theme Preference
function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('stickyNotes');
    if (saved) {
        notes = JSON.parse(saved);
    }
}
