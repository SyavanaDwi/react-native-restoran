export type RootStackParamList = {
  Login: undefined;
  MainTab: undefined;

  DetailMenu: {
    menuId: number;
    nama: string;
    harga: number;
  };

  DetailOrder: {
    orderId: number;
  };

  NewOrder: undefined;
  CreatePelanggan: undefined;
  EditProfile: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  CreatePelanggan: undefined;
  Menu: undefined;
  Pelanggan: undefined;
};
