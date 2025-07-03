import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';
import esCR from '@angular/common/locales/es-CR';

registerLocaleData(esCR);
registerLocaleData(localeEs, 'es');

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    importProvidersFrom(
      CommonModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),

    { provide: LOCALE_ID, useValue: 'es' }
  ]
});
