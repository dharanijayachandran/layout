import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { MenuItemComponent } from './pages/menu-item/menu-item.component';
import { NavigationLayoutComponent } from './pages/navigation-layout/navigation-layout.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SidebarRightComponent } from './pages/sidebar-right/sidebar-right.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { TopMenuComponent } from './pages/top-menu/top-menu.component';
import { MainInterceptor } from "../app/main-interceptor";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from "@agm/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { UIModalNotificationPage } from './pages/modal-notification/modal-notification';
import { HyphenPipe } from './pages/pipe/hyphen.pipe';
import { AutoLogoutService } from './services/AutoLogout/auto-logout.service';
import { ScrollbarDirective } from './services/scroll-bar/scroll-bar.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AngularDraggableModule } from 'angular2-draggable';
import { MatSortModule } from '@angular/material/sort';
import { TrendModule } from 'ngx-trend';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { RoutingToLoginComponent } from './pages/routing-to-login/routing-to-login/routing-to-login.component';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavigationLayoutComponent,
    PageNotFoundComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    MenuItemComponent,
    UIModalNotificationPage,
    HyphenPipe,
    ScrollbarDirective,
    EmptyRouteComponent,
    RoutingToLoginComponent
  ],
  imports: [
    HttpClientModule,
   // CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SlimLoadingBarModule.forRoot(),
    ToastrModule,
    AngularDraggableModule,
    MatSortModule,
    MatToolbarModule,
    MatTreeModule,
    MatTooltipModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    TrendModule,
     NgbModule,
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyC5gJ5x8Yw7qP_DqvNq3IdZi2WUSiDjskk' }),
    RouterModule,
  ],
  providers: [Title,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    AutoLogoutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
