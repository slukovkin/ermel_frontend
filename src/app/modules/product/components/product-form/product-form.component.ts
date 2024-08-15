import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Location, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ProductService} from "../../service/product.service";
import {ProductCreationAttributes} from "../../types/product.interfaces";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  form: FormGroup

  constructor(
    private location: Location,
    private readonly productService: ProductService
  ) {
    this.form = new FormGroup({
      code: new FormControl('',
        [Validators.required,
          Validators.minLength(7),
          Validators.maxLength(8)]),
      article: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      picture: new FormControl('')
    })
  }

  submit() {
    if (this.form.valid) {
      const product: ProductCreationAttributes = {
        code: Number(this.form.controls['code'].value),
        article: this.form.controls['article'].value,
        title: this.form.controls['title'].value,
      }
      this.productService.create(product)
      this.form.reset()
      this.location.back()
    } else {
      console.log('Not valid')
    }
  }

  back() {
    this.location.back()
  }
}
