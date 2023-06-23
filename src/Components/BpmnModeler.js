import React, { useEffect, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import simpleDiagramXML from '../Resources/SimpleDiagram.bpmn'
import SpeechRecognition,{ useSpeechRecognition } from 'react-speech-recognition';
import { computeHeadingLevel } from '@testing-library/react';
import { is } from 'bpmn-js/lib/util/ModelUtil';


function BpmnModelerComponent() {
  const [modeler, setModeler] = useState(null);
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  

  useEffect(() => {
    const bpmnModeler = new BpmnModeler({
      container: "#canvas",
      propertiesPanel: {
        parent: "#properties-panel",
      },
    });

    // Import an empty BPMN diagram
    bpmnModeler.importXML(      '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1">' +
    '<bpmn:process id="Process_1" isExecutable="false"></bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"></bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>',
        (err) => {
          if (err) {
            console.error('Failed to import BPMN diagram', err);
          } else {
            console.log('BPMN diagram imported successfully');
          }
        }
      );

    setModeler(bpmnModeler);
      

    return () => {
      bpmnModeler.destroy();
    };
  }, []);

  const handleVoiceCommand = () => {
    if(listening){
        SpeechRecognition.stopListening()
        
    }else{
        SpeechRecognition.startListening()
    }
    setTimeout(() => {
    console.log('Final transcript:', finalTranscript);
  
    if (finalTranscript.toLowerCase().includes('crear tarea')) {
        let transcriptArray
        let taskName
        transcriptArray=finalTranscript.split('crear tarea');
        console.log(transcriptArray)
        taskName=transcriptArray[1];
      // Add your logic to add a task to the BPMN diagram
      const bpmnFactory = modeler.get('bpmnFactory'),
        elementFactory = modeler.get('elementFactory'),
        elementRegistry = modeler.get('elementRegistry'),
        modeling = modeler.get('modeling');
        const process = elementRegistry.get('Process_1'),
        startEvent = elementRegistry.get('StartEvent_1');

        const taskBusinessObject = bpmnFactory.create('bpmn:Task', { id: 'Task_'+taskName, name: taskName });
        const task = elementFactory.createShape({ type: 'bpmn:Task', businessObject: taskBusinessObject });
        modeling.createShape(task, { x: 400, y: 100 }, process);
      // Create a new task element in the BPMN diagram
      //const modeling = modeler.get('modeling');
      //const canvas = modeler.get('canvas');
      
      // Define the task properties
      
      // Add the task element to the BPMN diagram
      console.log('Task added');
    }
    }, 1000);
  };


  return (
    <div>
      <div id="properties-panel"></div>
      <div id="canvas" style={{ height: '500px' }}></div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      {browserSupportsSpeechRecognition && (
    <button onClick={handleVoiceCommand}>
      {listening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
    </button>
  )}
  <p>{finalTranscript}</p>
    </div>
  );
}

export default BpmnModelerComponent;