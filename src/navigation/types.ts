export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Menu: undefined;
  DetailMenu: {
    menuId: number;
    nama: string;
    harga: number;
  };
  DetailOrder: {
    orderId: number;
  };
};
