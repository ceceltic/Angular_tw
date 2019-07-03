import { Component, OnInit,ViewEncapsulation,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-proposalconfirmationdisplay',
  templateUrl: './proposalconfirmationdisplay.component.html',
  styleUrls: ['../../../../assets/proposalconfirmation/css/style.css','../../../../assets/proposalconfirmation/css/main.css']
})
export class ProposalconfirmationdisplayComponent implements OnInit {

	quoteJson: any;
	premiumJson: any;
	proposalJson: any;
	personalDetailJson: any;
	carDetailJson: any;
	nomineeDetailJson: any;
	addressDetailJson: any;
	BhartiJsonData: any= {};
	RelianceJsonData: any= {};
	HdfcJsonData: any= {};
	BajajJsonData: any= {};
	proposalConfirmationJson: any= {};
	showQuotedata: any;
	showPremiumdata: any;
	showProposaldata: any;
	showPaymentdata: any;
	showErrormsg: any;
	resMessage: any;
	paymentUrlHDFC: any;
	paymentUrlRELIANCE: any;
	paymentUrlBharti: any;
	paymentUrlBajaj: any;
	responseUrlRELIANCE: any;
	months: any;
	errorContinueBuy: boolean = true;
	custId: any;
	APIURL: string = "";
	
	@ViewChild('hdfcSubmitBtn') hdfcSubmitBtn: ElementRef;
	@ViewChild('relianceSubmitBtn') relianceSubmitBtn: ElementRef;
	@ViewChild('bajajSubmitBtn') bajajSubmitBtn: ElementRef;
	@ViewChild('bhartiSubmitBtn') bhartiSubmitBtn: ElementRef;
	
