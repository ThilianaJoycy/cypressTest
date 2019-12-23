export interface ICategories {
  id?: number;
  libelle?: string;
}

export class Categories implements ICategories {
  constructor(public id?: number, public libelle?: string) {}
}
