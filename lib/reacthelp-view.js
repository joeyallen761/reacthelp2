'use babel';

export default class ReacthelpView {

  constructor(serializedState) {
    // Create root element

    this.element = document.createElement('div');
    this.element.classList.add('reacthelp');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'User Code React Helper Panel';
    message.classList.add('message');
    message.id = "messageID"
    message.style.fontSize = "18px"
    this.element.appendChild(message);

    const oldExportButton = document.createElement('button');
    //oldExportButton.style.fontSize = "x-large";
    //oldExportButton.style.width = "90%";
    //oldExportButton.style.height = "100px"
    //oldExportButton.style.border= "2px solid black"
    //oldExportButton.style.display = "block";

    oldExportButton.innerHTML = "Replace Old Export"
    oldExportButton.id = "oldExportButton"
    oldExportButton.title="It appears that this code includes an outdated export. Click this button to fix it."
    oldExportButton.style.visibility="hidden";
    oldExportButton.classList.add("button");
    this.element.appendChild(oldExportButton);
    this.element.appendChild(document.createElement('div'))
    const classToFunctionalButton = document.createElement('button');
    classToFunctionalButton.innerHTML = "Convert to Functional"
    classToFunctionalButton.id = "classToFunctional"
    classToFunctionalButton.title="It seems that this code is class-based, while the other editor is using functional code. Click this button to convert it."
    classToFunctionalButton.style.visibility="hidden";
    classToFunctionalButton.classList.add("button");
    this.element.appendChild(classToFunctionalButton);
    this.element.appendChild(document.createElement('div'))

    const funcToClassButton = document.createElement('button');
    funcToClassButton.innerHTML = "Convert to Class"
    funcToClassButton.id = "funcToClass"
    funcToClassButton.title="It seems that this code is functional, while the other editor is using class-based code. Click this button to convert it."
    funcToClassButton.style.visibility="hidden";
    funcToClassButton.classList.add("button");
    this.element.appendChild(funcToClassButton);
    this.element.appendChild(document.createElement('div'))

    const myOverlay = document.createElement('div')
    myOverlay.id = "overlay"
    this.element.appendChild(myOverlay);

    const infoPanel = document.createElement('div')
    infoPanel.classList.add("infoPanelHeader")
    infoPanel.id = "infoPanel";
    infoPanel.textContent = "Info Panel"

    var infoPanelText = document.createElement('div')
    infoPanelText.textContent = "\tThis is a test please work."
    infoPanelText.classList.add('infoPanelText')
    infoPanelText.id = "infoPanelText";
    //exportBodyText.style.fontSize="8px"
    //infoPanel.appendChild(infoPanelText)

    var infoPanelImage = document.createElement('img');
    infoPanelImage.classList.add('infoPanelImage')
    infoPanelImage.id = 'infoPanelImage';


    var infoPanelButton = document.createElement('button')
    infoPanelButton.classList.add('infoPanelButton')
    infoPanelButton.id = "infoPanelButton";
    infoPanelButton.textContent = "Learn More";



    this.element.appendChild(infoPanel)
    this.element.appendChild(infoPanelText)
    this.element.appendChild(infoPanelImage)
    this.element.appendChild(infoPanelButton)

    var userHistoryPanelHeader = document.createElement('div');
    userHistoryPanelHeader.classList.add("historyPanelHeader")
    userHistoryPanelHeader.id = "userHistoryPanelHeader";
    userHistoryPanelHeader.textContent = "App.js"

    var userHistoryPanelBody = document.createElement('div');
    userHistoryPanelBody.classList.add("historyPanelBody")
    userHistoryPanelBody.id = "userHistoryPanelBody";


    var exampleHistoryPanelHeader = document.createElement('div');
    exampleHistoryPanelHeader.classList.add("historyPanelHeader")
    exampleHistoryPanelHeader.id = "exampleHistoryPanelHeader";
    exampleHistoryPanelHeader.textContent = "Example.js"

    var exampleHistoryPanelBody = document.createElement('div');
    exampleHistoryPanelBody.classList.add("historyPanelBody")
    exampleHistoryPanelBody.id = "exampleHistoryPanelBody";

    var historyAnchor = document.createElement('div')
    historyAnchor.classList.add("historyAnchor")

    var historyPrompt = document.createElement("div");
    historyPrompt.innerHTML = "Name:"
    historyPrompt.id = "saveHistoryHeader"
    historyPrompt.style.visibility = "hidden";
    historyAnchor.appendChild(historyPrompt)


    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", "Hello World!");
    x.id = "historyPrompt";
    x.style.visibility = "hidden";
    //historyPrompt.appendChild(x)
    //historyPrompt.id = "historyPrompt"
    //historyPrompt.style.visibility = "hidden";

    historyAnchor.appendChild(x)

    var historyPromptEnd = document.createElement("button");
    historyPromptEnd.innerHTML = "Save"
    historyPromptEnd.id = "saveHistoryEnd"
    historyPromptEnd.style.visibility = "hidden";
    historyAnchor.appendChild(historyPromptEnd)

    historyAnchor.appendChild(userHistoryPanelHeader)
    historyAnchor.appendChild(userHistoryPanelBody)

    historyAnchor.appendChild(exampleHistoryPanelHeader)
    historyAnchor.appendChild(exampleHistoryPanelBody)

    this.element.appendChild(historyAnchor);


    //const myCanvas = document.createElement('canvas')
    //myCanvas.id = 'canvas'
    //this.element.appendChild(myCanvas)

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
