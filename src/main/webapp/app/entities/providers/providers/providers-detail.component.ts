import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProviders } from 'app/shared/model/providers/providers.model';

@Component({
  selector: 'jhi-providers-detail',
  templateUrl: './providers-detail.component.html'
})
export class ProvidersDetailComponent implements OnInit {
  providers: IProviders;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ providers }) => {
      this.providers = providers;
    });
  }

  previousState() {
    window.history.back();
  }
}
