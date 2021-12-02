'use babel';

export default class HistoryCodeView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.id = "myHistoryModalPanel"
    
    this.element.classList.add('historyCode');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Code History';
    message.classList.add('header');
    message.id = "messageID2"
    message.style.fontSize = "18px"
    this.element.appendChild(message);

    var codeBox = document.createElement('textarea');
    codeBox.textContent = ""
    codeBox.classList.add("codeBox")
    codeBox.id = "codeBox"
    this.element.appendChild(codeBox)

    var closeButton = document.createElement('button');
    closeButton.innerHTML = "X"
    closeButton.id = "closeHistoryButton"
    closeButton.classList.add("close")
    this.element.appendChild(closeButton)


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
