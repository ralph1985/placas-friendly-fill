import { LitElement, html, css } from "lit-element";
import "./input-field";

const types = [
  {
    id: 1,
    lines: 3,
    maxChars: 20
  },
  {
    id: 2,
    lines: 5,
    maxChars: 20
  },
  {
    id: 3,
    lines: 7,
    maxChars: 13
  }
];

export default class DroneSheet extends LitElement {
  static get properties() {
    return {
      model: { type: Number },
      type: { type: Number }
    };
  }

  static get styles() {
    return css`
      .model_1,
      .model_2 {
        display: inline-block;
        border: 1px solid black;
        margin: 0.5em 1em;
      }

      .model_1 {
        background-color: red;
      }

      .model_2 {
        background-color: green;
      }

      .model_2.type_2 {
        background-color: blue;
      }

      .model_2.type_3 {
        background-color: yellow;
      }
    `;
  }

  constructor() {
    super();

    this.model = 1;
  }

  _getType(typeId) {
    const type = types.find(({ id }) => id === typeId);

    return html`
      <div class="model_${this.model} type_${type.id}">
        ${new Array(type.lines).fill().map(
          (_, index) =>
            html`
              <input-field
                index="${index + 1}"
                maxChars="${type.maxChars}"
              ></input-field>
            `
        )}
      </div>
    `;
  }

  render() {
    return html`
      ${this._getType(this.type)}
    `;
  }
}

customElements.define("drone-sheet", DroneSheet);
