import { DOCUMENT } from '@angular/common';
import {
	AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy,
	OnInit, Output, Renderer2, ViewChild, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
//import { truncate } from 'fs';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { LogoutService } from '../../services/logout/logout.service';
import pageSettings from '../../config/page-settings';
import { ThemeNameType } from '../../model/themeName';
import { globalSharedService } from '../../services/global/globalSharedService';
import { ThemeChangeService } from '../../services/theme/theme-change.service';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/interval';
import { flatMap } from 'rxjs/operators';
import { AlarmDataService } from 'src/app/services/services/alarm-data.service';
import { GatewayService } from 'src/app/services/gateway/gateway.service';
import { UIModalNotificationPage } from 'src/app/pages/modal-notification/modal-notification';
import { ImageService } from 'src/app/services/image/image.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnDestroy, AfterViewInit, OnInit {

	selectedLanguage: string = '';
	@ViewChild(UIModalNotificationPage) modelNotification;
	@Input() pageSidebarTwo;
	@Output() toggleSidebarRightCollapsed = new EventEmitter<boolean>();
	@Output() toggleMobileSidebar = new EventEmitter<boolean>();
	@Output() toggleMobileRightSidebar = new EventEmitter<boolean>();
	pageSettings = pageSettings;
	userName: string;
	firstName: string;
	middleName: string;
	lastName: string;
	userId: string;
	path: string;
	selectedLanguageObj: any;
	homeIconPageUrl: any;
	gender: string;

	themeNames: ThemeNameType[];
	selectedTheme;
	alarmCount: number = 0;
	timeInterval: any;
	subscribe: Subscription;
	alarmStateMap = new Map<string, number>();
	masterMapOfAlarmData = new Map<number, any>();
	latestAlarmEventTime: any;
	isI18nEnabled: boolean;
	features: any[];
	isChangePasswordEnabled = true;
	authenticationType: string;
	userType: string='';
	singleimage: any;
	organizationId: any;
	imageName:string;
	loginUrl: string;
	landingMenuUrl: string;
	ngOnInit() {
		if (sessionStorage.getItem("userId") != null && sessionStorage.getItem("userId") != undefined) {
			this.loadAlarmCount();
		}
		this.homeIconPageUrl = this.globalService.landingMenuUrlForHome;
		this.gender = sessionStorage.getItem('gender');
		this.isI18nEnabled = JSON.parse(sessionStorage.getItem('isI18nEnabled'));
		//checking for click to reload

		/*
			Developer - Anandhan
			Purpose - Change Theme  = data source from local/Remote service
		*/

		// If first time application loades
		let changedTheme = this.globalService.getDataValue();
		if (!changedTheme.length) {
			let theam = this.changeTheme.getThemeNameFromRoot();
			this.themeNames = JSON.parse(theam);
			changedTheme = this.themeNames;
			this.globalService.setDataValue(this.themeNames);
		}
		if (!changedTheme.length) {
			this.changeTheme.getThemeNames().subscribe(dataSource => {
				this.themeNames = dataSource;
				this.globalService.setDataValue(this.themeNames);
				this.themeChangeHandling();
			});
		} else {
			this.themeNames = this.globalService.getDataValue();
			this.themeChangeHandling();
		}
		 this.organizationId=+sessionStorage.getItem("beId");
		let imageName="logo.png"

		if(this.organizationId!=null&&this.organizationId!=0){
		// this.imageService.getImage(this.organizationId,imageName).subscribe(response => {
		// 	this.singleimage = response['content'];
		// })
	}
	}

	// Theme change handling when logout and login
	themeChangeHandling() {
		let getSelectedThemeObject = this.globalService.getDataValue().find((object) => {
			if (object.isSelected == true) {
				return object;
			}
		});

		if (Object.keys(getSelectedThemeObject).length && getSelectedThemeObject.constructor === Object) {
			// this.selectedTheme = getSelectedThemeObject;
			this.themeChange(getSelectedThemeObject);
		} else {
			this.selectedTheme = 'Default';
		}
	}

	// Load theme
	themeChange(themeColor) {
		this.selectedTheme = themeColor.name;
		let styleSheetColor = this.selectedTheme.toLowerCase();
		if (document.documentElement.hasAttribute('theme')) {
			document.documentElement.removeAttribute('theme');
			document.getElementById("customTheme").remove();
		}

		document.documentElement.setAttribute('theme', styleSheetColor);

		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.id = 'customTheme';
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = "/assets/css/theme/" + styleSheetColor + '/styles-property-value.css';
		head.appendChild(link);


		// Selected Theme mark isSelected as a true for logout and login
		let setIsSelectedValue = this.globalService.getDataValue().map(object => {
			if (themeColor.name == object.name) {
				object.isSelected = true;
			} else {
				object.isSelected = false;
			}
			return object;
		})

		this.globalService.setDataValue(setIsSelectedValue);

	}


	mobileSidebarToggle() {
		this.toggleMobileSidebar.emit(true);
	}
	mobileRightSidebarToggle() {
		this.toggleMobileRightSidebar.emit(true);
	}
	toggleSidebarRight() {
		this.toggleSidebarRightCollapsed.emit(true);
	}
	mobileTopMenuToggle() {
		this.pageSettings.pageMobileTopMenuToggled = !this.pageSettings.pageMobileTopMenuToggled;
	}
	mobileMegaMenuToggle() {
		this.pageSettings.pageMobileMegaMenuToggled = !this.pageSettings.pageMobileMegaMenuToggled;
	}
	ngOnDestroy() {
		this.pageSettings.pageMobileTopMenuToggled = false;
		this.pageSettings.pageMobileMegaMenuToggled = false;
	}

	// All the country code and respective names
	languages = {
		en: {
			"ar": "Arabic",
			"en": "English",
			"hi": "Hindi"
		},
		ar: {
			"ar": "عربى",
			"en": "الإنجليزية",
			"hi": "الهندية"
		},
		hi: {
			"ar": "अरबी",
			"en": "अंग्रेज़ी",
			"hi": "हिन्दी"
		}

	}

	constructor(private router: Router, private renderer: Renderer2,
		private logoutService: LogoutService,
		private toast: ToastrService, @Inject(DOCUMENT) document: any,
		private globalService: globalSharedService,
		private auth: AuthService,
		private changeTheme: ThemeChangeService, private alarmDataService: AlarmDataService, private gatewayService: GatewayService,
		private imageService: ImageService) {

		this.firstName = sessionStorage.getItem('firstName');
		this.middleName = sessionStorage.getItem('middleName');
		this.lastName = sessionStorage.getItem('lastName');
		// Language deduction
		this.languageDeduction();
	}


	languageDeduction() {
		let requiredPath = document.location.href.split("#");
		this.path = requiredPath[0];
		//Checking already langauge selected or not
		let getSelectedLanguage = this.path.split('/')
		let selectedLan = getSelectedLanguage[3];
		// Syncfusion dropdown - No records found localization
		sessionStorage.setItem("selectedLan", selectedLan);
		this.globalService.setLanguage(selectedLan);


		if (this.languages.hasOwnProperty(selectedLan)) {
			// Binding whatever selected luanguage and respective language name bind to the List
			this.selectedLanguageObj = this.languages[selectedLan];
			this.selectedLanguage = this.languages[selectedLan][selectedLan];
			// If the language is selected Arabic the add the right to left body and change content
			if (selectedLan == 'ar') {
				$('body').addClass('page-with-right-sidebar');
				$('html').attr({
					'lan': 'ar',
					'dir': 'rtl'
				});
			}
			// Selected language remove from the DOM
			setTimeout(() => {
				$('.navbar-nav.navbar-right li.dropdown a#header_language + ul > li a').each(function () {
					let getUrl = $(this).attr('href');
					if (getUrl.indexOf(selectedLan) != -1) {
						$(this).parent('li').remove();
					}
				})
				// $("a[href^='"+ selectedLan +"']").parent('li').remove();
			}, 2000);
		} else {
			// Default Language is english
			this.selectedLanguageObj = this.languages.en;
			this.selectedLanguage = this.languages.en.en;
			setTimeout(() => {
				$("#header_language .dropdown-menu li:first-child").remove();
			}, 2000);
		}
	}


	ngAfterViewInit() {
		this.landingMenuUrl = sessionStorage.getItem("landingMenuUrl");
		// In language dropdown bind URL to anchor tag for respective page name(Full URL)
		this.globalService.setLanguageURL(null);
		if (sessionStorage.getItem("userId") != null && sessionStorage.getItem("userId") != undefined) {
			this.loadDataForTimeInterval();
		}
		if (+sessionStorage.getItem("beId")) {
			this.getFeaturesByOrganizationId(+sessionStorage.getItem("beId"));
		}
		this.authenticationType = sessionStorage.getItem('authenticationType');
		if (this.authenticationType != "undefined" && this.authenticationType != null) {
			this.isChangePasswordEnabled = false;
		}
	}
	logout() {
		this.loginUrl=sessionStorage.getItem("loginUrl");
		let themeJson = sessionStorage.getItem('theamName');
		let topMenu = sessionStorage.getItem("topMenu");
		let sideBarMenu = sessionStorage.getItem("sidebarMenu");
		let pageEmpty = sessionStorage.getItem("pageEmpty");
		this.clearNodeIdenetifierFromCache();
		this.logoutService.logout().subscribe(response => {
			localStorage.clear();
			localStorage.removeItem('pagemenu');
			sessionStorage.clear();
			sessionStorage.removeItem('userId');
			sessionStorage.removeItem('userName');
			sessionStorage.setItem('loginUrl',this.loginUrl);
			sessionStorage.setItem('logout','true');
			sessionStorage.setItem('pageEmpty', pageEmpty);
			sessionStorage.setItem("theamName", themeJson);
			sessionStorage.setItem("topMenu", topMenu);
			sessionStorage.setItem("sidebarMenu", sideBarMenu)
			this.router.navigate(['']);
		},
			error => {
				console.log(error);
			}
		);
	}
	clearNodeIdenetifierFromCache() {
		let gatewayIdentifier = sessionStorage.getItem("gatewayIdentifier");
		this.gatewayService.clearGatewayIdentifier(gatewayIdentifier).subscribe(res => {
			sessionStorage.setItem("nodeIdentifierCleared", "true");
		},
			(error: any) => {
			}
		);
	}
	navigateToAlarm() {
		this.router.navigate(['/alarm/alarms']);
	}

	loadDataForTimeInterval() {
		this.getUserType();
		let beId = parseInt(sessionStorage.getItem('beId'));
		let userId = parseInt(sessionStorage.getItem('userId'));
		let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.alarmDataService.getTimeIntervalsFromFile().toPromise().then(data => {
			this.timeInterval = data.alarmNotificationTimeInterval;
			this.subscribe = Observable
				.interval(this.timeInterval)
				.pipe(flatMap(() => this.alarmDataService.getAlarmCount(beId, targetTimeZone, this.latestAlarmEventTime, userId, this.userType))
				).subscribe(res => {
					res = res != null ? res : 0;
					this.alarmCount = Number(res);
					sessionStorage.setItem("alarmcount", res);
				})
		})
	}
	getUserType() {
		let isAdmin = sessionStorage.getItem("isAdmin");
		if (isAdmin == 'true') {
			this.userType = 'Admin';
		}
	}
	getFeaturesByOrganizationId(organizationId: number) {
		this.auth.getFeaturesByOrganizationId(organizationId).subscribe(res => {
			if (res != null) {
				this.features = res;
				this.features.forEach(element => {
					if (element.name === "feature.i18n.enabled") {
						this.isI18nEnabled = element.value;
					}
				});
			}
		},
			error => {
				// this.showLoaderImage = false;
				// If the service is not available
				this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
			});
	}

	loadAlarmCount() {
		this.getUserType();
		let beId = parseInt(sessionStorage.getItem('beId'));
		let userId = parseInt(sessionStorage.getItem('userId'));
		let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.alarmDataService.getAlarmCount(beId, targetTimeZone, this.latestAlarmEventTime, userId, this.userType).subscribe(res => {
			res = res != null ? res : 0;
			this.alarmCount = Number(res);
			sessionStorage.setItem("alarmcount", res);
		})
	}

}

