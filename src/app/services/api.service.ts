import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse  } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	
	NODE_URL  =  'http://192.168.7.160:3000/action';
	//NODE_URL  =  'http://67.211.45.49:8009/action';
	//NODE_URL  =  'https://napp.gibl.in/action/';
	
	APIURL: string = "http://192.168.7.124/gibl-php/tw-services/";
	//APIURL: string = "http://uat.gibl.in/tw-services/";
	//APIURL: string = "https://www.gibl.in/php-services/tw-services/";
	
	BASEURL: string = "http://192.168.7.160:4200/";
	//BASEURL: string = "http://uat.gibl.in/tw/";
	//BASEURL: string = "https://www.gibl.in/bike-insurance/";
	
	constructor(private  httpClient:  HttpClient) { }
	getServiceURL()
	{
		return this.APIURL;
	}
	getBaseURL()
	{
		return this.BASEURL;
	}
	getPremium(quoteJson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,quoteJson);
	}
	sendSmsEmail(formJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,formJson);
	}
	createProposal(proposalJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,proposalJson);
		
	}
	storeProposal(proposalJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,proposalJson);
		
	}
	
	updatePayment(paymentJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,paymentJson);
		
	}
	call_me_back_submit(callbackjson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,callbackjson);
	}

	signIn(callbackjson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,callbackjson);
	}
	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('user_json');
	  }
	  isAuthenticated() {
		let token = localStorage.getItem('user_json');
		return token != null;
	  }
}
