import { Member } from "./member";

export type Pelanggan = {
  id: number;
  nama: string;
  nomer_hp: string;
  alamat: string;
  statusPelanggan: boolean;
  createAt: string;
  updateAt: string;

  member?: Member | null;
};
