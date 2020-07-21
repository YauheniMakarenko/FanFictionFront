import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from '../_services/token-storage.service';
import {CompositionService} from '../_services/composition.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../_services/user.service';
import {AppComponent} from '../app.component';

export class Composition {
  title: string;
  description: string;
  chapterAmount: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  displayedColumns: string[] = ['settings', 'title', 'description', 'chapterAmount'];
  dataSource: MatTableDataSource<Composition>;
  errorMessage: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private token: TokenStorageService, private compositionService: CompositionService, private router: Router,
              private userService: UserService, private route: ActivatedRoute, private appComponent: AppComponent) {
  }


  ngOnInit() {
    if (this.token.getUser().roles[0] === 'ROLE_ADMIN') {
      this.route.params.subscribe(data => {
        this.userService.getUser(data.userId).subscribe(user => {
          if (this.token.getUser().id !== user['id']) {
            this.token.saveUser(user);
            this.token.saveToken(user['accessToken']);
            this.appComponent.ngOnInit();
            this.ngOnInit();
          }
        });
      });
    }
    if (this.token.getUser().roles[0] === 'ROLE_NOUSER') {
      this.token.signOut();
      this.appComponent.ngOnInit();
    }

    if (this.token.getUser() === null) {
      this.router.navigateByUrl("/login");
    } else {
      this.currentUser = this.token.getUser();
      this.compositionService.getCompositionsForCurrentUser().subscribe(compositions => {
        this.currentUser.compositions = compositions;
        this.dataSource = new MatTableDataSource(this.currentUser.compositions);
        this.dataSource.filterPredicate = (data: Composition, filter: string): boolean => {
          return data.title.toLowerCase().includes(filter)
            || data.description.toLowerCase().includes(filter)
            || data.chapterAmount.toString().includes(filter);
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addComposition() {
    this.router.navigateByUrl('/newcomposition');
  }

  addChapter(compositionId: number) {
    this.compositionService.imgUrl = null;
    this.compositionService.compositionId = compositionId;
    this.router.navigateByUrl('composition/' + compositionId + '/chapter');
  }

  editComposition(compositionId: number) {
    this.router.navigateByUrl('/newcomposition/' + compositionId);

  }

  readComposition(compositionId: number) {
    this.router.navigateByUrl('/composition/' + compositionId);
  }

  deleteComposition(compositionId: number) {
    this.compositionService.deleteComposition(compositionId).subscribe(() => this.ngOnInit());
  }

  editUser(changeUserName: string) {
    this.currentUser.username = changeUserName;
    this.userService.editUser(this.currentUser.id, changeUserName).subscribe(data => {
      this.errorMessage = null;
      this.token.saveToken(data['accessToken']);
      this.token.saveUser(this.currentUser);
      this.appComponent.ngOnInit();
    }, err => {
      this.errorMessage = err.error;
      this.ngOnInit();
    });
  }
}
