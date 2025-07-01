const START_EVENT_OPTIONS = [
  { key: 'none', label: 'None Start', eventDef: null, icon: 'bpmn-icon-start-event-none' },
  { key: 'timer', label: 'Timer Start', eventDef: 'bpmn:TimerEventDefinition', icon: 'bpmn-icon-start-event-timer' },
  { key: 'message', label: 'Message Start', eventDef: 'bpmn:MessageEventDefinition', icon: 'bpmn-icon-start-event-message' },
  { key: 'signal', label: 'Signal Start', eventDef: 'bpmn:SignalEventDefinition', icon: 'bpmn-icon-start-event-signal' },
  { key: 'conditional', label: 'Conditional Start', eventDef: 'bpmn:ConditionalEventDefinition', icon: 'bpmn-icon-start-event-none' },
  { key: 'parallelMultiple', label: 'Parallel Multiple Start', eventDef: 'bpmn:ParallelMultipleEventDefinition', icon: 'bpmn-icon-start-event-none' },
  { key: 'multiple', label: 'Multiple Start', eventDef: 'bpmn:MultipleEventDefinition', icon: 'bpmn-icon-start-event-none' },
];

const TASK_OPTIONS = [
  { key: 'task', label: 'None Task', type: 'bpmn:Task', icon: 'bpmn-icon-task' },
  { key: 'userTask', label: 'User Task', type: 'bpmn:UserTask', icon: 'bpmn-icon-user-task' },
  { key: 'serviceTask', label: 'Service Task', type: 'bpmn:ServiceTask', icon: 'bpmn-icon-service-task' },
  { key: 'receiveTask', label: 'Receive Task', type: 'bpmn:ReceiveTask', icon: 'bpmn-icon-receive-task' },
  { key: 'sendTask', label: 'Send Task', type: 'bpmn:SendTask', icon: 'bpmn-icon-send-task' },
  { key: 'scriptTask', label: 'Script Task', type: 'bpmn:ScriptTask', icon: 'bpmn-icon-script-task' },
  { key: 'manualTask', label: 'Manual Task', type: 'bpmn:ManualTask', icon: 'bpmn-icon-manual-task' },
  { key: 'businessRuleTask', label: 'Business Rule Task', type: 'bpmn:BusinessRuleTask', icon: 'bpmn-icon-business-rule-task' },
];

let showStartEventPopup = null;
let showTaskPopup = null;

export default function CustomPaletteProvider(palette, create, elementFactory, moddle, translate) {
  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._moddle = moddle;
  this._translate = translate;

  palette.registerProvider(this);
}

CustomPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'moddle',
  'translate'
];

function showDropdownPopup(event, options, onSelect) {
  let paletteEl = event.target;
  let container = null;
  while (paletteEl && !container) {
    if (paletteEl.classList && paletteEl.classList.contains('bjs-container')) {
      container = paletteEl;
      break;
    }
    paletteEl = paletteEl.parentElement;
  }
  if (!container) container = document.body;

  const popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.left = '60px';
  popup.style.top = '80px';
  popup.style.background = '#fff';
  popup.style.border = '1px solid #ccc';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
  popup.style.padding = '4px 0';
  popup.style.zIndex = 1000;
  popup.style.minWidth = '220px';
  popup.style.transition = 'opacity 0.2s';
  popup.style.opacity = '0';
  setTimeout(() => { popup.style.opacity = '1'; }, 10);

  const arrow = document.createElement('div');
  arrow.style.position = 'absolute';
  arrow.style.top = '-10px';
  arrow.style.left = '24px';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderLeft = '8px solid transparent';
  arrow.style.borderRight = '8px solid transparent';
  arrow.style.borderBottom = '10px solid #ccc';
  popup.appendChild(arrow);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.width = '100%';
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.padding = '10px 18px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '15px';
    btn.style.transition = 'background 0.15s';
    btn.onmouseover = () => btn.style.background = '#f3f4f6';
    btn.onmouseout = () => btn.style.background = 'none';

    const icon = document.createElement('span');
    icon.className = option.icon;
    icon.style.marginRight = '12px';
    icon.style.fontSize = '18px';
    btn.appendChild(icon);

    const label = document.createElement('span');
    label.innerText = option.label;
    btn.appendChild(label);

    btn.onclick = function(e) {
      e.stopPropagation();
      onSelect(option, e);
      popup.remove();
    };

    popup.appendChild(btn);
  });

  container.appendChild(popup);

  setTimeout(() => {
    const closePopup = (e) => {
      if (!popup.contains(e.target)) {
        popup.style.opacity = '0';
        setTimeout(() => {
          if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 200);
        document.removeEventListener('mousedown', closePopup);
      }
    };
    document.addEventListener('mousedown', closePopup);
  }, 100);

  return popup;
}

CustomPaletteProvider.prototype.getPaletteEntries = function() {
  const self = this;
  return {
    'custom-start-event': {
      group: 'event',
      className: 'bpmn-icon-start-event-none',
      title: self._translate('Tambah Start Event'),
      action: {
        click: function(event) {
          if (showStartEventPopup) {
            showStartEventPopup.remove();
            showStartEventPopup = null;
          }
          showStartEventPopup = showDropdownPopup(event, START_EVENT_OPTIONS, function(option, e) {
            const businessObject = self._moddle.create('bpmn:StartEvent', {
              eventDefinitions: option.eventDef ? [self._moddle.create(option.eventDef)] : []
            });
            const shape = self._elementFactory.createShape({
              type: 'bpmn:StartEvent',
              businessObject
            });
            self._create.start(event, shape);
            showStartEventPopup = null;
          });
        }
      }
    },
    'custom-task': {
      group: 'activity',
      className: 'bpmn-icon-task',
      title: self._translate('Tambah Task'),
      action: {
        click: function(event) {
          if (showTaskPopup) {
            showTaskPopup.remove();
            showTaskPopup = null;
          }
          showTaskPopup = showDropdownPopup(event, TASK_OPTIONS, function(option, e) {
            const businessObject = self._moddle.create(option.type);
            const shape = self._elementFactory.createShape({
              type: option.type,
              businessObject
            });
            self._create.start(event, shape);
            showTaskPopup = null;
          });
        }
      }
    }
  };
};
