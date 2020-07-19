import {AfterViewInit, Component, DoCheck, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Chapter, CompositionService} from '../../_services/composition.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {CompositionComponent} from '../composition.component';
import {TokenStorageService} from '../../_services/token-storage.service';


@Component({
  selector: 'app-reading-mode',
  templateUrl: './reading-mode.component.html',
  styleUrls: ['./reading-mode.component.css']
})
export class ReadingModeComponent implements OnInit, DoCheck, AfterViewInit {

  isCreator = false;
  chapter: Chapter;

  constructor(public compositionService: CompositionService, private router: Router,
              private storageService: TokenStorageService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.compositionService.chapter === undefined) {
      this.router.navigateByUrl('composition/' + this.compositionService.compositionId);
    } else {
      this.chapter = this.compositionService.chapter;
      this.compositionService.getComposition(this.compositionService.compositionId).subscribe(data => {
        if (this.storageService.getUser() !== null &&
          this.storageService.getUser().username === data.author.username) {
          this.isCreator = true;
        }
      });
    }
  }

  ngDoCheck(): void {
    if (this.chapter !== this.compositionService.chapter) {
      (document.getElementById(String(this.chapter.numberChapter)) as HTMLElement).style.fontSize = '16px';
      this.chapter = this.compositionService.chapter;
      (document.getElementById(String(this.chapter.numberChapter)) as HTMLElement).style.fontSize = '32px';
    }
  }

  ngAfterViewInit() {
    if (this.chapter !== undefined) {
      (document.getElementById(String(this.chapter.numberChapter)) as HTMLElement).style.fontSize = '32px';
    }
  }

  editMode() {
    this.router.navigateByUrl('composition/' +
      this.compositionService.compositionId + '/chapter/' + this.chapter.id + '/editmode');
  }

  deleteChapter() {
    this.compositionService.deleteChapter(this.chapter).subscribe(() => {
        window.location.reload();
      }
    );
  }

  goOgPage(chapterIndex: number, count: number) {
    if ((chapterIndex > 0 && count === -1)
      || (chapterIndex === 0 && count === 1 && this.compositionService.chapters.length > 1)
      || (chapterIndex < this.compositionService.chapters.length - 1 && count === 1)) {
      const currentChapter = this.compositionService.chapters
        .find(chapter => this.compositionService.chapters.indexOf(chapter) === chapterIndex + count);
      this.compositionService.chapter = currentChapter;
      this.router.navigateByUrl('composition/' +
        this.compositionService.compositionId + '/chapter/' +
        currentChapter.id + '/readingmode');
    }
  }

  clickPage(chapter) {
    this.compositionService.chapter = chapter;
    this.router.navigateByUrl('composition/' +
      this.compositionService.compositionId + '/chapter/' + chapter.id + '/readingmode');
  }
}

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
