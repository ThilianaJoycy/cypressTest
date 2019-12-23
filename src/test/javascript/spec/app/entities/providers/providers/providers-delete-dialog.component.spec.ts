import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GatewayTestModule } from '../../../../test.module';
import { ProvidersDeleteDialogComponent } from 'app/entities/providers/providers/providers-delete-dialog.component';
import { ProvidersService } from 'app/entities/providers/providers/providers.service';

describe('Component Tests', () => {
  describe('Providers Management Delete Component', () => {
    let comp: ProvidersDeleteDialogComponent;
    let fixture: ComponentFixture<ProvidersDeleteDialogComponent>;
    let service: ProvidersService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [ProvidersDeleteDialogComponent]
      })
        .overrideTemplate(ProvidersDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProvidersDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProvidersService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
