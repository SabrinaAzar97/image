var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
var ChatMessage = /** @class */ (function () {
    function ChatMessage() {
    }
    return ChatMessage;
}());
export { ChatMessage };
var UserInfo = /** @class */ (function () {
    function UserInfo() {
    }
    return UserInfo;
}());
export { UserInfo };
var ChatService = /** @class */ (function () {
    function ChatService(http, events) {
        this.http = http;
        this.events = events;
    }
    ChatService.prototype.mockNewMsg = function (msg) {
        var _this = this;
        var mockMsg = {
            messageId: Date.now().toString(),
            userId: '210000198410281948',
            userName: 'Hancock',
            userAvatar: './assets/to-user.jpg',
            toUserId: '140000198202211138',
            time: Date.now(),
            message: msg.message,
            status: 'success'
        };
        setTimeout(function () {
            _this.events.publish('chat:received', mockMsg, Date.now());
        }, Math.random() * 1800);
    };
    ChatService.prototype.getMsgList = function () {
        var msgListUrl = './assets/mock/msg-list.json';
        return this.http.get(msgListUrl)
            .pipe(map(function (response) { return response.array; }));
    };
    ChatService.prototype.sendMsg = function (msg) {
        var _this = this;
        return new Promise(function (resolve) { return setTimeout(function () { return resolve(msg); }, Math.random() * 1000); })
            .then(function () { return _this.mockNewMsg(msg); });
    };
    ChatService.prototype.getUserInfo = function () {
        var userInfo = {
            id: '140000198202211138',
            name: 'Luff',
            avatar: './assets/user.jpg'
        };
        return new Promise(function (resolve) { return resolve(userInfo); });
    };
    ChatService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            Events])
    ], ChatService);
    return ChatService;
}());
export { ChatService };
//# sourceMappingURL=chat-service.js.map