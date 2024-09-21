import { Injectable, signal } from '@angular/core'
import { OrderService } from '../../order/service/order.service'
import { IOrder } from '../../order/types/order.interface'
import { tap } from 'rxjs'
import { IProductInBasket } from '../../product/types/product.interfaces'
import { IInvoice } from '../types/invoice.interface'
import { HttpClient } from '@angular/common/http'
import { Constants } from '../../../shared/constants/constants'

@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  orders: IOrder[] = []
  products: IProductInBasket[] = []
  productsToInvoice$ = signal<IProductInBasket[]>([])
  invoice$ = signal<IInvoice | null>(null)

  constructor(
    private readonly orderService: OrderService,
    private readonly http: HttpClient,
  ) {
  }

  getAllInvoices() {
    return this.http.get<IInvoice[]>(Constants.BASE_URL + Constants.METHODS.GET_ALL_INVOICES)
  }

  getAllOrder() {
    this.orders = []
    this.products = []
    return this.orderService.getAllOrders()
      .pipe(
        tap((orders: IOrder[]) => {
          this.orders = orders
        }),
      )
      .subscribe()
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id)
      .pipe(
        tap(() => this.getAllOrder()),
      )
      .subscribe()
  }
}
