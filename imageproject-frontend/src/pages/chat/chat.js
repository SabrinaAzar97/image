var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';
import { ChatService } from "../../providers/chat-service";
import * as login from 'facebook-chat-api';
var Chat = /** @class */ (function () {
    function Chat(navParams, chatService, events) {
        var _this = this;
        this.chatService = chatService;
        this.events = events;
        this.msgList = [];
        this.editorMsg = '';
        this.showEmojiPicker = false;
        // Get the navParams toUserId parameter
        console.log(login);
        this.toUser = {
            id: navParams.get('toUserId'),
            name: navParams.get('toUserName')
        };
        // Get mock user information
        this.chatService.getUserInfo()
            .then(function (res) {
            _this.user = res;
        });
    }
    Chat.prototype.ionViewWillLeave = function () {
        // unsubscribe
        this.events.unsubscribe('chat:received');
    };
    Chat.prototype.ionViewDidEnter = function () {
        var _this = this;
        //get message list
        this.getMsg();
        // Subscribe to received  new message events
        this.events.subscribe('chat:received', function (msg) {
            _this.pushNewMsg(msg);
        });
    };
    Chat.prototype.onFocus = function () {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
    };
    Chat.prototype.switchEmojiPicker = function () {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.focus();
        }
        else {
            this.setTextareaScroll();
        }
        this.content.resize();
        this.scrollToBottom();
    };
    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    Chat.prototype.getMsg = function () {
        var _this = this;
        // Get mock message list
        return this.chatService
            .getMsgList()
            .subscribe(function (res) {
            _this.msgList = res;
            _this.scrollToBottom();
        });
    };
    /**
     * @name sendMsg
     */
    Chat.prototype.sendMsg = function () {
        var _this = this;
        if (!this.editorMsg.trim())
            return;
        // Mock message
        var id = Date.now().toString();
        var newMsg = {
            messageId: Date.now().toString(),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
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
        this.chatService.sendMsg(newMsg)
            .then(function () {
            var index = _this.getMsgIndexById(id);
            if (index !== -1) {
                _this.msgList[index].status = 'success';
            }
        });
    };
    /**
     * @name pushNewMsg
     * @param msg
     */
    Chat.prototype.pushNewMsg = function (msg) {
        var userId = this.user.id, toUserId = this.toUser.id;
        // Verify user relationships
        if (msg.userId === userId && msg.toUserId === toUserId) {
            this.msgList.push(msg);
        }
        else if (msg.toUserId === userId && msg.userId === toUserId) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    };
    Chat.prototype.getMsgIndexById = function (id) {
        return this.msgList.findIndex(function (e) { return e.messageId === id; });
    };
    Chat.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.content.scrollToBottom) {
                _this.content.scrollToBottom();
            }
        }, 400);
    };
    Chat.prototype.focus = function () {
        if (this.messageInput && this.messageInput.nativeElement) {
            this.messageInput.nativeElement.focus();
        }
    };
    Chat.prototype.setTextareaScroll = function () {
        var textarea = this.messageInput.nativeElement;
        textarea.scrollTop = textarea.scrollHeight;
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], Chat.prototype, "content", void 0);
    __decorate([
        ViewChild('chat_input'),
        __metadata("design:type", ElementRef)
    ], Chat.prototype, "messageInput", void 0);
    Chat = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
        }),
        __metadata("design:paramtypes", [NavParams,
            ChatService,
            Events])
    ], Chat);
    return Chat;
}());
export { Chat };
//# sourceMappingURL=chat.js.map