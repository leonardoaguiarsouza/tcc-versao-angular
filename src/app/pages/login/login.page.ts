import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController, Events, MenuController } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, {static: false}) slides: IonSlides;
  public userLogin: Users = {};
  public userRegister: Users = {};

  constructor(
    public loading: LoadingService,
    public toastCtrl: ToastController,
    private authService: AuthService,
    public events: Events,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  fieldsReset() {
    this.userLogin.email = '';
    this.userLogin.password = '';
  }

  async loginGoogle(){
    try {
      await this.authService.loginGoogle();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
    } finally {
      this.events.publish('user:loggedGF', this.authService.getAuth());
    }
  }

  async loginFacebook(){
    try {
      await this.authService.loginFacebook();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
    } finally {
      this.events.publish('user:loggedGF', this.authService.getAuth());
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      let message: string;
      console.log(error.code);
      
      switch(error.code){
        case 'auth/email-already-in-use':
          message = "E-mail já cadastrado!"
        break;

        case 'auth/invalid-email':
          message = "Verifique o e-mail digitado!"
        break;

        default:
          message = "Verifique se os dados foram preenchidos corretamente"
        break;
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss();
      this.fieldsReset();
      this.events.publish('user:loggedReg', this.authService.getAuth());
    }
  }

  async presentLoading() {
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color: "danger"
    });
    
    toast.present();
  }

}
