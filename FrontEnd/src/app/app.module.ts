import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FeedComponent } from './components/feed/feed.component';
import { VideoComponent } from './components/video/video.component';


import { NavbarComponent } from './components/navbar/navbar.component';
import { FlashMessagesModule } from 'angular2-flash-messages';


import { ValidateService } from './services/validate.service';
import { AuthenticateService } from './services/authenticate.service';
import { VideoFeedService } from './services/videofeed/video-feed.service';

const appRoutes: Routes =  [
  {path:'', component: FeedComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  /*{path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'feed', component: FeedComponent, canActivate:[AuthGuard]}*/
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FeedComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [VideoFeedService, AuthenticateService, ValidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }