import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  host = 'http://localhost:8080/devices'

  constructor(private http: HttpClient) { }

  getDevices()
  {
    return this.http.get<Device[]>(this.host);
  }

  addDevice()
  {
    return this.http.post(this.host,{name: "creation test"});
  }

  removeDevice(id: any)
  {
    return this.http.delete(`${this.host}/${id}`);
  }
}
