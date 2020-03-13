import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from './../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Users } from 'src/app/interfaces/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public userRegister: Users = {};

constructor(public loading: LoadingService, public toastCtrl: ToastController, private authService: AuthService) { }

  ngOnInit() {
  }

  loginGoogle(){
    try {
      this.authService.loginGoogle();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
    } 
  }

  loginFacebook(){
    try {
      this.authService.loginFacebook();
    } catch (error) {
      console.log(error);
      this.presentToast(error.message);
    } 
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      console.log(error);
      let message: string;
      
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
