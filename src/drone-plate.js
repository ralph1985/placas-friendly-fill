import { LitElement, html, css } from 'lit-element';
import { models } from './../config';
import '@material/mwc-button';
import '@material/mwc-fab';
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
        border: 1px solid black;
      }

      #deleteButton {
        position: fixed;
        right: 1em;
        bottom: 1em;
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
        ${this._getSheets(model)}
        <mwc-fab
          id="deleteButton"
          icon="delete"
          @click=${this._deletePlate}
        ></mwc-fab>
      `
    );
  }
}

customElements.define('drone-plate', DronePlate);
