import { Injectable } from '@angular/core';
import { Users } from '../interfaces/users';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: Observable<Users[]>;
  private usersCollection: AngularFirestoreCollection<Users>;
 
  constructor( private afs: AngularFirestore, private authService: AuthService ) {
    this.usersCollection = this.afs.collection<Users>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getUser(id: string): Observable<Users[]> {
    let userCollection = this.afs.collection<Users>('users', ref => ref.where('id', '==', id));
    let user = userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return user;
  }
 
  createUser(user: Users): Promise<DocumentReference> {
    user.id = this.authService.getUserId();
    return this.usersCollection.add(user);
  }
 
  // updateUser(user: Users): Promise<void> {
  //   return this.usersCollection.doc(user.id).update({ title: user.title, content: user.content, lastModify: user.lastModify, active: user.active, interval: note.interval });
  // }
 
  deleteUser(id: string): Promise<void> {
    return this.usersCollection.doc(id).delete();
  }
}