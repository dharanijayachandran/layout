import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component, ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  AfterViewChecked,
  ViewEncapsulation
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import pageSettings from '../../config/page-settings';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu/menu.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('expandCollapse', [
      state('expand', style({ height: '*', overflow: 'hidden', display: 'block' })),
      state('collapse', style({ height: '0px', overflow: 'hidden', display: 'block' })),
      state('active', style({ height: '*', overflow: 'hidden', display: 'block' })),
      transition('expand <=> collapse', animate(100)),
      transition('active => collapse', animate(100))
    ])
  ]
})
export class MenuItemComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  // pagemenu: any;
  scrollTop:any;
  public menuSize;
  public isActive = false;

  @Input() menuItem;
  @Input() menus;

  @Output() checkActive: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MenuItemComponent) menuComponent: MenuItemComponent;

  @ContentChildren('ul') comps !: QueryList<HTMLElement>;

  @ViewChild('rla') rla;

  private hostActive = true;
  private hostActiveSm = false;


  ngOnInit() {
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.updateActiveState();
        $('.nav li').removeClass('active');
        if (this.rla) {
          setTimeout(() => {
            // console.log(this.rla.isActive);
            if (this.rla.isActive) {
              this.checkActive.emit();
              $(this.rla.element.nativeElement).parents('li.expand').addClass('active');
              $(this.rla.element.nativeElement).addClass('active');
              $(this.rla.element.nativeElement).find('li.expand').addClass('active');
            }
          })
        }
      }
    });

  }

  ngOnChanges() {
  }

  ngAfterViewInit() {
    this.updateActiveState();
    $('.nav li.expand').addClass('active');

  }

  ngAfterViewChecked() {

  }

  // public toggleActive(): void {
  //   this.isActive = !this.isActive;
  //   // if (this.menuComponent) {
  //   //   this.menuComponent.isActive = true;
  //   // }
  // }

  private updateActiveState(): void {

    // reset previous state
    this.isActive = false;
    if (this.menuComponent) {
      this.menuComponent.isActive = false;
    }
  }

  public setActive() {
    this.isActive = true;
  }


  //	menus = pageMenus;
  pagemenu: Menu[];
  pageSettings = pageSettings;

  expandCollapseSubmenu(currentMenu, allMenu, active) {
    if (currentMenu.level == 1) {
      this.removeActiveExpandClass();
      // Menu expand and collapse
      this.menuExpandCollpaseHandling(currentMenu, allMenu, active);
    } else if (currentMenu.level > 1 && !currentMenu.pageUrl) {
      $(this.rla.element.nativeElement).parents('app-menu-item').siblings().find('li.active.expand > div').css({
        'height': '0px',
        'overflow': 'hidden',
        'display': 'block'
      });
      $(this.rla.element.nativeElement).parents('app-menu-item').siblings().find('li.active.expand').removeClass('expand');
      // Menu expand and collapse
      this.menuExpandCollpaseHandling(currentMenu, allMenu, active);
    }
  }


  removeActiveExpandClass() {
    $('.nav li.active.expand > div').css({
      'height': '0px',
      'overflow': 'hidden',
      'display': 'block'
    });
    $('.nav li.active').removeClass('expand');
  }


  getParentOfClickedObject(menuItem) {
    if (menuItem.level != 1) {
      let parentMenuId = menuItem.parentMenuId;
      return this.getParentMenu(parentMenuId, this.pagemenu);
    } else {
      return this.pagemenu;
    }
  }

  // Get Parent Menu by child
  getParentMenu(id, pagemenu) {
    try {
      for (let idx in pagemenu) {
        if (id === pagemenu[idx].id) {
          return pagemenu[idx];
        } else {
          if (pagemenu[idx]["menus"].length > 0) this.getParentMenu(id, pagemenu[idx]["menus"]);
        }
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }

  // Menu expand and collapse
  menuExpandCollpaseHandling(currentMenu, allMenu, active) {
    for (let menu of allMenu) {
      if (menu != currentMenu) {
        this.handleCollapseExpandMenu(menu);
      }
    }

    if (currentMenu.state == 'expand' || (active.isActive && !currentMenu.state)) {
      currentMenu.state = 'collapse';
    } else {
      currentMenu.state = 'expand';
    }
  }

  // If 
  handleCollapseExpandMenu(menu) {
    menu.state = 'collapse';
    var p;
    if (menu.menus.length && menu.menus) {
      for (p in menu.menus) {
        this.handleCollapseExpandMenu(menu.menus[p]);
      }
    }
  }

  collapseMenuNotPageURL(menu) {
    menu.state = 'collapse';
  }

  changePaddingLeft(level) {
    if (level > 2) {
      return { 'padding-left': 10 * level + "px" };
    }
  }

  constructor(private router: Router, private menu: MenuService) { }
}


setTimeout(() => {
  $('.nav li.active').parents('li').addClass('active expand');
  $('.nav li.active.expand > div').css({
    'height': 'auto',
    'overflow': 'hidden',
    'display': 'block'
  });
}, 2000)



