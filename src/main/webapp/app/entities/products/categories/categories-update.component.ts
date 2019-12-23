import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategories, Categories } from 'app/shared/model/products/categories.model';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'jhi-categories-update',
  templateUrl: './categories-update.component.html'
})
export class CategoriesUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    libelle: []
  });

  constructor(protected categoriesService: CategoriesService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categories }) => {
      this.updateForm(categories);
    });
  }

  updateForm(categories: ICategories) {
    this.editForm.patchValue({
      id: categories.id,
      libelle: categories.libelle
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categories = this.createFromForm();
    if (categories.id !== undefined) {
      this.subscribeToSaveResponse(this.categoriesService.update(categories));
    } else {
      this.subscribeToSaveResponse(this.categoriesService.create(categories));
    }
  }

  private createFromForm(): ICategories {
    return {
      ...new Categories(),
      id: this.editForm.get(['id']).value,
      libelle: this.editForm.get(['libelle']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategories>>) {
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