	constructor(public formBuilder: FormBuilder, protected localStorage: LocalStorage, private router: Router, private  apiService:  ApiService) { 
		this.showQuotedata=false;
		this.showPremiumdata=false;
		this.showProposaldata=false;
		this.showPaymentdata=true;
		this.showErrormsg=false;
		this.resMessage="";
		this.paymentUrlHDFC="";
		this.paymentUrlRELIANCE="";
		this.paymentUrlBharti="";
		this.paymentUrlBajaj="";
		this.months=["","Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		this.APIURL = this.apiService.getServiceURL();
		let baseUrl = this.apiService.getBaseURL();
		this.responseUrlRELIANCE=baseUrl+"payment/confirmation/";
		
		this.getQuoteJson();
	}
	getQuoteJson()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.showQuotedata=true;
			//console.log(this.quoteJson);
			this.proposalConfirmationJson.quoteJson=this.quoteJson;
			this.getPremiumJson();
		});
	}
	getPremiumJson()
	{
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			var premium_json=data;
			this.premiumJson=premium_json;
			this.responseUrlRELIANCE=this.responseUrlRELIANCE+this.premiumJson.PROVIDER_ID;
			this.showPremiumdata=true;
			this.getProposalJson();
			this.proposalConfirmationJson.premiumJson=this.premiumJson;
			
			
			console.log(this.premiumJson);
		});
	}
	getProposalJson()
	{
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson=data;
			this.personalDetailJson=this.proposalJson.personalDetailForm;
			this.carDetailJson=this.proposalJson.carDetailForm;
			this.nomineeDetailJson=this.proposalJson.nomineeDetailForm;
			this.addressDetailJson=this.proposalJson.addressDetailForm;
			this.showProposaldata=true;
			this.proposalConfirmationJson.proposalJson=this.proposalJson;
			if(this.proposalJson.isSubmitted=='1')
			{
				this.storeProposalJson();
			}
			//console.log(this.proposalJson);
		});
	}
	storeProposalJson()
	{
		
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let quoteID = data;
			this.proposalConfirmationJson.premiumJson.LAST_QUOTE_ID=quoteID;
			this.proposalConfirmationJson.serviceUrl=this.APIURL+"service.php?action=STORE_PROPOSAL";
			this.apiService.storeProposal(this.proposalConfirmationJson).subscribe(data => {
				this.proposalJson.isSubmitted='0';
				this.localStorage.setItem('proposalJson', this.proposalJson).subscribe(() => {});
				let userCode=data;
				this.proposalConfirmationJson.premiumJson.userCode=userCode;
				this.localStorage.getItem('proposalJson').subscribe((data) => {
					
				});
				console.log("Proposal Stored");
			});
		});
		
		
	}
	
	createProposal()
	{
		if(this.errorContinueBuy)
		{
			this.showPaymentdata=false;
			this.showErrormsg=false;
			this.localStorage.getItem('quoteID').subscribe((data) => {
				let quoteID = data;
				this.proposalConfirmationJson.premiumJson.LAST_QUOTE_ID=quoteID;
				this.proposalConfirmationJson.serviceUrl=this.APIURL+"service.php?action=CREATE_PROPOSAL&PROVIDER_ID="+this.premiumJson.PROVIDER_ID+"&PREMIUM_TYPE="+this.premiumJson.premium_type;
				
				console.log(this.proposalConfirmationJson);
				
				if(this.premiumJson.PROVIDER_ID=='1')
				{
					let obj =this.hdfcSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						let resData=data;
						let confirmationJSON : any;
						confirmationJSON=resData;
						this.HdfcJsonData=JSON.parse(confirmationJSON);
						this.paymentUrlHDFC=this.HdfcJsonData.PaymentUrl;
						console.log(this.HdfcJsonData);
						if(this.HdfcJsonData.Trnsno!="" && this.HdfcJsonData.Trnsno!=null)
						{
							
							setInterval(function() {
								this.showPaymentdata=true;
								obj.nativeElement.click();
							},4000); 
						}
						else
						{
							
							this.showPaymentdata=true;
							this.showErrormsg=true;
							this.resMessage=this.HdfcJsonData.resMessage;
							console.log(this.resMessage);
						}
					});
				}
				if(this.premiumJson.PROVIDER_ID=='12')
				{
					let obj = this.relianceSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						let resData=data;
						let confirmationJSON : any;
						confirmationJSON=resData;
						this.RelianceJsonData=JSON.parse(confirmationJSON);
						this.paymentUrlRELIANCE=this.RelianceJsonData.PaymentUrl;
						console.log(this.RelianceJsonData);
						if(this.RelianceJsonData.ProposalNo!="" && this.RelianceJsonData.ProposalNo!=null)
						{
							setInterval(function() {
								this.showPaymentdata=true;
								obj.nativeElement.click();
							},4000); 
						}
						else
						{
							this.showPaymentdata=true;
							this.showErrormsg=true;
						}
					});
				}
				if(this.premiumJson.PROVIDER_ID=='2')
				{
					let obj = this.bajajSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						
						let resData=data;
						let confirmationJSON : any;
						confirmationJSON=resData;
						this.BajajJsonData=JSON.parse(confirmationJSON);
						let requestId = this.BajajJsonData.requestID;
						this.paymentUrlBajaj=this.BajajJsonData.PaymentUrl;
						console.log(this.BajajJsonData);
						
						this.paymentUrlBajaj=this.paymentUrlBajaj+"?requestId="+requestId+"&Username=info@gibl.in&sourceName=WS_MOTOR";
						setInterval(function() {
							this.showPaymentdata=true;
							obj.nativeElement.click();
						},4000); 
					});
				}
				if(this.premiumJson.PROVIDER_ID=='3')
				{
					let obj = this.bhartiSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						let resData=data;
						let confirmationJSON : any;
						confirmationJSON=resData;
						this.BhartiJsonData=JSON.parse(confirmationJSON);
						this.paymentUrlBharti=this.BhartiJsonData.PaymentUrl;
						console.log(this.BhartiJsonData);
						setInterval(function() {
							this.showPaymentdata=true;
							obj.nativeElement.click();
						},4000); 
					});
				}
			});
		}
		
	}
	paymentFormSubmit(form: any, e: any): void
	{
		e.target.submit();
	}
	paymentFormSubmit1(form: any, e: any): void
	{
		e.target.submit();
	}
	paymentFormSubmit2(form: any, e: any): void
	{
		e.target.submit();
	}
	paymentFormSubmit3(form: any, e: any): void
	{
		e.target.submit();
	}
	termsCheckbox(event) {
		if ( event.target.checked ) {
			this.errorContinueBuy = true;
		}
		else
		{
			this.errorContinueBuy = false;
		}
	}
	ngOnInit() {
	}

}

