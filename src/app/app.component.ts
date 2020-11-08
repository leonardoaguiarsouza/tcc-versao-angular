import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { Note } from './interfaces/note';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Users } from './interfaces/users';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public notes: Observable<Note[]>
  public userName: string = null;
  public userEmail: string = null;
  public userObj: Observable<Users[]>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private userService: UserService,
    private menu: MenuController,
    public events: Events
  ) {
    this.initializeApp();
    events.subscribe('user:loggedGF', (auth) => {
      if (this.userEmail == null && this.userName == null) {
        this.userEmail = auth.currentUser.email;
        this.userName = auth.currentUser.displayName;
      }
    });

    events.subscribe('user:loggedReg', (auth) => {
      if (this.userEmail == null && this.userName == null) {
        this.userEmail = auth.currentUser.email;
        this.userObj = this.userService.getUser(auth.currentUser.uid);
        this.userObj.forEach(element => {
          this.userName = element[0].name;
        });
      }
    });
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  logout() {
    this.notes = null;
    this.userEmail = null;
    this.userName = null;
    this.menu.close();
    this.menu.enable(false);
    return this.authService.logout();
  }
}
