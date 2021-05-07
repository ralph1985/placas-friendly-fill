import { LitElement, html, css } from 'lit-element';
import './drone-sheet';

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
      id: { type: String },
      model: { type: Number },
      types: { type: Object }
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
    this.types = {};
  }

  _deletePlate() {
    this.dispatchEvent(
      new CustomEvent('delete-plate', {
        detail: { id: this.id }
      })
    );
  }

  _sheetChange({ detail: sheet } = {}) {
    this.dispatchEvent(
      new CustomEvent('change-plate', {
        detail: {
          id: this.id,
          sheet
        }
      })
    );
  }

  _getModel(modelId) {
    return models.find(({ id }) => id === modelId);
  }

  _getSheets(model) {
    return model.config.map(({ type, droneSheets }) =>
      new Array(droneSheets).fill().map(
        (_, index) =>
          html`
            <drone-sheet
              model=${this.model}
              type=${type}
              index=${index}
              .lines=${this.types[type]?.sheets[index]?.lines ?? []}
              @drone-sheet-change=${this._sheetChange}
            ></drone-sheet>
          `
      )
    );
  }

  render() {
    const model = this._getModel(this.model);

    return html`
      <h2>Plancha Modelo: ${model.id}</h2>
      <h3>${this.id}</h3>
      <div><button @click=${this._deletePlate}>Borrar plancha</button></div>
      ${this._getSheets(model)}
    `;
  }
}

customElements.define('drone-plate', DronePlate);
