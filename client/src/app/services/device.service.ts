import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  getDevices()
  {
    return this.http.get<Device[]>('http://localhost:8080/devices');
  }
}
