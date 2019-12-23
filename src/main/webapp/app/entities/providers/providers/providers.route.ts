import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Providers } from 'app/shared/model/providers/providers.model';
import { ProvidersService } from './providers.service';
import { ProvidersComponent } from './providers.component';
import { ProvidersDetailComponent } from './providers-detail.component';
import { ProvidersUpdateComponent } from './providers-update.component';
import { ProvidersDeletePopupComponent } from './providers-delete-dialog.component';
import { IProviders } from 'app/shared/model/providers/providers.model';

@Injectable({ providedIn: 'root' })
export class ProvidersResolve implements Resolve<IProviders> {
  constructor(private service: ProvidersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProviders> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(map((providers: HttpResponse<Providers>) => providers.body));
    }
    return of(new Providers());
  }
}

export const providersRoute: Routes = [
  {
    path: '',
    component: ProvidersComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Providers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProvidersDetailComponent,
    resolve: {
      providers: ProvidersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Providers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProvidersUpdateComponent,
    resolve: {
      providers: ProvidersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Providers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProvidersUpdateComponent,
    resolve: {
      providers: ProvidersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Providers'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const providersPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProvidersDeletePopupComponent,
    resolve: {
      providers: ProvidersResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Providers'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
