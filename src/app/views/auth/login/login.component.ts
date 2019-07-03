import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  submitted:boolean=false;
  //APIURL: string = "http://192.168.7.124/gibl-php/tw-services/";
  APIURL: string = "http://uat.gibl.in/tw-services/";

  loginStatus:string;
  constructor(private apiService: ApiService,
    protected localStorage: LocalStorage,
    private router: Router) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }
  signin() {
    if (this.signinForm.invalid){
      return;
    }
    this.submitted=true;
    const signinData = this.signinForm.value;
    let getquoteJson = {
      "email": signinData.email,
      "password": signinData.password,
      "serviceUrl": ""
    };
    getquoteJson.serviceUrl = this.APIURL + "service.php?action=LOGIN_AUTH";
    this.apiService.signIn(getquoteJson).subscribe(data => {
		let res:any=data;
		let rd=JSON.parse(res);
		if(rd.token)
        {
			this.localStorage.setItem('userJson', rd).subscribe(() => {
				this.router.navigate(['/']);
			});
        }
        else{
          this.loginStatus="invalid credentials";
        }
    });
  }

}
