import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IProducts } from 'app/shared/model/products/products.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: IProducts[];
  eventSubscriber: Subscription;

  constructor(protected productsService: ProductsService, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.productsService.query().subscribe((res: HttpResponse<IProducts[]>) => {
      this.products = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInProducts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IProducts) {
    return item.id;
  }

  registerChangeInProducts() {
    this.eventSubscriber = this.eventManager.subscribe('productsListModification', () => this.loadAll());
  }
}
