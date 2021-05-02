import { LitElement, html, css } from "lit-element";
import "./drone-sheet";

const models = [
  {
    id: 1,
    config: [
      {
        type: 1,
        droneSheets: 10
      }
    ]
  },
  {
    id: 2,
    config: [
      {
        type: 1,
        droneSheets: 2
      },
      {
        type: 2,
        droneSheets: 2
      },
      {
        type: 3,
        droneSheets: 2
      }
    ]
  }
];

export default class DronePlate extends LitElement {
  static get properties() {
    return {
      model: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();

    this.model = 1;
  }

  _getModel(modelId) {
    return models.find(({ id }) => id === modelId);
  }

  _getSheets(model) {
    return model.config.map(({ type, droneSheets }) =>
      new Array(droneSheets).fill().map(
        () =>
          html`
            <drone-sheet model=${this.model} type=${type} /></drone-sheet>
          `
      )
    );
  }

  _deletePlate() {
    this.dispatchEvent(
      new CustomEvent("delete-plate", {
        detail: {
          plate: this
        }
      })
    );
  }

  render() {
    const model = this._getModel(this.model);

    return html`
      <h2>Plancha Modelo: ${model.id}</h2>
      ${this._getSheets(model)}
    `;
  }
}

customElements.define("drone-plate", DronePlate);
