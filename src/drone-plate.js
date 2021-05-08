import { LitElement, html, css } from 'lit-element';
import { models } from './../config';
import '@material/mwc-button';
import './drone-sheet';

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
      h2,
      div,
      drone-sheet {
        align-self: center;
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

    return (
      model &&
      html`
        <div>
          <mwc-button @click=${this._deletePlate}>Borrar plancha</mwc-button>
        </div>
        ${this._getSheets(model)}
      `
    );
  }
}

customElements.define('drone-plate', DronePlate);
