import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ChatBoxComponent } from './chat-box/chat-box.component';

import { FormsModule } from '@angular/forms';
import { DummyComponent } from './dummy/dummy.component';
import { StartChatComponent } from './start-chat/start-chat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'chat', component:ChatBoxComponent},
      {path :'chatRoom/:name',component:StartChatComponent}
    ])
  ],
  declarations: [ChatBoxComponent, DummyComponent, StartChatComponent]
})
export class ChatModule { }
