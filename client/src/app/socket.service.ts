import { Injectable } from '@angular/core';
import { Observable,Subject,pipe } from 'rxjs';
import { HttpClient, HttpErrorResponse,HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public baseUrl="http://api-advance.singhmahendra.me";
  private socket;
  constructor(public http:HttpClient) {
    this.socket = io(this.baseUrl);
   }

   
  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {
       console.log("listening to online-user-list event")
        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {
   console.log("set user event emit")
    this.socket.emit("set-user", authToken);

  } // end setUser

  // events to be emitted

  public markChatAsSeen = (userDetails) => {

    this.socket.emit('mark-chat-as-seen', userDetails);

  } // end markChatAsSeen



  // end events to be emitted

  // chat related methods 

  

  // public getChat(senderId, receiverId, skip): Observable<any> {

  //   return this.http.get(`${this.baseUrl}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
  //     .do(data => console.log('Data Received'))
  //     .catch(this.handleError);

  // } // end logout function

  // public chatByUserId = (userId) => {

  //   return Observable.create((observer) => {
      
  //     this.socket.on(userId, (data) => {

  //       observer.next(data);

  //     }); // end Socket

  //   }); // end Observable

  // } // end chatByUserId

  public chatByChatRoom = (chatRoom) => {

    return Observable.create((observer) => {
      
      this.socket.on(chatRoom, (data) => {
        console.log("listening event according tto chat room")
        observer.next(data);

      }); // end Socket

    }); // end Observable

  }

  public SendChatMessage = (chatMsgObject) => {
      console.log("emit chat-msg event");
    this.socket.emit('chat-msg', chatMsgObject);

  } // end getChatMessage


  public exitSocket = () =>{


    this.socket.disconnect();


  }

  // public broadcastMessage = () => {

  //   return Observable.create((observer) => {

  //     this.socket.on("message-broadcast", (list) => {
  //      console.log("listening to broadcast message event")
  //      console.log(list);
  //       observer.next(list);

  //     }); // end Socket

  //   }); // end Observable

  // }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

   public welcomeUser = (data) => {
    
    this.socket.emit("welcome-email", data);
  }

   public addNewChatRoom = (data)=>{
    this.socket.emit("new-chat-room", data);
   }



  public activeChatRooms = () => {

    return Observable.create((observer) => {

      this.socket.on("all-chat-rooms", (list) => {
       console.log("listening to online-user-list event")
        observer.next(list);

      }); // end Socket

    }); // end Observable

  }

  public existingChatRooms = ()=>{
    this.socket.emit("existing-chat-rooms","");
   }

   public deleteAchatRoom =(name)=>{
     this.socket.emit("delete-chat-room",name);
   }
   
   public editchatRoomName =(newName,oldName,creator)=>{
     let data = {
       name : newName,
       oldChatRoom : oldName,
       createdBy : creator
     }
    this.socket.emit("edit-chat-room",data);
  }

  // fuction to emit join-chat room event
  public joinAChatRoom =(nickName,chatRoomName)=>{
    let data = {
      nickName: nickName,
      chatRoom : chatRoomName
    }
   this.socket.emit("join-chat-room",data);
 }


// observer to get all user in a particular chat room
 public usersInParticularChatRoom = () => {

  return Observable.create((observer) => {

    this.socket.on("all-users-in-paricular-chat-room", (list) => {
     console.log("listening to all-users-in-paricular-chat-room event")
      observer.next(list);

    }); // end Socket

  }); // end Observable

}

public existingUsersInAChatRoom=(chatRoom)=>{
  this.socket.emit("existing-users-in-chat-room",chatRoom);
}

public getChat(chatRoom, skip): Observable<any> {

  return this.http.get(`${this.baseUrl}/api/v1/chatRoom/getChat?chatRoom=${chatRoom}&skip=${skip}`)
    .do(data => console.log('Data Received'))
    .catch(this.handleError);

}
}
