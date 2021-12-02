'use babel';
$ = jQuery = require('jquery')
const {shell} = require('electron')

import ReacthelpView from './reacthelp-view';
import HistoryCodeView from './history-code-view'

//import Panel from './Sample_JSX.jsx'


import 'bootstrap';
//import jQuery from './jquery'
//$ = jQuery

//var url_root = "https://www.pythonanywhere.com/user/johnjallen/files/home/johnjallen/mysite/"
var url_root = "http://127.0.0.1:5000/"

import { CompositeDisposable } from 'atom';
var userFileName = "App.js"
var exampleFileName = "examplepage.js"


var exportMarkers = []
var exportMarked = false;

var userFunctionToClassMarkers = [];
var userFunctionToClassMarked = false;

var allMarkers = {}
var isMarked = {}
var markerVars = {}

var initialCodeStateSaved = false;

function getUserTextEditor(){
  textEditors = atom.workspace.getTextEditors();
  for (i = 0; i < textEditors.length;i++){
    te = textEditors[i]
    if (te.getFileName() == userFileName){
      return te;
    }
  }
}

function getExampleTextEditor(){
  textEditors = atom.workspace.getTextEditors();
  for (i = 0; i < textEditors.length;i++){
    te = textEditors[i]
    if (te.getFileName() == exampleFileName){
      return te;
    }
  }
}

function isClass(code){
  return h_getIsClass(code);
  /*
  $.ajax({
    type: "POST",
    url: url_root+"getIsClass",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     // do something
     console.log("isClass",o)
     oResponse = o.response;
     //if (o.response){
    //   exampleCodeType = "class";//"visible"
     //}

  }).fail(function(){
    console.log('we have a failure in processExampleChange')
    oResponse = false
  });
  return oResponse;*/
}

function isFunctional(code){
  return h_getIsFunctional(code)
  /*
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/getIsFunctional",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     // do something
     console.log("isFunctional",o.response)
     oResponse = o.response;
     //if (o.response){
    //   exampleCodeType = "functional";//"visible"
     //}
  }).fail(function(){
    oResponse = false;
    console.log('we have a failure in processExampleChange')
  });
  return oResponse*/
}

function canBeConverted(code){
  return h_canBeConvertedToFunction(code)
  /*
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/canBeConvertedToFunction",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     // do something
     if (o.response){
       console.log("used to be this")
       to_return = true;
       //origScope.classToFuncButtonRight.style.visibility = "visible";
     }
     else{
       to_return = false;
     }
  }).fail(function(){
    console.log('we have a failure in processExampleChange')
  });
  return to_return;*/
}

function addState(code){
  return h_addState(code)
  /*
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/addState",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     // do something
     if (o.response){
       console.log("used to be this")
       to_return = o.response;
       //origScope.classToFuncButtonRight.style.visibility = "visible";
     }
     else{
       to_return = false;
     }
  }).fail(function(){
    console.log('we have a failure in processExampleChange')
  });
  return to_return;*/
}

function hasOutdatedExport(code){
  return h_hasOutdatedExport(code)
  /*
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/hasOutdatedExport",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     // do something
     if (o.response){
       to_return = o.response;
       console.log("used to show this")
       //origScope.oldExportButton.style.visibility="visible";//"visible"
     }
     else{
       to_return = false;
       origScope.oldExportButton.style.visibility="hidden";//"visible"
     }
  }).fail(function(){
    console.log('we have a failure in processExampleChange')
    to_return = false;
  });
  return to_return;*/
}

function getFirstComponentName(code){
  return h_getFirstComponentName(code)
  /*
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/getFirstComponentName",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({text:code}),
    async: false,
  }).done(function( o ) {
     to_return = o.response
  }).fail(function(){
    console.log('we have a failure in processExampleChange')
    to_return = "ExampleApp";
  });
  return to_return;*/
}

//infopanel = something

