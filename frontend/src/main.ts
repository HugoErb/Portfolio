import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const loadDeferredIcons = (): void => {
  void import('iconify-icon');
};

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadDeferredIcons, { timeout: 1000 });
    } else {
      globalThis.setTimeout(loadDeferredIcons, 0);
    }
  })
  .catch(console.error);
