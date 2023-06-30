import { is } from "bpmn-js/lib/util/ModelUtil";

const existID = (idElement, elementRegistry, elementType = "Task") => {
  let idSearch = elementType + "_" + idElement;
  return elementRegistry.filter((element) => {
    return element.id === idSearch;
  }, []);
};

const getPreviousElement = (elementRegistry, elementID = "") => {
  if (elementID === "") {
    const allElements = elementRegistry.getAll().filter((element) => {
      return !is(element, "bpmn:SequenceFlow") && element.type !== "label";
    });
    console.log(allElements);
    const lastIndex = allElements.length - 1;

    // Get the previous element if it exists

    if (lastIndex >= 0) {
      console.log("TareaAnterior2: " + allElements);
      return allElements[lastIndex];
    }

    return null; // Return null if there is no previous element
  }
};

export const handlerVoiceCommands = (finalTranscript, modeler) => {
  let lcTranscript = finalTranscript.toLowerCase();
  let splittedTranscript = "";
  let elementName = "";
  if (lcTranscript.includes("crear tarea")) {
    splittedTranscript = lcTranscript.split("crear tarea");
    elementName = splittedTranscript[1];
    createElement(elementName, modeler, "Task");
    //createTask(lcTranscript, modeler);
  }

  if (lcTranscript.includes("crear gateway")) {
    splittedTranscript = lcTranscript.split("crear gateway");
    elementName = splittedTranscript[1];
    createElement(elementName, modeler, "Gateway");
    //createGateway(lcTranscript, modeler);
  }
};
// const createGateway = (finalTranscript, modeler) => {
//   let transcriptArray;
//   let taskName;
//   transcriptArray = finalTranscript.split("crear gateway");
//   taskName = transcriptArray[1] + "?";
//   console.log(taskName);
//   const elementRegistry = modeler.get("elementRegistry");
//   if (existID(taskName, elementRegistry, "Gateway").length === 0) {
//     const bpmnFactory = modeler.get("bpmnFactory");
//     const elementFactory = modeler.get("elementFactory");
//     const modeling = modeler.get("modeling");
//     const process = elementRegistry.get("Process_1");

//     const gatewayBusinessObject = bpmnFactory.create(`bpmn:Gateway`, {
//       id: `Gateway_${taskName}`,
//       name: taskName,
//     });
//     const gateway = elementFactory.createShape({
//       type: `bpmn:Gateway`,
//       businessObject: gatewayBusinessObject,
//     });

//     const previousElement = getPreviousElement(elementRegistry);
//     modeling.createShape(
//       gateway,
//       { x: previousElement.x + 200, y: previousElement.y + 40 },
//       process
//     );

//     if (previousElement) {
//       modeling.connect(previousElement, gateway);
//     }

//     console.log("Gateway added");
//   } else {
//     console.log("El id del Gateway ya existe");
//   }
// };

const createElement = (elementName, modeler, elementType) => {
  const elementRegistry = modeler.get("elementRegistry");
  if (existID(elementName, elementRegistry, elementType).length === 0) {
    const bpmnFactory = modeler.get("bpmnFactory");
    const elementFactory = modeler.get("elementFactory");
    const modeling = modeler.get("modeling");
    const process = elementRegistry.get("Process_1");

    const bpmElementBusinessObject = bpmnFactory.create(`bpmn:${elementType}`, {
      id: `${elementType}_${elementName}`,
      name: elementName,
    });
    const bpmElement = elementFactory.createShape({
      type: `bpmn:${elementType}`,
      businessObject: bpmElementBusinessObject,
    });

    const previousElement = getPreviousElement(elementRegistry);
    modeling.createShape(
      bpmElement,
      { x: previousElement.x + 200, y: previousElement.y + 40 },
      process
    );

    if (previousElement) {
      modeling.connect(previousElement, bpmElement);
    }

    console.log(`${elementType} added`);
  } else {
    console.log(`El id del ${elementType} ya existe`);
  }
};
