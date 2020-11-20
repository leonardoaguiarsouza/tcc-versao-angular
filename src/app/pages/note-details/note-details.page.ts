import { Note } from 'src/app/interfaces/note';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from 'src/app/services/notes.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.page.html',
  styleUrls: ['./note-details.page.scss'],
})
export class NoteDetailsPage implements OnInit {

  note: Note = {
    title: '',
    content: '',
    active: false,
    lastModify: null
  }

  constructor( 
      private acticatedRoute: ActivatedRoute,
      private authService: AuthService,
      private noteService: NoteService,
      private toastCtrl: ToastController,
      private router: Router 
    ) { }

  ngOnInit() {
    let id = this.acticatedRoute.snapshot.paramMap.get('id');

    if(id) {
      this.noteService.getNote(id).subscribe(note => {
        if(note.user != this.authService.getUserId()) {
          this.router.navigateByUrl('/home');
          this.showRedToast('Sem permissão para acessar essa nota');
          return;
        }

        this.note = note;
      })
    }
  }

  addNote() {
    this.note.createdAt = new Date();
    this.note.lastModify = new Date();
    this.noteService.addNote(this.note).then(() => {
      this.router.navigateByUrl('/home');
      this.showToast('Nota criada');
    }, err => {
      this.showToast('Houve um problema :(');
    });
  }
 
  deleteNote() {
    this.noteService.deleteNote(this.note.id).then(() => {
      this.router.navigateByUrl('/home');
      this.showToast('Nota excluída');
    }, err => {
      this.showToast('Ouve um problema :(');
    });
  }
 
  updateNote() {
    this.note.lastModify = new Date();
    this.noteService.updateNote(this.note).then(() => {
      this.router.navigateByUrl('/home');
      this.showToast('Nota atualizada');
    }, err => {
      this.showToast('Ouve um problema :(');
    });
  }

  showToast(message) {
    this.toastCtrl.create({
      message,
      duration: 2000
    }).then(toast => toast.present());
  }

  showRedToast(message) {
    this.toastCtrl.create({
      message,
      duration: 2000,
      color: "danger"
    }).then(toast => toast.present());
  }

}
