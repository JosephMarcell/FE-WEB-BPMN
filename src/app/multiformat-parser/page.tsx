'use client';

import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import BpmnUploadSection from '@/components/multiformat-parser/BpmnUploadSection';
import { getTranslation } from '@/lib/lang/i18n';
import Header from '@/components/landing-page/Header';
import BpmnViewerPanel from '@/components/multiformat-parser/BpmnViewerPanel';
// @ts-ignore
import BpmnModeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import resizeAllModule from 'bpmn-js-nyan/lib/resize-all-rules';
// @ts-ignore
import colorPickerModule from 'bpmn-js-nyan/lib/color-picker';
// @ts-ignore
import nyanDrawModule from 'bpmn-js-nyan/lib/nyan/draw';
// @ts-ignore
import nyanPaletteModule from 'bpmn-js-nyan/lib/nyan/palette';

import BpmnJS from 'bpmn-js';
// atau
import BpmnViewer from 'bpmn-js';

// @ts-ignore
import BpmnModdle from 'bpmn-moddle';

const SUPPORTED_FORMATS = [
  { name: 'Camunda' },
  { name: 'Signavio' },
  { name: 'Bizagi' },
  { name: 'Visio' },
  { name: 'Lucidchart' },
];

const SAMPLE_FILE = '/assets/sample.bpmn';

function detectFormat(xml: string) {
  if (xml.includes('camunda')) return 'Camunda';
  if (xml.includes('signavio')) return 'Signavio';
  if (xml.includes('bizagi')) return 'Bizagi';
  if (xml.includes('visio')) return 'Visio';
  if (xml.includes('lucidchart')) return 'Lucidchart';
  return 'Unknown';
}

type CanvasType = {
  zoom: (factor: number) => void;
};

const MultiformatParser: React.FC = () => {
  const { t } = getTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bpmnXml, setBpmnXml] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!bpmnXml || !containerRef.current) return;
    if (viewer) viewer.destroy();
    const bpmnModeler = new BpmnModeler({
      container: containerRef.current,
      height: 500,
      width: '100%',
    });
    bpmnModeler.importXML(bpmnXml).then((result: any) => {
      const { warnings } = result;
      console.log('success !', warnings);
      (bpmnModeler.get('canvas') as any).zoom('fit-viewport');
      const definitions = bpmnModeler.getDefinitions();
      const process = (definitions.rootElements as any[])?.find(
        (el: any) => el.$type === 'bpmn:Process'
      );
      setMeta({
        name: process?.name || '-',
        version: definitions.exporterVersion || '-',
        author: definitions.exporter || '-',
        date: definitions.exporterDate || '-',
        activities:
          (definitions.rootElements as any[])?.filter(
            (el: any) => el.$type === 'bpmn:Task'
          ).length || 0,
        gateways:
          (definitions.rootElements as any[])?.filter(
            (el: any) => el.$type === 'bpmn:Gateway'
          ).length || 0,
        events:
          (definitions.rootElements as any[])?.filter(
            (el: any) => el.$type === 'bpmn:Event'
          ).length || 0,
        complexity: (definitions.rootElements as any[])?.length || 0,
      });
    }).catch((err: any) => {
      const { warnings, message } = err;
      console.log('something went wrong:', warnings, message);
    });
    setViewer(bpmnModeler);
    return () => bpmnModeler.destroy();
  }, [bpmnXml]);

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
      setBpmnXml(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const xml = e.target?.result as string;
      if (!xml || !xml.includes('<?xml')) {
        setError('File tidak valid atau bukan file BPMN/XML.');
        setFormat(null);
        setBpmnXml(null);
        return;
      }
      const detected = detectFormat(xml);
      setFormat(detected);
      setBpmnXml(xml);
    };
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleZoom = (factor: number) => {
    if (!viewer) return;
    const canvas = viewer.get('canvas');
    const currentZoom = canvas.zoom();
    canvas.zoom(currentZoom * factor);
  };

  const handleFullscreen = () => {
    if (!panelRef.current) return;
    if (!isFullscreen) {
      if (panelRef.current.requestFullscreen) {
        panelRef.current.requestFullscreen();
      } else if ((panelRef.current as any).webkitRequestFullscreen) {
        (panelRef.current as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleExportBpmn = async () => {
    if (!viewer) return;
    try {
      const { xml } = await viewer.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName?.replace(/\.[^.]+$/, '') + '.bpmn' || 'diagram.bpmn';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (e) {
      alert('Gagal export BPMN!');
    }
  };

  const handleBpmnLoaded = (xml: string, meta: any) => {
    setBpmnXml(xml);
    setMeta(meta);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-primary dark:bg-darkmode py-12 px-4 sm:px-8">
        <div className="mb-10 text-center pt-20">
          <h1 className="text-5xl sm:text-4xl font-bold text-white dark:text-white">DROP YOUR BPMN</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/3">
            <BpmnUploadSection onBpmnLoaded={handleBpmnLoaded} />
          </div>
          <div className="w-full lg:w-2/3">
            <BpmnViewerPanel bpmnXml={bpmnXml} meta={meta} />
          </div>
        </div>
      </main>
    </>
  );
};

export default MultiformatParser;