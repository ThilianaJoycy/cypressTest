import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IProviders, Providers } from 'app/shared/model/providers/providers.model';
import { ProvidersService } from './providers.service';

@Component({
  selector: 'jhi-providers-update',
  templateUrl: './providers-update.component.html'
})
export class ProvidersUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    phone: [],
    email: [],
    locate: []
  });

  constructor(protected providersService: ProvidersService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ providers }) => {
      this.updateForm(providers);
    });
  }

  updateForm(providers: IProviders) {
    this.editForm.patchValue({
      id: providers.id,
      name: providers.name,
      phone: providers.phone,
      email: providers.email,
      locate: providers.locate
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const providers = this.createFromForm();
    if (providers.id !== undefined) {
      this.subscribeToSaveResponse(this.providersService.update(providers));
    } else {
      this.subscribeToSaveResponse(this.providersService.create(providers));
    }
  }

  private createFromForm(): IProviders {
    return {
      ...new Providers(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      phone: this.editForm.get(['phone']).value,
      email: this.editForm.get(['email']).value,
      locate: this.editForm.get(['locate']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProviders>>) {
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
