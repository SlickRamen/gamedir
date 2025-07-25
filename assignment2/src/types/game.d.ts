interface Game {
  gameId: number;
  title: string;
  genreId: number;
  creationDate: string;
  creatorId: number;
  creatorFirstName: string;
  creatorLastName: string;
  price: number;
  rating: number;
  platformIds: number[];
}

interface FilterOptions {
  genreIds: number[]; 
  platformIds: number[];
  price: number;
  sort: string;
};