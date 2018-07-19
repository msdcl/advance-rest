import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatBoxComponent } from '../chat/chat-box/chat-box.component';
import { ChatModule } from '../chat/chat.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChatModule,
    RouterModule.forChild([
      {path:'signUp', component:SignupComponent},
      {path:'chat',component:ChatBoxComponent}
    ])
  ],
  declarations: [SignupComponent, LoginComponent]
})
export class UserModule { }
