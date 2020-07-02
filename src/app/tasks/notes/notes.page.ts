import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';

import * as icons from '../../constants/icons';
import { Task } from '../../models/task';
import { TaskService } from 'src/app/services/task.service';
import { Subscription } from 'rxjs';
import { convertYYYYMMDD } from 'src/app/utilities/utility';

interface  NoteForDisplay extends Task {
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
  loadedNotes: NoteForDisplay[] = [];
  notesSub: Subscription;

  constructor(
    private taskService: TaskService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.notesSub = this.taskService.notes
      .subscribe({
        next: (notes: NoteForDisplay[]) => {
          this.loadedNotes = notes.map((note) => {
            note.expanded = false;
            return note;
          });
        }
      });
  }

  ionViewWillEnter() {
    this.loadNotes();
  }

  async loadNotes() {
    await this.taskService.getAllNotes();
  }

  toggleExpandItem(index) {
    if(this.loadedNotes[index].noteEditMode) {
      return;
    }
    this.loadedNotes[index].expanded = !this.loadedNotes[index].expanded
    if(!this.loadedNotes[index].expanded) {
      this.loadedNotes[index].noteEditMode = false;
    }
  }

  toggleNoteEditMode(index) {
    this.loadedNotes[index].noteEditMode = !this.loadedNotes[index].noteEditMode;
  }

  async createNewNote() {
    const note: Task = {
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
        noteText:'',
        lastUpdated: new Date()
      }
    };
    await this.taskService.addNewNote(note);
  }

}
