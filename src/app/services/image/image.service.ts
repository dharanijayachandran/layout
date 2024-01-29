import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
   apiurl = environment.baseUrl_empyrealUniverseImage;
  // apiurl='http://localhost:8080/streetlightwebservices/image';
  constructor(private http: HttpClient) { }
  getImage(_organizationId:string, _imageName:string):Observable<any>{
    let url = 'image'+'?organizationId=' + _organizationId + '&Logo=' + _imageName ;
    return this.http.get<any>(this.apiurl+url);
 }
}
