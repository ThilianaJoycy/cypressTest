import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { ProvidersUpdateComponent } from 'app/entities/providers/providers/providers-update.component';
import { ProvidersService } from 'app/entities/providers/providers/providers.service';
import { Providers } from 'app/shared/model/providers/providers.model';

describe('Component Tests', () => {
  describe('Providers Management Update Component', () => {
    let comp: ProvidersUpdateComponent;
    let fixture: ComponentFixture<ProvidersUpdateComponent>;
    let service: ProvidersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [ProvidersUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProvidersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProvidersUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProvidersService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Providers(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Providers();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
