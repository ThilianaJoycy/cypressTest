import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategories } from 'app/shared/model/products/categories.model';

@Component({
  selector: 'jhi-categories-detail',
  templateUrl: './categories-detail.component.html'
})
export class CategoriesDetailComponent implements OnInit {
  categories: ICategories;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categories }) => {
      this.categories = categories;
    });
  }

  previousState() {
    window.history.back();
  }
}
