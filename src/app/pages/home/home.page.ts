import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Note } from 'src/app/interfaces/note';
import { NoteService } from 'src/app/services/notes.service';
import { MenuController, Events } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public notes: Observable<Note[]>
  private user: string;
  public userObj: Observable<Users[]>;

  constructor(
    public events: Events,
    private noteService: NoteService,
    private authService: AuthService,
    private menuCtrl: MenuController
  ) { }
  
  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.user = this.authService.getUserId();
    this.notes = this.noteService.getNotes(this.user);
    this.menuCtrl.enable(true);
  }
  
  logout() {
    this.notes = null;
    return this.authService.logout();
  }
  
}
