import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { globalSharedService } from '../../services/global/globalSharedService';
import pageSettings from '../../config/page-settings';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu/menu.service';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements AfterViewChecked, OnInit {
  navProfileState = 'collapse';
  @ViewChild('sidebarScrollbar') private sidebarScrollbar: ElementRef;
  @Output() toggleSidebarMinified = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Input() pageSidebarTransparent;
  @Input() pageSidebarMinified;

  // Importing child component to
  @ViewChild(MenuItemComponent) menuComponent: MenuItemComponent;

  //	menus = pageMenus;
  pagemenu: Menu[];
  pageSettings = pageSettings;

  mobileMode;
  desktopMode;
  scrollTop;
  isMenuExpands: boolean = true;
  resizeSideBar: any;
  resizeStopSideBar: any;
  sidebarResizeReset: boolean = false;
  rzMinWidthSidebar = 232;
  sideBarMinimized: boolean = true;
  expandCollpage: string = "Collapse";
  searchClearIcon: boolean;


  ngOnInit() {
  }


  ngAfterViewInit() {
  }



  toggleNavProfile() {
    if (this.navProfileState == 'collapse') {
      this.navProfileState = 'expand';
    } else {
      this.navProfileState = 'collapse';
    }
  }

  toggleMinified() {
    if (this.isMenuExpands) {
      this.isMenuExpands = false;
      //alert('about to collapse');
    }
    else {
      this.isMenuExpands = true;
    }
    //alert('about to expande');
    this.sideBarMinimized = !this.sideBarMinimized;
    if (this.sideBarMinimized) {
      this.expandCollpage = "Collapse"
    } else {
      this.expandCollpage = "Expand"
    }
    this.toggleSidebarMinified.emit(true);
    this.scrollTop = 40;
  }

  onMenuSelection() {
    this.globalService.clearInfo()
  }


  collapseMenuNotPageURL(menu) {
    menu.state = 'collapse';
  }


  res = [];

  getLoggedInMenu() {
    this.pagemenu = this.menu.getSideBarMenus();
    this.pagemenu=JSON.parse(sessionStorage.getItem('loggedinMenus'));
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

  filterSubMenus(menus: any[]) {
    menus = menus.filter(menu => menu.status === "Active")
    menus.forEach(menu => {
      if (menu.menus) {
        menu.menus = this.filterSubMenus(menu.menus)
      }
    })
    return menus;



  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.hideMobileSidebar.emit(true);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollTop = (this.pageSettings.pageSidebarMinified) ? event.srcElement.scrollTop + 40 : 0;
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('sidebarScroll', event.srcElement.scrollTop);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof (Storage) !== 'undefined' && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }


  constructor(private globalService: globalSharedService, private eRef: ElementRef, private menu: MenuService, private router: Router, private httpService: HttpClient) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }

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

  // expanding/Collpsing Menus if input field is matched
  expandCollpse(menuObj, statusExpandCollapse) {
    try {
      for (let index in menuObj) {
        if (statusExpandCollapse == "expand") {
          if (menuObj[index].visible) {
            this.iteratemenu(menuObj, index, statusExpandCollapse);
          }
        } else {
          this.iteratemenu(menuObj, index, statusExpandCollapse);
        }
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }

  iteratemenu(menuObj, index, statusExpandCollapse) {
    menuObj[index]["state"] = statusExpandCollapse;
    if (menuObj[index]["menus"].length > 0) this.expandCollpse(menuObj[index]["menus"], statusExpandCollapse);
  }

  treeControl = new NestedTreeControl<Menu>(node => node.menus);

  // User search
  filterChanged(filterText: string) {
    if (filterText.length) {
      this.searchClearIcon = true;
    } else this.searchClearIcon = false;

    this.applyFilter(this.pagemenu, filterText);
    if (filterText) {
      this.expandCollpse(this.pagemenu, "expand");
    } else {
      this.expandCollpse(this.pagemenu, "collapse");
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

  // Clear input search
  searchValue: string = '';
  clearSearch() {
    this.filterChanged('');
  }

  // Filtering the Nodes by user input
  applyFilter(list, searchString) {
    const that = this;
    let isSubMenusVisible;
    return list.map(function (d) {
      isSubMenusVisible = null;
      if (d.menus && d.menus.length) {
        d.menus = that.applyFilter(d.menus, searchString);
        isSubMenusVisible = d.menus.filter(function (sm) {
          return sm.visible;
        });
      }
      d.visible = d.name.toLowerCase().includes(searchString.toLowerCase()) || (isSubMenusVisible && isSubMenusVisible.length > 0 ? true : false);
      return d;
    });
  }

  onResizeStart(event) {
  }

  onResizing(event) {
  }

  onResizeStop(event) {
    this.resizeStopSideBar = event.size.width;
    if (this.resizeStopSideBar != this.rzMinWidthSidebar) {
      this.sidebarResizeReset = true;
    } else {
      this.sidebarResizeReset = false;
    }
  }

  defaultSidebarWidth() {
    let sidebar = document.getElementById('sidebar');
    sidebar.removeAttribute('style');
    this.sidebarResizeReset = false;
  }

}