export default {

  reacthelpView: null,
  modalPanel: null,
  subscriptions: null,
  userEditor: null,
  exampleEditor: null,
  oldExportButton: null,
  myCanvas: null,
  infoPanel: null,
  //myOverlayView: null,

  activate(state) {
    this.historyModal = new HistoryCodeView(state.historyCodeViewState)

    this.historyModalPanel = atom.workspace.addBottomPanel({
      item: this.historyModal.getElement(),
      visible: false
    });



    //this.historyModalPanel.id = "myHistoryModalPanel"

    document.getElementById("closeHistoryButton").onclick=()=>{this.historyModalPanel.hide()};

    this.codeBox = document.getElementById("codeBox")

    this.reacthelpView = new ReacthelpView(state.reacthelpViewState);
    this.reacthelpViewRight = new ReacthelpView(state.reacthelpViewState);

    //this.myOverlayView = new ReacthelpView(state.reacthelpViewState);


    this.modalPanel = atom.workspace.addLeftPanel({
      item: this.reacthelpView.getElement(),
      visible: false
    });

    this.rightModalPanel = atom.workspace.addRightPanel({
      item: this.reacthelpViewRight.getElement(),
      visible: false
    });

    //this.rightModalPanel.appendChild(new Panel())

    //$(this.rightModalPanel.item).find("#messageID")[0].textContent = "Example Code React Helper Panel";
    this.oldExportButton = $(this.rightModalPanel.item).find("#oldExportButton")[0];
    this.oldExportButton.onclick=()=>{this.replaceOutdatedExport()};

    this.myOverlay = document.createElement('div')
    this.myOverlay.id = "overlay"//$(this.rightModalPanel.item).find("#overlay")[0];
    //this.myCanvas = $(this.rightModalPanel.item).find("#canvas")[0];
    this.myCanvas = document.createElement('canvas')
    this.myCanvas.id = 'canvas'
    this.classToFuncButton = $(this.modalPanel.item).find("#classToFunctional")[0];
    this.classToFuncButton.onclick=()=>{this.classToFunctional(this.userEditor)};

    this.classToFuncButtonRight = $(this.rightModalPanel.item).find("#classToFunctional")[0];
    this.classToFuncButtonRight.onclick=()=>{this.classToFunctional(this.exampleEditor)};



    this.funcToClassButton = $(this.modalPanel.item).find("#funcToClass")[0];
    this.funcToClassButton.onclick=()=>{
      this.functionalToClass(this.userEditor)
      //this.addMarkers("userFunctionToClass")

    };

    this.funcToClassButtonRight = $(this.rightModalPanel.item).find("#funcToClass")[0];
    this.funcToClassButtonRight.onclick=()=>{this.functionalToClass(this.exampleEditor)};


    this.infoPanel = $(this.rightModalPanel.item).find("#infoPanel")[0];
    this.infoPanelText = $(this.rightModalPanel.item).find("#infoPanelText")[0];
    this.infoPanelButton = $(this.rightModalPanel.item).find("#infoPanelButton")[0];
    this.infoPanelImage = $(this.rightModalPanel.item).find("#infoPanelImage")[0];

    this.userHistoryPanelBody = $(this.rightModalPanel.item).find('#userHistoryPanelBody')[0];
    this.exampleHistoryPanelBody = $(this.rightModalPanel.item).find('#exampleHistoryPanelBody')[0];

    this.historyPromptHeader = $(this.rightModalPanel.item).find("#saveHistoryHeader")[0];
    this.historyPrompt = $(this.rightModalPanel.item).find("#historyPrompt")[0];
    this.historyPromptEnd = $(this.rightModalPanel.item).find("#saveHistoryEnd")[0];

    this.userEditor = getUserTextEditor();
    this.exampleEditor = getExampleTextEditor();

    var origScope = this;
    var historyItem = document.createElement("button")
    historyItem.classList.add("historyItem")
    historyItem.textContent = "Save Code Snapshot";
    var curExampleCode = getExampleTextEditor().getText();
    historyItem.addEventListener ("click", function() {
      origScope.historyPromptHeader.style.visibility = "visible"
      origScope.historyPrompt.style.visibility = "visible";
      origScope.historyPromptEnd.style.visibility = "visible";



      origScope.historyPromptEnd.onclick=()=> {
        origScope.addExampleHistoryItem(origScope.historyPrompt.value,origScope.exampleEditor.getText());
        origScope.historyPromptHeader.style.visibility = "hidden";
        origScope.historyPrompt.style.visibility = "hidden";
        origScope.historyPromptEnd.style.visibility = "hidden";
      }
      //origScope.historyPrompt.innerHTML = "code snapshot"
  });
    this.exampleHistoryPanelBody.appendChild(historyItem)

    var historyItem = document.createElement("button")
    historyItem.classList.add("historyItem")
    historyItem.textContent = "Save Code Snapshot";
    var curExampleCode = getExampleTextEditor().getText();
    historyItem.addEventListener ("click", function() {
      origScope.historyPromptHeader.style.visibility = "visible"
      origScope.historyPrompt.style.visibility = "visible";
      origScope.historyPromptEnd.style.visibility = "visible";



      origScope.historyPromptEnd.onclick=()=> {
        origScope.addUserHistoryItem(origScope.historyPrompt.value,origScope.userEditor.getText());
        origScope.historyPromptHeader.style.visibility = "hidden";
        origScope.historyPrompt.style.visibility = "hidden";
        origScope.historyPromptEnd.style.visibility = "hidden";
      }
      //origScope.historyPrompt.innerHTML = "code snapshot"
  });

    this.userHistoryPanelBody.appendChild(historyItem)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'reacthelp:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'reacthelp:replaceOutdatedExport': () => this.replaceOutdatedExport()
    }));

    /*this.subscriptions.add(atom.workspace.observeTextEditors((this.exampleEditor) =>
    {
      let buffer = this.exampleEditor.getBuffer();
      let stopChangingSubscription = buffer.onDidStopChanging(() => {this.checkOutdatedExport})
    }));*/
    this.subscriptions.add(this.exampleEditor.onDidStopChanging(()=>{this.processExampleChange()}));
    this.subscriptions.add(this.userEditor.onDidStopChanging(()=>{this.processExampleChange()}));

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.reacthelpView.destroy();
  },

  serialize() {
    return {
      reacthelpViewState: this.reacthelpView.serialize(),
      historyCodeViewState: this.historyModal.serialize()
    };
  },

  toggle() {
    console.log('toggle was toggled!');
    console.log(this);

    if (this.historyModalPanel.isVisible()){
      this.historyModalPanel.hide();
    }
    else {
      this.historyModalPanel.hide();
    }

    if (this.rightModalPanel.isVisible()){
      this.rightModalPanel.hide();
    }
    else{
      //this.rightModalPanel.hide();
      this.rightModalPanel.show();
    }

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.hide()//show()
    );
    /*let editor
    if (editor = this.userEditor){
      //let selection = editor.getSelectedText()
      let selection = editor.getText()
      let reversed = selection.split('').reverse().join('')
      editor.setText(reversed)
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/remove_comments",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:selection}),

      }).done(function( o ) {
         // do something
         console.log(o)
      }).fail(function(){
        console.log('we have a failure')
      });
    }*/
  },
  classToFunctional(editor){
    let rawCode = editor.getText()
    editor.setText(h_classToFunctional(rawCode))
    return h_classToFunctional(rawCode)
    /*
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5000/classToFunctional",
      dataType : "json",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify({text:rawCode}),
      async: false,

    }).done(function( o ) {
       // do something
       console.log(o)
       editor.setText(o.response)
       to_return = o.response;
    }).fail(function(){
      console.log('we have a failure')
      to_return = false;
    });
    return o.response;*/
  },

  functionalToClass(editor){
    let rawCode = editor.getText()
    editor.setText(h_functional_to_class(rawCode))
    return h_functional_to_class(rawCode)
    /*
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5000/functionalToClass",
      dataType : "json",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify({text:rawCode}),
      async: false,

    }).done(function( o ) {
       // do something
       console.log(o)
       editor.setText(o.response)
       to_return = o.response;
    }).fail(function(){
      console.log('we have a failure')
      to_return = false;
    });
    return to_return;*/
  },

  replaceOutdatedExport(calledFromFrameButton=false, scope=null){
    let editor
    //origScope = this;
    if (editor = getExampleTextEditor()){
      //let selection = editor.getSelectedText()
      let selection = editor.getText()

      /*
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/replaceOutdatedExport",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:selection}),

      }).done(function( o ) {
         // do something
         console.log(o)
         editor.setText(o.response)
         if (calledFromFrameButton){

         }
         else{
           origScope.addExampleHistoryItem("Fixed Export", o.response)
         }
      }).fail(function(){
        console.log('we have a failure')
      });*/
      newText = h_replaceOutdatedExport(selection);
      editor.setText(newText)
      if (calledFromFrameButton){

      }
      else{
        origScope.addExampleHistoryItem("Fixed Export", newText)
      }
    }
  },

  getOutdatedExport(){
    let editor
    if (editor = getExampleTextEditor()){
      //let selection = editor.getSelectedText()
      let selection = editor.getText()
      start_i = selection.indexOf("ReactDOM.render(")
      if (start_i < 0){
        return "zkldjfklsjadfljJALKFSJLKASF21FAJKLAFJKLSA453456"
      }
      else{
        i = start_i + "ReactDOM.render(".length;
        parenth_count = 1
        while (i < selection.length && parenth_count > 0){
          if (selection[i] == "("){
            parenth_count += 1
          }
          else if (selection[i] == ")") {
            parenth_count -= 1
          }
          i++;
        }
        return selection.substring(start_i, i)
      }
    }
  },

  setInfoPanel(headerText="default header", bodyText="default body this should really really really really work", pictures=[], learnMoreLink="www.w3schools.com"){

    this.infoPanel.style.visibility = "visible";
    this.infoPanelText.style.visibility = "visible";
    this.infoPanelButton.style.visibility = "visible";
    this.infoPanelImage.style.visibility = "visible";

    this.infoPanel.textContent = headerText;
    this.infoPanelText.textContent = bodyText;

    if (headerText == "Exporting Components"){

      this.infoPanelButton.addEventListener ("click", function() {
        shell.openExternal("https://www.geeksforgeeks.org/reactjs-importing-exporting/")
      });

      this.infoPanelImage.src = __dirname+"/export.png"
      /*hiDiv = document.createElement("div")
      hiDiv.textContent = "HELLAFO"
      hiDiv.style.color = "black";
      this.exampleHistoryPanelBody.appendChild(hiDiv)*/
    }
    else if (headerText == "React Functions and Classes"){
      this.infoPanelButton.addEventListener ("click", function() {
        shell.openExternal("https://www.twilio.com/blog/react-choose-functional-components#:~:text=First%20of%20all%2C%20the%20clear,JavaScript%20class%20that%20extends%20React.&text=The%20JSX%20to%20render%20will%20be%20returned%20inside%20the%20render%20method.")
      });

      this.infoPanelImage.src = __dirname+"/functionClasses.png"
    }
    else if (headerText == "Component State"){
      this.infoPanelButton.addEventListener ("click", function() {
        shell.openExternal("https://www.w3schools.com/react/react_state.asp")
      });

      this.infoPanelImage.src = __dirname+"/reactState.png"
    }


  },
  clearInfoPanel(){
    this.infoPanel.style.visibility = 'hidden';
    this.infoPanelText.style.visibility = 'hidden';
    this.infoPanelButton.style.visibility = 'hidden';
    this.infoPanelImage.style.visibility = 'hidden';
  },
  addExampleHistoryItem(historyTitle, codeText){
    var historyItem = document.createElement("button")
    historyItem.classList.add("historyItem")
    historyItem.textContent = historyTitle;
    historyItem.addEventListener ("click", function() {
      document.getElementById("codeBox").value = codeText;
      console.log(codeText)
      origScope.historyModalPanel.show();
      //document.getElementById("myHistoryModalPanel").show()
    });
    this.exampleHistoryPanelBody.appendChild(historyItem)
  },
  addUserHistoryItem(historyTitle, codeText){
    var historyItem = document.createElement("button")
    historyItem.classList.add("historyItem")
    historyItem.textContent = historyTitle;
    historyItem.addEventListener ("click", function() {
      document.getElementById("codeBox").value = codeText;
      origScope.historyModalPanel.show();
    });
    this.userHistoryPanelBody.appendChild(historyItem)
  },
      /*
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/getOutdatedExport",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:selection}),

      }).done(function( o ) {
         // do something
         console.log(o)
         return o.response;
      }).fail(function(){
        console.log('we have a failure in getOutdatedExport')
      });
    }
  },*/
  addExportMarker(){
    let editor
    origScope = this;
    if (editor = this.exampleEditor){
      let userEditor = this.userEditor
      let selection = editor.getText()
      let userCode = userEditor.getText()


    let badExportFound = false;
    editor.scan(RegExp("ReactDOM\\.render*",'s'), (result) => {
    let outdated_export = this.getOutdatedExport()
    let num_lines = outdated_export.split(/\r\n|\r|\n/).length
    //var myRegExp = "/ReactDOM\\.render\\(.*\\<TodoApp \\/\\>,.*document\\.getElementById\\('todos-example'\\).*\\)/gs"
    var myRegExp = /ReactDOM\.render\(.*;/gs
    console.log("selection match? ",selection.match(myRegExp))
    console.log(myRegExp)
    console.log("regex above me")
    //editor.scan(myRegExp, (result) => {
      console.log(result);
      badExportFound = true;
      console.log("result above me")
      if (!exportMarked) {
        exportMarked = true;//maybe this should go at the end
        exportSimpleMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
        var simpleExportMarkerButton = document.createElement('button')
        simpleExportMarkerButton.classList.add("simpleMarkerButton")
        simpleExportDecoration = editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
        disposablez = atom.tooltips.add(simpleExportMarkerButton, {title: 'Invalid export detected'})
        exportMarkers.push(exportSimpleMarker)
        simpleExportMarkerButton.addEventListener ("click", function() {
          disposablez.dispose();
          displayMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
          console.log(displayMarker.getTailScreenPosition())
          var beginRow = displayMarker.getStartBufferPosition().row
          //getTailScreenPosition().row;
          console.log(editor.lineTextForBufferRow(beginRow))
          console.log(editor.lineTextForBufferRow(beginRow+2))
          var textCount = 0;
          var i = 0;
          var row = beginRow;
          while (textCount < outdated_export && row < editor.getLineCount()){
            textCount += editor.lineTextForBufferRow(row).length;
            row += 1
          }
          console.log(beginRow)
          //displayMarker = editor.markBufferRange(new Range(result.range.start, [row,0]), {invalidate: 'never'})
          console.log("end row")
          console.log(row)
          console.log("beginRow, numlines",beginRow, num_lines)
          //displayMarker.setBufferRange(new Range([beginRow,0], [row,0]),{invalidate: 'never'})
          //displayMarker.setBufferRange([[66,0], [69,2]], {reversed:true})//,{invalidate: 'never'})
          var endDisplayMarker = editor.markBufferRange([[beginRow + num_lines,0],[beginRow+num_lines,3]], {invalidate:'never'})
          console.log("displayMarker afterSet", displayMarker)

          //decoration = editor.decorateMarker(displayMarker, {type: 'highlight', class: 'my-highlight-class'})
          editor.decorateMarker(displayMarker, {type: 'line', class: "my-line-class"})

          var elementZ = document.createElement('div')
          elementZ.textContent = '\tInvalid export detected!'
          elementZ.id = 'exportDiv'
          //elementZ.style.fontSize="18px"
          //elementZ.style.background = "red";
          elementZ.classList.add("exportDivClass");
          //elementZ.style.width = "100px";
          var editorZ = editor;//atom.workspace.getActiveTextEditor()
          var markerZ = displayMarker
          editorZ.decorateMarker(markerZ, {type: 'block', position: 'before', item: elementZ})
          //editorZ.decorateMarker(markerZ, {type: 'overlay', position: 'before', item: elementZ})

          var exportBodyText = document.createElement('div')
          exportBodyText.textContent = "\tThis export statement should not be used outside of your index.js file."
          exportBodyText.classList.add('exportDivText')
          //exportBodyText.style.fontSize="8px"
          elementZ.appendChild(exportBodyText)

          var endExportDiv = document.createElement('div')
          endExportDiv.textContent = "END"
          endExportDiv.classList.add("exportDivEnd")
          editorZ.decorateMarker(endDisplayMarker, {type: 'block', position: 'before', item: endExportDiv})

          var endExportDivSquare = document.createElement('div')
          endExportDivSquare.classList.add("square")
          editorZ.decorateMarker(endDisplayMarker, {type: 'overlay', position: 'head', item: endExportDivSquare})



          exportMarkers.push(markerZ)
          exportMarkers.push(endDisplayMarker)
          //exportMarkers.push(exportSimpleMarker)

          var endExportFixButton = document.createElement("button");
          endExportFixButton.innerHTML = "Fix";

          // 2. Append somewhere

          endExportDiv.appendChild(endExportFixButton);
          endExportFixButton.classList.add("fixButton");
          endExportFixButton.addEventListener("click", function(){
            origScope.replaceOutdatedExport()
          })

          var endExportButton = document.createElement("button");
          endExportButton.innerHTML = "Learn More";

          // 2. Append somewhere

          endExportDiv.appendChild(endExportButton);
          endExportButton.classList.add("learnMoreButton");

          // 3. Add event handler
          endExportButton.addEventListener ("click", function() {
            origScope.setInfoPanel("Exporting Components",'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.')
            //shell.openExternal("https://www.geeksforgeeks.org/reactjs-importing-exporting/")
          });

          //exportSimpleMinimizerMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
          var simpleExportMarkerMinimizerButton = document.createElement('button')
          simpleExportMarkerMinimizerButton.innerHTML = "Hide"
          endExportDiv.appendChild(simpleExportMarkerMinimizerButton)
          simpleExportMarkerMinimizerButton.classList.add("hideButton")
          //editor.decorateMarker(exportSimpleMinimizerMarker, {type:'block', position:'before', item:simpleExportMarkerMinimizerButton})
          simpleExportMarkerMinimizerButton.addEventListener("click",function(){
            //origScope.clearInfoPanel();
            origScope.clearInfoPanel();
            //infoPanel.style.visibility = 'hidden';
            //bring back old simple marker button
            //exportSimpleMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
            //var simpleExportMarkerButton = document.createElement('button')
            //simpleExportMarkerButton.classList.add("simpleMarkerButton")
            //editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
            //simpleExportMarkerButton.style.display = "block";
            simpleExportDecoration = editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
            disposablez = atom.tooltips.add(simpleExportMarkerButton, {title: 'Invalid export detected'})
            //get rid of new markers
            for (i = 0; i < exportMarkers.length; i++){
              if (exportMarkers[i] != exportSimpleMarker){
                exportMarkers[i].destroy()
              }
            }

          });

          simpleExportDecoration.destroy()
          //simpleExportMarkerButton.style.display = "none";
          //simpleExportMarkerButton.remove()
          //exportSimpleMarker.destroy()


        });
      }


      //const disposablez = atom.tooltips.add(endExportDiv, {title: 'This is a tooltip'})

      /*origScope.myOverlay.style.display = "block";
      canvas = origScope.myCanvas
      ctx = canvas.getContext('2d')
      var grd = ctx.createLinearGradient(0, 0, 200, 0);
      grd.addColorStop(0, "red");
      grd.addColorStop(1, "white");

      // Fill with gradient
      ctx.fillStyle = grd;
      ctx.fillRect(10, 10, 150, 80);*/


    });
    if (!badExportFound){
      for (i = 0; i < exportMarkers.length; i++){
        exportMarkers[i].destroy()
      }
      exportMarked = false;
    }
  }
  },

  addMarkers(markerType){
    let editor
    origScope = this;
    if (editor = this.exampleEditor){
      let userEditor = this.userEditor
      let selection = editor.getText()
      let userCode = userEditor.getText()

    switch (markerType){
      case "userFunctionToClass":
        markerVars[markerType+"editor"] = userEditor;
        markerVars[markerType+"RegExp"] = RegExp("function.*{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(userEditor)
          origScope.addUserHistoryItem("Converted to Class", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Function, while your example is rendered as a Class"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;
      case "exampleFunctionToClass":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("function.*{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isFunctional(selection) && isClass(userCode));
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(editor)
          origScope.addExampleHistoryItem("Converted to Class", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Class, while your example is rendered as a Function"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;
      case "invalidExport":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"num_lines"] = this.getOutdatedExport().split(/\r\n|\r|\n/).length
        markerVars[markerType+"RegExp"] = RegExp("ReactDOM\\.render*",'s')
        markerVars[markerType+"conditionsFulfilled"] = hasOutdatedExport(editor.getText())
        markerVars[markerType+"fixAction"] = origScope.replaceOutdatedExport

        markerVars[markerType+"infoBodyText"] = "This export statement should not be used outside of your index.js file."
        markerVars[markerType+"infoHeaderText"] = "Invalid Export Detected"
        markerVars[markerType+"infoPanelBodyText"] = 'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.'
        markerVars[markerType+"infoPanelHeaderText"] = "Exporting Components"
        break;

      case "userClassToFunction":
        markerVars[markerType+"editor"] = userEditor;
        markerVars[markerType+"RegExp"] = RegExp("class.*extends.*React.Component{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode) && canBeConverted(userCode))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.classToFunctional(userEditor)
          origScope.addUserHistoryItem("Converted to Function", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Class, while your example is rendered as a Function"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;

      case "exampleClassToFunction":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("class.*extends.*React.Component{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode) && canBeConverted(selection));
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(editor)
          origScope.addExampleHistoryItem("Converted to Function", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Function, while your example is rendered as a Class"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;

      case "addState":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("this.state.*=",'s')
        markerVars[markerType+"num_lines"] = 1
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isClass(userCode) && !userCode.includes("this.state"))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = addState(userCode)
          userEditor.setText(newCode)
          origScope.addUserHistoryItem("Added State Variable", newCode)
        };


        markerVars[markerType+"infoBodyText"] = "This example uses the 'state' property of React components"
        markerVars[markerType+"infoHeaderText"] = "'State' is a property in React that allows variables to change over time"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components hold information in variables that may change over time. React uses the “state” keyword to signify these variables. Instead of constantly re-rendering components, React waits for state variables to be changed and immediately updates the specific components that are bound to the changed state variable.'
        markerVars[markerType+"infoPanelHeaderText"] = "Component State"

        break;
      case "noExportExample":
      markerVars[markerType+"editor"] = editor;
      markerVars[markerType+"num_lines"] = 1
      markerVars[markerType+"RegExp"] = RegExp("function|class","s")
      markerVars[markerType+"conditionsFulfilled"] = (!(editor.getText().includes("ReactDOM") || editor.getText().includes("export default"))) && (editor.getText().includes("function") || editor.getText().includes("class"))
      markerVars[markerType+"fixAction"] = () => { editor.setText(editor.getText()+"export default "+getFirstComponentName(markerVars[markerType+"editor"].getText())+';');
          origScope.addExampleHistoryItem("Added default export", editor.getText())}

      markerVars[markerType+"infoBodyText"] = "In React, each file must export an object to be visible to other objects"
      markerVars[markerType+"infoHeaderText"] = "No Export Detected"
      markerVars[markerType+"infoPanelBodyText"] = 'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.'
      markerVars[markerType+"infoPanelHeaderText"] = "Exporting Components"
      break;

      case "noExportUser":
      markerVars[markerType+"editor"] = userEditor;
      markerVars[markerType+"num_lines"] = 1
      markerVars[markerType+"RegExp"] = RegExp("function|class","s")
      markerVars[markerType+"conditionsFulfilled"] = !(userEditor.getText().includes("ReactDOM") || userEditor.getText().includes("export default")) && (userEditor.getText().includes("function") || userEditor.getText().includes("class"))
      markerVars[markerType+"fixAction"] = () => { userEditor.setText(userEditor.getText()+"export default "+getFirstComponentName(markerVars[markerType+"editor"].getText())+';');
          origScope.addUserHistoryItem("Added default export", userEditor.getText())}

      markerVars[markerType+"infoBodyText"] = "In React, each file must export an object to be visible to other objects"
      markerVars[markerType+"infoHeaderText"] = "No Export Detected"
      markerVars[markerType+"infoPanelBodyText"] = 'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.'
      markerVars[markerType+"infoPanelHeaderText"] = "Exporting Components"
      break;

    }



    markerVars[markerType+"isFound"] = false;
    markerVars[markerType+"editor"].scan(markerVars[markerType+"RegExp"], (result) => {

    //outdated_export.split(/\r\n|\r|\n/).length

      console.log(result);
      markerVars[markerType+"isFound"] = true;
      console.log("result above me")

      if (!isMarked[markerType] && markerVars[markerType+"conditionsFulfilled"]) {
        isMarked[markerType] = true;//maybe this should go at the end
        markerVars[markerType+"simpleMarker"] = markerVars[markerType+"editor"].markBufferRange(result.range, {invalidate: 'never'})
        markerVars[markerType+"simpleMarkerButton"] = document.createElement('button')
        markerVars[markerType+"simpleMarkerButton"].classList.add("simpleMarkerButton")
        markerVars[markerType+"simpleDecoration"] = markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"simpleMarker"], {type:'block', position:'before', item:markerVars[markerType+"simpleMarkerButton"]})
        markerVars[markerType+"disposablez"] = atom.tooltips.add(markerVars[markerType+"simpleMarkerButton"], {title: markerVars[markerType+"infoHeaderText"]})
        if (allMarkers[markerType] == null){
          allMarkers[markerType] = [];
        }
        allMarkers[markerType].push(markerVars[markerType+"simpleMarker"])
        markerVars[markerType+"simpleMarkerButton"].addEventListener ("click", function() {
          markerVars[markerType+"disposablez"].dispose();
          markerVars[markerType+"displayMarker"] = markerVars[markerType+"editor"].markBufferRange(result.range, {invalidate: 'never'})
          markerVars[markerType+"beginRow"] = markerVars[markerType+"displayMarker"].getStartBufferPosition().row
          markerVars[markerType+"endDisplayMarker"] = markerVars[markerType+"editor"].markBufferRange([[markerVars[markerType+"beginRow"] + markerVars[markerType+"num_lines"],0],[markerVars[markerType+"beginRow"]+markerVars[markerType+"num_lines"],3]], {invalidate:'never'})

          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"displayMarker"], {type: 'line', class: "my-line-class"})

          markerVars[markerType+"divClassElement"] = document.createElement('div')
          markerVars[markerType+"divClassElement"].textContent = markerVars[markerType+"infoHeaderText"]
          markerVars[markerType+"divClassElement"].classList.add("exportDivClass");

          markerVars[markerType+"editor"] = markerVars[markerType+"editor"]//atom.workspace.getActiveTextEditor()
          //var markerZ2 = markerVars[markerType+"displayMarker"]
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"displayMarker"], {type: 'block', position: 'before', item: markerVars[markerType+"divClassElement"]})

          markerVars[markerType+"bodyText"] = document.createElement('div')
          markerVars[markerType+"bodyText"].textContent = markerVars[markerType+"infoBodyText"]
          markerVars[markerType+"bodyText"].classList.add('exportDivText')
          //exportBodyText.style.fontSize="8px"
          markerVars[markerType+"divClassElement"].appendChild(markerVars[markerType+"bodyText"])

          markerVars[markerType+"endDiv"] = document.createElement('div')
          markerVars[markerType+"endDiv"].textContent = "END"
          markerVars[markerType+"endDiv"].classList.add("exportDivEnd")
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"endDisplayMarker"], {type: 'block', position: 'before', item: markerVars[markerType+"endDiv"]})

          markerVars[markerType+"endDivSquare"] = document.createElement('div')
          markerVars[markerType+"endDivSquare"].classList.add("square")
          markerVars[markerType+"endDivSquare"].style.height = 100;
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"endDisplayMarker"], {type: 'overlay', position: 'head', item: markerVars[markerType+"endDivSquare"]})


          allMarkers[markerType].push(markerVars[markerType+"displayMarker"])
          allMarkers[markerType].push(markerVars[markerType+"endDisplayMarker"])
          //exportMarkers.push(exportSimpleMarker)

          markerVars[markerType+"endFix"] = document.createElement("button");
          markerVars[markerType+"endFix"].innerHTML = "Fix";

          // 2. Append somewhere

          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"endFix"]);
          markerVars[markerType+"endFix"].classList.add("fixButton");
          markerVars[markerType+"endFix"].addEventListener("click", function(){
            markerVars[markerType+"fixAction"]()
            isMarked[markerType] = false;
          })

          markerVars[markerType+"learnMoreButton"] = document.createElement("button");
          markerVars[markerType+"learnMoreButton"].innerHTML = "Learn More";

          // 2. Append somewhere

          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"learnMoreButton"]);
          markerVars[markerType+"learnMoreButton"].classList.add("learnMoreButton");

          // 3. Add event handler
          markerVars[markerType+"learnMoreButton"].addEventListener ("click", function() {
            origScope.setInfoPanel(markerVars[markerType+"infoPanelHeaderText"],markerVars[markerType+"infoPanelBodyText"])
          });

          markerVars[markerType+"simpleMarkerMinimizerButton"] = document.createElement('button')
          markerVars[markerType+"simpleMarkerMinimizerButton"].innerHTML = "Hide"
          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"simpleMarkerMinimizerButton"])
          markerVars[markerType+"simpleMarkerMinimizerButton"].classList.add("hideButton")

          markerVars[markerType+"simpleMarkerMinimizerButton"].addEventListener("click",function(){

            origScope.clearInfoPanel();

            markerVars[markerType+"simpleDecoration"] = markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"simpleMarker"], {type:'block', position:'before', item:markerVars[markerType+"simpleMarkerButton"]})
            markerVars[markerType+"disposablez"] = atom.tooltips.add(markerVars[markerType+"simpleMarkerButton"], {title: 'Invalid export detected'})
            //get rid of new markers
            for (i = 0; i < allMarkers[markerType].length; i++){
              if (allMarkers[markerType][i] != markerVars[markerType+"simpleMarker"]){
                allMarkers[markerType][i].destroy()
              }
            }

          });

          markerVars[markerType+"simpleDecoration"].destroy()
        });
      }


    });
    if (!isMarked[markerType]){
      if (allMarkers[markerType] == null){
        allMarkers[markerType] = []
      }
      for (i = 0; i < allMarkers[markerType].length; i++){
        allMarkers[markerType][i].destroy()
      }
      isMarked[markerType] = false;
    }
  }
      if (!markerVars[markerType+"conditionsFulfilled"]){
        if (allMarkers[markerType] == null){
          allMarkers[markerType] = []
        }
        for (i = 0; i < allMarkers[markerType].length; i++){
          allMarkers[markerType][i].destroy()
        }
        isMarked[markerType] = false;

        if (markerVars[markerType+"simpleDecoration"]!=null){
          markerVars[markerType+"simpleDecoration"].destroy()
        }
     }
  },

  addMarkersJSON(fileName="infoRequest.json"){
    let editor
    origScope = this;
    if (editor = this.exampleEditor){
      let userEditor = this.userEditor
      let selection = editor.getText()
      let userCode = userEditor.getText()

    var data = {
      "markerType": "noExportExample",
      "headerText": "Exporting in React",
      "shortDescription": "No export detected in file!!!",
      "medDescription": "In React, each file must export an object to be visible to other objects",
      "longDescription": "React components render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported... [type full Desc here]",
      "referenceURL": "https://www.geeksforgeeks.org/reactjs-importing-exporting/",
      "exampleImage":"exports.png"
    };
    console.log(data);

    //console.log(data)
    markerType = data.markerType;
    markerVars[markerType+"infoBodyText"] = data.medDescription
    markerVars[markerType+"infoHeaderText"] = data.shortDescription
    markerVars[markerType+"infoPanelBodyText"] = data.longDescription
    markerVars[markerType+"infoPanelHeaderText"] = data.headerText



    switch (markerType){
      case "userFunctionToClass":
        markerVars[markerType+"editor"] = userEditor;
        markerVars[markerType+"RegExp"] = RegExp("function.*{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(userEditor)
          origScope.addUserHistoryItem("Converted to Class", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Function, while your example is rendered as a Class"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;
      case "exampleFunctionToClass":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("function.*{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isFunctional(selection) && isClass(userCode));
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(editor)
          origScope.addExampleHistoryItem("Converted to Class", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Class, while your example is rendered as a Function"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;
      case "invalidExport":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"num_lines"] = this.getOutdatedExport().split(/\r\n|\r|\n/).length
        markerVars[markerType+"RegExp"] = RegExp("ReactDOM\\.render*",'s')
        markerVars[markerType+"conditionsFulfilled"] = hasOutdatedExport(editor.getText())
        markerVars[markerType+"fixAction"] = origScope.replaceOutdatedExport

        markerVars[markerType+"infoBodyText"] = "This export statement should not be used outside of your index.js file."
        markerVars[markerType+"infoHeaderText"] = "Invalid Export Detected"
        markerVars[markerType+"infoPanelBodyText"] = 'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.'
        markerVars[markerType+"infoPanelHeaderText"] = "Exporting Components"
        break;

      case "userClassToFunction":
        markerVars[markerType+"editor"] = userEditor;
        markerVars[markerType+"RegExp"] = RegExp("class.*extends.*React.Component{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode) && canBeConverted(userCode))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.classToFunctional(userEditor)
          origScope.addUserHistoryItem("Converted to Function", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Class, while your example is rendered as a Function"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;

      case "exampleClassToFunction":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("class.*extends.*React.Component{",'s')
        markerVars[markerType+"num_lines"] = 2
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isFunctional(userCode) && canBeConverted(selection));
        markerVars[markerType+"fixAction"] =()=>{
          newCode = origScope.functionalToClass(editor)
          origScope.addExampleHistoryItem("Converted to Function", newCode)
        };

        markerVars[markerType+"infoBodyText"] = "Your component is rendered as a Function, while your example is rendered as a Class"
        markerVars[markerType+"infoHeaderText"] = "Your component is incompatible with your example"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components are used to render Javascript XML (JSX) code, allowing easier access to HTML objects. Components can be created as functions or classes. React features (for example, State) are accessible from both functional and class components, but they require a different syntax, so be careful when using an example of class-based code that uses the state feature if your code is functional, and vice versa.'
        markerVars[markerType+"infoPanelHeaderText"] = "React Functions and Classes"

        break;

      case "addState":
        markerVars[markerType+"editor"] = editor;
        markerVars[markerType+"RegExp"] = RegExp("this.state.*=",'s')
        markerVars[markerType+"num_lines"] = 1
        markerVars[markerType+"conditionsFulfilled"] = (isClass(selection) && isClass(userCode) && !userCode.includes("this.state"))
        markerVars[markerType+"fixAction"] =()=>{
          newCode = addState(userCode)
          userEditor.setText(newCode)
          origScope.addUserHistoryItem("Added State Variable", newCode)
        };


        markerVars[markerType+"infoBodyText"] = "This example uses the 'state' property of React components"
        markerVars[markerType+"infoHeaderText"] = "'State' is a property in React that allows variables to change over time"
        markerVars[markerType+"infoPanelBodyText"] = 'In React, Components hold information in variables that may change over time. React uses the “state” keyword to signify these variables. Instead of constantly re-rendering components, React waits for state variables to be changed and immediately updates the specific components that are bound to the changed state variable.'
        markerVars[markerType+"infoPanelHeaderText"] = "Component State"

        break;
      case "noExportExample":
      markerVars[markerType+"editor"] = editor;
      markerVars[markerType+"num_lines"] = 1
      markerVars[markerType+"RegExp"] = RegExp("function|class","s")
      markerVars[markerType+"conditionsFulfilled"] = (!(editor.getText().includes("ReactDOM") || editor.getText().includes("export default"))) && (editor.getText().includes("function") || editor.getText().includes("class"))
      markerVars[markerType+"fixAction"] = () => { editor.setText(editor.getText()+"export default "+getFirstComponentName(markerVars[markerType+"editor"].getText())+';');
          origScope.addExampleHistoryItem("Added default export", editor.getText())}

      break;

      case "noExportUser":
      markerVars[markerType+"editor"] = userEditor;
      markerVars[markerType+"num_lines"] = 1
      markerVars[markerType+"RegExp"] = RegExp("function|class","s")
      markerVars[markerType+"conditionsFulfilled"] = !(userEditor.getText().includes("ReactDOM") || userEditor.getText().includes("export default")) && (userEditor.getText().includes("function") || userEditor.getText().includes("class"))
      markerVars[markerType+"fixAction"] = () => { userEditor.setText(userEditor.getText()+"export default "+getFirstComponentName(markerVars[markerType+"editor"].getText())+';');
          origScope.addUserHistoryItem("Added default export", userEditor.getText())}

      markerVars[markerType+"infoBodyText"] = "In React, each file must export an object to be visible to other objects"
      markerVars[markerType+"infoHeaderText"] = "No Export Detected"
      markerVars[markerType+"infoPanelBodyText"] = 'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.'
      markerVars[markerType+"infoPanelHeaderText"] = "Exporting Components"
      break;

    }



    markerVars[markerType+"isFound"] = false;
    markerVars[markerType+"editor"].scan(markerVars[markerType+"RegExp"], (result) => {

    //outdated_export.split(/\r\n|\r|\n/).length

      console.log(result);
      markerVars[markerType+"isFound"] = true;
      console.log("result above me")

      if (!isMarked[markerType] && markerVars[markerType+"conditionsFulfilled"]) {
        isMarked[markerType] = true;//maybe this should go at the end
        markerVars[markerType+"simpleMarker"] = markerVars[markerType+"editor"].markBufferRange(result.range, {invalidate: 'never'})
        markerVars[markerType+"simpleMarkerButton"] = document.createElement('button')
        markerVars[markerType+"simpleMarkerButton"].classList.add("simpleMarkerButton")
        markerVars[markerType+"simpleDecoration"] = markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"simpleMarker"], {type:'block', position:'before', item:markerVars[markerType+"simpleMarkerButton"]})
        markerVars[markerType+"disposablez"] = atom.tooltips.add(markerVars[markerType+"simpleMarkerButton"], {title: markerVars[markerType+"infoHeaderText"]})
        if (allMarkers[markerType] == null){
          allMarkers[markerType] = [];
        }
        allMarkers[markerType].push(markerVars[markerType+"simpleMarker"])
        markerVars[markerType+"simpleMarkerButton"].addEventListener ("click", function() {
          markerVars[markerType+"disposablez"].dispose();
          markerVars[markerType+"displayMarker"] = markerVars[markerType+"editor"].markBufferRange(result.range, {invalidate: 'never'})
          markerVars[markerType+"beginRow"] = markerVars[markerType+"displayMarker"].getStartBufferPosition().row
          markerVars[markerType+"endDisplayMarker"] = markerVars[markerType+"editor"].markBufferRange([[markerVars[markerType+"beginRow"] + markerVars[markerType+"num_lines"],0],[markerVars[markerType+"beginRow"]+markerVars[markerType+"num_lines"],3]], {invalidate:'never'})

          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"displayMarker"], {type: 'line', class: "my-line-class"})

          markerVars[markerType+"divClassElement"] = document.createElement('div')
          markerVars[markerType+"divClassElement"].textContent = markerVars[markerType+"infoHeaderText"]
          markerVars[markerType+"divClassElement"].classList.add("exportDivClass");

          markerVars[markerType+"editor"] = markerVars[markerType+"editor"]//atom.workspace.getActiveTextEditor()
          //var markerZ2 = markerVars[markerType+"displayMarker"]
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"displayMarker"], {type: 'block', position: 'before', item: markerVars[markerType+"divClassElement"]})

          markerVars[markerType+"bodyText"] = document.createElement('div')
          markerVars[markerType+"bodyText"].textContent = markerVars[markerType+"infoBodyText"]
          markerVars[markerType+"bodyText"].classList.add('exportDivText')
          //exportBodyText.style.fontSize="8px"
          markerVars[markerType+"divClassElement"].appendChild(markerVars[markerType+"bodyText"])

          markerVars[markerType+"endDiv"] = document.createElement('div')
          markerVars[markerType+"endDiv"].textContent = "END"
          markerVars[markerType+"endDiv"].classList.add("exportDivEnd")
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"endDisplayMarker"], {type: 'block', position: 'before', item: markerVars[markerType+"endDiv"]})

          markerVars[markerType+"endDivSquare"] = document.createElement('div')
          markerVars[markerType+"endDivSquare"].classList.add("square")
          markerVars[markerType+"endDivSquare"].style.height = 100;
          markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"endDisplayMarker"], {type: 'overlay', position: 'head', item: markerVars[markerType+"endDivSquare"]})


          allMarkers[markerType].push(markerVars[markerType+"displayMarker"])
          allMarkers[markerType].push(markerVars[markerType+"endDisplayMarker"])
          //exportMarkers.push(exportSimpleMarker)

          markerVars[markerType+"endFix"] = document.createElement("button");
          markerVars[markerType+"endFix"].innerHTML = "Fix";

          // 2. Append somewhere

          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"endFix"]);
          markerVars[markerType+"endFix"].classList.add("fixButton");
          markerVars[markerType+"endFix"].addEventListener("click", function(){
            markerVars[markerType+"fixAction"]()
            isMarked[markerType] = false;
          })

          markerVars[markerType+"learnMoreButton"] = document.createElement("button");
          markerVars[markerType+"learnMoreButton"].innerHTML = "Learn More";

          // 2. Append somewhere

          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"learnMoreButton"]);
          markerVars[markerType+"learnMoreButton"].classList.add("learnMoreButton");

          // 3. Add event handler
          markerVars[markerType+"learnMoreButton"].addEventListener ("click", function() {
            origScope.setInfoPanel(markerVars[markerType+"infoPanelHeaderText"],markerVars[markerType+"infoPanelBodyText"])
          });

          markerVars[markerType+"simpleMarkerMinimizerButton"] = document.createElement('button')
          markerVars[markerType+"simpleMarkerMinimizerButton"].innerHTML = "Hide"
          markerVars[markerType+"endDiv"].appendChild(markerVars[markerType+"simpleMarkerMinimizerButton"])
          markerVars[markerType+"simpleMarkerMinimizerButton"].classList.add("hideButton")

          markerVars[markerType+"simpleMarkerMinimizerButton"].addEventListener("click",function(){

            origScope.clearInfoPanel();

            markerVars[markerType+"simpleDecoration"] = markerVars[markerType+"editor"].decorateMarker(markerVars[markerType+"simpleMarker"], {type:'block', position:'before', item:markerVars[markerType+"simpleMarkerButton"]})
            markerVars[markerType+"disposablez"] = atom.tooltips.add(markerVars[markerType+"simpleMarkerButton"], {title: 'Invalid export detected'})
            //get rid of new markers
            for (i = 0; i < allMarkers[markerType].length; i++){
              if (allMarkers[markerType][i] != markerVars[markerType+"simpleMarker"]){
                allMarkers[markerType][i].destroy()
              }
            }

          });

          markerVars[markerType+"simpleDecoration"].destroy()
        });
      }


    });
    if (!isMarked[markerType]){
      if (allMarkers[markerType] == null){
        allMarkers[markerType] = []
      }
      for (i = 0; i < allMarkers[markerType].length; i++){
        allMarkers[markerType][i].destroy()
      }
      isMarked[markerType] = false;
    }
  }
      if (!markerVars[markerType+"conditionsFulfilled"]){
        if (allMarkers[markerType] == null){
          allMarkers[markerType] = []
        }
        for (i = 0; i < allMarkers[markerType].length; i++){
          allMarkers[markerType][i].destroy()
        }
        isMarked[markerType] = false;

        if (markerVars[markerType+"simpleDecoration"]!=null){
          markerVars[markerType+"simpleDecoration"].destroy()
        }
     }
  },

  /*addUserFunctionToClassMarker(){
    let editor
    const origScope = this;
    if (editor = this.exampleEditor){
      let userEditor = this.userEditor
      let selection = editor.getText()
      let userCode = userEditor.getText()


    let functionFound = false;
    userEditor.scan(RegExp("function.*{",'s'), (result) => {

    //let outdated_export = this.getOutdatedExport()
    let num_lines2 = 2//outdated_export.split(/\r\n|\r|\n/).length
    //var myRegExp = "/ReactDOM\\.render\\(.*\\<TodoApp \\/\\>,.*document\\.getElementById\\('todos-example'\\).*\\)/gs"
    //var myRegExp = /ReactDOM\.render\(.*;/gs
    //console.log("selection match? ",selection.match(myRegExp))
    //console.log(myRegExp)
    //console.log("regex above me")
    //editor.scan(myRegExp, (result) => {
      console.log(result);
      functionFound = true;
      console.log("result above me")
      if (!userFunctionToClassMarked) {
        userFunctionToClassMarked = true;//maybe this should go at the end
        exportSimpleMarker2 = userEditor.markBufferRange(result.range, {invalidate: 'never'})
        var simpleExportMarkerButton2 = document.createElement('button')
        simpleExportMarkerButton2.classList.add("simpleMarkerButton")
        simpleExportDecoration2 = userEditor.decorateMarker(exportSimpleMarker2, {type:'block', position:'before', item:simpleExportMarkerButton2})
        disposablez2 = atom.tooltips.add(simpleExportMarkerButton2, {title: 'Invalid export detected'})
        userFunctionToClassMarkers.push(exportSimpleMarker2)
        simpleExportMarkerButton2.addEventListener ("click", function() {
          disposablez2.dispose();
          displayMarker2 = userEditor.markBufferRange(result.range, {invalidate: 'never'})
          var beginRow2 = displayMarker2.getStartBufferPosition().row
          var endDisplayMarker2 = userEditor.markBufferRange([[beginRow2 + num_lines2,0],[beginRow2+num_lines2,3]], {invalidate:'never'})

          userEditor.decorateMarker(displayMarker2, {type: 'line', class: "my-line-class"})

          var elementZ2 = document.createElement('div')
          elementZ2.textContent = '\tFunctional Code here'
          elementZ2.classList.add("exportDivClass");

          var editorZ2 = userEditor//atom.workspace.getActiveTextEditor()
          var markerZ2 = displayMarker2
          editorZ2.decorateMarker(markerZ2, {type: 'block', position: 'before', item: elementZ2})

          var exportBodyText2 = document.createElement('div')
          exportBodyText2.textContent = "\tThis export statement should not be used outside of your index.js file."
          exportBodyText2.classList.add('exportDivText')
          //exportBodyText.style.fontSize="8px"
          elementZ2.appendChild(exportBodyText2)

          var endExportDiv2 = document.createElement('div')
          endExportDiv2.textContent = "END"
          endExportDiv2.classList.add("exportDivEnd")
          editorZ2.decorateMarker(endDisplayMarker2, {type: 'block', position: 'before', item: endExportDiv2})

          var endExportDivSquare2 = document.createElement('div')
          endExportDivSquare2.classList.add("square")
          editorZ2.decorateMarker(endDisplayMarker2, {type: 'overlay', position: 'head', item: endExportDivSquare2})



          userFunctionToClassMarkers.push(markerZ2)
          userFunctionToClassMarkers.push(endDisplayMarker2)
          //exportMarkers.push(exportSimpleMarker)

          var endExportFixButton2 = document.createElement("button");
          endExportFixButton2.innerHTML = "Fix";

          // 2. Append somewhere

          endExportDiv2.appendChild(endExportFixButton2);
          endExportFixButton2.classList.add("fixButton");
          endExportFixButton2.addEventListener("click", function(){
            alert("HERE")//origScope.replaceOutdatedExport()
          })

          var endExportButton2 = document.createElement("button");
          endExportButton2.innerHTML = "Learn More";

          // 2. Append somewhere

          endExportDiv2.appendChild(endExportButton2);
          endExportButton2.classList.add("learnMoreButton");

          // 3. Add event handler
          endExportButton2.addEventListener ("click", function() {
            origScope.setInfoPanel("React Functions and Classes",'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.')
            //shell.openExternal("https://www.geeksforgeeks.org/reactjs-importing-exporting/")
          });

          //exportSimpleMinimizerMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
          var simpleExportMarkerMinimizerButton2 = document.createElement('button')
          simpleExportMarkerMinimizerButton2.innerHTML = "Hide"
          endExportDiv2.appendChild(simpleExportMarkerMinimizerButton2)
          simpleExportMarkerMinimizerButton2.classList.add("hideButton")
          //editor.decorateMarker(exportSimpleMinimizerMarker, {type:'block', position:'before', item:simpleExportMarkerMinimizerButton})
          simpleExportMarkerMinimizerButton2.addEventListener("click",function(){
            //origScope.clearInfoPanel();
            origScope.clearInfoPanel();
            //infoPanel.style.visibility = 'hidden';
            //bring back old simple marker button
            //exportSimpleMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
            //var simpleExportMarkerButton = document.createElement('button')
            //simpleExportMarkerButton.classList.add("simpleMarkerButton")
            //editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
            //simpleExportMarkerButton.style.display = "block";
            simpleExportDecoration2 = userEditor.decorateMarker(exportSimpleMarker2, {type:'block', position:'before', item:simpleExportMarkerButton2})
            disposablez2 = atom.tooltips.add(simpleExportMarkerButton2, {title: 'Invalid export detected'})
            //get rid of new markers
            for (i = 0; i < userFunctionToClassMarkers.length; i++){
              if (userFunctionToClassMarkers[i] != exportSimpleMarker2){
                userFunctionToClassMarkers[i].destroy()
              }
            }

          });

          simpleExportDecoration2.destroy()
          //simpleExportMarkerButton.style.display = "none";
          //simpleExportMarkerButton.remove()
          //exportSimpleMarker.destroy()
        });
      }


      //const disposablez = atom.tooltips.add(endExportDiv, {title: 'This is a tooltip'})

      /*origScope.myOverlay.style.display = "block";
      canvas = origScope.myCanvas
      ctx = canvas.getContext('2d')
      var grd = ctx.createLinearGradient(0, 0, 200, 0);
      grd.addColorStop(0, "red");
      grd.addColorStop(1, "white");

      // Fill with gradient
      ctx.fillStyle = grd;
      ctx.fillRect(10, 10, 150, 80);


    });
    if (!userFunctionToClassMarked){
      for (i = 0; i < userFunctionToClassMarkers.length; i++){
        userFunctionToClassMarkers[i].destroy()
      }
      userFunctionToClassMarked = false;
    }
  }
},*/


  processExampleChange(){


    let editor
    origScope = this;

    if (!initialCodeStateSaved){
      origScope.addUserHistoryItem("Initial Starter Code",origScope.userEditor.getText());
      initialCodeStateSaved = true;
    }
    if (editor = this.exampleEditor){
      let userEditor = this.userEditor
      let selection = editor.getText()
      let userCode = userEditor.getText()

      //this.addExportMarker();
      //this.addUserFunctionToClassMarker();
      //this.addMarkers("userFunctionToClass");
      //this.addMarkers("invalidExport");

      /*
      let badExportFound = false;
      editor.scan(RegExp("ReactDOM\\.render*",'s'), (result) => {
      let outdated_export = this.getOutdatedExport()
      let num_lines = outdated_export.split(/\r\n|\r|\n/).length
      //var myRegExp = "/ReactDOM\\.render\\(.*\\<TodoApp \\/\\>,.*document\\.getElementById\\('todos-example'\\).*\\)/gs"
      var myRegExp = /ReactDOM\.render\(.*;/gs
      console.log("selection match? ",selection.match(myRegExp))
      console.log(myRegExp)
      console.log("regex above me")
      //editor.scan(myRegExp, (result) => {
        console.log(result);
        badExportFound = true;
        console.log("result above me")
        if (!exportMarked) {
          exportMarked = true;//maybe this should go at the end
          exportSimpleMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
          var simpleExportMarkerButton = document.createElement('button')
          simpleExportMarkerButton.classList.add("simpleMarkerButton")
          simpleExportDecoration = editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
          disposablez = atom.tooltips.add(simpleExportMarkerButton, {title: 'Invalid export detected'})
          exportMarkers.push(exportSimpleMarker)
          simpleExportMarkerButton.addEventListener ("click", function() {
            disposablez.dispose();
            displayMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
            console.log(displayMarker.getTailScreenPosition())
            var beginRow = displayMarker.getStartBufferPosition().row
            //getTailScreenPosition().row;
            console.log(editor.lineTextForBufferRow(beginRow))
            console.log(editor.lineTextForBufferRow(beginRow+2))
            var textCount = 0;
            var i = 0;
            var row = beginRow;
            while (textCount < outdated_export && row < editor.getLineCount()){
              textCount += editor.lineTextForBufferRow(row).length;
              row += 1
            }
            console.log(beginRow)
            //displayMarker = editor.markBufferRange(new Range(result.range.start, [row,0]), {invalidate: 'never'})
            console.log("end row")
            console.log(row)
            console.log("beginRow, numlines",beginRow, num_lines)
            //displayMarker.setBufferRange(new Range([beginRow,0], [row,0]),{invalidate: 'never'})
            //displayMarker.setBufferRange([[66,0], [69,2]], {reversed:true})//,{invalidate: 'never'})
            var endDisplayMarker = editor.markBufferRange([[beginRow + num_lines,0],[beginRow+num_lines,3]], {invalidate:'never'})
            console.log("displayMarker afterSet", displayMarker)

            //decoration = editor.decorateMarker(displayMarker, {type: 'highlight', class: 'my-highlight-class'})
            editor.decorateMarker(displayMarker, {type: 'line', class: "my-line-class"})

            var elementZ = document.createElement('div')
            elementZ.textContent = '\tInvalid export detected!'
            elementZ.id = 'exportDiv'
            //elementZ.style.fontSize="18px"
            //elementZ.style.background = "red";
            elementZ.classList.add("exportDivClass");
            //elementZ.style.width = "100px";
            var editorZ = atom.workspace.getActiveTextEditor()
            var markerZ = displayMarker
            editorZ.decorateMarker(markerZ, {type: 'block', position: 'before', item: elementZ})
            //editorZ.decorateMarker(markerZ, {type: 'overlay', position: 'before', item: elementZ})

            var exportBodyText = document.createElement('div')
            exportBodyText.textContent = "\tThis export statement should not be used outside of your index.js file."
            exportBodyText.classList.add('exportDivText')
            //exportBodyText.style.fontSize="8px"
            elementZ.appendChild(exportBodyText)

            var endExportDiv = document.createElement('div')
            endExportDiv.textContent = "END"
            endExportDiv.classList.add("exportDivEnd")
            editorZ.decorateMarker(endDisplayMarker, {type: 'block', position: 'before', item: endExportDiv})

            var endExportDiv2 = document.createElement('div')
            endExportDiv2.classList.add("square")
            editorZ.decorateMarker(endDisplayMarker, {type: 'overlay', position: 'head', item: endExportDiv2})



            exportMarkers.push(markerZ)
            exportMarkers.push(endDisplayMarker)
            //exportMarkers.push(exportSimpleMarker)

            var endExportFixButton = document.createElement("button");
            endExportFixButton.innerHTML = "Fix";

            // 2. Append somewhere

            endExportDiv.appendChild(endExportFixButton);
            endExportFixButton.classList.add("fixButton");
            endExportFixButton.addEventListener("click", function(){
              origScope.replaceOutdatedExport()
            })

            var endExportButton = document.createElement("button");
            endExportButton.innerHTML = "Learn More";

            // 2. Append somewhere

            endExportDiv.appendChild(endExportButton);
            endExportButton.classList.add("learnMoreButton");

            // 3. Add event handler
            endExportButton.addEventListener ("click", function() {
              origScope.setInfoPanel("Exporting Components",'React projects render Components in a tree-like hierarchy. ReactDOM is only used to render the root component. Additional components that are created must be exported in order to be accessible to other components, or by the root itself. In the default React project shell, index.js renders the default “App” component, so the file  “App.js”  must export the component desired to be rendered.')
              //shell.openExternal("https://www.geeksforgeeks.org/reactjs-importing-exporting/")
            });

            //exportSimpleMinimizerMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
            var simpleExportMarkerMinimizerButton = document.createElement('button')
            simpleExportMarkerMinimizerButton.innerHTML = "Hide"
            endExportDiv.appendChild(simpleExportMarkerMinimizerButton)
            simpleExportMarkerMinimizerButton.classList.add("hideButton")
            //editor.decorateMarker(exportSimpleMinimizerMarker, {type:'block', position:'before', item:simpleExportMarkerMinimizerButton})
            simpleExportMarkerMinimizerButton.addEventListener("click",function(){
              //origScope.clearInfoPanel();
              origScope.clearInfoPanel();
              //infoPanel.style.visibility = 'hidden';
              //bring back old simple marker button
              //exportSimpleMarker = editor.markBufferRange(result.range, {invalidate: 'never'})
              //var simpleExportMarkerButton = document.createElement('button')
              //simpleExportMarkerButton.classList.add("simpleMarkerButton")
              //editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
              //simpleExportMarkerButton.style.display = "block";
              simpleExportDecoration = editor.decorateMarker(exportSimpleMarker, {type:'block', position:'before', item:simpleExportMarkerButton})
              disposablez = atom.tooltips.add(simpleExportMarkerButton, {title: 'Invalid export detected'})
              //get rid of new markers
              for (i = 0; i < exportMarkers.length; i++){
                if (exportMarkers[i] != exportSimpleMarker){
                  exportMarkers[i].destroy()
                }
              }

            });

            simpleExportDecoration.destroy()
            //simpleExportMarkerButton.style.display = "none";
            //simpleExportMarkerButton.remove()
            //exportSimpleMarker.destroy()


          });


        }
        //const disposablez = atom.tooltips.add(endExportDiv, {title: 'This is a tooltip'})

        /*origScope.myOverlay.style.display = "block";
        canvas = origScope.myCanvas
        ctx = canvas.getContext('2d')
        var grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(10, 10, 150, 80);


      });
      if (!badExportFound){
        for (i = 0; i < exportMarkers.length; i++){
          exportMarkers[i].destroy()
        }
        exportMarked = false;
      }
      */

      origScope.addMarkersJSON();
      origScope.addMarkers("invalidExport")
      origScope.addMarkers("userFunctionToClass")
      origScope.addMarkers("exampleFunctionToClass")
      origScope.addMarkers("userClassToFunction")
      origScope.addMarkers("exampleClassToFunction")
      origScope.addMarkers("addState")
      origScope.addMarkers("noExportUser")
      //origScope.addMarkers("noExportExample")



      //check if example code has Outdated Export
      /*console.log('checkOutdatedExport');
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/hasOutdatedExport",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:selection}),
        async: false,
      }).done(function( o ) {
         // do something
         if (o.response){
           console.log("used to show this")
           //origScope.oldExportButton.style.visibility="visible";//"visible"
         }
         else{
           origScope.oldExportButton.style.visibility="hidden";//"visible"
         }
      }).fail(function(){
        console.log('we have a failure in processExampleChange')
      });
      */

      //get example code type and user code type
      let userCodeType = "";
      let exampleCodeType = "";
      //check if is class
      if (h_getIsClass(selection)){
        exampleCodeType = "class"
      }
      /*
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/getIsClass",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:selection}),
        async: false,
      }).done(function( o ) {
         // do something
         console.log("example getisclass")
         console.log(o)
         if (o.response){
           exampleCodeType = "class";//"visible"
         }

      }).fail(function(){
        console.log('we have a failure in processExampleChange')
      });*/
      if (h_getIsClass(userCode)){
        userCodeType = "class"
      }
      /*
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/getIsClass",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify({text:userCode}),
        async: false,
      }).done(function( o ) {
         // do something
         console.log("user getIsClass")
         console.log(o)
         if (o.response){
           userCodeType = "class";//"visible"
           console.log('usercodetype updated')
           console.log(userCodeType)
         }
      }).fail(function(){
        console.log('we have a failure in processExampleChange')
      });*/

      // check if functional
      if (exampleCodeType != "class"){
        if (h_getIsFunctional(selection)){
          exampleCodeType="functional"
        }
        /*
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/getIsFunctional",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:selection}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             exampleCodeType = "functional";//"visible"
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/
      }

      if (userCodeType != "class"){
        if (h_getIsFunctional(userCode)){
          userCodeType = "functional"
        }
        /*
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/getIsFunctional",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:userCode}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             userCodeType = "functional";//"visible"
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/
      }

      if (userCodeType != "functional"){
        this.funcToClassButton.style.visibility = "hidden"
      }
      if (userCodeType != "class"){
        this.classToFuncButton.style.visibility = "hidden"
      }
      if (exampleCodeType != "functional"){
        this.funcToClassButtonRight.style.visibility = "hidden"
      }
      if (exampleCodeType != "class"){
        this.classToFuncButtonRight.style.visibility = "hidden"
      }

      if (userCodeType == "functional" && exampleCodeType == "class"){

        /*$.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/canBeConvertedToClass",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:userCode}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             //user code can be converted to class code
             console.log("used to be this")
             //origScope.funcToClassButton.style.visibility = "visible";
             //origScope.addMarkers("userFunctionToClass")
           }
           else{
             origScope.funcToClassButton.style.visibility = "hidden";
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/


        /*$.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/canBeConvertedToFunction",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:selection}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             console.log("used to be this")
             //origScope.classToFuncButtonRight.style.visibility = "visible";
           }
           else{
             origScope.classToFuncButtonRight.style.visibility = "hidden";
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/


      }
      else if (userCodeType == "class" && exampleCodeType == "functional"){

        /*$.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/canBeConvertedToFunction",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:userCode}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             //user code can be converted to function code
             console.log("used to be this")
             //origScope.classToFuncButton.style.visibility = "visible";
             //origScope.addMarkers("userFunctionToClass")
           }
           else{
             origScope.classToFuncButton.style.visibility = "hidden";
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/


        /*$.ajax({
          type: "POST",
          url: "http://127.0.0.1:5000/canBeConvertedToClass",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({text:selection}),
          async: false,
        }).done(function( o ) {
           // do something
           if (o.response){
             console.log("used to be this")
             //origScope.funcToClassButtonRight.style.visibility = "visible";

             //origScope.addMarkers("exampleFunctionToClass")
           }
           else{
             origScope.funcToClassButtonRight.style.visibility = "hidden";
           }
        }).fail(function(){
          console.log('we have a failure in processExampleChange')
        });*/
      }


    }

  }

};


