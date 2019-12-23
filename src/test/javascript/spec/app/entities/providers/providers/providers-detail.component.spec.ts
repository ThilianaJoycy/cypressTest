import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { ProvidersDetailComponent } from 'app/entities/providers/providers/providers-detail.component';
import { Providers } from 'app/shared/model/providers/providers.model';

describe('Component Tests', () => {
  describe('Providers Management Detail Component', () => {
    let comp: ProvidersDetailComponent;
    let fixture: ComponentFixture<ProvidersDetailComponent>;
    const route = ({ data: of({ providers: new Providers(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [ProvidersDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProvidersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProvidersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.providers).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
