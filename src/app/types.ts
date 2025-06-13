export interface IBid {
  id: string;
  amount: number;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface IAuction {
  id: string;
  name: string;
  description: string;
  endDate: string;
  isActive: boolean;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    imgProduct: string[];
    description: string;
    initialPrice: number;
    currentHighestBid?: number;
    category?: {
      categoryName: string;
    };
  };
  currentHighestBid?: number;
  bids?: IBid[];
}

export interface IProduct {
  id: string;
  name: string;
  imgProduct: string[];
  description: string;
  initialPrice: number;
  currentHighestBid?: number;
  category?: {
    categoryName: string;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}