//Begin helper Functions

function h_hasOutdatedExport(rawCode){
  return rawCode.includes("ReactDOM.render(")
}

function h_replaceOutdatedExport(rawCode){
  start_i = rawCode.indexOf('ReactDOM.render(')
  i = start_i + 'ReactDOM.render('.length
  parenth_count = 1
  while (i < rawCode.length && parenth_count > 0){
    if (rawCode[i] == '('){
      parenth_count += 1
    }
    else if (rawCode[i] == ')'){
      parenth_count -= 1
    }
    i += 1
  }
  outdated_export_statement = rawCode.substring(start_i,i)
  export_target = h_getOutdatedExportTarget(outdated_export_statement)
  new_export_statement = 'export default '+export_target+';\n'
  rawCode = rawCode.replace(outdated_export_statement, new_export_statement)
  return rawCode
}

function h_getIsClass(rawCode){
  if (h_hasOutdatedExport(rawCode) || !h_hasValidExport(rawCode)){
    return false;
  }

  object_exported_name = h_getFirstExport(rawCode)
  declaration = h_findDeclaration(object_exported_name, rawCode)
  return declaration.includes("class")
}

function h_getIsFunctional(rawCode){
  if (h_hasOutdatedExport(rawCode) || !h_hasValidExport(rawCode)){
    return false;
  }
  object_exported_name = h_getFirstExport(rawCode)
  declaration = h_findDeclaration(object_exported_name, rawCode)
  return declaration.includes("function")
}

