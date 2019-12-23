export interface IProviders {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  locate?: string;
}

export class Providers implements IProviders {
  constructor(public id?: number, public name?: string, public phone?: string, public email?: string, public locate?: string) {}
}
