import {Component, OnInit, ViewChild} from '@angular/core';
import {Chapter, CompositionService} from '../../_services/composition.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MySheetComponent} from './edit-mode/my-sheet/my-sheet.component';
import {TokenStorageService} from '../../_services/token-storage.service';

declare var tinymce;

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  @ViewChild(SidenavComponent) sidenavComponent: SidenavComponent;
  form: any = {};
  compositionId: number;
  chapter: Chapter;
  composition: any;

  constructor(private compositionService: CompositionService, public route: ActivatedRoute,
              private bottomSheet: MatBottomSheet, private router: Router, private token: TokenStorageService) {
  }

  openBottomSheet(): void {
    this.bottomSheet.open(MySheetComponent);
  }

  ngOnInit() {
    if (this.compositionService.compositionId) {
      this.compositionService.getComposition(this.compositionService.compositionId).subscribe(composition => {
        this.composition = composition;
        if (this.token.getUser() === null) {
          this.router.navigateByUrl('login');
        } else if (this.token.getUser().id !== this.composition.author.id) {
          this.router.navigateByUrl('home');
        } else {
          this.compositionId = this.compositionService.compositionId;
        }
      });
    }else {
      this.router.navigateByUrl('home');
    }
  }

  onSubmit() {
    this.form.imgUrl = this.compositionService.imgUrl;
    this.form.compositionId = this.compositionId;
    this.form.numberChapter = this.sidenavComponent.chapters.length + 1;
    this.form.text = tinymce.activeEditor.getContent();
    this.compositionService.saveChapter(this.form).subscribe(() => {
      this.sidenavComponent.ngOnInit();
      this.form = {};
      this.compositionService.imgUrl = null;
      (document.getElementsByClassName('hidden-icon')[0] as HTMLElement).hidden = false;
      tinymce.activeEditor.setContent('');
    });
  }

  loadImage(files: FileList) {
    (document.getElementsByClassName('hidden-icon')[0] as HTMLElement).hidden = true;
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.compositionService.imgUrl = reader.result;
    };
  }

  callLoadImage() {
    this.compositionService.callLoadImage('loadImage');
  }

  readChapter() {
    this.chapter = this.sidenavComponent.chapter;
    this.compositionService.chapter = this.chapter;
    this.router.navigateByUrl('composition/' + this.compositionId + '/chapter/' +
      this.chapter.id + '/readingmode');
  }
}
