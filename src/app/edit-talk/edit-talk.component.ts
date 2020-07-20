import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

import { ColorPickerDialogComponent } from '../shared/components/color-picker-dialog/color-picker-dialog.component';
import { IssueType, Talk, Board, Track } from '../shared/models/schema.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { appConstants } from '../shared/appConstants';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-talk',
  templateUrl: './edit-talk.component.html',
  styleUrls: ['./edit-talk.component.scss']
})
export class EditTalkComponent implements OnInit {

  formGroup: FormGroup;
  boards: Board;
  track: Track;
  cardStatus = [{ name: 'ToDo', color: '#3f51b5' }, { name: 'InProgress', color: '#ff9800' }, { name: 'Pending', color: '#e91e63' }, { name: 'Done', color: '#4caf50' }]

  @ViewChild(DaterangepickerDirective, { static: true }) picker: DaterangepickerDirective;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: Talk },
    private dialogRef: MatDialogRef<EditTalkComponent>,
    public formBuilder: FormBuilder,
    public colorPickerdialog: MatDialog
  ) {
  }

  ngOnInit() {
    const card = this.data && this.data.card ? this.data.card : null;
    const startDate = card.selectedDate && card.selectedDate.start ? card.selectedDate.start : moment(new Date());
    const endDate = card.selectedDate && card.selectedDate.end ? card.selectedDate.end : moment(new Date());

    this.formGroup = this.formBuilder.group({
      title: [card && card.title ? card.title : ''],
      description: [card && card.description ? card.description : '', Validators.required],
      author: [card && card.author ? card.author : '', Validators.required],
      image: [card && card.image ? card.image : ''],
      tags: [card && card.tags ? card.tags : []],
      status: [card && card.status ? card.status : ''],
      createdAt: [card && card.createdAt ? card.createdAt : new Date()],
      selectedDate: [{ start: startDate, end: endDate }, Validators.required],
    });
  }

  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }

  removeTag(tag: string) {
    // Remove the tag from the tag control's value.
    const tagsControl = this.formGroup.get('tags');
    tagsControl.value.splice(tagsControl.value.indexOf(tag), 1);
  }

  addTag(event: MatChipInputEvent) {
    const tagsControl = this.formGroup.get('tags');
    // Create a new array of tags, if the talk doesn't have any,
    // otherwise add the new tag to the existing array.
    if (tagsControl.value) {
      // tagsControl.value.push({ name: event.value, color: '#e0e0e0' });
      tagsControl.value.push(event.value);
    } else {
      tagsControl.setValue([event.value]);
    }
    // Clear the input's value once the tag has been added.
    event.input.value = '';
  }

  openColorPickerDialog(tag): void {
    const dialogRef = this.colorPickerdialog.open(ColorPickerDialogComponent, {
      // width: '250px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        tag.color = result;
      }
    });
  }
}

