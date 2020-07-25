import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css']
})
export class GoogleAuthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
              private tokenStorage: TokenStorageService, private router: Router, private appComponent: AppComponent) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.authService.authFromGoogle(params.code).subscribe(data => {
          if (!(data.roles[0] === 'ROLE_NOUSER')) {
            this.tokenStorage.saveToken(data.accessToken);
            this.tokenStorage.saveUser(data);
            this.router.navigateByUrl('home');
            this.appComponent.ngOnInit();
          }else {
            this.router.navigateByUrl('login');
          }
        });
      });
  }

}
