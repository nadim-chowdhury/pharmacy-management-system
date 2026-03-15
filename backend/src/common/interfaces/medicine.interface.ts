export interface IMedicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer: string;
  price: number;
  stockQuantity: number;
  expiryDate: Date;
}

export interface ICreateMedicineDto extends Omit<IMedicine, 'id'> {}
