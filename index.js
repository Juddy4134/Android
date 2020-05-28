class Note {
	constructor (id = null, content = '') {
		const instance = this;
		const element = this.element = document.createElement('div');
		element.classList.add('note');
		element.setAttribute('draggable', 'true');
		element.textContent = content;
		element.addEventListener('dblclick', function (event) {
			element.setAttribute('contenteditable', 'true');
			element.removeAttribute('draggable');
			instance.column.removeAttribute('draggable');
			element.focus()
		});

		element.addEventListener('blur', function (event) {
			element.removeAttribute('contenteditable');
			element.setAttribute('draggable', 'true');
			instance.column.setAttribute('draggable', 'true');
			if (!element.textContent.trim().length) {
				element.remove();
			}
		});

		element.addEventListener('dragstart', this.dragstart.bind(this));
		element.addEventListener('dragend', this.dragend.bind(this));
		element.addEventListener('dragenter', this.dragenter.bind(this));
		element.addEventListener('dragover', this.dragover.bind(this));
		element.addEventListener('dragleave', this.dragleave.bind(this));
		element.addEventListener('drop', this.drop.bind(this))
	}

	get column () {
		return this.element.closest('.column');
	}

	dragstart (event) {
		Note.dragged = this.element;
		this.element.classList.add('dragged');
		event.stopPropagation();
	}

	dragend (event) {
		event.stopPropagation();
		Note.dragged = null;
		this.element.classList.remove('dragged');
		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'));
	}

	dragenter (event) {
		event.stopPropagation();
		if (Note.dragged || !(this.element === Note.dragged)) {
			this.element.classList.add('under');
		}
	}

	dragover (event) {
		event.preventDefault();
		event.stopPropagation();
	}

	dragleave (event) {
		event.stopPropagation();
		if (Note.dragged || !(this.element === Note.dragged)) {
			this.element.classList.remove('under');
		}
	}

	drop (event) {
		event.stopPropagation();
		if (!Note.dragged || this.element === Note.dragged) {
			return;
		}
		if (this.element.parentElement === Note.dragged.parentElement) {
			const note = Array.from(this.element.parentElement.querySelectorAll('.note'));
			const indexA = note.indexOf(this.element);
			const indexB = note.indexOf(Note.dragged);
			if (indexA < indexB) {
				this.element.parentElement.insertBefore(Note.dragged, this.element);
			} else {
				this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling);
			}
		} else {
			this.element.parentElement.insertBefore(Note.dragged, this.element);
		}
	}
}

Note.dragged = null;

class Column {
	constructor (id = null) {
		const instance = this;
		this.notes = [];
		const element = this.element = document.createElement('div');
		element.classList.add('column');
		element.setAttribute('draggable', 'true');
		if (id) {
			element.setAttribute('data-column-id', id);
		}
		else {
			element.setAttribute('data-column-id', Column.idCounter);
			Column.idCounter++;
		}
		element.innerHTML =
			`<p class="column-header">To do<span class="column-sort">Sort to a-z</span></p>
<div data-notes></div>
<p class="column-footer">
	<span data-action-addNote class="action">+ Добавить карточку</span>
</p>`;

		const spanAction_addNote = element.querySelector('[data-action-addNote]');
		spanAction_addNote.addEventListener('click', function (event) {
			const note = new Note;
			instance.add(note);

			note.element.setAttribute('contenteditable', 'true');
			note.element.focus()
		});
		const headerElement = element.querySelector('.column-header');
		headerElement.addEventListener('dblclick', function (event) {
			headerElement.setAttribute('contenteditable', true);
			headerElement.focus()
		});
		headerElement.addEventListener('blur', function (event) {
			headerElement.removeAttribute('contenteditable', true)
		});
		element.addEventListener("click", this.sortNotes.bind(this));
		element.addEventListener('dragstart', this.dragstart.bind(this));
		element.addEventListener('dragend', this.dragend.bind(this));
		element.addEventListener('dragover', this.dragover.bind(this));
		element.addEventListener('drop', this.drop.bind(this));
	}

	add (...notes) {
		for (const note of notes) {
			if (!this.notes.includes(note)) {
				this.notes.push(note);
				this.element.querySelector('[data-notes]').append(note.element);
			}
		}
	}

	sortNotes(event){
		if (event.target.classList.contains("column-sort")) {
			let list = Array.from(this.element.querySelectorAll(".note"));
			list.sort((first,second)=>first.textContent>second.textContent ? 1 : -1)
				.map(node=>this.element.querySelector("[data-notes]").appendChild(node))
		}
	}

	dragstart (event) {
		Column.dragged = this.element;
		Column.dragged.classList.add('dragged');
		event.stopPropagation();
		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.removeAttribute('draggable'));
	}

	dragend (event) {
		Column.dragged.classList.remove('dragged');
		Column.dragged = null;
		Column.dropped = null;
		document
			.querySelectorAll('.note')
			.forEach(noteElement => noteElement.setAttribute('draggable', true));
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'));

	}

	dragover (event) {
		event.preventDefault();
		event.stopPropagation();
		if (Column.dragged === this.element) {
			if (Column.dropped) {
				Column.dropped.classList.remove('under');
			}
			Column.dropped = null;
		}
		if (!Column.dragged || Column.dragged === this.element) {
			return;
		}
		Column.dropped = this.element;
		document
			.querySelectorAll('.column')
			.forEach(columnElement => columnElement.classList.remove('under'));
		this.element.classList.add('under');
	}

	drop () {
		if (Note.dragged) {
			return this.element.querySelector('[data-notes]').append(Note.dragged);
		} else if (Column.dragged) {
			const children = Array.from(document.querySelector('.columns').children);
			const indexA = children.indexOf(this.element);
			const indexB = children.indexOf(Column.dragged);
			if (indexA < indexB) {
				document.querySelector('.columns').insertBefore(Column.dragged, this.element);
			} else {
				document.querySelector('.columns').insertBefore(Column.dragged, this.element.nextElementSibling);
			}
			document
				.querySelectorAll('.column')
				.forEach(columnElement => columnElement.classList.remove('under'));
		}
	}
}

Column.dragged = null;
Column.dropped = null;

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		const column = new Column;
		document.querySelector('.columns').append(column.element);
	});