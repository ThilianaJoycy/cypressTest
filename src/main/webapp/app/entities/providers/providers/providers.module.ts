import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { ProvidersComponent } from './providers.component';
import { ProvidersDetailComponent } from './providers-detail.component';
import { ProvidersUpdateComponent } from './providers-update.component';
import { ProvidersDeletePopupComponent, ProvidersDeleteDialogComponent } from './providers-delete-dialog.component';
import { providersRoute, providersPopupRoute } from './providers.route';

const ENTITY_STATES = [...providersRoute, ...providersPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProvidersComponent,
    ProvidersDetailComponent,
    ProvidersUpdateComponent,
    ProvidersDeleteDialogComponent,
    ProvidersDeletePopupComponent
  ],
  entryComponents: [ProvidersDeleteDialogComponent]
})
export class ProvidersProvidersModule {}
