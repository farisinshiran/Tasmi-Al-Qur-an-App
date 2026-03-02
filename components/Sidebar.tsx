'use client';

import React from 'react';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: 'data' | 'image' | 'chat';
  setActiveTab: (tab: 'data' | 'image' | 'chat') => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'data', label: 'Data Nilai', icon: LayoutDashboard },
    { id: 'image', label: 'Image Generator', icon: ImageIcon },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  ] as const;

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          N
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">NilaiKu</h1>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-slate-400">
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
