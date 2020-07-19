import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {Chapter, CompositionService} from '../../../_services/composition.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @Output('readingMode') readingMode: EventEmitter<any> = new EventEmitter();
  @Output() chapter: Chapter;
  compositionId: number;
  title: string;
  isExpanded = true;
  showSubmenu = true;
  isShowing = false;
  chapters: Array<Chapter>;


  constructor(public compositionService: CompositionService, private router: Router) {
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  ngOnInit() {
    if (this.compositionService.compositionId) {
      this.compositionId = this.compositionService.compositionId;
      this.compositionService.getComposition(this.compositionId).subscribe(composition =>
        this.title = composition.title);
      this.compositionService.getChapters(this.compositionId).subscribe(data => {
          this.chapters = data;
          this.compositionService.chapters = this.chapters;
        });
    }
  }

  readChapter(chapterId: number) {
    this.chapter = this.chapters.find(chapter => chapter.id === chapterId);
    this.readingMode.emit();
  }

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.chapters,
      event.previousIndex,
      event.currentIndex
    );
    this.compositionService.saveAllChapters(this.chapters).subscribe(() => this.ngOnInit());
  }

  addChapter() {
    this.compositionService.imgUrl = null;
    this.router.navigateByUrl('/composition/'
      + this.compositionId + '/chapter');
  }
}
