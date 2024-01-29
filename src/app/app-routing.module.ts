import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { RoutingToLoginComponent } from './pages/routing-to-login/routing-to-login/routing-to-login.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RoutingToLoginComponent
  },
  { 
    path: '**', 
    component: EmptyRouteComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppRoutingModule { }
