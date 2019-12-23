import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from 'app/shared/model/products/categories.model';
import { CategoriesService } from './categories.service';
import { CategoriesComponent } from './categories.component';
import { CategoriesDetailComponent } from './categories-detail.component';
import { CategoriesUpdateComponent } from './categories-update.component';
import { CategoriesDeletePopupComponent } from './categories-delete-dialog.component';
import { ICategories } from 'app/shared/model/products/categories.model';

@Injectable({ providedIn: 'root' })
export class CategoriesResolve implements Resolve<ICategories> {
  constructor(private service: CategoriesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategories> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((categories: HttpResponse<Categories>) => categories.body));
    }
    return of(new Categories());
  }
}

export const categoriesRoute: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Categories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoriesDetailComponent,
    resolve: {
      categories: CategoriesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Categories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoriesUpdateComponent,
    resolve: {
      categories: CategoriesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Categories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoriesUpdateComponent,
    resolve: {
      categories: CategoriesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Categories'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoriesPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategoriesDeletePopupComponent,
    resolve: {
      categories: CategoriesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Categories'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
