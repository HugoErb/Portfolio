import { bootstrapApplication } from '@angular/platform-browser';
import 'iconify-icon';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(console.error);
