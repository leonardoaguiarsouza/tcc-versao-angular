import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Note } from '../interfaces/note';
 
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes: Observable<Note[]>;
  private noteCollection: AngularFirestoreCollection<Note>;
 
  constructor( private afs: AngularFirestore, private authService: AuthService ) {
    this.noteCollection = this.afs.collection<Note>('notes');
    this.notes = this.noteCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getNotes(user: string): Observable<Note[]> {
    let noteCollection = this.afs.collection<Note>('notes', ref => ref.where('user', '==', user));
    let notes = noteCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return notes;
  }
 
  getNote(id: string): Observable<Note> {
    return this.noteCollection.doc<Note>(id).valueChanges().pipe(
      take(1),
      map(note => {
        note.id = id;
        return note
      })
    );
  }
 
  addNote(note: Note): Promise<DocumentReference> {
    note.user = this.authService.getUserId();
    return this.noteCollection.add(note);
  }
 
  updateNote(note: Note): Promise<void> {
    return this.noteCollection.doc(note.id).update({ title: note.title, content: note.content, lastModify: note.lastModify, active: note.active });
  }
 
  deleteNote(id: string): Promise<void> {
    return this.noteCollection.doc(id).delete();
  }
}