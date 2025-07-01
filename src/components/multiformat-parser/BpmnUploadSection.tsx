"use client";

import React, { useRef, useState } from 'react';

const SUPPORTED_FORMATS = [
  { name: 'Camunda' },
  { name: 'Signavio' },
  { name: 'Bizagi' },
  { name: 'Visio' },
  { name: 'Lucidchart' },
];

function detectFormat(xml: string) {
  if (xml.includes('camunda')) return 'Camunda';
  if (xml.includes('signavio')) return 'Signavio';
  if (xml.includes('bizagi')) return 'Bizagi';
  if (xml.includes('visio')) return 'Visio';
  if (xml.includes('lucidchart')) return 'Lucidchart';
  return 'Unknown';
}

const BpmnUploadSection = ({ onBpmnLoaded }: { onBpmnLoaded: (xml: string, meta: any) => void }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    setFileName(file.name);
    if (!file.name.endsWith('.bpmn') && !file.name.endsWith('.xml')) {
      setError('File harus berformat .bpmn atau .xml');
      setFormat(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const xml = e.target?.result as string;
      if (!xml || !xml.includes('<?xml')) {
        setError('File tidak valid atau bukan file BPMN/XML.');
        setFormat(null);
        return;
      }
      const detected = detectFormat(xml);
      setFormat(detected);
      onBpmnLoaded(xml, { fileName: file.name, format: detected });
    };
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div
        className={`w-full h-[300px] bg-white border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 backdrop-blur-md border-white/40 shadow-lg hover:bg-black/20 ${dragActive ? 'ring-2 ring-primary' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".bpmn,.xml"
          className="hidden"
          onChange={handleChange}
        />
        <div className="text-xl font-bold mb-2 text-primary dark:text-darkmode">Drag & Drop BPMN file</div>
        <div className="text-gray-500 dark:text-darkmode mb-2">or click to choose file</div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {SUPPORTED_FORMATS.map(f => (
            <span key={f.name} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-darkmode text-xs font-semibold border border-primary/20">
              {f.name}
            </span>
          ))}
        </div>
        <div className="mt-4">
          {fileName && (
            <div className="mt-4 text-sm text-gray-700">File: <span className="font-semibold">{fileName}</span></div>
          )}
          {format && (
            <div className="mt-2 text-xs text-green-700">Detected format: <span className="font-bold">{format}</span></div>
          )}
          {error && (
            <div className="mt-2 text-xs text-red-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BpmnUploadSection; 