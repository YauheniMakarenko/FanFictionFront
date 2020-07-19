import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {BoardAdminComponent} from './board-admin/board-admin.component';
import {ProfileComponent} from './profile/profile.component';
import {NewcompositionComponent} from './newcomposition/newcomposition.component';
import {ChapterComponent} from './composition/chapter/chapter.component';
import {SidenavComponent} from './composition/chapter/sidenav/sidenav.component';
import {MySheetComponent} from './composition/chapter/edit-mode/my-sheet/my-sheet.component';
import {
  ReadingModeComponent,
  SafeHtmlPipe
} from './composition/reading-mode/reading-mode.component';
import {EditModeComponent} from './composition/chapter/edit-mode/edit-mode.component';
import {InplaceeditingComponent} from './profile/inplaceediting/inplaceediting.component';
import {CompositionComponent} from './composition/composition.component';

import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';

import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSidenavModule} from '@angular/material/sidenav';
import {EditorModule} from '@tinymce/tinymce-angular';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BoardAdminComponent,
    ProfileComponent,
    NewcompositionComponent,
    ChapterComponent,
    SidenavComponent,
    MySheetComponent,
    ReadingModeComponent,
    EditModeComponent,
    SafeHtmlPipe,
    InplaceeditingComponent,
    CompositionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    DragDropModule,
    MatButtonModule,
    MatBottomSheetModule,
    ScrollingModule,
    EditorModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  providers: [authInterceptorProviders],
  entryComponents: [MySheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
