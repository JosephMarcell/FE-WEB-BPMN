import React, { useState, useEffect } from 'react';

const TABS = [
  { key: 'basic', label: 'Basic' },
  { key: 'extended', label: 'Extended' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'presentation', label: 'Presentation Action' },
];

const PropertyPanel = ({
  selectedElement,
  style,
  onClose,
  onColorChange,
  onNameChange,
  onDescriptionChange,
  fillColor,
  strokeColor
}: {
  selectedElement: any,
  style?: React.CSSProperties,
  onClose?: () => void,
  onColorChange?: (type: 'fill' | 'stroke', color: string) => void,
  onNameChange?: (name: string) => void,
  onDescriptionChange?: (desc: string) => void,
  fillColor?: string,
  strokeColor?: string
}) => {
  const [name, setName] = useState(selectedElement?.name || '');
  const [desc, setDesc] = useState(selectedElement?.documentation?.[0]?.text || '');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    setName(selectedElement?.name || '');
    setDesc(selectedElement?.documentation?.[0]?.text || '');
  }, [selectedElement]);

  const handleNameChange = (name: string) => {
    if (!viewer || !selectedElement) return;
    const elementRegistry = viewer.get('elementRegistry');
    let element = elementRegistry.get(selectedElement.id);

    // Untuk edge/flow, update label pada element.label jika ada
    if (element && element.label) {
      element = element.label;
    }

    if (element) {
      const modeling = viewer.get('modeling');
      modeling.updateLabel(element, name);

      setTimeout(() => {
        const updatedElement = elementRegistry.get(selectedElement.id);
        setSelectedElement(updatedElement.businessObject);
      }, 0);
    }
  };

  if (!selectedElement) return null;
  return (
    <div
      className="w-[360px] min-w-[360px] max-w-full bg-white border border-gray-200 rounded-xl shadow-lg p-5 relative"
      style={{ ...style, background: '#f9fafb', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', overflow: 'auto' }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg font-bold rounded focus:outline-none focus:ring-2 focus:ring-primary"
          title="Tutup"
        >
          ×
        </button>
      )}
      <div className="font-bold text-base text-gray-800 mb-3 pb-2 border-b border-gray-200">Element Properties</div>
      {/* Tabs Navbar */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex gap-2 max-w-[320px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-3 py-2 text-sm font-semibold focus:outline-none whitespace-nowrap transition-colors duration-150
                ${activeTab === tab.key
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'}
              `}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === 'basic' && (
        <div className="space-y-3">
          <div>
            <span className="block text-xs text-gray-500 font-semibold">Name</span>
            <input
              type="text"
              className="block w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => onNameChange && onNameChange(name)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Object name"
            />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-semibold">Type</span>
            <span className="block text-sm text-gray-800">{selectedElement.$type.replace(/^bpmn:/, '')}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-semibold mb-1">Description</span>
            <textarea
              className="block w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              onBlur={() => onDescriptionChange && onDescriptionChange(desc)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  (e.target as HTMLTextAreaElement).blur();
                  e.preventDefault();
                }
              }}
              placeholder="Object description"
              rows={2}
            />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-semibold mb-1">Fill Color</span>
            <input
              type="color"
              value={fillColor || '#ffffff'}
              onChange={e => onColorChange && onColorChange('fill', e.target.value)}
              className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
            />
          </div>
          <div>
            <span className="block text-xs text-gray-500 font-semibold mb-1">Stroke Color</span>
            <input
              type="color"
              value={strokeColor || '#000000'}
              onChange={e => onColorChange && onColorChange('stroke', e.target.value)}
              className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
            />
          </div>
          {selectedElement.documentation && selectedElement.documentation.length > 0 && (
            <div>
              <span className="block text-xs text-gray-500 font-semibold">Documentation</span>
              <span className="block text-sm text-gray-800 whitespace-pre-line">{selectedElement.documentation[0].text}</span>
            </div>
          )}
        </div>
      )}
      {activeTab === 'extended' && (
      <div className="space-y-3">
        <div>
          <span className="block text-xs text-gray-500 font-semibold">Add New Extended Attribute</span>
          <input
            type="text"
            className="block w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => onNameChange && onNameChange(name)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Object name"
          />
        </div>
      </div>
      )}
      {activeTab === 'advanced' && (
        <div className="space-y-3">
        <div>
          <span className="block text-xs text-gray-500 font-semibold">Basic Properties</span>
          <input
            type="text"
            className="block w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => onNameChange && onNameChange(name)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Object name"
          />
        </div>
      </div>
      )}
      {activeTab === 'presentation' && (
        <div className="space-y-3">
        <div>
          <span className="block text-xs text-gray-500 font-semibold">On Click</span>
          <input
            type="text"
            className="block w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => onNameChange && onNameChange(name)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Object name"
          />
        </div>
      </div>
      )}
    </div>
  );
};

export default PropertyPanel; 