function h_getDeclarationFull(rawCode){
  if (h_hasOutdatedExport(rawCode)){
    console.log("outdated export in "+rawCode)
    return false;
  }
  if (!h_hasValidExport(rawCode)){
    console.log('no valid export in '+rawCode)
    return false;
  }
    object_exported_name = h_getFirstExport(rawCode)
    declaration = h_findDeclaration(object_exported_name, rawCode)
    return declaration
}

function h_canBeConvertedToClass(rawCode){
  canBeConverted = true
    object_exported_name = h_getFirstExport(rawCode)
    object_declaration = h_findDeclaration(object_exported_name, rawCode)
    args_string = h_get_args(object_exported_name, object_declaration)
    if (!(!args_string.trim() || args_string.length==0)){
        canBeConverted = False
        console.log('Function has parameters ('+args_string+') which cannot be converted into class code.')
      }
    return canBeConverted
}

function h_canBeConvertedToFunction(rawCode){
  return !(h_classHasConstructor(rawCode) || h_hasStateDefined(rawCode))
}

function h_functional_to_class(rawCode){
    function_name = h_getFirstExport(rawCode)
    declaration = h_findDeclaration(function_name, rawCode)
    inner_code = h_get_inner_code(declaration, rawCode)
    func_params = h_get_args(function_name, declaration)//.split(',')#to split args up
    fun_result = h_split_inner_functional_code(inner_code)
    support_code = fun_result[0]
    to_return = fun_result[1]
    console.log("functional_to_class","\n\n\nsupport_code", support_code, "\n\n\nto_return", to_return, "\n\n\nfunction_name", function_name, "\n\n\ndeclaration", declaration, "\n\n\ninner_code", inner_code,"\n\n\nfunc_params", func_params)
    class_code = 'class '+function_name+' extends React.Component{\n' + 'constructor(props) {\n super(props);\n}'+support_code +'\nrender() {\n' + to_return + '\n}\n}'

    rawCode = rawCode.replace(h_getAllObjectCode(function_name, rawCode), class_code) //surgically replace old code

    if (!rawCode.includes("import React from 'react'")){
        rawCode = "import React from 'react';\n" + rawCode
      }

    return rawCode
}

