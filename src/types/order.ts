export type order = {
  id: number;
  orderKode: string;
  pelangganId: number;
  kasirId: number;

  status: string;
  statusPembayaran: string;

  subTotal: string;
  diskon: string;
  total: string;

  createAt: string;
  updateAt: string;

  pelanggan: {
    id: number;
    nama: string;
    nomer_hp: string;
    alamat: string;
    statusPelanggan: boolean;
    createAt: string;
    updateAt: string;
  };

  createBy: {
    id: number;
    nama: string;
    email: string;
    role: string;
  };

  pesanMenu: {
    id: number;
    orderId: number;
    menuId: number;
    jumlah: number;
    hargaSnapshot: string;
    subTotal: string;

    menu: {
      id: number;
      menu: string;
      harga: number;
      kategori: string;
      deskripsi: string;
      image: string | null;
      statusMenu: boolean;
      createAt: string;
      updateAt: string;
    };
  }[];

  historiPesanan: {
    id: number;
    orderId: number;
    status: string;
    diubahOlehKasirId: number;
    createAt: string;
    updateAt: string;
  }[];
};
