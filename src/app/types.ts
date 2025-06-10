interface IAuction {
  id: string;
  name: string;
  description: string;
  endDate: string;
  isActive: boolean;
  owner: {
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
  bids?: any[];
}
