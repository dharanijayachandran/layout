import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import pageSettings from 'src/app/config/page-settings';

@Component({
  selector: 'layout-routing-to-login',
  templateUrl: './routing-to-login.component.html',
  styleUrls: ['./routing-to-login.component.css']
})
export class RoutingToLoginComponent implements OnInit {
  pageSettings=pageSettings;
  timeInterverl= 1000;
  pageEmpty: boolean;
  pageEmptyAfterLogout: boolean;
  constructor(private router: Router) {
    var currentUrl = window.location.href;
    currentUrl = currentUrl.replace(null, "");
    window.location.href = currentUrl;
    let pageEmpty= window.sessionStorage.getItem('pageEmpty');
    let logout=window.sessionStorage.getItem('logout');
    if(logout!=undefined && logout=='true'){
      window.sessionStorage.removeItem('pageEmpty');
      this.pageSettings.pageEmpty = true;
      this.pageEmpty=true;
    }
    if(pageEmpty!='false' || pageEmpty===undefined || logout===undefined || logout===null) {
      sessionStorage.setItem('pageEmpty','true');
      this.pageEmpty=true;
      this.pageSettings.pageEmpty = true;
    }else{
      let stringTrue='true';
      if(pageEmpty===stringTrue){
        this.pageEmpty=false;
      }
    }

   }

  ngOnInit(): void {
    let loginUrl = sessionStorage.getItem("loginUrl");
    if(null != loginUrl){
      if("null" == loginUrl){
      loginUrl="";
      sessionStorage.setItem('pageEmpty', 'true');
      }
      this.callIntervell();
      this.router.navigate(['/'+loginUrl]);
    }else{
      var currentUrl = window.location.href;
      currentUrl = currentUrl.replace(null, "");
      window.location.href = currentUrl;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([this.router.url]));
      window.location.reload();
    }
  }
  callIntervell() {
    interval(1000).subscribe(x => {
      if(this.pageEmpty){
        this.onTimeOut();
      }
  });

  }

  onTimeOut() {
    let pageEmpty= window.sessionStorage.getItem('pageEmpty');
      if(pageEmpty==='false'){
       this.pageSettings.pageEmpty = false;
       this.pageEmpty=false;
      // this.timeInterverl=0;
      }else{
       this.pageSettings.pageEmpty = true;
       this.pageEmpty=true;
      }
  }
}
