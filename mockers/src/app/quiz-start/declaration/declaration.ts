import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-declaration',
  imports: [RouterLink,FormsModule],
  templateUrl: './declaration.html',
  styleUrl: './declaration.css'
})
export class Declaration {
  agreed = false;

}