function h_classToFunctional(rawCode){
    class_name = h_getFirstExport(rawCode)
    declaration = h_findDeclaration(class_name, rawCode)
    inner_code = h_get_inner_code(declaration,rawCode)
    support_code = h_split_inner_class_code(inner_code)[0]
    render_code = h_split_inner_class_code(inner_code)[1]
    functional_code = 'function '+class_name+'(){\n' + support_code +'\n' + render_code +'\n}'
    return rawCode.replace(h_getAllObjectCode(class_name,rawCode), functional_code)
}

function h_getOutdatedExport(rawCode){
  if (h_hasOutdatedExport(rawCode)){
        start_i = rawCode.indexOf('ReactDOM.render(')
        i = start_i+'ReactDOM.render('.length
        parenth_count = 1
        while (i < rawCode.length && parenth_count > 0){
            if (rawCode[i] == '('){
                parenth_count += 1
              }
            else if (rawCode[i] == ')'){
                parenth_count -= 1
              }
            i += 1
          }
        outdated_export_statement = rawCode.substring(start_i,i)
        return outdated_export_statement
      }
    else{
        return "zkldjfklsjadfljJALKFSJLKASF21FAJKLAFJKLSA453456"
      }
}
function h_addState(rawCode){
  i = rawCode.indexOf("super(props);") + "super(props);".length
  return rawCode.substring(0,i)+"\nthis.state = {exampleString: 'hi', exampleInt: 5}"+rawCode.substring(i,rawCode.length)
}

