import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from "@angular/router";
import statejson from './state_master.json';
import cityjson from './city_master.json';

@Component({
	selector: 'app-proposalinput',
	templateUrl: './proposalinput.component.html',
	styleUrls: ['../../../../assets/proposal/css/style.css', '../../../../assets/proposal/css/main.css'],
	//encapsulation : ViewEncapsulation.None
})
export class ProposalinputComponent implements OnInit {

	stateJson: any;
	cityJson: any;
	filtercityJson: any;
	quoteJson: any;
	premiumJson: any;
	proposalJson: any;
	showQuotedata: any;
	showPremiumdata: any;
	personalDetailTab: any;
	carDetailTab: any;
	nomineeDetailTab: any;
	addressDetailTab: any;
	personalDetailComplete: any;
	carDetailComplete: any;
	nomineeDetailComplete: any;
	addressDetailComplete: any;
	modifyRtoCode: any;
	custStateLabel: any;
	custCityLabel: any;
	personalDetailJson: any;
	carDetailJson: any;
	nomineeDetailJson: any;
	addressDetailJson: any;
	isLoan: boolean = false;
	months: any;
	
	custDOBDD : any[] =[];
	custDOBMM : any[] =[];
	custDOBYY : any[] =[];
	
	constructor(public formBuilder: FormBuilder,protected localStorage: LocalStorage,private router: Router,private route:ActivatedRoute) {
		
		this.personalDetailTab=true;
		this.carDetailTab=false;
		this.nomineeDetailTab=false;
		this.addressDetailTab=false;
		
		this.activepersonalDetail(); //To active personal detail Tab
		
		
		for (let i = 1; i <= 31; i++) {
			if(i<10)
			{
				var dd="0"+i.toString();
			}
			else
			{
				var dd=i.toString();
			}
			this.custDOBDD.push(dd);
		}
		for (let i = 1; i <= 12; i++) {
			if(i<10)
			{
				var mm="0"+i.toString();
			}
			else
			{
				var mm=i.toString();
			}
			this.custDOBMM.push(mm);
		}
		
		var curr_adult = new Date().getFullYear()-18;
		var last_adult = new Date().getFullYear()-99;
		
		for (let i = curr_adult; i > last_adult; i--) {
			this.custDOBYY.push(i);
		}
		
		this.showQuotedata=false;
		this.showPremiumdata=false;
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.showQuotedata=true;
			this.modifyRtoCode=this.quoteJson.rto_code.replace('-', '');
			//console.log(this.quoteJson);
			//this.setFormDetails(); // Use to set Form details values
			
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			var premium_json=data;
			this.premiumJson=premium_json;
			this.showPremiumdata=true;
			console.log(this.premiumJson);
		});
	}
	
	getCity(event)
	{
		this.custStateLabel = event.target['options'][event.target['options'].selectedIndex].text;
		
		var custState=event.target.value;
		var filter_city=[];
		this.cityJson.forEach(el => {
			if(el.state_id==custState)
			{
				filter_city.push(el);
			}
		});
		this.filtercityJson=filter_city;
	}
	
	cityChanged(event)
	{
		this.custCityLabel = event.target['options'][event.target['options'].selectedIndex].text;
	}
	
	registerForm: FormGroup;
	ngOnInit() {
		
		this.stateJson=statejson;
		this.cityJson=cityjson;
		
		//this.stateJson = require('./state_master.json');
		//console.log(this.stateJson);
		
		/*******************************************************Register all forms*********************************************/
		this.registerForm = this.formBuilder.group({
			isSubmitted: ['1',[Validators.required]],
			personalDetailForm: this.formBuilder.group({
				custTitle: ['MR',[Validators.required]],
				custName: ['',[Validators.required]],
				custPhone: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
				custEmail: ['',[Validators.required,Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
				custPancard: ['',[Validators.required,Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/)]],
				custDOBDD: ['',Validators.required],
				custDOBMM: ['',Validators.required],
				custDOBYY: ['',Validators.required],
			}),
			carDetailForm: this.formBuilder.group({
				rtoCode: ['',[Validators.required]],
				rtoregNumber: ['',[Validators.required]],
				prevPolicyNo: ['',[Validators.required]],
				engineNo: ['',[Validators.required,Validators.minLength(6)]],
				chassisNo: ['',[Validators.required,Validators.minLength(6)]],
				financierName: [''],
				financierBranchName: [''],
			}),
			nomineeDetailForm: this.formBuilder.group({
				nomineeName: ['',[Validators.required]],
				nomineeAge: ['',[Validators.required]],
				nomineeRelation: ['',[Validators.required]]
			}),
			addressDetailForm: this.formBuilder.group({
				custAddress: ['',[Validators.required]],
				custState: ['',[Validators.required]],
				custCity: ['',[Validators.required]],
				custPincode: ['',[Validators.required,Validators.pattern(/^[1-9][0-9]{5}$/)]],
				custStateLabel: [''],
				custCityLabel: [''],
			})
		});
		
		this.getProposalJson();
		
		/*******************************************************Register all forms*********************************************/
	}
	personalDetailSubmitted: boolean = false;
	carDetailSubmitted: boolean = false;
	nomineeDetailSubmitted: boolean = false;
	addressDetailSubmitted: boolean = false;
	
	get f() { return (<FormGroup>this.registerForm.get('personalDetailForm')).controls; }
	get c() { return (<FormGroup>this.registerForm.get('carDetailForm')).controls; }
	get n() { return (<FormGroup>this.registerForm.get('nomineeDetailForm')).controls; }
	get a() { return (<FormGroup>this.registerForm.get('addressDetailForm')).controls; }

	get personalDetailForm() {
		return this.registerForm.get('personalDetailForm');
	}
	get carDetailForm() {
		return this.registerForm.get('carDetailForm');
	}
	get nomineeDetailForm() {
		return this.registerForm.get('nomineeDetailForm');
	}
	get addressDetailForm() {
		return this.registerForm.get('addressDetailForm');
	}
	
	getProposalJson()
	{
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson=data;
			if(this.proposalJson != null)
			{
				console.log(this.proposalJson);
				this.proposalJson.personalDetailForm.custEmail = this.quoteJson.cust_email;
				this.proposalJson.personalDetailForm.custPhone = this.quoteJson.cust_phone;
				this.personalDetailJson=this.proposalJson.personalDetailForm;
				
				this.proposalJson.carDetailForm.rtoCode=this.modifyRtoCode;
				this.carDetailJson=this.proposalJson.carDetailForm;
				this.nomineeDetailJson=this.proposalJson.nomineeDetailForm;
				this.addressDetailJson=this.proposalJson.addressDetailForm;
				this.editDetail();
			}
			else
			{
				var custPhone=this.quoteJson.cust_phone;
				var custEmail=this.quoteJson.cust_email;
				
				this.personalDetailForm.patchValue({"custPhone":custPhone,"custEmail":custEmail});
				this.carDetailForm.patchValue({"rtoCode":this.modifyRtoCode});
			}
			
		});
	}
	editDetail()
	{
		this.personalDetailForm.patchValue(this.personalDetailJson);
		this.carDetailForm.patchValue(this.carDetailJson);
		this.nomineeDetailForm.patchValue(this.nomineeDetailJson);
		this.addressDetailForm.patchValue(this.addressDetailJson);
		this.custStateLabel=this.addressDetailJson.custStateLabel;
		this.custCityLabel=this.addressDetailJson.custCityLabel;
		
		var filter_city=[];
		this.cityJson.forEach(el => {
			if(el.state_id==this.addressDetailJson.custState)
			{
				filter_city.push(el);
			}
		});
		this.filtercityJson=filter_city;
		
		/********************************* Tab Change Event *********************************/
		this.route.queryParams.subscribe(params => {
			if(params.edit=="address")
			{
				this.personalDetailComplete=true;
				this.carDetailComplete=true;
				this.activeaddressDetail();
			}
			if(params.edit=="cardetail")
			{
				this.personalDetailComplete=true;
				this.activecarDetail();
			}
		});
	}
	personalDetailSubmit() {
		this.personalDetailSubmitted = true;
		if (this.personalDetailForm.invalid) {
			return;
		}
		else
		{
			this.personalDetailComplete=true;
			this.activecarDetail(); //To active car detail Tab
			
		}
	}
	carDetailSubmit() {
		this.carDetailSubmitted = true;
		if (this.carDetailForm.invalid) {
			return;
		}
		else
		{
			
			this.carDetailComplete=true;
			this.activeaddressDetail(); //To active nominee detail Tab
			
		}
	}
	addressDetailSubmit() {
		this.addressDetailSubmitted = true;
		if (this.addressDetailForm.invalid) {
		  return;
		}
		else
		{
			this.addressDetailComplete=true;
			this.addressDetailForm.patchValue({"custCityLabel":this.custCityLabel,"custStateLabel":this.custStateLabel});
			this.activenomineeDetail();
			
		}
	}
	nomineeDetailSubmit() {
		this.nomineeDetailSubmitted = true;
		if (this.nomineeDetailForm.invalid) {
		  return;
		}
		else
		{
			this.nomineeDetailComplete=true;
			this.activeaddressDetail(); //To active address detail Tab
			
			
			this.localStorage.setItem('proposalJson', this.registerForm.value).subscribe(() => {
				console.log(this.registerForm.value);
				this.router.navigate(['/proposal-confirmation']);
			});
			
		}
	}
	loanClick(loanType)
	{
		if(loanType=='1')
		{
			this.carDetailForm.get('financierName').reset();
			this.carDetailForm.get('financierBranchName').reset();
			this.carDetailForm.get('financierName').setValidators([Validators.required]);
			this.carDetailForm.get('financierBranchName').setValidators([Validators.required]);
			this.isLoan=true;
		}
		else
		{
			this.carDetailForm.get('financierName').reset();
			this.carDetailForm.get('financierBranchName').reset();
			this.carDetailForm.get('financierName').clearValidators();
			this.carDetailForm.get('financierBranchName').clearValidators();
			this.isLoan=false;
		}
		this.carDetailForm.get('financierName').updateValueAndValidity();
		this.carDetailForm.get('financierBranchName').updateValueAndValidity();
	}
	activepersonalDetail()
	{
		this.personalDetailTab=true;
		this.carDetailTab=false;
		this.nomineeDetailTab=false;
		this.addressDetailTab=false;
	}
	activecarDetail()
	{
		if(this.personalDetailComplete)
		{
			this.personalDetailTab=false;
			this.carDetailTab=true;
			this.nomineeDetailTab=false;
			this.addressDetailTab=false;
		}
	}
	activenomineeDetail()
	{
		if(this.addressDetailComplete)
		{
			this.personalDetailTab=false;
			this.carDetailTab=false;
			this.nomineeDetailTab=true;
			this.addressDetailTab=false;
		}
	}
	activeaddressDetail()
	{
		if(this.carDetailComplete)
		{
			this.personalDetailTab=false;
			this.carDetailTab=false;
			this.nomineeDetailTab=false;
			this.addressDetailTab=true;
		}
	}
}

