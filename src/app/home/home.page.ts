import { Component, NgZone } from '@angular/core';
import { CallbackID, Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isActionSheetOpen = false;
  coordinate: any;
  watchCoordinate: any;
  watchId: any;

  constructor(private zone: NgZone) { }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
  }

  getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy
      };
    }).catch(err => {
      console.error(err);
    });
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        if (position != null) {
          console.log('Watch', position);
          this.zone.run(() => {
            this.watchCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          });
        }else{
          console.error('The position is null');
        }

      });
    } catch (e) {
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }




  public actionSheetButtons = [
    {
      text: 'Enable Permissions',
      handler: () => {
        this.requestPermissions();
      },
    },

    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

}