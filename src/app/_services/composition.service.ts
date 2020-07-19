import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';

const API_URL = 'https://fanfictionfback.herokuapp.com/api/test/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

export class Chapter {
  compositionId: number;
  chaptername: string;
  text: string;
  imgUrl: string;
  id: number;
  numberChapter: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompositionService {
  imgUrl: any;
  compositionId: number;
  chapter: Chapter;
  chapters: Array<Chapter>;

  constructor(private http: HttpClient) {
  }

  getGenre(): Observable<any> {
    return this.http.get(API_URL + 'allGenres');
  }

  saveComposition(composition): Observable<any> {
    return this.http.post(API_URL + 'savecomposition', {
      id: composition.id,
      title: composition.title,
      description: composition.description,
      genres: composition.genres
    }, httpOptions);
  }

  saveChapter(chapter): Observable<any> {
    return this.http.post(API_URL + 'savechapter', {
      compositionId: chapter.compositionId,
      chaptername: chapter.chaptername,
      text: chapter.text,
      imgUrl: chapter.imgUrl,
      id: chapter.id,
      numberChapter: chapter.numberChapter
    }, httpOptions);
  }

  getChapters(compositionId: number): Observable<any> {
    return this.http.get(API_URL + 'allChapters/' + compositionId);
  }

  getAllComposition(): Observable<any> {
    return this.http.get(API_URL + 'allCompositions');
  }

  getComposition(compositionId: number): Observable<any> {
    return this.http.get(API_URL + 'getcomposition/' + compositionId);
  }

  getCompositionsForCurrentUser(): Observable<any> {
    return this.http.get(API_URL + 'getcompositionsforcurrentuser');
  }

  deleteComposition(compositionId: number): Observable<any> {
    return this.http.delete(API_URL + 'deletecomposition/' + compositionId);
  }

  deleteChapter(chapter): Observable<any> {
    return this.http.post(API_URL + 'deletechapter', {
      id: chapter.id,
      chaptername: chapter.chaptername,
      text: chapter.text,
      imgUrl: chapter.imgUrl,
      composition: chapter.composition
    }, httpOptions);
  }

  getCommentsByCompositionId(compositionId: number): Observable<any> {
    return this.http.get(API_URL + 'getCommentsByCompositionId/' + compositionId);
  }

  addComment(text: string, composition): Observable<any> {
    return this.http.post(API_URL + 'addcomment', {
        text,
        composition
      }
      , httpOptions);
  }

  saveAllChapters(chapters: Chapter[]) {
    return this.http.post(API_URL + 'replacingchapters',
      chapters, httpOptions);
  }

  search(searchRequest: string): Observable<any> {
    if (!searchRequest.trim()) {
      return of([]);
    }
    return this.http.get(API_URL + 'search/' + searchRequest);
  }

  public findChapter(chapterId) {
    return this.chapters.find(chapter => chapter.id === chapterId);
  }

  callLoadImage(className: string) {
    (document.getElementsByClassName(className)[0] as HTMLElement).click();
  }

  deleteImage(className: string) {
    this.imgUrl = null;
    if (this.chapter !== undefined){
      this.chapter.imgUrl = null;
    }
    (document.getElementsByClassName(className)[0] as HTMLElement).hidden = false;
  }

}
