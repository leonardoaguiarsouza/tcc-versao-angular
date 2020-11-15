import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ToastController, MenuController } from '@ionic/angular';
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
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.userLogin.email = null;
    this.userLogin.password = null;
  }

  async loginGoogle(){
    try {
      await this.authService.loginGoogle();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
    }
  }

  async loginFacebook(){
    try {
      await this.authService.loginFacebook();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
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
