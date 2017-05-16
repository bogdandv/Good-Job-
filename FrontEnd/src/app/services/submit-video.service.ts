import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SubmitVideoService {

  constructor(private http:Http) {}
  
  submitVideo(videoInformation){
    let headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8000/routes/upload',videoInformation,
    {headers:headers}).map(res=>res.json());
  }

  submitComment(commentInformation) {
     let headers=new Headers();
     headers.append('Content-Type','application/json');
     return this.http.post('http://localhost:8000/routes/postComment',commentInformation,
    {headers:headers}).map(res=>res.json());
  }

  remove(id) {
     let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = this.prepEndpoint('routes/deletecomm');
    return this.http.post(ep, id, { headers: headers })
      .map(res => res.json());
  }

   private prepEndpoint(ep){
    return 'http://localhost:8000/'+ep;
  }

}
