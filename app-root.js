import { LitElement, html, css } from "lit-element";
import "./src/drone-plate";

class App extends LitElement {
  static get properties() {
    return {
      plates: { type: Array }
    };
  }

  constructor() {
    super();

    this.plates = [];
  }

  static get styles() {
    return css`
      drone-plate {
        border: 2px dashed black;
        padding: 1.5em 3em;
        margin-bottom: 0.5em;
        text-align: center;
      }
    `;
  }

  _addPlate() {
    const modelId = this.shadowRoot.getElementById("selectPlates").value;

    this.plates = [...this.plates, { model: modelId }];
  }

  _deletePlate() {}

  render() {
    return html`
      <select id="selectPlates">
        <option value="1">Modelo 1</option>
        <option value="2">Modelo 2</option>
      </select>
      <button @click="${this._addPlate}">Añadir</button>

      ${this.plates.map(
        ({ model }) =>
          html`
            <drone-plate
              model="${model}"
              @delete-plate="${this._deletePlate}"
            ></drone-plate>
          `
      )}
    `;
  }
}

customElements.define("app-root", App);
