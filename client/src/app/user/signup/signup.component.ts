import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[SocketService]
})
export class SignupComponent implements OnInit {
 
  public firstName;
  public lastName;
  public email;
  public password;
  public phoneNumber;
  public nickName;
  constructor(public http: HttpService, public router:Router,public toastr :ToastrService, public vcr : ViewContainerRef,public socketService:SocketService) {
   // this.toastr.setRootViewContainerRef(vcr);
   }

  ngOnInit() {
  }
 public doSignUp(){
   if(!this.firstName){
    this.toastr.warning('Enter first name', 'Alert!');
   }else if(!this.lastName){
    this.toastr.warning('Enter last name', 'Alert!');
  }else if(!this.email){
    this.toastr.warning('Enter your email', 'Alert!');
  }else if(!this.password){
    this.toastr.warning('Enter your password', 'Alert!');
  }else if(!this.phoneNumber){
    this.toastr.warning('Enter mobile number ', 'Alert!');
  }else if(!this.nickName){
    this.toastr.warning('Enter nick name ', 'Alert!');
  }else{
    let data ={
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      password : this.password,
      mobileNumber : this.phoneNumber,
      nickName : this.nickName
    }

    this.http.doSignUpFunction(data).subscribe(
      (apiResponse) => {
      console.log(apiResponse)
     
        if (apiResponse.status === 200) {
          this.toastr.success("sign up successful",'success!')
         // console.log(apiResponse)

          //  Cookie.set('authtoken', apiResponse.data.authToken);
          
          //  Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          
          //  Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
         
          //  this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          console.log("event emit kro")
            this.socketService.welcomeUser(apiResponse.data);
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },1000)
            

        } else {
          this.toastr.warning(apiResponse.message,'alert!')
         // alert(apiResponse.message)
           console.log(apiResponse.message);

        }

      },
       error => {
        this.toastr.error("Some error has been occured",'alert!')

      }
    );
  }
 }
}
