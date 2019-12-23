import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ICategories } from 'app/shared/model/products/categories.model';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'jhi-categories',
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: ICategories[];
  eventSubscriber: Subscription;

  constructor(protected categoriesService: CategoriesService, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.categoriesService.query().subscribe((res: HttpResponse<ICategories[]>) => {
      this.categories = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInCategories();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategories) {
    return item.id;
  }

  registerChangeInCategories() {
    this.eventSubscriber = this.eventManager.subscribe('categoriesListModification', () => this.loadAll());
  }
}
