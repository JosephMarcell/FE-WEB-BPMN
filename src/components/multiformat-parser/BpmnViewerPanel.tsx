"use client";

import React, { useRef, useState, useEffect } from "react";
// @ts-ignore
import BpmnModeler from "bpmn-js/lib/Modeler";
// @ts-ignore
import resizeAllModule from 'bpmn-js-nyan/lib/resize-all-rules';
// @ts-ignore
import colorPickerModule from 'bpmn-js-nyan/lib/color-picker';
// @ts-ignore
import nyanDrawModule from 'bpmn-js-nyan/lib/nyan/draw';
// @ts-ignore
import nyanPaletteModule from 'bpmn-js-nyan/lib/nyan/palette';
import PropertyPanel from './PropertyPanel';
import '../../styles/bpmn-canvas-grid.css';
import CustomPaletteProvider from './CustomPaletteProvider';

const BpmnViewerPanel = ({ bpmnXml, meta }: { bpmnXml: string | null, meta: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [processMeta, setProcessMeta] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [showCanvasGrid, setShowCanvasGrid] = useState(false);
  const [selectedFillColor, setSelectedFillColor] = useState<string | undefined>(undefined);
  const [selectedStrokeColor, setSelectedStrokeColor] = useState<string | undefined>(undefined);

  const START_EVENT_OPTIONS = [
    { key: 'none', label: 'None Start', eventDef: null, icon: 'bpmn-icon-start-event-none' },
    { key: 'timer', label: 'Timer Start', eventDef: 'bpmn:TimerEventDefinition', icon: 'bpmn-icon-start-event-timer' },
    { key: 'message', label: 'Message Start', eventDef: 'bpmn:MessageEventDefinition', icon: 'bpmn-icon-start-event-message' },
    { key: 'signal', label: 'Signal Start', eventDef: 'bpmn:SignalEventDefinition', icon: 'bpmn-icon-start-event-signal' },
    // Fallback icon for conditional 
    // Fallback icon for parallelMultiple
    { key: 'parallelMultiple', label: 'Parallel Multiple Start', eventDef: 'bpmn:ParallelMultipleEventDefinition', icon: 'bpmn-icon-start-event-none' },
    // Fallback icon for multiple
    { key: 'multiple', label: 'Multiple Start', eventDef: 'bpmn:MultipleEventDefinition', icon: 'bpmn-icon-start-event-none' },
  ];

  useEffect(() => {
    if (!bpmnXml || !containerRef.current) return;
    if (viewer) viewer.destroy();
    const bpmnModeler = new BpmnModeler({
      container: containerRef.current,
      height: '100%',
      width: '100%',
      additionalModules: [
        resizeAllModule,
        colorPickerModule,
        nyanDrawModule,
        nyanPaletteModule,
        {
          __init__: ['customPaletteProvider'],
          customPaletteProvider: ['type', CustomPaletteProvider]
        }
      ],
    });
    bpmnModeler.importXML(bpmnXml).then((result: any) => {
      const { warnings } = result;
      (bpmnModeler.get('canvas') as any).zoom('fit-viewport');
      const definitions = bpmnModeler.getDefinitions();
      const process = (definitions.rootElements as any[])?.find((el: any) => el.$type === 'bpmn:Process');
      setProcessMeta({
        name: process?.name || '-',
        version: definitions.exporterVersion || '-',
        author: definitions.exporter || '-',
        date: definitions.exporterDate || '-',
        activities: (definitions.rootElements as any[])?.filter((el: any) => el.$type === 'bpmn:Task').length || 0,
        gateways: (definitions.rootElements as any[])?.filter((el: any) => el.$type === 'bpmn:Gateway').length || 0,
        events: (definitions.rootElements as any[])?.filter((el: any) => el.$type === 'bpmn:Event').length || 0,
        complexity: (definitions.rootElements as any[])?.length || 0,
      });
      // Set default color setelah render
      setTimeout(() => {
        const elementRegistry = bpmnModeler.get('elementRegistry');
        const modeling = bpmnModeler.get('modeling');
        elementRegistry.getAll().forEach((element: any) => {
          if (!element.businessObject) return;
          if (element.type === 'label') return;
          const type = element.businessObject.$type;
          if (type === 'bpmn:Participant') {
            modeling.setColor(element, { stroke: '#222' });
          } else if (type === 'bpmn:Task') {
            modeling.setColor(element, { fill: '#447FFD', stroke: '#FFFFFF' });
          } else if (type === 'bpmn:StartEvent') {
            modeling.setColor(element, { fill: '#22c55e', stroke: '#222' });
          }
        });
      }, 0);
    }).catch((err: any) => {
      const { warnings, message } = err;
      console.log('something went wrong:', warnings, message);
    });
    bpmnModeler.on('element.click', function(event: any) {
      const element = event.element;
      setSelectedElement(element.businessObject);
    });
    setViewer(bpmnModeler);
    return () => bpmnModeler.destroy();
    // eslint-disable-next-line
  }, [bpmnXml]);

  useEffect(() => {
    if (!viewer || !selectedElement) {
      setSelectedFillColor(undefined);
      setSelectedStrokeColor(undefined);
      return;
    }
    const elementRegistry = viewer.get('elementRegistry');
    const element = elementRegistry.get(selectedElement.id);
    if (element && element.di) {
      setSelectedFillColor(element.di.fill || '');
      setSelectedStrokeColor(element.di.stroke || '');
    } else {
      setSelectedFillColor(undefined);
      setSelectedStrokeColor(undefined);
    }
  }, [viewer, selectedElement]);

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
      a.download = meta?.fileName?.replace(/\.[^.]+$/, '') + '.bpmn' || 'diagram.bpmn';
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

  // Effect untuk handle resize
  useEffect(() => {
    if (!viewer || !containerRef.current) return;

    const handleResize = () => {
      viewer.get('canvas').resized();
    };

    // Gunakan ResizeObserver agar otomatis saat container di-resize
    const resizeObserver = new window.ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [viewer]);

  const handleColorChange = (type: 'fill' | 'stroke', color: string) => {
    if (!viewer || !selectedElement) return;
    const elementRegistry = viewer.get('elementRegistry');
    const modeling = viewer.get('modeling');
    const element = elementRegistry.get(selectedElement.id);
    if (element) {
      modeling.setColor(element, {
        [type]: color
      });
    }
  };

  const handleNameChange = (name: string) => {
    if (!viewer || !selectedElement) return;
    const elementRegistry = viewer.get('elementRegistry');
    const modeling = viewer.get('modeling');
    const element = elementRegistry.get(selectedElement.id);
    if (element) {
      modeling.updateLabel(element, name);
    }
  };

  const handleDescriptionChange = (desc: string) => {
    if (!viewer || !selectedElement) return;
    const elementRegistry = viewer.get('elementRegistry');
    const modeling = viewer.get('modeling');
    const moddle = viewer.get('moddle');
    const element = elementRegistry.get(selectedElement.id);
    if (element) {
      // BPMN documentation adalah array of { text, ... }
      const documentation = [moddle.create('bpmn:Documentation', { text: desc })];
      modeling.updateProperties(element, { documentation });
      setTimeout(() => {
        const updatedElement = elementRegistry.get(selectedElement.id);
        setSelectedElement(updatedElement.businessObject);
      }, 0);
    }
  };

  return (
    <div className="w-full lg:w-full flex flex-col items-center">
      {!bpmnXml ? (
        <div className="flex items-center justify-center h-[600px] text-gray-300 text-lg bg-white rounded-xl border-2 border-dashed border-gray-300 w-full">
          Upload file BPMN untuk melihat diagram
        </div>
      ) : (
        <div className="flex w-full">
          <div className="flex-1 bg-white rounded-xl p-4 shadow-lg w-full" ref={panelRef}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-bold text-lg text-gray-800">Diagram BPMN</div>
                <div className="text-xs text-gray-500">{meta?.fileName} ({meta?.format})</div>
              </div>
              <div className="flex-1 flex justify-end gap-2">
                <button onClick={() => handleZoom(1.2)} className="px-3 py-1 rounded bg-primary text-white text-lg font-bold">+</button>
                <button onClick={() => handleZoom(0.8)} className="px-3 py-1 rounded bg-primary text-white text-lg font-bold">-</button>
                <button onClick={handleFullscreen} className="px-3 py-1 rounded bg-primary text-white text-lg font-bold" title="Full Screen">[&nbsp;]</button>
                <button onClick={handleExportBpmn} className="px-3 py-1 rounded bg-primary text-white text-lg font-bold" title="Export BPMN">⭳</button>
                <button
                  onClick={() => setShowCanvasGrid(v => !v)}
                  className={`px-3 py-1 rounded ${showCanvasGrid ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} text-lg font-bold`}
                  title="Toggle Grid"
                >
                  GRID
                </button>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <PropertyPanel
                selectedElement={selectedElement}
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 20, width: 360 }}
                onClose={() => setSelectedElement(null)}
                onColorChange={handleColorChange}
                onNameChange={handleNameChange}
                onDescriptionChange={handleDescriptionChange}
                fillColor={selectedFillColor}
                strokeColor={selectedStrokeColor}
              />
              <div
                ref={containerRef}
                className={`w-full border rounded mb-4 resize-y overflow-auto ${showCanvasGrid ? 'bpmn-canvas-grid' : ''}`}
                style={{ minHeight: 300, maxHeight: 900, height: 500, background: showCanvasGrid ? undefined : '#f9fafb' }}
              />
            </div>
            {processMeta && (
              <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-gray-700">
                <div><span className="font-semibold">Process Name:</span> {processMeta.name}</div>
                <div><span className="font-semibold">Version:</span> {processMeta.version}</div>
                <div><span className="font-semibold">Author:</span> {processMeta.author}</div>
                <div><span className="font-semibold">Created:</span> {processMeta.date}</div>
                <div><span className="font-semibold">Activities:</span> {processMeta.activities}</div>
                <div><span className="font-semibold">Gateways:</span> {processMeta.gateways}</div>
                <div><span className="font-semibold">Events:</span> {processMeta.events}</div>
                <div><span className="font-semibold">Complexity:</span> {processMeta.complexity}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BpmnViewerPanel; 