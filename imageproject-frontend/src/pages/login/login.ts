import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController, Loading, ToastController} from 'ionic-angular';
import {tap} from "rxjs/operators";
import {TabsPage} from "../tabs/tabs";
import {Socket} from "ng-socket-io";
import {Storage} from "@ionic/storage";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};

  constructor(private storage: Storage,private socket: Socket, private toastCtrl: ToastController, private nav: NavController,  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.storage.get('login')
      .then(result => {
        if (result) {
          this.registerCredentials = result
        }
      })
  }


  public async login() {

    // let token = await this.fcm.getToken()
    this.showLoading()
    // this.registerCredentials['firebase_token'] = token
    // this.auth.login(this.registerCredentials).subscribe(allowed => {
    //     console.log(allowed)
    //     if (allowed) {
    //       this.fcm.listenToNotifications().pipe(
    //         tap(msg => {
    //           show a toast
              // const toast = this.toastCtrl.create({
              //   message: msg.body,
              //   duration: 3000
              // });
              // toast.present();
            // })
          // )
          //   .subscribe()
    this.socket.emit('login', this.registerCredentials)
    this.socket.on('successLogin', data => {
      this.storage.set('login', this.registerCredentials)
      this.storage.set('api', data.state)
      this.storage.set('user', data.user)
      this.nav.setRoot(TabsPage);
    })
      // .then(result => {
      //   console.log(result)
      // })
      // .catch(err => {
      //   console.log(err)
      // })
          // this.nav.setRoot(TabsPage);
        // } else {
        //   this.showError("Access Denied");
        // }
      // },
      // error => {
      //   this.showError(error);
      // });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    // alert.present('prompt');
  }
}
