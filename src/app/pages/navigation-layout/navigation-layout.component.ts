import { Component, HostListener, Renderer2, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import pageSettings from '../../config/page-settings';
//import * as global from '../../config/globals';

import * as $ from 'jquery';


import { ShareddataService } from '../../services/shared/shareddata.service';
import { Subscription } from 'rxjs';
import { globalSharedService } from '../../services/global/globalSharedService';
export let browserRefresh = false;

@Component({
  selector: 'app-navigation-layout',
  templateUrl: './navigation-layout.component.html',
  styleUrls: ['./navigation-layout.component.css']
})
export class NavigationLayoutComponent implements OnInit {


  pageSettings;
  theme: any;
  sidebarMenuFlag:any;
  topMenu: any;

  constructor(
    private DataService: ShareddataService,
    private titleService: Title,
    private slimLoadingBarService: SlimLoadingBarService,
    private router: Router, private renderer: Renderer2,
    private globalSharedService: globalSharedService
  ) {
   let themeJson= sessionStorage.getItem('theamName');
   
  if(themeJson){
    this.theme=JSON.parse(themeJson);
    this.theme.forEach(object => {
      if (object.isSelected == true) {
        this.sidebarMenuFlag= object.sidebarMenu;
        this.topMenu= object.topMenu;
        sessionStorage.setItem('sidebarMenu',this.sidebarMenuFlag);
        sessionStorage.setItem('topMenu',this.topMenu);
      }
    });
  }
  if(this.sidebarMenuFlag==undefined && this.topMenu==undefined){
    this.sidebarMenuFlag=true;
   }
    router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (window.innerWidth < 768) {
          this.pageSettings.pageMobileSidebarToggled = false;
        }
        if (e.url != '/') {
          slimLoadingBarService.progress = 50;
          slimLoadingBarService.start();
        }
        // Page reload handling ==> navigate to parent page
        browserRefresh = !router.navigated;
        if (browserRefresh) {
          let location = e.url.split('/');
          let getUrl;
          if (location.length > 3) {
            getUrl = location.splice(1, 2).join('/');
            this.router.navigate([getUrl]);
          }
        }
      }
      if (e instanceof NavigationEnd) {
        if (e.url != '/') {
          // this.glosetLanguageURL(e.url);
          this.globalSharedService.setLanguageURL(e.url);

         /*  let container = document.querySelector('#containerTop');
          container.scrollTop = 0; */

          $("#containerTop").scrollTop(0);

          setTimeout(function () {
            slimLoadingBarService.complete();
          }, 300);
        }
      }
    });
  //  console.log("currently in navigation layout constructor");
  }

  ngOnInit() {

    // page settings
    this.pageSettings = pageSettings;
    this.pageSettings.pageEmpty=false;
    if(this.topMenu){
      this.pageSettings.pageTopMenu=true;
    }
   // console.log("currently in navigation layout on init");
  }

  // window scroll
  pageHasScroll;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    if (top > 0) {
      this.pageHasScroll = true;
    } else {
      this.pageHasScroll = false;
    }
  }

  @Output() toggle = new EventEmitter();
  // set page minified
  onToggleSidebarMinified(val: boolean): void {
    this.toggle.emit(this.pageSettings.pageSidebarMinified);
    if (this.pageSettings.pageSidebarMinified) {
      this.pageSettings.pageSidebarMinified = false;
      this.DataService.changeMessage(false);
    } else {
      this.pageSettings.pageSidebarMinified = true;
      this.DataService.changeMessage(true);
    }
  }

  // set page right collapse
  onToggleSidebarRight(val: boolean): void {
    if (this.pageSettings.pageSidebarRightCollapsed) {
      this.pageSettings.pageSidebarRightCollapsed = false;
    } else {
      this.pageSettings.pageSidebarRightCollapsed = true;
    }
  }

  // hide mobile sidebar
  onHideMobileSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileSidebarToggled) {
      if (this.pageSettings.pageMobileSidebarFirstClicked) {
        this.pageSettings.pageMobileSidebarFirstClicked = false;
      } else {
        this.pageSettings.pageMobileSidebarToggled = false;
      }
    }
  }


  // toggle mobile sidebar
  onToggleMobileSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileSidebarToggled) {
      this.pageSettings.pageMobileSidebarToggled = false;
    } else {
      this.pageSettings.pageMobileSidebarToggled = true;
      this.pageSettings.pageMobileSidebarFirstClicked = true;
    }
  }


  // hide right mobile sidebar
  onHideMobileRightSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileRightSidebarToggled) {
      if (this.pageSettings.pageMobileRightSidebarFirstClicked) {
        this.pageSettings.pageMobileRightSidebarFirstClicked = false;
      } else {
        this.pageSettings.pageMobileRightSidebarToggled = false;
      }
    }
  }

  // toggle right mobile sidebar
  onToggleMobileRightSidebar(val: boolean): void {
    if (this.pageSettings.pageMobileRightSidebarToggled) {
      this.pageSettings.pageMobileRightSidebarToggled = false;
    } else {
      this.pageSettings.pageMobileRightSidebarToggled = true;
      this.pageSettings.pageMobileRightSidebarFirstClicked = true;
    }
  }


  subscription: Subscription;

  ngOnDestroy() {
    this.subscription.unsubscribe();
   // console.log("currently in navigation layout on destory");
  }

}
