export interface Student {
  id: number;
  no: number;
  nama: string;
  kelas: string;
  juz: string;
  penguji: string;
  nilai: number | null;
  keterangan: string;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
