import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { NgIf } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ProductService } from '../../service/product.service'
import { IProduct, ProductCreationAttributes } from '../../types/product.interfaces'
import { ModalService } from '../../../modal/service/modal.service'
import { firstCharToUpperCase } from '../../../../shared/utils/transformString'
import { FaIconComponent } from '@fortawesome/angular-fontawesome'
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons/faCloudUpload'
import { HttpClient } from '@angular/common/http'
import { CurrencyService } from '../../../currency/components/services/currency.service'
import { SettingService } from '../../../settings/service/setting.service'
import { ICurrency } from '../../../currency/types/currency.interface'


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    FaIconComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  product?: IProduct
  productForm: FormGroup
  previewImage = signal<string>('')
  productImage: any
  pathFile: any
  currentCurrency: ICurrency

  uploadIcon = faCloudUpload

  constructor(
    private readonly http: HttpClient,
    public readonly modalService: ModalService,
    public readonly productService: ProductService,
    private readonly currencyService: CurrencyService,
    private readonly settingService: SettingService,
  ) {
    this.currencyService.getCurrencyById(this.settingService.setting!.currencyId)
    this.currentCurrency = this.currencyService.currencyDefault!
    this.product = this.modalService.itemSign()
    this.productForm = new FormGroup({
      code: new FormControl(this.product?.code,
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
        ]),
      article: new FormControl(this.product?.article, [Validators.required]),
      title: new FormControl(this.product?.title, [Validators.required]),
      brand: new FormControl(this.product?.brand),
      price: new FormControl(this.product?.price),
      qty: new FormControl(this.product?.qty),
      picture: new FormControl(this.product?.imageUrl),
    })
  }

  fileHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]

    if (!file || !file.type.match('image')) return
    const reader = new FileReader()
    reader.onload = (event) => {
      // @ts-ignore
      const formData = new FormData()
      formData.append('file', file)
      this.http.post('http://localhost:5000/files', formData).subscribe((path) => {
        this.pathFile = path
      })
      this.previewImage.set(event.target?.result?.toString() ?? '')
    }
    reader.readAsDataURL(file)

  }

  submit() {
    if (this.productForm.valid) {

      const newProduct: ProductCreationAttributes = {
        code: Number(this.productForm.controls['code'].value),
        article: this.productForm.controls['article'].value.toUpperCase(),
        title: firstCharToUpperCase(this.productForm.controls['title'].value),
        brand: firstCharToUpperCase(this.productForm.controls['brand'].value),
        price: Number(this.productForm.controls['price'].value),
        qty: Number(this.productForm.controls['qty'].value),
        imageUrl: this.pathFile,
      }
      if (this.product?.id) {
        this.productService.update(
          {
            ...newProduct,
            id: this.product.id,
            cross: this.product.cross,
            createdAt: this.product.createdAt,
            updatedAt: this.product.updatedAt,
          },
        )
      } else {
        this.productService.create(newProduct)
      }
      this.productForm.reset()
      this.modalService.closeModal()
    } else {
      console.log('Not valid')
    }
  }

  resetForm() {
    this.productForm.reset()
  }
}
