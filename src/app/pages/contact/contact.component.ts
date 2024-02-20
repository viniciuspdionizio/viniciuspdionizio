import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.sass'
})
export default class ContactComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
    message: new FormControl('', [Validators.required]),
  });

  @ViewChild('submitResult') submitResult: HTMLElement;

  ngOnInit(): void {
  }


  send(event: any) {
    console.log(event.form);

  }

}
