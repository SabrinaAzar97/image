import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatService } from "../../providers/chat-service";
import { RelativeTime } from "../../pipes/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji";
import {SocketIoModule} from "ng-socket-io";
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    Chat,
    RelativeTime
  ],
  imports: [
    EmojiPickerComponentModule,
    SocketIoModule,
    IonicStorageModule,
    IonicPageModule.forChild(Chat),
  ],
  exports: [
    Chat
  ],
  providers: [
    ChatService,
    EmojiProvider,

  ]
})
export class ChatModule {
}
