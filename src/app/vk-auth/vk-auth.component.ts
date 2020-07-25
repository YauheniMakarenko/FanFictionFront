import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-vk-auth',
  templateUrl: './vk-auth.component.html',
  styleUrls: ['./vk-auth.component.css']
})
export class VkAuthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
              private tokenStorage: TokenStorageService, private router: Router, private appComponent: AppComponent) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.authService.authFromVk(params.code).subscribe(data => {
            if (!(data.roles[0] === 'ROLE_NOUSER')) {
              this.tokenStorage.saveToken(data.accessToken);
              this.tokenStorage.saveUser(data);
              this.router.navigateByUrl('home');
              this.appComponent.ngOnInit();
            } else {
              this.router.navigateByUrl('login');
            }
          }
        );
      });
  }
}
