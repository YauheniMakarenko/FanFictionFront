import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenStorageService} from '../_services/token-storage.service';
import {Router} from '@angular/router';
import {UserService} from '../_services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

class User {
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})


export class BoardAdminComponent implements OnInit {

  users: any;
  displayedColumns: string[] = ['settings', 'username', 'email', 'role'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private token: TokenStorageService, private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    if (this.token.getUser() === null || this.token.getUser().roles[0] !== 'ROLE_ADMIN') {
      this.router.navigateByUrl('/home');
    } else {
      this.userService.getAllUsers().subscribe(dataUsers => {
        this.users = dataUsers;
        for (const user of this.users) {
          user.role = this.users[this.users.indexOf(user)].roles[0].name;
        }

        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
          return data.username.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter) ||
            data.role.toLowerCase().includes(filter);
        };
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

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => this.ngOnInit());
  }

  blockUser(userId: number) {
    this.userService.blockUser(userId).subscribe(() => {
      if (userId === this.token.getUser().id) {
        this.token.signOut();
        window.location.reload();
      } else {
        this.ngOnInit();
      }
    });
  }

  setUserRole(userId: number) {
    this.userService.setUserRole(userId).subscribe(() => {
      this.ngOnInit();
      if (userId === this.token.getUser().id) {
        this.token.signOut();
        window.location.reload();
      } else {
        this.ngOnInit();
      }
    });
  }

  setAdminRole(userId: number) {
    this.userService.setAdminRole(userId).subscribe(() => this.ngOnInit());
  }

  openProfile(userId: number) {
    this.router.navigateByUrl('profile/' + userId);
  }
}
