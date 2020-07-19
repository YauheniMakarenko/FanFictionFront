import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompositionService} from '../_services/composition.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from "../_services/token-storage.service";

@Component({
  selector: 'app-newcomposition',
  templateUrl: './newcomposition.component.html',
  styleUrls: ['./newcomposition.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewcompositionComponent implements OnInit {
  form: any = {};
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  allGenre: string[];
  value = 'Create Composition';

  constructor(private token: TokenStorageService, private formBuilder: FormBuilder, private compositionService: CompositionService,
              public route: ActivatedRoute, private router: Router) {
  }


  ngOnInit() {
    if (this.token.getUser() === null) {
      this.router.navigateByUrl('login');
    } else {
      this.route.params.subscribe(data => {
        if (data.compositionId !== undefined) {
          this.compositionService.getComposition(data.compositionId).subscribe(compositionEdited => {
            const arr = [];
            for (const genre of compositionEdited.genres) {
              arr.push(genre.genrename);
            }
            this.form.id = compositionEdited.id;
            this.form.title = compositionEdited.title;
            this.form.description = compositionEdited.description;
            this.form.genres = arr;
            this.isLinear = true;
            this.value = 'Save Changes';
          }, () => this.router.navigateByUrl('home'));
        }
      });
    }

    this.compositionService.getGenre().subscribe(
      data => this.allGenre = data);
    this.firstFormGroup = this.formBuilder.group({firstCtrl: ['', Validators.required]});
    this.secondFormGroup = this.formBuilder.group({secondCtrl: ['', Validators.required]});
    this.thirdFormGroup = this.formBuilder.group({thirdCtrl: ['', Validators.required]});
  }

  onSubmit() {
    this.compositionService.saveComposition(this.form).subscribe(data => {
      this.compositionService.compositionId = data.id;
      this.form = {};
      this.compositionService.imgUrl = null;
      this.router.navigateByUrl('composition/' + data.id + '/chapter');
    });
  }
}
