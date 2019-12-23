import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { IProviders } from 'app/shared/model/providers/providers.model';
import { ProvidersService } from './providers.service';

@Component({
  selector: 'jhi-providers',
  templateUrl: './providers.component.html'
})
export class ProvidersComponent implements OnInit, OnDestroy {
  providers: IProviders[];
  eventSubscriber: Subscription;

  constructor(protected providersService: ProvidersService, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.providersService.query().subscribe((res: HttpResponse<IProviders[]>) => {
      this.providers = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInProviders();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IProviders) {
    return item.id;
  }

  registerChangeInProviders() {
    this.eventSubscriber = this.eventManager.subscribe('providersListModification', () => this.loadAll());
  }
}
