import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import pageSettings from './config/page-settings';
import { AutoLogoutService } from './services/AutoLogout/auto-logout.service';
@Component({
  selector: 'layout-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'layout';
  gettingToggleStatusSideBar: any;
  @ViewChild("sideMenu") sideMenuStatus;
   @ViewChild("topMenu") topMenuStatus;
    myValue: string;
    theme: any;
    sidebarMenuFlag: any;
    topMenu: any;
  loginUrl: any;
  subscription: Subscription;
  browserRefresh: boolean;
  pageSettings=pageSettings;
  path: string;
    gettingToggleStatus($event) {
      this.gettingToggleStatusSideBar = $event;
      //alert(this.gettingToggleStatusSideBar);
      if (!this.gettingToggleStatusSideBar) {
        // set as closed
        sessionStorage.setItem('sideMenuBarStatus', 'closed');
        if(this.sidebarMenuFlag){
          this.sideMenuStatus.nativeElement.classList.add("show");
        }else{
          this.topMenuStatus.nativeElement.classList.add("show");
        }
        let expand_collapse = document.querySelector('.main-content .content');
        expand_collapse.classList.add('show')
      } else {
        // set as open
        sessionStorage.setItem('sideMenuBarStatus', 'open');
        if(this.sidebarMenuFlag){
          this.sideMenuStatus.nativeElement.classList.remove("show");
        }else{
          this.topMenuStatus.nativeElement.classList.remove("show");
        }
        let expand_collapse = document.querySelector('.main-content .content');
        expand_collapse.classList.remove('show')
      }
    }
    constructor( private autoLogout: AutoLogoutService,private router: Router) {
      sessionStorage.setItem('sideMenuBarStatus', 'open');
      let themeJson= sessionStorage.getItem('theamName');
      this.theme=JSON.parse(themeJson);
      if(this.theme){
        this.theme.forEach(object => {
          if (object.isSelected == true) {
            this.sidebarMenuFlag= object.sidebarMenu;
            this.topMenu= object.topMenu;
            this.loginUrl=object.loginUrl;
            sessionStorage.setItem('sidebarMenu',this.sidebarMenuFlag);
            sessionStorage.setItem('topMenu',this.topMenu);
            sessionStorage.setItem('loginUrl',this.loginUrl);
          }
        });
        //brouser refresh (on click of browser refresh navigating to root url).
        this.subscription = router.events.subscribe((event) => {
          let requiredPath = document.location.href.split("#");
	      	this.path = requiredPath[1];
		    // Checking already langauge selected or not	 
	     	let getSelectedLanguage = this.path.split('/')
          if (event instanceof NavigationStart) {
            this.browserRefresh = !router.navigated;
          }
          if(this.browserRefresh && getSelectedLanguage[2]===undefined) {
            this.pageSettings.pageEmpty = true;
            window.location.href = '#/';
          }
          
      });
      }
     if(this.sidebarMenuFlag==undefined && this.topMenu==undefined){
      this.sidebarMenuFlag=true;
     }
      // console.log("Inside app component"+this.theme);
      // console.log("currently in app component constructor");
    }
    ngOnInit() {
      sessionStorage.setItem('sideMenuBarStatus', 'open');
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
      if(sessionStorage.getItem('resetpassword') == null ) {
        this.autoLogout.logout();
        return false;
      }
    }
    @HostListener('window:unload', ['$event'])
    unloadHandler(event) {
      this.autoLogout.logout();
      return false;
    }
}
