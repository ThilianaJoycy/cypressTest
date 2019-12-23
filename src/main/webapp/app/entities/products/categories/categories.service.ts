import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICategories } from 'app/shared/model/products/categories.model';

type EntityResponseType = HttpResponse<ICategories>;
type EntityArrayResponseType = HttpResponse<ICategories[]>;

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  public resourceUrl = SERVER_API_URL + 'services/products/api/categories';

  constructor(protected http: HttpClient) {}

  create(categories: ICategories): Observable<EntityResponseType> {
    return this.http.post<ICategories>(this.resourceUrl, categories, { observe: 'response' });
  }

  update(categories: ICategories): Observable<EntityResponseType> {
    return this.http.put<ICategories>(this.resourceUrl, categories, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategories>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategories[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
