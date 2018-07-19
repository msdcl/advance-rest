import { Component, OnInit } from '@angular/core';
import { SocketService } from './../../socket.service';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean=false;  

  public receiverId: any;
  public receiverName: any;
  public previousChatList: any = [];
 // public messageText: any; 
 // public messageList: any = []; // stores the current message list display in chat box
 // public pageValue: number = 0;
 // public loadingPreviousChat: boolean = false;
  public chatRoomName:any
  public allChatRoom:any=[]

  public chatRoomEditedName:any // new edited name of chat room
  public chatRoomOldName:any
  public nickName:any // nick name of the user

  constructor(public http:HttpService,
    public socketService:SocketService,
    public router: Router,
    public toastr:ToastrService) { }

  ngOnInit() {
    this.userInfo = this.http.getUserInfoFromLocalStorage();
    this.receiverId = Cookie.get("receiverId");

    this.receiverName =  Cookie.get('receiverName');
    this.authToken = Cookie.get('authtoken');
    this.nickName = Cookie.get('nickName');
    this.checkStatus();
    this.verifyUserConfirmation();
      this.socketService.existingChatRooms();
    this.getActiveChatRooms();
   // this.getAllChatRoom();
    
    
  }

  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus



  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {
       
        this.disconnectedSocket = false;

        this.socketService.setUser(this.authToken);
        this.getOnlineUserList()

      });
    }
  public getOnlineUserList :any =()=>{
    console.log("get user online list called")
    this.socketService.onlineUserList()
      .subscribe((userList) => {
      
        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log(this.userList);

      }); // end online-user-list
  }
 

// function to create new chat room
  public createNewChatRoom(){
    if(this.chatRoomName){

      let chatRoomObject = {
        name:this.chatRoomName,
        createdBy :Cookie.get('receiverId')
      } // end chatMsgObject
      this.socketService.addNewChatRoom(chatRoomObject);
     this.getActiveChatRooms();
      this.http.createNewChatRoom(chatRoomObject).subscribe(
        (apiResponse) => {
        console.log(apiResponse)
       
          if (apiResponse.status === 200) {
            this.toastr.success("chat room successfully created",'success!')
          
              
  
          } else {
            this.toastr.warning(apiResponse.message,'alert!')
           // alert(apiResponse.message)
             console.log(apiResponse.message);
  
          }
  
        },
         error => {
          this.toastr.error("Some error has been occured while creating chat room ",'alert!')
  
        }
      );
    }
    else{
      this.toastr.warning('Chat room name can not be empty')
  
    }
  }

  public getAllChatRoom(){
    this.allChatRoom=this.http.getAllChatRooms().subscribe(
      (apiResponse) => {
      console.log(apiResponse)
     
        if (apiResponse.status === 200) {
          
         this.allChatRoom =apiResponse.data;
            console.log(apiResponse.data)

        } else {
          this.toastr.warning(apiResponse.message,'alert!')
         // alert(apiResponse.message)
           console.log(apiResponse.message);

        }

      },
       error => {
        this.toastr.error("Some error has been occured while getting chat room ",'alert!')

      }
    );
  }

// function to get all chat room from redis database
  public getActiveChatRooms :any =()=>{
    console.log("get active chat room list called")
    this.socketService.activeChatRooms()
      .subscribe((list) => {
      
        this.allChatRoom = [];

        for (let x in list) {

          let temp = { 'createdBy':list[x], 'name': x};

          this.allChatRoom.push(temp);          

        }
        
        console.log(this.allChatRoom);

      }); // end active chat-rooms-list
  }


  //function to delete a chat-room

  public deleteChatRoom(name){
    this.socketService.deleteAchatRoom(name);
  }
 // function to get old name of chat room
  public nameOfChatRoomToEdit(oldName){
    this.chatRoomOldName= oldName;
  }
  // function to edit name of chat room
  public editChatRoom(){
    this.socketService.editchatRoomName(this.chatRoomEditedName,this.chatRoomOldName,this.receiverId);
  }
  

  //function to join a chat room
  public joinChatRoom(name){
    this.socketService.joinAChatRoom(this.nickName,name)
    this.router.navigate(['/chatRoom',name]);
    
      
  }

 //l user logout function
  public logout: any = () => {

    console.log("logout called")
    Cookie.delete('authtoken');

    Cookie.delete('receiverId');

    Cookie.delete('receiverName');

    this.socketService.exitSocket()

    this.router.navigate(['/']);

}
}
