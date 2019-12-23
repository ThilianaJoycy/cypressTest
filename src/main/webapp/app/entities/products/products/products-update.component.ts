import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IProducts, Products } from 'app/shared/model/products/products.model';
import { ProductsService } from './products.service';

@Component({
  selector: 'jhi-products-update',
  templateUrl: './products-update.component.html'
})
export class ProductsUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    category: [],
    qtty: [],
    price: [],
    provider: []
  });

  constructor(protected productsService: ProductsService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ products }) => {
      this.updateForm(products);
    });
  }

  updateForm(products: IProducts) {
    this.editForm.patchValue({
      id: products.id,
      name: products.name,
      category: products.category,
      qtty: products.qtty,
      price: products.price,
      provider: products.provider
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const products = this.createFromForm();
    if (products.id !== undefined) {
      this.subscribeToSaveResponse(this.productsService.update(products));
    } else {
      this.subscribeToSaveResponse(this.productsService.create(products));
    }
  }

  private createFromForm(): IProducts {
    return {
      ...new Products(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      category: this.editForm.get(['category']).value,
      qtty: this.editForm.get(['qtty']).value,
      price: this.editForm.get(['price']).value,
      provider: this.editForm.get(['provider']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProducts>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
