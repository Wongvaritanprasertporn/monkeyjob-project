import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  socket = io(environment.url);

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message : any) =>{
      console.log('chat', JSON.parse(message));

      if(message) {
        this.message$.next(JSON.parse(message));
      }
    });
    
    return this.message$.asObservable();
  };
}