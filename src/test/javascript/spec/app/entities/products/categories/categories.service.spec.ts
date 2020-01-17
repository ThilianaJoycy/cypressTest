import { ComponentFixture, TestBed, getTestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { take, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CategoriesService } from 'app/entities/products/categories/categories.service';
import { ICategories, Categories } from 'app/shared/model/products/categories.model';
import { CategoriesComponent } from 'app/entities/products/categories/categories.component';
import { CategoriesUpdateComponent } from 'app/entities/products/categories/categories-update.component';
import { CategoriesDeleteDialogComponent } from 'app/entities/products/categories/categories-delete-dialog.component';
import { GatewayTestModule } from '../../../../test.module';

import { defineFeature, loadFeature } from 'jest-cucumber';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('Service Tests', () => {
  describe('Categories Service', () => {
    
    let injector: TestBed;
    let service: CategoriesService;
    let httpMock: HttpTestingController;
    let elemDefault: ICategories;
    let expectedResult;

    let comp: CategoriesComponent;
    let fixture: ComponentFixture<CategoriesComponent>;

    let component: CategoriesUpdateComponent;
    let fixture1: ComponentFixture<CategoriesUpdateComponent>;

    let deletecomp: CategoriesDeleteDialogComponent;
    let fixture2: ComponentFixture<CategoriesDeleteDialogComponent>;
    let mockEventManager: any;
    let mockActiveModal: any;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, GatewayTestModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
        declarations: [CategoriesComponent, CategoriesUpdateComponent, CategoriesDeleteDialogComponent],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
        providers: []
      })
      .overrideTemplate(CategoriesComponent, '')
      .compileComponents();
      expectedResult = {};
      injector = getTestBed();
      fixture = TestBed.createComponent(CategoriesComponent);
      comp = fixture.componentInstance;

      fixture1 = TestBed.createComponent(CategoriesUpdateComponent);
      component = fixture1.componentInstance;

      fixture2 = TestBed.createComponent(CategoriesDeleteDialogComponent);
      deletecomp = fixture2.componentInstance;
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
      
      service = injector.get(CategoriesService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new Categories(0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      const feature = loadFeature('src/test/features/categorie.feature');
      defineFeature(feature, test => {
        const headers = new HttpHeaders().append('link', 'link;link');
        // beforeEach(() => {
        //   TestBed.configureTestingModule({
        //     imports: [GatewayTestModule],
        //     declarations: [CategoriesComponent],
        //     providers: []
        //   })
        //     .overrideTemplate(CategoriesComponent, '')
        //     .compileComponents();
    
        //   fixture = TestBed.createComponent(CategoriesComponent);
        //   comp = fixture.componentInstance;
        //   service = fixture.debugElement.injector.get(CategoriesService);
        // });
      test('Création', ({
        given,
        when,
        then
      }) => {
        
        const entity=new Categories(undefined, "Nouvelle categorie");
        given('Nous avons  N Categorie', () => {
          
          spyOn(service, 'query').and.returnValue(
          of(
            new HttpResponse({
              body: [
                      new Categories(123, 'AAAAAAA'),
                      new Categories(32, 'BBBBBBB'),
                      new Categories(2, 'RC')
                    ],
              headers
            })
          )
        );
        comp.ngOnInit();
        expect(service.query).toHaveBeenCalled();
        expect(comp.categories.length).toEqual(3);

          // comp.categories=[
          //   new Categories(0, 'AAAAAAA'),
          //   new Categories(32, 'BBBBBBB'),
          //   new Categories(2, 'RC'),
          // ];

        });
      
        when('Je crée une nouvelle', fakeAsync(() => {
          
          spyOn(service, 'create').and.returnValue(
            of(
              new HttpResponse({
                body: entity
              })
            )
          );
          component.updateForm(entity);
          component.save();
          tick();

          // expect(service.create).toHaveBeenCalledWith(entity);
          
          // service
          //   .create(new Categories(33, 'nouvelle catégorie'))
          //   .pipe(take(1))
          //   .subscribe(resp => {(expectedResult = resp)});
          // const req = httpMock.expectOne({ method: 'POST' });
          // req.flush(comp.categories);
          // expect(expectedResult).toMatchObject({ body: expected });

          comp.ngOnInit();
        }));
      
        then('J\'obtiens N + 1 categories', () => {
      
          expect(service.create).toHaveBeenCalledWith(entity);
          // expect(component.previousState()).toHaveBeenCalled();
          // expect(comp.categories.length).toEqual(4);
        });
      });

      test('Suppression', ({
        given,
        when,
        then
      }) => {
        given('La BD contient la catégorie RC', () => {
      
          spyOn(service, 'query').and.returnValue(
            of(
              new HttpResponse({
                body: [
                        new Categories(123, 'AAAAAAA'),
                        new Categories(32, 'BBBBBBB'),
                        new Categories(2, 'RC')
                      ],
                headers
              })
            )
          );
          comp.ngOnInit();
          expect(service.query).toHaveBeenCalled();
          expect(comp.categories).toContainEqual({"id":2,"libelle": "RC"});
          
        });
      
        when('Je supprime Categorie avec pour id 32', fakeAsync(() => {
          spyOn(service, 'delete').and.returnValue(of({}));
          deletecomp.confirmDelete(32);
          tick();

          // THEN
          
      
        }));
      
        then('La BD contient N-1 Caategorie', () => {
          expect(service.delete).toHaveBeenCalledWith(32);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();

          comp.ngOnInit();

          expect(comp.categories.length).toEqual(2);
      
        });
      });

      test('Lecture', ({
        given,
        when,
        then
      }) => {
        given('Nous avons  N Categorie', () => {
      
        });
      
        when('Je recupère la categorie 33', () => {
      
        });
      
        then('J\'obtiens la categorie d\'identifiant 33 contenant les données RC', () => {
      
        });
      });

      test('Modification', ({
        given,
        when,
        then
      }) => {
        // table
        given('Nous avons la categorie suivant', () => {
      
        });
      
        when('Je modifie la categorie RC Modifie', () => {
      
        });
      
        then('J\'obtiens la categorie d\'identifiant 3 contenant les donnees RC Modifie', () => {
      
        });
      });
    });
      it('should create a Categories', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .create(new Categories(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Categories', () => {
        const returnedFromService = Object.assign(
          {
            libelle: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Categories', () => {
        const returnedFromService = Object.assign(
          {
            libelle: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign({}, returnedFromService);
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Categories', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    // afterEach(() => {
    //   httpMock.verify();
    // });
  });
});
