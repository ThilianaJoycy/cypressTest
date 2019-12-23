import { Provider } from 'app/shared/model/enumerations/provider.model';

export interface IProducts {
  id?: number;
  name?: string;
  category?: string;
  qtty?: string;
  price?: number;
  provider?: Provider;
}

export class Products implements IProducts {
  constructor(
    public id?: number,
    public name?: string,
    public category?: string,
    public qtty?: string,
    public price?: number,
    public provider?: Provider
  ) {}
}
