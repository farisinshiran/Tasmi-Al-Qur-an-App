'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StudentTable from '@/components/StudentTable';
import ImageGenerator from '@/components/ImageGenerator';
import Chatbot from '@/components/Chatbot';
import { Student } from '@/types';

// ===============================
// TYPES
// ===============================

export type Student = {
  id: number
  no: number
  nama: string
  kelas: string
  juz: string
  penguji: string
  nilai: number | null
  keterangan: string
}

// ===============================
// INITIAL DATA
// ===============================

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, no: 1, nama: 'Ghoya Rifa Ruh Ramadhan', kelas: '9C', juz: '1', penguji: 'Ust. Oban Robani', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 2, no: 2, nama: 'M Aryasatyo Harjuna Bachtiar', kelas: '9C', juz: '30', penguji: "Ust. Ja'far Syarif Hidayatullah, S.Pd", nilai: null, keterangan: 'Belum Tasmi' },
  { id: 3, no: 3, nama: 'Muhammad Asyam Annafi', kelas: '7A', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 4, no: 4, nama: 'Nazran Syahid Amanillah', kelas: 'X-2', juz: '30', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 5, no: 5, nama: 'Yuswan Ali', kelas: 'X-4', juz: '30', penguji: 'Ust. Muhammad Fauzi Abdillah', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 6, no: 6, nama: 'Muhammad Fahri Fathurrohman', kelas: 'X-4', juz: '29', penguji: 'Ust. Muhammad Soffan', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 7, no: 7, nama: 'Muhammad Gufron Nurhadi', kelas: 'X-1', juz: '2', penguji: 'Ust. Muslim Tasdiq', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 8, no: 8, nama: 'Fawwaz Haikal Rasyidan', kelas: 'X-2', juz: '29', penguji: 'Ust. Luqmanul Hakim, S.T', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 9, no: 9, nama: 'Khairurrizal Ulil Amri A.B', kelas: '8C', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: 'Belum Tasmi' },
  { id: 10, no: 10, nama: 'Arfhan Adhi Irawan', kelas: '8A', juz: '30', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: 'Belum Tasmi' }
]

// ===============================
// VALIDATION
// ===============================

function clampNilai(value: number): number {
  if (isNaN(value)) return 0
  if (value > 100) return 100
  if (value < 0) return 0
  return Number(value.toFixed(2))
}

// ===============================
// KETERANGAN OTOMATIS
// ===============================

export function generateKeterangan(nilai: number | null): string {
  if (nilai === null) return 'Belum Tasmi'
  if (nilai >= 95) return 'Lulus (Mutqin)'
  if (nilai >= 90) return 'Lulus'
  return 'Tidak Lulus'
}

// ===============================
// UPDATE NILAI STUDENT
// ===============================

export function updateStudentNilai(
  students: Student[],
  id: number,
  nilaiInput: number | null
): Student[] {

  return students.map(student => {
    if (student.id !== id) return student

    const nilaiFinal =
      nilaiInput === null ? null : clampNilai(nilaiInput)

    return {
      ...student,
      nilai: nilaiFinal,
      keterangan: generateKeterangan(nilaiFinal)
    }
  })
}

