export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: 'Paid' | 'Pending' | 'Draft'; // Strictly define possible values
  senderAddress: Address;
  clientAddress: Address;
  items: Item[];
  total: number;
}

export interface InvoiceState {
  invoices: Invoice[];
  error: string | null;
}

export const initialState: InvoiceState = {
  invoices: [],
  error: null,
};
