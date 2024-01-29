import { group, animate, query, style, trigger, transition, state } from '@angular/animations';
import { Component, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import pageSettings from '../../config/page-settings';
import pageMenus from '../../config/page-menus';
import * as global from '../../config/globals';
import { globalSharedService } from 'src/app/services/global/globalSharedService';
import { MenuService } from 'src/app/services/menu/menu.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Menu } from 'src/app/model/menu';
import { interval } from 'rxjs';
@Component({
  selector: 'topMenu',
  templateUrl: './top-menu.component.html',
  styleUrls:['./top-menu.component.css']
})

export class TopMenuComponent implements AfterViewInit {
  @ViewChild('topMenuContainer') topMenuContainer;

  menus:Menu[];
  navControlLeft = false;
  navControlRight = false;
  navWidth = 0;
  navMarginLeft = 0;
  navMarginRight = 0;
  pageSettings = pageSettings
  pagemenu: Menu[];

  constructor(private globalService: globalSharedService, private eRef: ElementRef, private menu: MenuService, private router: Router, private httpService: HttpClient) {
    this.pageSettings.pageWithoutSidebar = true;
    this.pageSettings.pageTopMenu = true;
    if (sessionStorage.getItem('userId') != null && sessionStorage.getItem('userId') != 'undefined') {
      if (sessionStorage.getItem('pagemenu') != null && sessionStorage.getItem('pagemenu') != 'undefined') {
        this.pagemenu = JSON.parse(sessionStorage.getItem('pagemenu'));
        this.traverseDown(this.pagemenu);
        this.updateLevels(this.pagemenu, 1);
      }
      else {
        
        this.getLoggedInMenu();
      }
    }
  //  console.log("currently in top menu constructor");
  }
   /* Set visible value to all childrens of passed tree */
   traverseDown(menuObject) {
    try {
      for (let idx in menuObject) {
        menuObject[idx]["visible"] = true;
        if (menuObject[idx]["menus"].length > 0) this.traverseDown(menuObject[idx]["menus"]);
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }
  updateLevels(list, index) {
    var that = this;
    return list.map(function (d, i) {
      d.level = index;
      if (d.menus && d.menus.length) {
        d.menus = that.updateLevels(d.menus, index + 1);
      }
      return d;
    });
  }
  getLoggedInMenu() {
    this.pagemenu = this.menu.getSideBarMenus();
  //  console.log("Top menu component in side service call ")
    this.pagemenu=JSON.parse(sessionStorage.getItem('loggedinMenus'));
  //   console.log("Page menus"+JSON.stringify(this.pagemenu));
    //   interval(1000).subscribe(x => {
    //     if(this.pagemenu===null || this.pagemenu===undefined){
    //       this.pagemenu=JSON.parse(sessionStorage.getItem('loggedinMenus'));
    //       console.log("Top menu component intervel in side service call"+JSON.stringify(this.pagemenu));   
    //     }
    // });
    this.pagemenu = this.pagemenu.filter(menu => menu.status === "Active")

    this.pagemenu.forEach(menu => {
      if (menu.menus) {
        menu.menus = this.filterSubMenus(menu.menus)

      }
    })
    this.traverseDown(this.pagemenu);
    this.updateLevels(this.pagemenu, 1);
    // 
    sessionStorage.setItem('pagemenu', JSON.stringify(this.pagemenu));
  }

  controlLeft() {
    var widthLeft = this.navMarginLeft;
    var containerWidth = this.topMenuContainer.nativeElement.clientWidth;
    var finalScrollWidth = 0;

    if (widthLeft <= containerWidth) {
      finalScrollWidth = 0;
      this.navControlLeft = false;
    } else {
      finalScrollWidth = widthLeft - containerWidth + 88;
    }

    if (!document.body.classList.contains('rtl-mode')) {
      this.navMarginLeft = finalScrollWidth;
      this.navMarginRight = 0;
      this.navControlRight = true;
    } else {
      this.navMarginRight = finalScrollWidth;
      this.navMarginLeft = 0;
      this.navControlRight = true;
    }
  }

  controlRight() {
    var containerWidth = this.topMenuContainer.nativeElement.clientWidth - 88;
    var widthLeft = this.navWidth + (-this.navMarginLeft) - containerWidth;
    var finalScrollWidth = 0;

    if (widthLeft <= containerWidth) {
      finalScrollWidth = widthLeft - (-this.navMarginLeft) + 128;
      this.navControlRight = false;
    } else {
      finalScrollWidth = containerWidth - (-this.navMarginLeft) - 128;
    }

    if (finalScrollWidth !== 0) {
      if (!document.body.classList.contains('rtl-mode')) {
        this.navMarginLeft = finalScrollWidth;
        this.navMarginRight = 0;
      } else {
        this.navMarginRight = finalScrollWidth;
        this.navMarginLeft = 0;
      }
      this.navControlLeft = true;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      var windowWidth = this.topMenuContainer.nativeElement.clientWidth - 128;
      var listFullWidth = 0;
      var listPrevWidth = 0;
      var listActive = false;

      const navList = Array.from(document.querySelectorAll('.top-menu .nav > li'));
      navList.forEach(function (list) {
        const elm = list as any;
        listFullWidth += elm.offsetWidth;
        listPrevWidth += (!listActive) ? elm.offsetWidth : 0;
        listActive = (elm.classList.contains('active')) ? true : listActive;
      });

      this.navWidth = listFullWidth;

      listPrevWidth = (!listActive) ? 0 : listPrevWidth;

      if (listPrevWidth >= windowWidth) {
        var finalScrollWidth = listPrevWidth - windowWidth + 128;
        if (!document.body.classList.contains('rtl-mode')) {
          this.navMarginLeft = finalScrollWidth;
          this.navMarginRight = 0;
        } else {
          this.navMarginRight = finalScrollWidth;
          this.navMarginLeft = 0;
        }
      }

      this.navControlRight = (listPrevWidth != listFullWidth && listFullWidth >= windowWidth) ? true : false;
      this.navControlLeft = (listPrevWidth >= windowWidth && listFullWidth >= windowWidth) ? true : false;
    });
   // console.log("currently intop menu after view init");
  }

  expandCollapseSubmenu(currentMenu, allMenu, active) {
    // if (currentMenu.state == 'expand' || (active.isActive && !currentMenu.state)) {
    //   currentMenu.state = 'collapse';
    // } else {
    //   currentMenu.state = 'expand';
    // }
  }
  filterSubMenus(menus: any[]) {
    menus = menus.filter(menu => menu.status === "Active")
    menus.forEach(menu => {
      if (menu.menus) {
        menu.menus = this.filterSubMenus(menu.menus)
      }
    })
    return menus;
  }


}
