import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.sass'],
  providers: [DeviceService]
})
export class DevicesComponent implements OnInit {
  devices!: Device[];

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.deviceService.getDevices()
      .subscribe(devices => 
      this.devices = devices);
  }

}