function h_getFirstComponentName(rawCode){
  rawCodeSplit = rawCode.split("\n")
  for (i in rawCodeSplit){
    line = rawCodeSplit[i]
    if (line.startsWith("class") || line.startsWith("function")){
      return line.split(" ")[1].split('(')[0]
    }
  }
  return "App" // default
}

function h_hasValidExport(rawCode){
  return rawCode.indexOf("export default") > 0
}

function h_getFirstExport(rawCode){
    baseLevelCode = h_getBaseLevelCode(rawCode)
    if (baseLevelCode.indexOf("export default") > 0){
        i = baseLevelCode.indexOf("export default") + "export default".length
        wordCount = 0
        textCount = 0
        while (i < baseLevelCode.length && wordCount<1){
            if (!baseLevelCode.trim()){
              if (textCount >0){
                wordCount += 1
              }
            }
            else{
                textCount += 1
              }
            i += 1
          }
        exported_word = baseLevelCode.substring(baseLevelCode.indexOf("export default") + "export default ".length,i-1).split(';')[0]
        return exported_word
      }
}
function h_findDeclaration(objectName, rawCode){
  baseLevelCode = h_getBaseLevelCode(rawCode.replace(";","\n"))
    exported_word_declaration = ""
    while (baseLevelCode.indexOf(objectName) > 0){
        i = baseLevelCode.indexOf(objectName)
        if (!baseLevelCode[i-1].trim()){
            if (!baseLevelCode[i+objectName.length].trim() || baseLevelCode[i+objectName.length] == '('){
                //we have found valid declaration.
                wordCount = 0
                textCount = 0
                while (i > 0 && (wordCount == 0 || baseLevelCode[i] != '\n')){
                    i -= 1
                    if (!baseLevelCode[i].trim()){
                      if (textCount > 0){
                        wordCount += 1
                        break;
                      }
                    }
                    else{
                      textCount += 1
                    }
                }
                startDeclaration = i
                while (i < baseLevelCode.length && baseLevelCode[i] != '{'){
                    i+= 1
                  }
                endDeclaration = i
                exported_word_declaration = baseLevelCode.substring(startDeclaration,endDeclaration)
                //#inner_code = get_inner_code(exported_word_declaration, rawCode)
                //# get inner code.
                break;
              }
            else{
                console.log("2nd if fails")
              }
        }
        else{
            console.log('1st if fails',baseLevelCode)
          }
        baseLevelCode = baseLevelCode.replace(objectName, " "+objectName.substring(1, objectName.length)) // no way exported_word can have space in it
        i -= 1
      }
    clean_exported_word_declaration = exported_word_declaration.split(' ').join(' ')
    return clean_exported_word_declaration
}

