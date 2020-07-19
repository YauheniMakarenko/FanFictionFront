import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CompositionService} from '../_services/composition.service';
import {MatPaginator} from '@angular/material/paginator';
import {TokenStorageService} from '../_services/token-storage.service';
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../_services/user.service";

declare var SockJS;
declare var Stomp;

export class Comment {
  commentUser: any;
  composition: any;
  id: number;
  text: string;
}

@Component({
  selector: 'app-composition',
  templateUrl: './composition.component.html',
  styleUrls: ['./composition.component.css']
})
export class CompositionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  addCommentText: string;
  composition: any;
  compositionId: number;
  chapters: any[];
  comments: Comment[];
  filterComments: Comment[];
  commentsAmount: number;
  stompClient;
  compositionIds: any[] = [];

  constructor(public activatedRoute: ActivatedRoute, private compositionService: CompositionService,
              private router: Router, private token: TokenStorageService) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/api/test/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = null;
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe('/message', (comment) => {
        if (comment) {
          this.comments.unshift(JSON.parse(comment.body));
          this.ngOnInit();
        }
      });
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      if (data.compositionId !== this.compositionId) {
        this.compositionService.getAllComposition().subscribe(compositions => {
          for (const composition of compositions) {
            this.compositionIds.push(composition.id);
          }
          if (this.compositionIds.indexOf(Number(data.compositionId)) === -1) {
            this.router.navigateByUrl('home');
          } else {
            this.compositionId = data.compositionId;
            this.compositionService.compositionId = data.compositionId;
            this.ngOnInit();
            this.compositionService.getComposition(data.compositionId).subscribe(composition =>
              this.composition = composition);
            this.compositionService.getChapters(data.compositionId).subscribe(chapters => this.chapters = chapters);
          }
        });
      }
      if (this.compositionIds.indexOf(Number(data.compositionId)) !== -1) {
        this.compositionService.getCommentsByCompositionId(data.compositionId).subscribe(comments => {
          this.comments = comments;
          this.filterComments = this.comments.slice(0, 4);
          this.commentsAmount = this.comments.length;
          (new MatTableDataSource(this.comments)).paginator = this.paginator;
        });
      }
    });
  }

  readChapter(chapter: any) {
    (document.getElementsByClassName('container')[0] as HTMLElement).hidden = true;
    this.compositionService.chapter = chapter;
    this.compositionService.chapters = this.chapters;
    this.router.navigateByUrl('/composition/' + this.compositionId + '/chapter/' + chapter.id + '/readingmode');
  }

  readFirstChapter() {
    if (this.chapters.length !== 0) {
      (document.getElementsByClassName('container')[0] as HTMLElement).hidden = true;
      this.compositionService.chapter = this.chapters[0];
      this.compositionService.chapters = this.chapters;
      this.router.navigateByUrl('/composition/' +
        this.compositionId + '/chapter/' + this.chapters[0].id + '/readingmode');
    }
  }

  onPaginateChange(data) {
    this.filterComments = this.comments.slice(data.pageIndex * data.pageSize, data.pageIndex * data.pageSize + data.pageSize);
  }

  openCommentArea() {
    (document.getElementById('add-comment') as HTMLElement).hidden = false;
  }

  cancel() {
    (document.getElementById('add-comment') as HTMLElement).hidden = true;
    this.addCommentText = '';
  }

  addComment() {
    if (this.token.getUser() === null) {
      this.router.navigateByUrl('login');
    } else {
      if (this.addCommentText.replace(/\s/g, '') !== '') {
        this.compositionService.addComment(this.addCommentText, this.composition).subscribe(() => {
          (document.getElementById('add-comment') as HTMLElement).hidden = true;
          this.addCommentText = '';
          this.ngOnInit();
        });
      }
    }
  }
}
