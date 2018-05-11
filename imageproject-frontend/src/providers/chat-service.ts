import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import {Socket} from "ng-socket-io";
import {Storage} from "@ionic/storage";

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
  thumbSrc?: string;
}

@Injectable()
export class ChatService {

  constructor(private http: HttpClient,
              private events: Events, private socket: Socket, private storage: Storage) {
    this.socket.on('newMessage', data => {
      console.log('oifoi')
      this.events.publish('chat:received', data, Date.now())
    })
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  getMsgList(toUserId) {
    return this.storage.get('chats')
      .then(result => {
        let index = result.findIndex(item => item.toUserId == toUserId)
        return result[index] && result[index].messages ? result[index].messages : []
      })
    // const msgListUrl = './assets/mock/msg-list.json';
    // return this.http.get<any>(msgListUrl)
    // .pipe(map(response => response.array));
  }

  async sendMsg(msg: ChatMessage, is_safe) {
    let api = await this.storage.get('api')
    this.socket.emit('sendMessage', {api: api,message:msg, is_safe: is_safe})
    return this.storage.get('chats')
      .then(result => {
        let index = result.findIndex(item => item.toUserId == msg.toUserId)
        if (result[index] && result[index].messages) {
          result[index].messages.push(msg)
        } else {
          result[index].messages = [msg]
        }
        this.storage.set('chats', result)
      })
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: '140000198202211138',
      name: 'Luff',
      avatar: './assets/user.jpg'
    };
    return new Promise(resolve => resolve(userInfo));
  }

  addMessageToList(msg) {
    return this.storage.get('chats')
      .then(result => {
        if (!result) result = []
        let index = result.findIndex(item => item.toUserId == msg.toUserId || item.toUserId == msg.userId)
        if (result[index] && result[index].messages) {
          result[index].messages.push(msg)
        } else if (result[index]) {
          result[index].messages = [msg]
        } else {
          result.push({
            toUserId: msg.userId,
            toUserName: msg.userName,
            photo: msg.userAvatar,
            message: msg.message,
            messages: [{
              time: Date.now(),
              userId: msg.userId,
              userName: msg.userName,
              toUserId: msg.toUserId,
              userAvatar: msg.userAvatar,
              message: msg.message
            }]
          })
        }
        this.storage.set('chats', result)
        return result
      })
  }

}
