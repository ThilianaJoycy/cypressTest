import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProviders } from 'app/shared/model/providers/providers.model';
import { ProvidersService } from './providers.service';

@Component({
  selector: 'jhi-providers-delete-dialog',
  templateUrl: './providers-delete-dialog.component.html'
})
export class ProvidersDeleteDialogComponent {
  providers: IProviders;

  constructor(protected providersService: ProvidersService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.providersService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'providersListModification',
        content: 'Deleted an providers'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-providers-delete-popup',
  template: ''
})
export class ProvidersDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ providers }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProvidersDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.providers = providers;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/providers', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/providers', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
