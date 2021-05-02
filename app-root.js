import { LitElement, html, css } from "lit-element";
import "./src/drone-plate";

const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

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

    this.plates = [...this.plates, { id: uuid(), model: modelId }];
  }

  _deletePlate({ detail } = {}) {
    if (window.confirm("¿Deseas eliminar esta plancha?")) {
      const index = this.plates.findIndex(({ id }) => id === detail.id);

      this.plates.splice(index, 1);

      this.requestUpdate();
    }
  }

  render() {
    return html`
      <select id="selectPlates">
        <option value="1">Modelo 1</option>
        <option value="2">Modelo 2</option>
      </select>
      <button @click="${this._addPlate}">Añadir plancha</button>

      ${this.plates.map(
        ({ id, model }) => html`
          <drone-plate
            id="${id}"
            model="${model}"
            @delete-plate="${this._deletePlate}"
          ></drone-plate>
        `
      )}
    `;
  }
}

customElements.define("app-root", App);
