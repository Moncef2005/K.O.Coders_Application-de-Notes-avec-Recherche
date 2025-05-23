class NotesApp {
    constructor() {
        // charger les notes depuis localeStorage
        this.notes = this.loadNotes();
        this.editId = null;

        // recupère les element du DOM dont on a besoin
        this.noteTitle = document.getElementById('noteTitle');
        this.noteContent = document.getElementById('noteContent');
        this.saveNoteBtn = document.getElementById('saveNote');
        this.clearFormBtn = document.getElementById('clearForm');
        this.searchInput = document.getElementById('searchInput');
        this.dateFilter = document.getElementById('dateFilter');
        this.notesList = document.getElementById('notesList');
        this.editIdInput = document.getElementById('editId');
        
        // inisializer le DOM pour la suppression
        this.deleteModal = document.getElementById('deleteModal');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        
        // inisializer le DOM pour la modification
        this.modifyModal = document.getElementById('modifyModal');
        this.confirmModifyBtn = document.getElementById('confirmModifyBtn');
        this.cancelModifyBtn = document.getElementById('cancelModifyBtn');
        
        this.successMessage = document.getElementById('successMessage');
        this.pendingDeleteId = null;
        this.pendingModifyData = null;

        // Vérification des éléments DOM
        if (!this.notesList) {
            alert("Erreur: L'élément notesList n'existe pas dans le DOM");
            return;
        }
        if (!this.saveNoteBtn) {
            alert("Erreur: L'élément saveNoteBtn n'existe pas dans le DOM");
            return;
        }
        if (!this.clearFormBtn) {
            alert("Erreur: L'élément clearFormBtn n'existe pas dans le DOM");
            return;
        }
        if (!this.noteTitle || !this.noteContent || !this.editIdInput) {
            alert("Erreur: Un ou plusieurs éléments de formulaire (noteTitle, noteContent, editIdInput) sont manquants");
            return;
        }
        if (!this.successMessage) {
            alert("Erreur: L'élément successMessage n'existe pas dans le DOM");
            return;
        }
        if (!this.deleteModal || !this.confirmDeleteBtn || !this.cancelDeleteBtn) {
            alert("Erreur: Un ou plusieurs éléments du modal de suppression sont manquants");
            return;
        }
        if (!this.modifyModal || !this.confirmModifyBtn || !this.cancelModifyBtn) {
            alert("Erreur: Un ou plusieurs éléments du modal de modification sont manquants");
            return;
        }

        // configue les actions pour chaque interaction utilisateur
        this.saveNoteBtn.addEventListener('click', () => this.saveNote()); // sauvegarder
        this.clearFormBtn.addEventListener('click', () => this.clearForm()); // effacement
        this.searchInput.addEventListener('input', () => this.renderNotes()); // recherche
        this.dateFilter.addEventListener('change', () => this.renderNotes()); // filtre les dates
        
        // lier les evenment de button pour la suppression
        this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.cancelDeleteBtn.addEventListener('click', () => this.closeModal());
        
        // lier les evenment de button pour la modification
        this.confirmModifyBtn.addEventListener('click', () => this.confirmModify());
        this.cancelModifyBtn.addEventListener('click', () => this.closeModifyModal());
        
        // affiche les notes au démarrage 
        this.renderNotes();
    }

    // recupere les notes depuis local storage
    loadNotes() {
        return JSON.parse(localStorage.getItem('notes')) || [];
    }

    // sauvegarder les notes dans le localstorage 
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes)); // convertir en json
    }

    // afficher un message de succès temporaire
    showSuccessMessage(message) {
        this.successMessage.textContent = message;
        this.successMessage.style.display = 'block';
        this.successMessage.classList.add('show');
        setTimeout(() => {
            this.successMessage.classList.remove('show');
            setTimeout(() => {
                this.successMessage.style.display = 'none';
            }, 300); // Correspond à la durée de la transition CSS
        }, 3000); // Affiche le message pendant 3 secondes
    }

    // sauvegarder une note 
    saveNote() {
        // recupere les valeurs des champs 
        const title = this.noteTitle.value.trim();
        const content = this.noteContent.value.trim();

        // validation minimale 
        if (!title || !content) {
            alert('Veuillez remplir le titre et le contenu.');
            return;
        }

        if (this.editIdInput.value) {
            // Préparer les données pour la modification
            this.pendingModifyData = {
                id: this.editIdInput.value,
                title,
                content
            };
            // Afficher le modal de confirmation pour la modification
            this.showModifyConfirmModal();
        } else {
            // nouvelle note 
            const newNote = {
                id: Date.now().toString(), // id unique 
                title,
                content,
                createdAt: new Date().toISOString(), // date de creation
                updatedAt: new Date().toISOString() // date modification
            };
            this.notes.push(newNote);
            this.saveNotes();
            this.showSuccessMessage('Note ajoutée avec succès !');
            if (typeof this.clearForm === 'function') {
                this.clearForm();
            } else {
                alert('Erreur: clearForm n\'est pas une fonction');
            }
            this.renderNotes();
        }
    }

    // efface le formulaire
    clearForm() {
        if (this.noteTitle && this.noteContent && this.editIdInput) {
            this.noteTitle.value = '';
            this.noteContent.value = '';
            this.editIdInput.value = '';
        } else {
            alert('Erreur: Un ou plusieurs éléments de formulaire sont manquants pour clearForm');
        }
    }

    // remplit le formulaire avec une note existante 
    editNote(id) {
        const note = this.notes.find(note => note.id === id); // trouver la note 
        if (note) {
            this.noteTitle.value = note.title; // remplit le titre
            this.noteContent.value = note.content; // remplit le contenu
            this.editIdInput.value = id; // stocke l'Id
        } else {
            alert('Erreur: Note à éditer non trouvée.');
        }
    }

    // affiche la boite de confirmation
    deleteNote(id) {
        this.pendingDeleteId = id; 
        this.deleteModal.style.display = 'flex'; 
    }

    // confirmation de la supression
    confirmDelete() {
        if (this.pendingDeleteId) {
            this.notes = this.notes.filter(note => note.id !== this.pendingDeleteId);
            this.saveNotes();
            this.renderNotes();
            this.showSuccessMessage('Note supprimée avec succès !');
            this.closeModal();
        }
    }

    closeModal() {
        this.deleteModal.style.display = 'none';
        this.pendingDeleteId = null;
    }

    // affiche la boite de confirmation
    showModifyConfirmModal() {
        this.modifyModal.style.display = 'flex'; // Show the modal
    }

    // Confirmation de la modification
    confirmModify() {
        if (this.pendingModifyData) {
            const index = this.notes.findIndex(note => note.id === this.pendingModifyData.id);
            if (index !== -1) {
                this.notes[index] = {
                    ...this.notes[index],
                    title: this.pendingModifyData.title,
                    content: this.pendingModifyData.content,
                    updatedAt: new Date().toISOString()
                };
                this.saveNotes();
                this.renderNotes();
                this.showSuccessMessage('Note modifiée avec succès !');
                this.clearForm();
                this.closeModifyModal();
            } else {
                alert('Erreur: Note à modifier non trouvée.');
                this.closeModifyModal();
            }
        }
    }
    closeModifyModal() {
        this.modifyModal.style.display = 'none';
        this.pendingModifyData = null;
    }

    // filtrer les notes selon la recherche
    filterNotes() {
        let filteredNotes = [...this.notes]; // copier le tableau
        const searchTerm = this.searchInput.value.toLowerCase();
        const dateFilter = this.dateFilter.value;

        // filtre par contenu
        if (searchTerm) {
            filteredNotes = filteredNotes.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm)
            );
        }

        // filtre par date
        const now = new Date();
        if (dateFilter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            filteredNotes = filteredNotes.filter(note =>
                new Date(note.updatedAt) >= weekAgo
            );
        } else if (dateFilter === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            filteredNotes = filteredNotes.filter(note =>
                new Date(note.updatedAt) >= monthAgo
            );
        }
        // trie par date
        return filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // affiche les notes dans le DOM
    renderNotes() {
        if (!this.notesList) {
            alert("Erreur: L'élément notesList n'est pas trouvé dans le DOM");
            return;
        }
        const filteredNotes = this.filterNotes();
        this.notesList.innerHTML = ''; // vide la liste
        // cree une carte pour chaque note 
        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card note-item';
            noteCard.innerHTML = `
                <h3 class="note-title">${note.title}</h3>
                <p class="note-content">${note.content}</p>
                <p class="note-date">
                    Modifié le: ${new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                </p>
                <div class="button-group">
                    <button 
                        class="edit-btn edit-button"
                        data-id="${note.id}"
                    >
                        Modifier
                    </button>
                    <button 
                        class="delete-btn delete-button"
                        data-id="${note.id}"
                    >
                        Supprimer
                    </button>
                </div>
            `;
            this.notesList.appendChild(noteCard);
        });

        // ajouter les événements aux nouveaux boutons 
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.removeEventListener('click', this.editNote); // Supprimer les anciens écouteurs
            btn.addEventListener('click', () => this.editNote(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.removeEventListener('click', this.deleteNote); // Supprimer les anciens écouteurs
            btn.addEventListener('click', () => this.deleteNote(btn.dataset.id));
        });
    }
}

// lance l'application
new NotesApp();


