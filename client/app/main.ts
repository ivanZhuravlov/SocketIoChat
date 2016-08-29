import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { UserService } from './user.service'
platformBrowserDynamic().bootstrapModule(AppModule);