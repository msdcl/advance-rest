import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[SocketService]
})
export class LoginComponent implements OnInit {
  
  public email;
  public password;
 
  constructor(public http:HttpService,public router:Router,public toastr : ToastrService,public socketService : SocketService) { }

  ngOnInit() {
  }
  public doSignIn(){
    if (!this.email) {
      this.toastr.warning('Enter your email', 'Alert!');


    } else if (!this.password) {

      this.toastr.warning('Enter your password', 'Alert!');


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.http.doSignInFunction(data).subscribe(
        (apiResponse) => {
        console.log(apiResponse)
       
          if (apiResponse.status === 200) {
           // console.log(apiResponse)

             Cookie.set('authtoken', apiResponse.data.token);
            
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
             Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
             
             Cookie.set('nickName', apiResponse.data.userDetails.nickName);

             this.http.settUserInfoInLocalStorage(apiResponse.data.userDetails)
             //set user event emit
            //  console.log("auth token sent while event emit ")
            //  console.log(apiResponse.data.token);
            //  this.socketService.setUser(apiResponse.data.token);
             
              this.router.navigate(['/chat']);

          } else {

           // alert(apiResponse.message)
           this.toastr.warning(apiResponse.message, 'Alert!');

          }

        },
         error => {
          this.toastr.error("Some error has been occured",'alert!')

        }
      );

    }
  }
}