function h_hasValidExport(rawCode){
  baseLevelCode = h_getBaseLevelCode(rawCode)
  return rawCode.indexOf("export default") > 0
}

function h_classHasConstructor(rawCode){
    class_name = h_getFirstExport(rawCode)
    declaration = h_findDeclaration(class_name, rawCode)
    inner_code = h_get_inner_code(declaration,rawCode)
    inner_code_clean = h_clipBrackets(inner_code)
    constructor_ind = h_findConstructorInClass(inner_code_clean)
    console.log(rawCode, "constructorind",constructor_ind)
    return constructor_ind > -1
}

function h_hasStateDefined(rawCode){
  return h_classStateInConstructor(rawCode) || h_classStateInTopLevel(rawCode)
}

function h_get_inner_code(object_declaration, code){
    key = object_declaration
    i = code.indexOf(key)
    bracketCount = 0
    inBracket = false
    innerCode = ""
    while (i < code.length && (bracketCount > 0 || !inBracket)){
        char = code[i]
        if (char == '{') {
            bracketCount += 1
            if (!inBracket) {
                inBracket = true
              }
          }
        else if (char == '}') {
            bracketCount -= 1
          }
        if (inBracket){
            innerCode += char
          }
        i += 1
    }
    return innerCode
}

function h_split_inner_functional_code(inner_code){
  return_begin = h_findReturnInFunction(inner_code)
  return_end = h_findReturnEndInFunction(inner_code)
  //console.log("split_inner_functional_code render begin/end:", return_begin, return_end)
  support_code = inner_code.substring(0,return_begin) + inner_code.substring(return_end, inner_code.length)
  to_return = inner_code.substring(return_begin,return_end)
  return [support_code.substring(1,support_code.length-1), to_return] //#trim first and last brackets off support code
}