// const INITIAL_STUDENTS: Student[] = [
//   { id: 1, no: 1, nama: 'Ghoya Rifa Ruh Ramadhan', kelas: '9C', juz: '1', penguji: 'Ust. Oban Robani', nilai: null, keterangan: '' },
//   { id: 2, no: 2, nama: 'M Aryasatyo Harjuna Bachtiar', kelas: '9C', juz: '30', penguji: "Ust. Ja'far Syarif Hidayatullah, S.Pd", nilai: null, keterangan: '' },
//   { id: 3, no: 3, nama: 'Muhammad Asyam Annafi', kelas: '7A', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: '' },
//   { id: 4, no: 4, nama: 'Nazran Syahid Amanillah', kelas: 'X-2', juz: '30', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: '' },
//   { id: 5, no: 5, nama: 'Yuswan Ali', kelas: 'X-4', juz: '30', penguji: 'Ust. Muhammad Fauzi Abdillah', nilai: null, keterangan: '' },
//   { id: 6, no: 6, nama: 'Muhammad Fahri Fathurrohman', kelas: 'X-4', juz: '29', penguji: 'Ust. Muhammad Soffan', nilai: null, keterangan: '' },
//   { id: 7, no: 7, nama: 'Muhammad Gufron Nurhadi', kelas: 'X-1', juz: '2', penguji: 'Ust. Muslim Tasdiq', nilai: null, keterangan: '' },
//   { id: 8, no: 8, nama: 'Fawwaz Haikal Rasyidan', kelas: 'X-2', juz: '29', penguji: 'Ust. Luqmanul Hakim, S.T', nilai: null, keterangan: '' },
//   { id: 9, no: 9, nama: 'Khairurrizal Ulil Amri A.B', kelas: '8C', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: '' },
//   { id: 10, no: 10, nama: 'Arfhan Adhi Irawan', kelas: '8A', juz: '30', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: '' },
//   { id: 11, no: 11, nama: 'Hizbadien Muhammad', kelas: 'X-4', juz: '3', penguji: 'Ust. Muhammad Fauzi Abdillah', nilai: null, keterangan: '' },
//   { id: 12, no: 12, nama: 'Affan Ghazy Kholilullah', kelas: 'X-1', juz: '28', penguji: 'Ust. Muhammad Soffan', nilai: null, keterangan: '' },
//   { id: 13, no: 13, nama: 'Aldi Fathan Dulfiqor', kelas: 'XI-2', juz: '29', penguji: 'Ust. Muslim Tasdiq', nilai: null, keterangan: '' },
//   { id: 14, no: 14, nama: 'Raditya Nugraha', kelas: 'X-1', juz: '28', penguji: 'Ust. Luqmanul Hakim, S.T', nilai: null, keterangan: '' },
//   { id: 15, no: 15, nama: 'Danish Achmad Hawary', kelas: '9C', juz: '29', penguji: 'Ust. Oban Robani', nilai: null, keterangan: '' },
//   { id: 16, no: 16, nama: 'Akmal Syahrizal', kelas: 'XI-4', juz: '29', penguji: 'Ust. Muhammad Soffan', nilai: null, keterangan: '' },
//   { id: 17, no: 17, nama: 'Ramdan MK', kelas: 'XI-4', juz: '30', penguji: 'Ust. Muslim Tasdiq', nilai: null, keterangan: '' },
//   { id: 18, no: 18, nama: 'Affan Ghazy Kholilullah', kelas: 'X-1', juz: '1', penguji: 'Ust. Luqmanul Hakim, S.T', nilai: null, keterangan: ' ' },
//   { id: 19, no: 19, nama: 'Zubair Alfatih', kelas: '7A', juz: '2', penguji: 'Ust. Oban Robani', nilai: 99, keterangan: 'Lulus (Mutqin)' },
//   { id: 20, no: 20, nama: 'M Athalarik Wijaya Saputra', kelas: '7A', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: ' ' },
//   { id: 21, no: 21, nama: 'Muhammad Azzam Huwaidi', kelas: 'XI-2', juz: '30', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: ' ' },
//   { id: 22, no: 22, nama: 'Muhammad Irham Pane', kelas: 'XI-2', juz: '29', penguji: 'Ust. Muhammad Fauzi Abdillah', nilai: null, keterangan: ' ' },
//   { id: 23, no: 23, nama: 'Muhammad Irham Pane', kelas: 'XI-2', juz: '30', penguji: 'Ust. Ja\'far Syarif Hidayatullah, S.Pd', nilai: null, keterangan: ' ' },
//   { id: 24, no: 24, nama: 'Imadudin Rijal Al-Faruq', kelas: 'XI-4', juz: '29', penguji: 'Ust. Oban Robani', nilai: 97.5, keterangan: 'Lulus (Mutqin)' },
//   { id: 25, no: 25, nama: 'Ismail Fathanul Islam', kelas: 'XI-4', juz: '5', penguji: 'Ust. Ja\'far Syarif Hidayatullah, S.Pd', nilai: null, keterangan: ' ' },
//   { id: 26, no: 26, nama: 'Yusuf Rizal Abdilllah', kelas: 'XI-4', juz: '30', penguji: 'Ust. Opa Mustofa', nilai: null, keterangan: ' ' },
//   { id: 27, no: 27, nama: 'Muhammad Raihan', kelas: 'XI-4', juz: '1', penguji: 'Ust. Dani Hamdani', nilai: null, keterangan: ' ' },
//   { id: 28, no: 28, nama: 'Zhafran Izharul Haq', kelas: '8D', juz: '29', penguji: 'Ust. Muhammad Fauzi Abdillah', nilai: null, keterangan: ' ' },
//   { id: 29, no: 29, nama: 'Fathir Hafiz Gumilar', kelas: '8C', juz: '30', penguji: 'Ust. Muhammad Soffan', nilai: null, keterangan: ' ' },
//   { id: 30, no: 30, nama: 'Hafid Fauzi', kelas: '8D', juz: '30', penguji: 'Ust. Muslim Tasdiq', nilai: null, keterangan: ' ' },
//   { id: 31, no: 31, nama: 'Muhammad Djibril Maulana Yusuf', kelas: '8A', juz: '29', penguji: 'Ust. Luqmanul Hakim, S.T', nilai: null, keterangan: ' ' },
//   { id: 32, no: 32, nama: 'Rafa Ahza Zaidan', kelas: '8A', juz: '29', penguji: 'Ust. Muhammad Faris Nuriman', nilai: 92, keterangan: 'Lulus' }, 
// ];

// function generateKeterangan(nilai: number): string {
//   if (nilai >= 95) return 'Lulus (Mutqin)'
//   if (nilai >= 85) return 'Lulus (Jayyid Jiddan)'
//   if (nilai >= 75) return 'Lulus (Jayyid)'
//   if (nilai >= 60) return 'Lulus (Maqbul)'
//   return 'Belum Lulus'
// }

export default function Home() {
  const [activeTab, setActiveTab] = useState<'data' | 'image' | 'chat'>('data');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const handleUpdateStudent = (id: number, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updates } : student))
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-hidden p-8">
        <div className="h-full max-w-7xl mx-auto">
          {activeTab === 'data' && (
            <StudentTable students={students} onUpdateStudent={handleUpdateStudent} />
          )}
          {activeTab === 'image' && <ImageGenerator />}
          {activeTab === 'chat' && <Chatbot />}
        </div>
      </main>
    </div>
  );
}
