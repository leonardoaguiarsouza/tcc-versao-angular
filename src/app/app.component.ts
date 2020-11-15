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
    this.authService.getAuth().onAuthStateChanged(user=> {
      if(user) {
        this.menu.enable(true);
        this.userEmail = user.email;
        if(user.displayName) {
          this.userName = user.displayName;
        } else {
          this.userObj = this.userService.getUser(user.uid);
          this.userObj.forEach(element => {
            this.userName = element[0].name;
          });
        }
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
    this.userName = null;
    this.menu.close().then(() => {
      this.notes = null;
      this.userEmail = null;
      this.menu.enable(false).then(() => {
        this.authService.logout();
      });
    });
  }
}