function h_getAllObjectCode(objectName, rawCode){
  start_index = h_getDeclarationBeginIndex(objectName, rawCode)
  end_index = h_get_end_index(objectName, rawCode)
  return rawCode.substring(start_index,end_index)
}

function h_getBaseLevelCode(rawCode){
  bracketCount = 0
  baseLevelCode = ""
  for (i in rawCode){
    char = rawCode[i]
    if (bracketCount == 0){
        baseLevelCode += char
      }
    if (char == "{"){
        bracketCount += 1
      }
    else if (char == "}"){
      bracketCount -= 1
    }
  }
  return baseLevelCode
}
function h_clipBrackets(codeString){
  open_brack_locations = []
  close_brack_locations = []
  for (i=0; i <codeString.length; i++){
    if (codeString[i]=='{'){
      open_brack_locations.push(i)
    }
    else if (codeString[i] == '}'){
      close_brack_locations.push(i)
    }
  }
  newString = ""
  for (i=0; i < codeString.length; i++){
    if (i == open_brack_locations[0] || i == close_brack_locations[close_brack_locations.length-1]){
      continue
    }
    else{
      newString += codeString[i]
    }
  }
  return newString
}

function h_findConstructorInClass(inner_code){
  i = inner_code.indexOf('constructor')
  while (inner_code.indexOf('constructor') >0){
      i = inner_code.indexOf('constructor')
      if (!inner_code[i-1].trim() && (!inner_code[i+'constructor'.length].trim() || inner_code[i+'constructor'.length] == '(')){ //#' return ' is by itself
          if (h_indexInBaseLevelCode(i, inner_code)){
              return i
            }
          }
      //inner_code = inner_code.replace('constructor','constructor',1) //# ensure we next look at next return
    }
  if (i < 0){
    console.log("findConstructorInClass i < 0")
  }
  return i
}

function h_classStateInConstructor(rawCode){
  class_constructor = h_getClassConstructor(rawCode)
  constructor_stmt = h_stringReplaceAll(constructor_stmt, ';','\n')
  constructor_stmt_split = constructor_stmt.split('\n')
  for (i in constructor_stmt_split){
    line = constructor_stmt_split[i]
    if (line.trim().startsWith('this.state')){
      return true;
    }
  }
  return false
}

function h_classStateInTopLevel(rawCode){
  class_name = h_getFirstExport(rawCode)
  declaration = h_findDeclaration(class_name, rawCode)
  inner_code = h_get_inner_code(declaration,rawCode)
  inner_code_clean = h_clipBrackets(inner_code)
  baseLevelCode = h_stringReplaceAll(h_getBaseLevelCode(inner_code_clean),';','\n')
  baseLevelCodeSplit = baseLevelCode.split('\n')
  for (i in baseLevelCodeSplit){
      line = baseLevelCodeSplit[i]
      s_line = line.trim()
      if (s_line.startsWith('state')){
        if (!s_line['state'.length].trim() || s_line['state'.length] == '='){
          return true;
        }
      }
    }
  return false
}

function h_findReturnInFunction(inner_code){
  i = inner_code.indexOf('return')
  while (inner_code.indexOf('return') > 0){
    i = inner_code.indexOf('return')
    if (!inner_code[i-1].trim() && (!inner_code[i+'return'.length].trim() || inner_code[i+'return'.length] =='(')){
      if (h_indexInBaseLevelCode(i, inner_code)){
        return i
      }
    }
    inner_code = inner_code.replace('return','RETURN')
  }
  if (i < 0){
    console.log("findReturnInFunction i < 0")
  }
  return i
}

function h_findReturnEndInFunction(inner_code){
  i = h_findReturnInFunction(inner_code) + 'return'.length
  parenth_count = 0
  isInitiated = false
  nonSpaceCharHasBeenSeen = false
  while (i < inner_code.length && parenth_count>0 || !isInitiated){
    char = inner_code[i]
    if (char == ';' && !isInitiated){
      return i
    }
    else if ([';','\n'].includes(char) && !isInitiated && nonSpaceCharHasBeenSeen){
      return i
    }
    else if (char == '('){
      parenth_count += 1
      if (!isInitiated){
        isInitiated = true;
      }
    }
    else if (char == ')'){
      parenth_count-=1
    }
    i+=1
    if (char.trim()){
      isInitiated=true;
    }
  }
  return i
}

function h_getDeclarationBeginIndex(objectName, rawCode){
  rawCode = h_stringReplaceAll(rawCode,';','\n')
  while (rawCode.indexOf(objectName)>0){
    i = rawCode.indexOf(objectName)
    if (!rawCode[i-1].trim()){
      if (!rawCode[i+objectName.length].trim() || rawCode[i+objectName.length]=='('){
        wordCount = 0
        textCount = 0
        while (i > 0 && (wordCount == 0 || rawCode[i] != '\n')){
          i -=1
          if (!rawCode[i].trim()){
            if (textCount>0){
              wordCount += 1;
              break;
            }
          }
          else{
            textCount += 1
          }
        }
        startDeclaration = i
        return startDeclaration + 1
      }
    }
    rawCode = rawCode.replace(objectName, " "+objectName.substring(1,objectName.length))
  }
}

function h_indexInBaseLevelCode(index, rawCode){
  bracketCount = 0
  currIndex = 0
  while (currIndex < index){
    char = rawCode[currIndex]
    if (char == '{'){
      bracketCount += 1
    }
    else if (char == '}'){
      bracketCount -=1
    }
    currIndex += 1
  }
  return bracketCount == 0
}

function h_getClassConstructor(rawCode){
  class_name = h_getFirstExport(rawCode)
  declaration = h_findDeclaration(class_name, rawCode)
  inner_code = h_get_inner_code(declaration,rawCode)
  inner_code_clean = h_clipBrackets(inner_code)
  constructor_ind = h_findConstructorInClass(inner_code_clean)
  constructor_end = h_findConstructorEndInClass(inner_code_clean)
  constructor_stmt = inner_code_clean.substring(constructor_ind,constructor_end)
  return constructor_stmt
}
function h_findConstructorEndInClass(inner_code){
  i = h_findConstructorInClass(inner_code) + 'constructor'.length
  bracket_count = 0
  isInitiated = false
  while (i < inner_code.length && (bracket_count > 0 || !isInitiated)){
    char = inner_code[i]
    if (char=='{'){
      bracket_count += 1
      if (!isInitiated){
        isInitiated=true;
      }
    }
    else if (char == '}'){
      bracket_count -= 1
    }
    i += 1
  }
  return i
}
function h_getOutdatedExportTarget(outdated_export){
  split1 = outdated_export.split('<')[1]
  target = split1.split('/>')[0].trim()
  return target
}

function h_stringReplaceAll(s, c1, c2){
  for (i in s){
    if (s[i] == c1){
      s[i] = c2
    }
  }
  return s
}
function h_get_args(objectName, declaration){
  after_name = declaration.split(objectName)[1]
  parenth_count = 0
  args_string = ""
  for (i = 0; i < after_name.length; i++){
    if (after_name[i]=='('){
      parenth_count += 1
      if (parenth_count > 1){
        args_string += after_name[i]
      }
    }
    else if (after_name[i] == ')'){
      parenth_count -= 1
      if (parenth_count == 0){
        break;
      }
      else{
        args_string += after_name[i]
      }
    }
    else if (parenth_count > 0){
      args_string += after_name[i]
    }
  }
  return args_string
}


function h_split_inner_class_code(inner_code){
  render_begin = h_findRenderInClass(inner_code)
  render_end = h_findRenderEndInClass(inner_code)
  raw_support_code = inner_code.substring(0, render_begin) + inner_code.substring(render_end, inner_code.length)
  support_code = h_clipBrackets(raw_support_code)
  render_code = h_getRenderInnerCode(inner_code)
  return [support_code, render_code]
}

function h_findRenderInClass(inner_code){
  i = inner_code.indexOf('return')
  while (inner_code.indexOf('render') > 0){
    i = inner_code.indexOf("render")
    if (!inner_code[i-1].trim() && (!inner_code[i+"render".length].trim() || inner_code[i+"render".length] == "(")){
      if (h_indexInBaseLevelCode(i, inner_code)){
        return i
      }
    }
    inner_code = inner_code.replace("render", "RENDER")
  }
  if (i < 0){
    console.log("findRenderInClass i < 0")
  }
  return i
}

function h_findRenderEndInClass(inner_code){
  i = h_findRenderInClass(inner_code) + 'render'.length
  bracket_count = 0
  isInitiated = false
  while (i < inner_code.length && (bracket_count > 0 || !isInitiated)){
    char = inner_code[i]
    if (char == '{'){
      bracket_count += 1
      if (!isInitiated){
        isInitiated = true;
      }
    }
    else if (char == '}'){
      bracket_count -= 1
    }
    i += 1
  }
  return i
}

function h_getRenderInnerCode(inner_code){
  i = h_findRenderInClass(inner_code) + 'render'.length
  bracket_count = 0
  isInitiated = false;
  inner_string = ""
  while (i < inner_code.length && (bracket_count > 0 || !isInitiated)){
    char = inner_code[i]
    if (char == '{'){
      bracket_count += 1
      if (!isInitiated){
        isInitiated = true;
        i += 1
        continue
      }
    }
    else if (char == '}'){
      bracket_count -= 1
    }
    i += 1
    if (isInitiated && bracket_count > 0){
      inner_string += char
    }
  }
  return inner_string
}

function h_get_end_index(objectName, rawCode){
    start_index = h_getDeclarationBeginIndex(objectName, rawCode)
    bracket_count = 0
    isInitiated = false
    i = start_index
    while (i < rawCode.length && (bracket_count > 0 ||  !isInitiated)){
      if (rawCode[i] == '{'){
        bracket_count += 1
        if (!isInitiated){
          isInitiated = true;
        }
      }
      else if (rawCode[i] == '}'){
        bracket_count -= 1
      }
      i += 1
    }
    return i
}

function h_(){
}

function h_(){
}


function h_(){
}


function h_(){
}


function h_(){
}


function h_(){
}
