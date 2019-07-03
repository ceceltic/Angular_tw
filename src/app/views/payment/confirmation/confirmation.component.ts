import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['../../../../assets/payment/css/style.css', './confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
	
	providerId: any="";
	transactionStatus: any="";
	transactionMsg: any="";
	policyDownloadURL: any="";
	policyNo: any="NA";
	transactionNo: any="";
	proposalNo: any="";
	paymentMethod: any="";
	orderStatus: any="";
	productCode: any="";
	premiumJson: any;
	paymentJson: any;
	showPremiumdata: boolean = false;
	APIURL: string = "";
	constructor(private route:ActivatedRoute, private  apiService:  ApiService,protected localStorage: LocalStorage) { 
		this.APIURL = this.apiService.getServiceURL();
	}

	ngOnInit() {
		this.getPremiumJson();
		
	}
	getPremiumJson()
	{
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumJson=data;
			this.showPremiumdata=true;
			this.route.params.subscribe(params => {
				this.providerId = params.id;
				if(this.providerId=="12")
				{
					this.reliancePaymentProcess();
				}
				if(this.providerId=="1")
				{
					this.hdfcPaymentProcess();
				}
				if(this.providerId=="3")
				{
					this.bhartiPaymentProcess();
				}
			});
		});
	}
	bhartiPaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			
			this.transactionNo = queryArr[0];
			this.transactionMsg = queryArr[1];
			this.orderStatus = queryArr[2];
			this.proposalNo = queryArr[3]; //Or, Order No
			this.policyNo = queryArr[4];
			this.paymentJson={
				"order_id":this.proposalNo,
				"policy_no":this.policyNo,
				"insurer_id":this.providerId,
				"payment_type":"",
				"response_track_id":this.transactionNo,
				"order_status":this.orderStatus,
				
			};
			this.paymentJson.serviceUrl=this.APIURL+"service.php?action=UPDATE_PAYMENT&PROVIDER_ID="+this.providerId;
			this.apiService.updatePayment(this.paymentJson).subscribe(data => {
				/*
				let resData=data;
				let confirmationJSON : any;
				confirmationJSON=resData;
				let hdfcResponse=JSON.parse(confirmationJSON)
				this.policyNo = hdfcResponse.policy_no;
				console.log(this.policyNo);
				*/
			});
			
		});
		
	}
	hdfcPaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.transactionNo = queryArr[0];
			this.transactionMsg = queryArr[1];
			this.orderStatus = queryArr[2];
			this.paymentJson={
				"order_id":this.transactionNo,
				"policy_no":"",
				"insurer_id":this.providerId,
				"payment_type":"",
				"response_track_id":this.transactionNo,
				"order_status":this.orderStatus,
				"unique_request_id":this.premiumJson.UniqueRequestID,
			};
			this.paymentJson.serviceUrl=this.APIURL+"service.php?action=UPDATE_PAYMENT&PROVIDER_ID="+this.providerId;
			this.apiService.updatePayment(this.paymentJson).subscribe(data => {
				let resData=data;
				let confirmationJSON : any;
				confirmationJSON=resData;
				let hdfcResponse=JSON.parse(confirmationJSON)
				this.policyNo = hdfcResponse.policy_no;
				console.log(this.policyNo);
				this.policyDownloadURL = this.APIURL+"hdfc_policy_copy.php?PolicyNo="+this.policyNo+"&UniqueRequestID="+this.premiumJson.UniqueRequestID;
			});
		});
		
	}
	reliancePaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.transactionStatus = queryArr[3];
			this.transactionMsg = queryArr[6];
			this.policyNo = queryArr[1];
			this.transactionNo = queryArr[2];
			this.paymentMethod = queryArr[4];
			this.proposalNo = queryArr[5];
			
			if(this.transactionStatus=="0")
			{
				this.orderStatus = "1";
			}
			else
			{
				this.orderStatus = "2";
			}						
			this.paymentJson={
				"order_id":this.proposalNo,
				"policy_no":this.policyNo,
				"insurer_id":this.providerId,
				"payment_type":this.paymentMethod,
				"response_track_id":this.transactionNo,
				"order_status":this.orderStatus
			};
			this.paymentJson.serviceUrl=this.APIURL+"service.php?action=UPDATE_PAYMENT&PROVIDER_ID="+this.providerId;
			this.apiService.updatePayment(this.paymentJson).subscribe(data => {
				console.log("Payment Updation Done");
				this.policyDownloadURL = "http://rzonews.reliancegeneral.co.in:91/API/Service/GeneratePolicyschedule?PolicyNo="+this.policyNo+"&ProductCode="+this.productCode;
			});
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			let premiumData=data;
			this.productCode = premiumData.PRODUCT_CODE;
			console.log(this.productCode);
		});
	}
}
