import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProviders } from 'app/shared/model/providers/providers.model';

type EntityResponseType = HttpResponse<IProviders>;
type EntityArrayResponseType = HttpResponse<IProviders[]>;

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  public resourceUrl = SERVER_API_URL + 'services/providers/api/providers';

  constructor(protected http: HttpClient) {}

  create(providers: IProviders): Observable<EntityResponseType> {
    return this.http.post<IProviders>(this.resourceUrl, providers, { observe: 'response' });
  }

  update(providers: IProviders): Observable<EntityResponseType> {
    return this.http.put<IProviders>(this.resourceUrl, providers, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProviders>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProviders[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
