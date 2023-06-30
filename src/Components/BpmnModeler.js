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
import { emptyBpmn } from '../Resources/SimpleDiagram';
import { handlerVoiceCommands } from '../Utils/HandlerVoiceCommands';


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
      container: "#bpm",
      propertiesPanel: {
        parent: "#properties-panel",
      },
    });

    // Import an empty BPMN diagram
    bpmnModeler.importXML(emptyBpmn).then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    const canvas = modeler.get("canvas");

    canvas.zoom("fit-viewport");
  })
  .catch((err) => {
    console.log(err);
  });

    setModeler(bpmnModeler);
      

    return () => {
      bpmnModeler.destroy();
    };
  }, []);

  const toggleVoiceCommmand = () => {
    if(listening){
      SpeechRecognition.stopListening()
      
  }else{
      SpeechRecognition.startListening()
  }
  }
  const handleVoiceCommand = () => {
    
    handlerVoiceCommands(finalTranscript,modeler)
    
  };

  useEffect(() => {
      handleVoiceCommand();
  }, [listening]);


  return (
    <div>
      <div id="properties-panel"></div>
      <div id="bpm" style={{ height: '500px' }}></div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      {browserSupportsSpeechRecognition && (
    <button onClick={toggleVoiceCommmand}>
      {listening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
    </button>
  )}
  <p>{finalTranscript}</p>
    </div>
  );
}

export default BpmnModelerComponent;
