import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';

import * as icons from '../../constants/icons';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { convertYYYYMMDD } from '../../utilities/utility';
import { presentAlertConfirm } from '../../ion-components/alert';


interface NoteForDisplay extends Task {
  expanded: boolean;
  noteEditMode: boolean;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  backButtonIcon = icons.ionIcons.arrowBackOutline;
  addNoteIcon = icons.ionIcons.addOutline;
  editNoteIcon = icons.ionIcons.createOutline;
  deleteNoteIcon = icons.ionIcons.trashOutline;
  saveNoteIcon = icons.ionIcons.checkmarkOutline;
  loadedNotes: NoteForDisplay[] = [];
  notesSub: Subscription;
  newTaskCreatedDatetime = new Date();

  constructor(
    private taskService: TaskService,
    private datePipe: DatePipe,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.notesSub = this.taskService.notes
      .subscribe({
        next: (notes: NoteForDisplay[]) => {
          this.loadedNotes = notes.map((note, i) => {
            if (note.dueDateTime === this.newTaskCreatedDatetime) {
              note.expanded = true;
              note.noteEditMode = false;
            }
            else {
              note.expanded = false;
            }
            return note;
          });
        }
      });
  }

  ionViewWillEnter() {
    this.newTaskCreatedDatetime = new Date();
    this.loadNotes();
  }

  ionViewWillLeave() {
    this.savePendingChanges();
  }

  async loadNotes() {
    await this.taskService.getAllNotes();
  }

  toggleExpandItem(index) {
    if (this.loadedNotes[index].noteEditMode) {
      return;
    }
    if (!this.loadedNotes[index].expanded) {
      this.savePendingChanges();
    }
    this.loadedNotes[index].expanded = !this.loadedNotes[index].expanded;
  }

  toggleNoteEditMode(index) {
    this.loadedNotes[index].noteEditMode = !this.loadedNotes[index].noteEditMode;
  }

  async saveNote(index) {
    this.loadedNotes[index].noteEditMode = false;
    const noteToUpdate = { ...this.loadedNotes[index] }
    noteToUpdate.detail.lastUpdated = new Date();
    delete noteToUpdate.expanded;
    delete noteToUpdate.noteEditMode;
    await this.taskService.updateNote(noteToUpdate);
  }

  async createNewNote() {
    await this.savePendingChanges();
    const noteToAdd: Task = {
      id: -1,
      name: this.datePipe.transform(new Date(), 'MMM dd, yyyy'),
      remarks: '',
      done: false,
      dueDateTime: new Date(),
      dueDate: +convertYYYYMMDD(new Date()),
      list: 'Personal',
      repeat: '',
      repeating: 'false',
      refTaskId: -888,
      type: 'note',
      detail: {
        noteText: '',
        lastUpdated: new Date()
      }
    };
    this.newTaskCreatedDatetime = noteToAdd.dueDateTime;
    await this.taskService.addNewNote(noteToAdd);
  }

  async savePendingChanges() {
    for (const [i, note] of this.loadedNotes.entries()) {
      if (note.noteEditMode) {
        await this.saveNote(i);
      }
      note.expanded = false;
    }
  }

  async onDeleteNote(noteId) {
    const confirm = await presentAlertConfirm(this.alertController, 'Are you sure you want to delete the note?',
      'Are you sure?', 'Cancel', 'Okay', null, []);
    if (confirm.result) {
      await this.taskService.deleteNote(noteId);
    }
  }

}
