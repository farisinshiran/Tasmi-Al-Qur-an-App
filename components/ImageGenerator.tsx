'use client';

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Image as ImageIcon, Loader2, Download, Settings, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window !== 'undefined' && window.aistudio) {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(keySelected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window !== 'undefined' && window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Always create a new instance to get the latest key
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { text: prompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
          }
        }
      });

      let foundImage = false;
      if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
            setGeneratedImage(imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError("Gagal menghasilkan gambar. Silakan coba lagi dengan prompt yang berbeda.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         setError("API Key tidak valid atau tidak memiliki akses ke model ini. Silakan pilih API Key lain.");
         setHasKey(false);
      } else {
         setError(err.message || "Terjadi kesalahan saat menghasilkan gambar.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Konfigurasi API Key</h2>
        <p className="text-slate-600 text-center max-w-md mb-8">
          Untuk menggunakan fitur Nano Banana Pro (gemini-3-pro-image-preview), Anda perlu memilih API Key dari project Google Cloud yang berbayar.
        </p>
        <button
          onClick={handleSelectKey}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Pilih API Key
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3 mb-1">
          <ImageIcon className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Nano Banana Pro Image Generator</h2>
        </div>
        <p className="text-sm text-slate-500">Buat gambar berkualitas tinggi untuk keperluan materi ujian atau presentasi.</p>
      </div>

      <div className="p-6 flex-1 flex flex-col lg:flex-row gap-8 overflow-auto">
        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Gambar (Prompt)</label>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none h-32"
              placeholder="Contoh: Ilustrasi anak sedang belajar membaca Al-Quran dengan gaya kartun 3D..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ukuran Resolusi</label>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                    size === s
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Buat Gambar</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center min-h-[400px] relative overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center space-y-4 text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <p className="font-medium animate-pulse">AI sedang melukis gambar Anda...</p>
            </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full group">
              <Image
                src={generatedImage}
                alt={prompt}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={generatedImage}
                  download="generated-image.png"
                  className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium flex items-center space-x-2 hover:bg-slate-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Gambar</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3 text-slate-400">
              <ImageIcon className="w-16 h-16 opacity-50" />
              <p>Area pratinjau gambar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
