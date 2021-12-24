import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.sass'],
  providers: [DeviceService]
})
export class DevicesComponent implements OnInit {
  devices!: Device[];
  newDeviceForm!: FormGroup;

  constructor(
    private deviceService: DeviceService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.deviceService.getDevices()
    .subscribe(devices => 
    this.devices = devices);
  }

  onSubmit()
  {
    
  }

  addDevice()
  {
    this.deviceService.addDevice().subscribe()
    this.toastr.success(`Device has been added`)
  }

  getDevice(id: any)
  {

  }

  editDevice(id: any){

  }

  removeDevice(id: any) {
    this.deviceService.removeDevice(id)
      .subscribe(data =>{
        for(var i = 0; i < this.devices.length; i++)
        {
          if(this.devices[i]._id == id)
          {
            this.devices.splice(i,1);
          }
        }
      })
    this.toastr.success(`Device '${id}' has been deleted`)
  }
}
