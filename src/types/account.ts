export type BuukiaAccount = {
  id: string;
  personal: {
    name: string;
    email: string;
    dob: string;
    tel: string;
    thumbnail: string;
  };
  business: {
    name: string;
    tax: {
      number: string;
    };
    mobile: string;
    contact: {
      address: string;
      city: string;
      municipality: string;
      postalCode: string;
      country: string;
    };
  };
};

export interface UpdateAccountBody {
  name: string;
  email: string;
  dob: string;
  tel: string;
}
