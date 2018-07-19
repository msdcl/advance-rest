import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { ActivatedRoute, Route ,ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-start-chat',
  templateUrl: './start-chat.component.html',
  styleUrls: ['./start-chat.component.css']
})
export class StartChatComponent implements OnInit {

  public currentChatRoom:any;
  public allUsers:any=[]
  public nickName;
  public messageText;
  public userInfo
  public messageList:any=[]
  public loadingPreviousChat:boolean=false;
  public pageValue:number=0

  constructor(public socket:SocketService,public http:HttpService,
    public activatedRoute:ActivatedRoute,
    public locaton:Location,
    public toastr:ToastrService,  public router:Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.currentChatRoom = params.get('name');
  });
  this.userInfo = this.http.getUserInfoFromLocalStorage();
  this.nickName = Cookie.get('nickName');
  //this.socket.joinAChatRoom(this.nickName,this.currentChatRoom);
  this.socket.existingUsersInAChatRoom(this.currentChatRoom)
  this.allUserInParticularChatRoom()
  this.socket.chatByChatRoom(this.currentChatRoom)
 // this.getMessageFromAUser();
  }

  public allUserInParticularChatRoom :any =()=>{
    console.log("get user list for particular chat room called")
    this.socket.usersInParticularChatRoom()
      .subscribe((list) => {
      
        this.allUsers = [];

        for (let x in list) {

          let temp = { 'chatRoom':list[x], 'name': x};

          this.allUsers.push(temp);          

        }
        
        console.log(this.allUsers);

      }); // end active chat-rooms-list
  }

  public sendMessage() {

    if(this.messageText){
  
      let chatMsgObject = {
        senderName: this.nickName,
        senderId: this.userInfo.userId,
        receiverName: this.currentChatRoom,
        //receiverId: Cookie.get('receiverId'),
        chatRoom:this.currentChatRoom,

        message: this.messageText,
        createdOn: new Date()
      } // end chatMsgObject
      console.log(chatMsgObject);
      this.socket.SendChatMessage(chatMsgObject);
      this.pushToChatWindow2()
    //  this.pushToChatWindow()
      
  
    }
    else{
      this.toastr.warning('text message can not be empty')
  
    }
  }

  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.sendMessage();

    }
  }
  // public pushToChatWindow : any =(data)=>{

  //   this.messageText="";
  //   this.messageList.push(data);
  //   //this.scrollToChatTop=false;

  // }
  public pushToChatWindow2 : any =()=>{

    this.socket.chatByChatRoom(this.currentChatRoom)
    .subscribe((data)=>{
     
      console.log("get chat as per chat room");
      this.messageText="";
     this.messageList.push(data);

      //this.toastr.success(`${data.senderName} says : ${data.message}`)

     // this.scrollToChatTop=false;

    });

  }

//   public getMessageFromAUser :any =()=>{

//     this.socket.chatByUserId(this.nickName)
//     .subscribe((data)=>{
     
//       console.log("chat by user id that is for me chat room");
//       (this.nickName==data.senderId)?this.messageList.push(data):'';

//       this.toastr.success(`${data.senderName} says : ${data.message}`)

//      // this.scrollToChatTop=false;

//     });//end subscribe

// }

public goToBackPage :any=()=>{
  this.locaton.back();
}

public logout: any = () => {

        console.log("logout called")
        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

        this.socket.exitSocket()

        this.router.navigate(['/']);

}


public loadEarlierPageOfChat: any = () => {

  this.loadingPreviousChat = true;

  this.pageValue++;
 // this.scrollToChatTop = true;

  this.getPreviousChatWithAUser() 

} 

public getPreviousChatWithAUser :any = ()=>{
  let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
  
  this.socket.getChat(this.currentChatRoom, this.pageValue * 10)
  .subscribe((apiResponse) => {

    console.log(apiResponse);

    if (apiResponse.status == 200) {

      this.messageList = apiResponse.data.concat(previousData);

    } else {

      this.messageList = previousData;
      this.toastr.warning('No Messages available')

     

    }

    this.loadingPreviousChat = false;

  }, (err) => {

    this.toastr.error('some error occured')


  });

}

}
