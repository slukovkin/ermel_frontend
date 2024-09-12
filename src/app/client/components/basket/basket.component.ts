import { Component } from '@angular/core'
import { Location, NgIf } from '@angular/common'
import { IProductInBasket, IProductInStockAttributes } from '../../../modules/product/types/product.interfaces'
import { OrderService } from '../../../modules/order/service/order.service'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { StopPropagationDirective } from '../../../shared/directives/stop-propagation.directive'
import { AuthService } from '../../../modules/auth/service/auth.service'

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    StopPropagationDirective,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  product?: IProductInStockAttributes
  basketForm: FormGroup

  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private _location: Location,
  ) {
    this.product = this.orderService.currentProduct
    this.basketForm = new FormGroup({
      title: new FormControl(this.product?.title),
      article: new FormControl(this.product?.article),
      qty: new FormControl(1),
    })
  }

  sum(): number {
    return this.product?.stores?.[0]?.ProductStore?.qty!
      * this.product?.stores?.[0]?.ProductStore?.priceOut!
  }

  submit() {
    if (this.basketForm.valid) {
      const productOrder: IProductInBasket = {
        id: this.product?.id ?? 0,
        code: this.product?.code ?? 0,
        article: this.product?.article ?? '',
        title: this.product?.title ?? '',
        brand: this.product?.brand ?? '',
        categoryId: this.product?.categoryId ?? 0,
        imageUrl: this.product?.imageUrl ?? '',
        cross: this.product?.cross ?? 0,
        storeId: this.product?.stores?.[0]?.ProductStore?.storeId!,
        qty: Number(this.basketForm.controls['qty'].value),
        priceIn: this.product?.stores?.[0]?.ProductStore?.priceIn!,
        priceOut: this.product?.stores?.[0]?.ProductStore?.priceOut!,
      }

      const products = this.orderService.order

      if (products.length > 0 && products.find(pr => pr.id === productOrder.id)) {
        this.orderService.order = this.orderService.order.map((product) => ({
          ...product,
          qty: product.id === productOrder.id ? product.qty + productOrder.qty : product.qty,
        }))
      } else {
        this.orderService.order.push(productOrder)
      }
    }
    this._location.back()
  }

  exit() {

  }
}
