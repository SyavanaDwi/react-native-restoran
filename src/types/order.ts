export type order = {
  id: number;
  orderKode: string;
  status: string;
  statusPembayaran: string;
  total: string;
  pelanggan: {
    id: number;
    nama: string;
    alamat: string;
  };
};
