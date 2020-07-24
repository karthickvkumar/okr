import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import * as _moment from 'moment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawerComponent } from './drawer/drawer.component';
import { LayoutModule } from '@angular/cdk/layout';
import { CardComponent } from './card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditTalkComponent } from './edit-talk/edit-talk.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeleteTalkComponent } from './delete-talk/delete-talk.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ColorChromeModule } from 'ngx-color/chrome'; // <color-chrome></color-chrome>
import { ColorPickerDialogComponent } from './shared/components/color-picker-dialog/color-picker-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BoardsComponent } from './boards/boards.component';
import { FormatPipe } from './format.pipe';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardWrapperComponent } from './board-wrapper/board-wrapper.component';


@NgModule({
  declarations: [
    AppComponent,
    DrawerComponent,
    CardComponent,
    EditTalkComponent,
    DeleteTalkComponent,
    ColorPickerDialogComponent,
    BoardsComponent,
    FormatPipe,
    LoginComponent,
    PageNotFoundComponent,
    BoardListComponent,
    BoardWrapperComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    ColorChromeModule,
    MatTooltipModule,
    HttpClientModule,
    MatSnackBarModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  entryComponents: [EditTalkComponent, DeleteTalkComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
