import {Component, OnInit} from '@angular/core';
import {CompositionService} from '../../../_services/composition.service';
import {MySheetComponent} from './my-sheet/my-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ChapterComponent} from '../chapter.component';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../_services/token-storage.service';

declare var tinymce;

@Component({
  selector: 'app-edit-mode',
  templateUrl: './edit-mode.component.html',
  styleUrls: ['./edit-mode.component.css']
})
export class EditModeComponent implements OnInit {

  title: string;
  text: string;

  chapter: {
    compositionId: number,
    chaptername: string,
    text: string,
    imgUrl: any,
    id: number,
    numberChapter: number
  };

  constructor(public compositionService: CompositionService, private bottomSheet: MatBottomSheet,
              private chapterComponent: ChapterComponent, private router: Router, private token: TokenStorageService) {
  }

  ngOnInit() {
    if (this.token.getUser() === null) {
      this.router.navigateByUrl('login');
    } else if (this.compositionService.chapter === undefined) {
      this.router.navigateByUrl('composition/' +
        this.chapterComponent.compositionId);
    } else {
      this.chapter = this.compositionService.chapter;
      this.compositionService.imgUrl = null;
      tinymce.remove();
      tinymce.init({
        selector: '#textAreaChapterEdit',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
      });
      this.title = this.chapter.chaptername;
      this.text = this.chapter.text;
      tinymce.activeEditor.setContent(this.text);
      if (this.chapter.imgUrl !== null) {
        (document.getElementsByClassName('hidden-icon-edit')[0] as HTMLElement).hidden = true;
        this.compositionService.imgUrl = this.chapter.imgUrl;
      }
    }
  }

  onSubmit() {
    this.chapter.numberChapter = this.compositionService.findChapter(this.chapter.id).numberChapter;
    this.chapter.compositionId = this.chapterComponent.compositionId;
    this.chapter.text = tinymce.activeEditor.getContent();
    this.chapter.chaptername = this.title;
    this.compositionService.saveChapter(this.chapter).subscribe(() => {
      this.compositionService.chapters[this.compositionService.chapters
        .indexOf(this.compositionService
          .findChapter(this.chapter.id))] = this.chapter;

      this.router.navigateByUrl('/composition/'
        + this.chapter.compositionId + '/chapter/' + this.chapter.id + '/readingmode');
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open(MySheetComponent);
  }

  loadImage(files: FileList) {
    (document.getElementsByClassName('hidden-icon-edit')[0] as HTMLElement).hidden = true;
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.chapter.imgUrl = reader.result;
      this.compositionService.imgUrl = this.chapter.imgUrl;
    };
  }

  callLoadImage() {
    this.compositionService.callLoadImage('loadImage-edit');
  }
}
