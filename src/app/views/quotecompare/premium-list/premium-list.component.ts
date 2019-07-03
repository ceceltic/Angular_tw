import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';
import {NgbAccordionConfig,NgbModal, ModalDismissReasons,NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../services/ngb-date-fr-parser-formatter";

@Component({
  selector: 'app-PremiumList',
  templateUrl: './premium-list.component.html',
  styleUrls: ['../../../../assets/quotecompare/css/main.css'],
  providers: [NgbAccordionConfig,{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
})
export class PremiumListComponent implements OnInit {
	callMeBack:FormGroup;
	quoteModifyForm: FormGroup;
	quoteModifyLeftForm: FormGroup;
	shareFormEmail: FormGroup;
	shareFormSMS: FormGroup;
	
	changeText=[];
	maufacYear: any[] =[];
	form_premium_type: string;
	premiumJson: any[] = [];
	
	quoteJson: any;
	showquoteData: any;
	showPremiumData: any;
	countResultPremium: any;
	premiumBreakupJson: any;
	currDate: any;
	isRenewal:any;
	
	closeResult: string;
	quoteUrl: string;
	
	zeroDepBool: boolean = false;
	paOwnerBool: boolean = false;
	showCustomIDV: boolean = false;
	shareFormEmailSubmitted: boolean = false;
	shareFormEmailMsg: boolean = false;
	shareFormSMSMsg: boolean = false;
	shareFormCopyMsg: boolean = false;
	shareErrorMsg: boolean = true;
	validQuoteModifyLeft: boolean = true;
	isQuoteModifyLeftSubmitted: boolean = false;
	isCustomIDV: boolean = false;
	
	minIDV: any = 0;
	maxIDV: any = 0;
	
	maxRelianceIDV: any = 0;
	maxHdfcIDV: any = 0;
	maxBajajIDV: any = 0;
	maxBhartiIDV: any = 0;
	
	minRelianceIDV: any = 0;
	minHdfcIDV: any = 0;
	minBajajIDV: any = 0;
	minBhartiIDV: any = 0;
	
	
	modifyIDV: any = 0;
	modifyIDVVal: any = 0;
	months: any;
	callMeBackSubmit=true;
	APIURL: string = "";
	
	public isCollapsed = true;
	
	constructor(public fb: FormBuilder,protected localStorage: LocalStorage,private router: Router,private  apiService:  ApiService,config: NgbAccordionConfig,private modalService: NgbModal,private route:ActivatedRoute,) {
		config.closeOthers = true;
        config.type = 'info';
		this.months=["","Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
		this.APIURL = this.apiService.getServiceURL();
	}
	
	
	ngOnInit() {
		for(let i=0;i<2;i++){
			this.changeText[i]=false;
		}
		this.showquoteData=false;
		this.isRenewal=true;
		let now = new Date();
		this.currDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
		var curr_year = new Date().getFullYear();
		var last_year = new Date().getFullYear()-15;
		
		for (let i = curr_year-1; i > last_year; i--) {
			this.maufacYear.push(i);
		}
		
		this.callPremiumApiService();
		this.generateModifyQuoteForm();
		this.generateshareFormEmail();
		this.generateshareFormSMS();
		this.createCallMeBackForm();
	}
	
	callPremiumApiService()
	{
		this.countResultPremium=0;
		this.showPremiumData=false;
		this.premiumJson=[];
		this.route.queryParams.subscribe(params => {
			if(params.QID!=null)
			{
				this.getQuoteData(params.QID);
			}
			else
			{
				this.callServices();
			}
		});
		
	}
	getQuoteData(QID)
	{
		
		let getquoteJson={
			"QID":QID,
			"serviceUrl":""
		};
		getquoteJson.serviceUrl=this.APIURL+"service.php?action=GET_PREMIUM";
		
		this.apiService.getPremium(getquoteJson).subscribe(data => {
			let resData=data;
			let quoteStoredJSON : any;
			quoteStoredJSON=resData;
			//console.log(quoteStoredJSON);

			this.localStorage.setItem('quoteJson', JSON.parse(quoteStoredJSON)).subscribe(() => {
				this.callServices();
			});
		});
	}
	
	callServices()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			
			this.form_premium_type=this.quoteJson.form_premium_type;
			if(this.form_premium_type=="0")
			{
				this.isRenewal=false;
			}
			this.showquoteData=true;
			this.populateModifyQuoteForm();
			
			//console.log(this.quoteJson);
			
			this.quoteJson.zero_dep=1;
			this.quoteJson.pa_owner=1;
			if(!this.isQuoteModifyLeftSubmitted)
			{
				this.quoteJson.idv=0;
			}
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.storePremium();
				if(this.quoteJson.ownership_changed)
				{
					this.hdfcGetPremium();
					this.relianceGetPremium();
					//this.bajajGetPremium();
					//this.bhartiGetPremium();
				}
				else
				{
					this.showPremiumData=true;
				}
			});
			
			
			
			//this.newindiaGetPremium();
			
		});
	}
	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			//size: 'sm',//
			backdrop: 'static',
			keyboard  : false,
			centered: true}).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}
	
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return  `with: ${reason}`;
		}
	}
	showDivCustomIDV(bool)
	{
		this.showCustomIDV=bool;
	}
	/***********************************************************************************************************************/
													//Set Premium Breakup
	/***********************************************************************************************************************/
	premiumBreakup(premiumItem)
	{
		
		this.premiumBreakupJson=premiumItem;
		//console.log(this.premiumBreakupJson);
		
	}
	
	/***********************************************************************************************************************/
													//Share Form Details
	/***********************************************************************************************************************/
	createCallMeBackForm(){
		this.callMeBack = this.fb.group({
			MobileNo: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
		});
	}
	generateshareFormEmail()
	{
		this.shareFormEmail = this.fb.group({
			refEmailAddress: ['',[Validators.required,Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
			//refMobileNo: ['',[Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
		
	}
	generateshareFormSMS()
	{
		this.shareFormSMS = this.fb.group({
			refMobileNo: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
		
	}
	generateLink()
	{
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let quoteID=data;
			this.quoteUrl=window.location.href;
			this.quoteUrl=this.quoteUrl+"?QID="+quoteID;
			this.shareFormEmail.get('QuoteUrl').setValue(this.quoteUrl);
		});
		
	}
	call_me_back_submit(){
		let callMeBack = this.callMeBack.value;
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let getquoteJson={
				"QID":data,
				"mobileNo":callMeBack.MobileNo,
				"serviceUrl":""
			};
	
			getquoteJson.serviceUrl=this.APIURL+"service.php?action=STORE_CALLBACK";
			this.apiService.call_me_back_submit(getquoteJson).subscribe(data => {
				this.callMeBackSubmit=false;
			});
		});
	}
	shareEmailFormSubmit()
	{
		//console.log(this.shareFormEmail.value);
		this.shareFormEmailSubmitted = true;
		if (this.shareFormEmail.invalid) {
			return;
		}
		else
		{
			let shareFormEmailData = this.shareFormEmail.value;
			this.sendSmsEmailApiService(shareFormEmailData);
			this.shareFormEmailMsg=true;
		}
		
	}
	shareSMSFormSubmit()
	{
		//console.log(this.shareFormEmail.value);
		this.shareFormEmailSubmitted = true;
		if (this.shareFormSMS.invalid) {
			return;
		}
		else
		{
			let shareFormSMSData = this.shareFormSMS.value;
			this.sendSmsEmailApiService(shareFormSMSData);
			this.shareFormSMSMsg=true;
		}
		
	}
	sendSmsEmailApiService(shareFormEmailData)
	{
		shareFormEmailData.serviceUrl=this.APIURL+"service.php?action=SEND_SMS_EMAIL";
		
		this.apiService.sendSmsEmail(shareFormEmailData).subscribe(data => {
			
		});

		
	}
	copyToClipboard(refferalLink)
	{
		refferalLink.select();
		document.execCommand('copy');
		refferalLink.setSelectionRange(0, 0);
		this.shareFormCopyMsg=true;
	}
	/***********************************************************************************************************************/
													//Modify Policy Details
	/***********************************************************************************************************************/
	
	
	
	
	generateModifyQuoteForm()
	{
		this.quoteModifyForm = this.fb.group({
			modifyExpiryDate: [''],
			modifyRegistrationDate: [''],
			modifyManufacDateMM: [''],
			modifyManufacDateYY: [''],
		});
		this.quoteModifyLeftForm = this.fb.group({
			customIDV: ['0'],
			modifyIDV: ['0'],
			isClaimed: ['0'],
			modifyNCB: ['0'],
			modifyDiscount: ['0'],
		});
		
		
	}
	populateModifyQuoteForm()
	{
		let modifyExpiryDate = {year: this.quoteJson.policy_expiry_date.year, month: this.quoteJson.policy_expiry_date.month, day: this.quoteJson.policy_expiry_date.day};
		this.quoteModifyForm.get('modifyExpiryDate').setValue(modifyExpiryDate);
		
		let modifyRegistrationDate = {year: this.quoteJson.registration_date.year, month: this.quoteJson.registration_date.month, day: this.quoteJson.registration_date.day};
		this.quoteModifyForm.get('modifyRegistrationDate').setValue(modifyRegistrationDate);
		
		//let modifyManufacDate = {year: this.quoteJson.manufacture_date.year, month: this.quoteJson.manufacture_date.month, day: this.quoteJson.manufacture_date.day};
		this.quoteModifyForm.get('modifyManufacDateMM').setValue(this.quoteJson.manufacture_date.month);
		this.quoteModifyForm.get('modifyManufacDateYY').setValue(this.quoteJson.manufacture_date.year);
		
		this.quoteModifyLeftForm.patchValue({"modifyNCB":this.quoteJson.prev_ncb});
		this.quoteModifyLeftForm.patchValue({"modifyDiscount":this.quoteJson.vol_discount});
	}
	quoteModifySubmit()
	{
		let modifyData = this.quoteModifyForm.value;
		this.quoteJson.manufacture_date={year: modifyData.modifyManufacDateYY, month: modifyData.modifyManufacDateMM, day:1};
		this.quoteJson.policy_expiry_date={year: modifyData.modifyExpiryDate.year, month: modifyData.modifyExpiryDate.month, day:modifyData.modifyExpiryDate.day};
		this.quoteJson.registration_date={year: modifyData.modifyRegistrationDate.year, month: modifyData.modifyRegistrationDate.month, day:modifyData.modifyRegistrationDate.day};
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
		});
		
	}
	quoteModifyLeftSubmit()
	{
		
		console.log("maxRelianceIDV: "+this.maxRelianceIDV);
		console.log("minRelianceIDV: "+this.minRelianceIDV);
		console.log("maxHdfcIDV: "+this.maxHdfcIDV);
		console.log("minHdfcIDV: "+this.minHdfcIDV);
		let modifyData = this.quoteModifyLeftForm.value;
		
		if(modifyData.modifyIDV < this.minIDV || modifyData.modifyIDV > this.maxIDV)
		{
			this.validQuoteModifyLeft=false;
		}
		else
		{
			this.modifyIDVVal = modifyData.modifyIDV;
			this.isQuoteModifyLeftSubmitted=true;
			this.validQuoteModifyLeft=true;
			let new_ncb=20;
			let modifyVal=modifyData.modifyNCB;
			switch(modifyVal)
			{
				case '0': new_ncb = 20; break;
				case '20': new_ncb = 25; break;
				case '25': new_ncb = 35; break;
				case '35': new_ncb = 45; break;
				case '45': new_ncb = 50; break;
				case '50': new_ncb = 50; break;
			}
			this.quoteJson.prev_ncb = modifyData.modifyNCB;
			this.quoteJson.new_ncb = new_ncb;
			this.quoteJson.last_claimed_year = modifyData.isClaimed;
			this.quoteJson.last_claimed_year = 0;
			this.modifyIDV = modifyData.modifyIDV;
			if(modifyData.customIDV=='Y')
			{
				this.quoteJson.idv = modifyData.modifyIDV;
				this.isCustomIDV=true;
			}
			else
			{
				this.quoteJson.idv = 0;
				this.isCustomIDV=false;
			}
			console.log(this.quoteJson);
			this.quoteJson.vol_discount = modifyData.modifyDiscount;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		
	}
	zeroDepChange(e)
	{
		if(e.target.checked){
			this.quoteJson.zero_dep=1;
			this.zeroDepBool=true;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_ZERO_DEPT_PREM!="Not Available")
					{
						item.NET_PREMIUM=parseFloat(item.NET_PREMIUM)+parseFloat(item.NUM_ZERO_DEPT_PREM);
						item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
						item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
					}
					
				});
			});
		}
		else
		{
			this.quoteJson.zero_dep=0;
			this.zeroDepBool=false;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_ZERO_DEPT_PREM!="Not Available")
					{
						item.NET_PREMIUM=item.NET_PREMIUM-item.NUM_ZERO_DEPT_PREM;
						item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
						item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
					}
					
				});
			});
			
		}
		
		
		console.log(this.premiumJson);
		
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			//this.callPremiumApiService();
		});
		
	}
	paOwnerChange(e)
	{
		if(e.target.checked){
			this.quoteJson.pa_owner=1;
			this.paOwnerBool=true;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_PA_TO_OWNER_DRIVER!="Not Available")
					{
						if(item.PROVIDER_ID =='2') //PA Owner Driver is mandatory for BAJAJ & HDFC 
						{
							
						}
						else
						{
							item.NET_PREMIUM=parseFloat(item.NET_PREMIUM)+parseFloat(item.NUM_PA_TO_OWNER_DRIVER);
							item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
							item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
						}		
					}
					
				});
			});
		}
		else
		{
			this.quoteJson.pa_owner=0;
			this.paOwnerBool=false;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_PA_TO_OWNER_DRIVER!="Not Available")
					{
						if(item.PROVIDER_ID =='2') //PA Owner Driver is mandatory for BAJAJ & HDFC 
						{
							console.log('');
						}
						else
						{
							item.NET_PREMIUM=item.NET_PREMIUM-item.NUM_PA_TO_OWNER_DRIVER;
							item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
							item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
						}
					}
					
				});
			});
		}
		
		console.log(this.premiumJson);
		
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {});
		
	}
	
	
	/***********************************************************************************************************************/
													//Premium Api Service Call
	/***********************************************************************************************************************/
	
	
	storePremium()
	{
		
		let quoteID;
		let userCode=0;
		let obj =this;
	/************************************** Store Quote Data for first time**************************************************/
		if(this.quoteJson.quote_submit==1)
		{
			this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_SUBMIT&PREMIUM_TYPE="+this.form_premium_type;
			this.apiService.getPremium(this.quoteJson).subscribe(data => {
				quoteID=data;
				if(quoteID!="" && typeof quoteID !== 'undefined')
				{
					this.quoteJson.quote_submit=0;
					this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {})
					this.localStorage.setItem('quoteID', quoteID).subscribe(() => {
						console.log(quoteID);
					});
				}
			});
		}
	/************************************ Update Quote Data for modify search *************************************************/
		if(this.isQuoteModifyLeftSubmitted)
		{
			this.localStorage.getItem('quoteID').subscribe((quoteID) => {
				this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_UPDATE&QUOTE_ID="+quoteID;
				this.apiService.getPremium(this.quoteJson).subscribe(data => {});
			});
		}
		
	}
	
	hdfcGetPremium()
	{
		
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=1&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		if(this.modifyIDV > 0 && this.isCustomIDV)
		{
			if(this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV!='0')
			{
				this.quoteJson.idv=this.minHdfcIDV;
			}
			else if(this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV!='0')
			{
				this.quoteJson.idv=this.maxHdfcIDV;
			}
			else
			{
				this.quoteJson.idv=this.modifyIDV;
			}
		}
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
			
		});
		
	}
	relianceGetPremium()
	{
		
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=12&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		if(this.modifyIDV > 0  && this.isCustomIDV)
		{
			if(this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV!='0')
			{
				this.quoteJson.idv=this.minRelianceIDV;
			}
			else if(this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV!='0')
			{
				this.quoteJson.idv=this.maxRelianceIDV;
			}
			else
			{
				this.quoteJson.idv=this.modifyIDV;
			}
		}
		
		//console.log(this.quoteJson);
		
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
		});
		
	}
	
	
	bajajGetPremium()
	{
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=2&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		if(this.modifyIDV > 0  && this.isCustomIDV)
		{
			if(this.modifyIDV < this.minBajajIDV && this.minBajajIDV!='0')
			{
				this.quoteJson.idv=this.minBajajIDV;
			}
			else if(this.modifyIDV > this.maxBajajIDV && this.maxBajajIDV!='0')
			{
				this.quoteJson.idv=this.maxBajajIDV;
			}
			else
			{
				this.quoteJson.idv=this.modifyIDV;
			}
		}
		
		//console.log(this.quoteJson);
		
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
		});
	}
	bhartiGetPremium()
	{
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=3&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		if(this.modifyIDV > 0  && this.isCustomIDV)
		{
			if(this.modifyIDV < this.minBhartiIDV && this.minBhartiIDV!='0')
			{
				this.quoteJson.idv=this.minBhartiIDV;
			}
			else if(this.modifyIDV > this.maxBhartiIDV && this.maxBhartiIDV!='0')
			{
				this.quoteJson.idv=this.maxBhartiIDV;
			}
			else
			{
				this.quoteJson.idv=this.modifyIDV;
			}
		}
		
		//console.log(this.quoteJson);
		
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
		});
	}
	
	/***********************************************************************************************************************/
													//IDV, Max IDV, Min IDV setup
	/***********************************************************************************************************************/
	
	parsePremiumJson(primiumString)
	{
		if(primiumString!="" && typeof primiumString !== 'undefined')
		{
			
			let premiumJson=JSON.parse(primiumString);
			
			
			
			
			if(premiumJson[0].PROVIDER_ID=='12')
			{
				this.relianceParseJson(primiumString);
			}
			if(premiumJson[0].PROVIDER_ID=='1')
			{
				this.hdfcParseJson(primiumString);
			}
			if(premiumJson[0].PROVIDER_ID=='2')
			{
				this.bajajParseJson(primiumString);
			}
			if(premiumJson[0].PROVIDER_ID=='3')
			{
				this.bhartiParseJson(primiumString);
			}
			premiumJson.forEach(el => {
				
				if(el.NUM_PA_TO_OWNER_DRIVER!="Not Available")
				{
					
					if(el.PROVIDER_ID!='2') //PA Owner Driver is mandatory for BAJAJ 
					{
						el.NET_PREMIUM = parseFloat(el.NET_PREMIUM)-parseFloat(el.NUM_PA_TO_OWNER_DRIVER);
						el.SERVICE_TAX = Math.round(el.NET_PREMIUM*.18)
						el.TOTAL_PREMIUM = el.NET_PREMIUM+el.SERVICE_TAX;
					}
				}
				if(el.NUM_ZERO_DEPT_PREM!="Not Available")
				{
					el.NET_PREMIUM=el.NET_PREMIUM-el.NUM_ZERO_DEPT_PREM;
					el.SERVICE_TAX = Math.round(el.NET_PREMIUM*.18)
					el.TOTAL_PREMIUM = el.NET_PREMIUM+el.SERVICE_TAX;
				}
				this.quoteJson.zero_dep=0;
				this.quoteJson.pa_owner=0;
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {});
				
				if(this.minIDV==0 && el.idv_amount_min!="")
				{
					this.minIDV=el.idv_amount_min;
				}
				else
				{
					
					if(el.idv_amount_min <= this.minIDV && el.idv_amount_min!="")
					{
						this.minIDV=el.idv_amount_min;
					}
				}
				
				if(this.maxIDV==0 && el.idv_amount_max!="")
				{
					this.maxIDV=el.idv_amount_max;
				}
				else
				{
					if(el.idv_amount_max >= this.maxIDV && el.idv_amount_max!="")
					{
						this.maxIDV=el.idv_amount_max;
					}
				}
			});
			
			
			this.countResultPremium++;
			this.premiumJson.push(premiumJson);
			this.showPremiumData=true;
			console.log(this.premiumJson);
			if(this.quoteJson.idv==0)
			{
				this.quoteModifyLeftForm.patchValue({"modifyIDV":this.minIDV}); //IF MODIFY IDV NOT SUBMITTED MIN VALUE WILL BE SET
			}
			else
			{
				this.quoteModifyLeftForm.patchValue({"modifyIDV":this.modifyIDVVal});
			}
		}
	}
	
	relianceParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minRelianceIDV==0)
			{
				this.minRelianceIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minRelianceIDV && el.idv_amount_min!="")
				{
					this.minRelianceIDV=el.idv_amount_min;
				}
			}
			if(this.maxRelianceIDV==0)
			{
				this.maxRelianceIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxRelianceIDV)
				{
					this.maxRelianceIDV=el.idv_amount_max;
				}
			}
		});
	}
	hdfcParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minHdfcIDV==0)
			{
				this.minHdfcIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minHdfcIDV)
				{
					this.minHdfcIDV=el.idv_amount_min;
				}
			}
			if(this.maxHdfcIDV==0)
			{
				this.maxHdfcIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxHdfcIDV)
				{
					this.maxHdfcIDV=el.idv_amount_max;
				}
			}
		});
	}
	bajajParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minBajajIDV==0)
			{
				this.minBajajIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minHdfcIDV)
				{
					this.minBajajIDV=el.idv_amount_min;
				}
			}
			if(this.maxHdfcIDV==0)
			{
				this.maxBajajIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxHdfcIDV)
				{
					this.maxBajajIDV=el.idv_amount_max;
				}
			}
		});
	}
	bhartiParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minBhartiIDV==0)
			{
				this.minBhartiIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minHdfcIDV)
				{
					this.minBhartiIDV=el.idv_amount_min;
				}
			}
			if(this.maxHdfcIDV==0)
			{
				this.maxBhartiIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxHdfcIDV)
				{
					this.maxBhartiIDV=el.idv_amount_max;
				}
			}
		});
	}
	/***********************************************************************************************************************/
													//IDV, Max IDV, Min IDV setup
	/***********************************************************************************************************************/
	
	
	/***********************************************************************************************************************/
													//Trigger premium button
	/***********************************************************************************************************************/
	
	
	
	premiumTapped(providerID,premiumitem)
	{
		if(providerID=="1")
		{
			this.localStorage.setItem('premiumJson', premiumitem).subscribe(() => {
				this.router.navigate(['/proposal']);
			});
		}
	}

}

