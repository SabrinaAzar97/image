import {Component} from '@angular/core';
import {AlertController, IonicPage} from 'ionic-angular';
import {Socket} from "ng-socket-io";
import {Storage} from "@ionic/storage";
import {ChatModel} from "../../models/chat-model";
import {ChatService, UserInfo} from "../../providers/chat-service";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  toUser: { toUserId: string, toUserName: string };
  chats: Array<ChatModel> = []
  user: UserInfo

  constructor(private socket: Socket, private alertCtrl: AlertController, private storage: Storage, private chatService: ChatService) {
    this.toUser = {
      toUserId: '210000198410281948',
      toUserName: 'Hancock'
    }
    this.storage.get('user')
      .then(result => {
        this.user = result
      })

    this.storage.get('chats')
      .then(result => {
        this.chats = result ? result : []
        console.log(this.chats)
      })

    this.socket.on('newConversationSuccessful', data => {
      console.log(data)
      this.chats.push({
        toUserId: data.user.userID,
        toUserName: data.user.name,
        photo: data.user.photoUrl,
        message: data.message,
        messages: [{
          time: Date.now(),
          userId: this.user.id,
          userName: this.user.name,
          toUserId: this.user.id,
          userAvatar: this.user.thumbSrc,
          message: data.message
        }]
      })
      this.storage.set('chats', this.chats)
    })



  }

  ionViewDidEnter() {
    console.log('home view entered')
    this.storage.get('chats')
      .then(result => {
        this.chats = result ? result : []
        console.log(this.chats)
      })
    this.socket.on('newMessage', data => {
      data['toUserId'] = this.user.id
      // data['userName'] = data.userName
      // data['userAvatar'] = data.userAvatar
      data['time'] = Date.now()
      console.log(data)
      this.chatService.addMessageToList(data)
        .then(res => {
          this.chats = res
        })
      // this.storage.get('chats')
      //   .then(result => {
      //     this.chats = result
      //   })
    })
  }

  ionViewWillLeave() {
    console.log('home view left')
    this.socket.removeListener('newMessage')
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Send New Message',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'body',
          placeholder: 'Message',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            if (data.username && data.body) {
              this.storage.get('api')
                .then(result => {
                  data['avatar'] = this.user.thumbSrc
                  this.socket.emit('newConversation', {api: result, data: data})
                })
            }
          }
        }
      ]
    });
    alert.present();
  }


}
