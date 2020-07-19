import {Component, OnInit, ViewChild} from '@angular/core';
import { UserService } from '../_services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {CompositionService} from "../_services/composition.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content: string;
  compositions: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredCompositions: any[] = [];
  compositionAmount: number;

  constructor(private compositionService: CompositionService, private router: Router) { }

  ngOnInit() {
    this.compositionService.getAllComposition().subscribe(
      data => {
        this.compositions = data;
        this.compositions.paginator = this.paginator;
        this.filteredCompositions = this.compositions.slice(0, 4);
        this.compositionAmount = this.compositions.length;
      },
    );
  }

  onPaginateChange(data) {
    this.filteredCompositions =  this.compositions.slice(data.pageIndex * data.pageSize, data.pageIndex * data.pageSize + data.pageSize);
  }

  showMore(compositionId: string) {
    if ((document.getElementById(compositionId) as HTMLElement).style.whiteSpace === 'pre-wrap') {
      (document.getElementById(compositionId) as HTMLElement).style.whiteSpace = 'nowrap';
    } else {
      (document.getElementById(compositionId) as HTMLElement).style.whiteSpace = 'pre-wrap';
    }
  }

  readComposition(compositionId: number){
    this.router.navigateByUrl('/composition/' + compositionId);
  }
}
