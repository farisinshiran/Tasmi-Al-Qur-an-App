'use client';

import React, { useState } from 'react';
import { Student } from '@/types';
import { Search, Edit2, Check, X } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onUpdateStudent: (id: number, updates: Partial<Student>) => void;
}

export default function StudentTable({ students, onUpdateStudent }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNilai, setEditNilai] = useState<string>('');
  const [editKeterangan, setEditKeterangan] = useState<string>('');

  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.penguji.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditNilai(student.nilai !== null ? student.nilai.toString() : '');
    setEditKeterangan(student.keterangan);
  };

  const handleSave = (id: number) => {
    onUpdateStudent(id, {
      nilai: editNilai === '' ? null : Number(editNilai),
      keterangan: editKeterangan,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Data Nilai Ujian</h2>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari siswa, kelas, penguji..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">No</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kelas</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Juz</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Penguji</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nilai</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keterangan</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.no}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.kelas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.juz}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.penguji}</td>
                
                {editingId === student.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={editNilai}
                        onChange={(e) => setEditNilai(e.target.value)}
                        placeholder="Nilai"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={editKeterangan}
                        onChange={(e) => setEditKeterangan(e.target.value)}
                        placeholder="Keterangan"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleSave(student.id)} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 p-1 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancel} className="text-rose-600 hover:text-rose-900 bg-rose-50 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">
                      {student.nilai !== null ? student.nilai : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {student.keterangan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(student)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada data siswa yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
