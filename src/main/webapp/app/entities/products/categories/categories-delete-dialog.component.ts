import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategories } from 'app/shared/model/products/categories.model';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'jhi-categories-delete-dialog',
  templateUrl: './categories-delete-dialog.component.html'
})
export class CategoriesDeleteDialogComponent {
  categories: ICategories;

  constructor(
    protected categoriesService: CategoriesService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoriesService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'categoriesListModification',
        content: 'Deleted an categories'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-categories-delete-popup',
  template: ''
})
export class CategoriesDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categories }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CategoriesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.categories = categories;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/categories', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/categories', { outlets: { popup: null } }]);
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
