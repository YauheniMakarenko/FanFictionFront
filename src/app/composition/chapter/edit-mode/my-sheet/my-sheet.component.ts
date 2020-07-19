import {Component, OnInit} from '@angular/core';
import {CompositionService} from '../../../../_services/composition.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';


@Component({
  selector: 'app-my-sheet',
  templateUrl: './my-sheet.component.html',
  styleUrls: ['./my-sheet.component.css']
})
export class MySheetComponent implements OnInit {


  constructor(private compositionService: CompositionService, private bottomSheet: MatBottomSheet,
              private router: Router) {
  }

  ngOnInit() {
  }

  editImage() {
    if (this.compositionService.chapter !== undefined && (this.router.url === '/composition/' +
      this.compositionService.compositionId + '/chapter/' + this.compositionService.chapter.id + '/editmode')) {

      this.compositionService.callLoadImage('loadImage-edit');
    } else {
      this.compositionService.callLoadImage('loadImage');
    }
    this.bottomSheet.ngOnDestroy();
  }

  deleteImage() {
    if (this.compositionService.chapter !== undefined && (this.router.url === '/composition/' +
      this.compositionService.compositionId + '/chapter/' + this.compositionService.chapter.id + '/editmode')) {

      this.compositionService.deleteImage('hidden-icon-edit');
    } else {
      this.compositionService.deleteImage('hidden-icon');
    }
    this.bottomSheet.ngOnDestroy();
  }
}
