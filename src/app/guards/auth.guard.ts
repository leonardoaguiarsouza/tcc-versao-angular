import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Events } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor (
    private authService: AuthService,
    private router: Router,
    public events: Events,
  ) { }
  
  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.authService.getAuth().onAuthStateChanged(user=> {
        this.events.publish('user:logged', this.authService.getAuth());
        if(!user) this.router.navigate(['login']);
          resolve(user ? true : false)
      })
    })
  }
}
