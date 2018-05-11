import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import {Storage} from "@ionic/storage";
import {Socket} from "ng-socket-io";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  safe = false

  constructor(navParams: NavParams,
              private chatService: ChatService,
              private events: Events, private storage: Storage, private socket: Socket) {
    // Get the navParams toUserId parameter

    this.toUser = {
      id: navParams.get('toUserId'),
      name: navParams.get('toUserName'),
      avatar: navParams.get('photo')
    };
    // Get mock user information
    this.storage.get('user')
      .then(result => {
        console.log(result)
        this.user = result
      })


  }


  ionViewWillLeave() {
    // unsubscribe
    this.socket.removeListener('newMessage')
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe('chat:received', msg => {
      console.log('event shot')
      this.pushNewMsg(msg);
    })
    this.socket.on('newMessage', data => {
      this.chatService.addMessageToList(data)
        .then(res => {
          data['toUserId'] = this.user.id
          data['userName'] = this.toUser.name
          data['userAvatar'] = this.toUser.avatar
          data['time'] = Date.now()
          if (data.userId == this.toUser.id) {
            this.pushNewMsg(data)
          }
        })

    })
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService
    .getMsgList(this.toUser.id)
    .then(res => {
      this.msgList = res;
      this.scrollToBottom();
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = Date.now().toString();
    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.user.id,
      userName: this.user.name,
      userAvatar: this.user.thumbSrc,
      toUserId: this.toUser.id,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.chatService.sendMsg(newMsg, this.safe)
    .then(() => {
      let index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    })
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    console.log(msg.userId,userId,toUserId)
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      console.log('intofirstif')
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      console.log('intoseondif')
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}
