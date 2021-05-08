import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import './src/drone-plate';

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

class App extends LitElement {
  static get properties() {
    return {
      plates: { type: Array }
    };
  }

  static get styles() {
    return css`
      .plates-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1em;
      }

      @media (max-width: 1600px) {
        .plates-container {
          grid-template-columns: repeat(1, 1fr);
        }
      }

      drone-plate {
        border: 2px dashed black;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 1.5em 3em;
        margin-bottom: 0.5em;
        text-align: center;
      }
    `;
  }

  constructor() {
    super();

    this.plates = [];
  }

  connectedCallback() {
    super.connectedCallback();

    try {
      const plates = window.localStorage.getItem('plates');
      const platesArr = JSON.parse(plates);

      this.plates = Array.isArray(platesArr) ? platesArr : [];
    } catch {
      this.plates = [];
    }
  }

  _addPlate() {
    const modelId = this.shadowRoot.getElementById('selectPlates').value;

    if (!modelId || modelId === '') {
      return;
    }

    this.plates = [...this.plates, { id: uuid(), model: modelId }];

    return this._save();
  }

  _changePlate({
    detail: { sheet: { type, index, line } = {}, id: plateId } = {}
  } = {}) {
    const sheetType = type;
    const sheetIndex = index;
    const lineIndex = line.index;
    const lineValue = line.value;
    const selectedPlate = this.plates.find(plate => plate.id === plateId);

    if (!selectedPlate.types) {
      selectedPlate.types = {};
    }

    const selectedType =
      selectedPlate.types[sheetType] ?? (selectedPlate.types[sheetType] = {});

    if (!selectedType.sheets) {
      selectedType.sheets = [];
    }

    const selectedSheet =
      selectedType.sheets[sheetIndex] ?? (selectedType.sheets[sheetIndex] = {});

    if (!selectedSheet.lines) {
      selectedSheet.lines = [];
    }

    (
      selectedSheet.lines[lineIndex] ?? (selectedSheet.lines[lineIndex] = {})
    ).value = lineValue;

    this._save();
  }

  _deletePlate({ detail } = {}) {
    if (window.confirm('¿Deseas eliminar esta plancha?')) {
      const index = this.plates.findIndex(({ id }) => id === detail.id);

      this.plates.splice(index, 1);

      this._save();
      this.requestUpdate();
    }
  }

  _save() {
    window.localStorage.setItem('plates', JSON.stringify(this.plates));
  }

  render() {
    return html`
      <mwc-select id="selectPlates" label="Selecciona un modelo">
        <mwc-list-item value="1">Modelo 1</mwc-list-item>
        <mwc-list-item value="2">Modelo 2</mwc-list-item>
      </mwc-select>

      <mwc-button @click=${this._addPlate}>Añadir plancha</mwc-button>

      <div class="plates-container">
        ${this.plates.map(
          ({ id, model, types = {} }) => html`
            <drone-plate
              id=${id}
              model=${model}
              .types=${types}
              @change-plate=${this._changePlate}
              @delete-plate=${this._deletePlate}
            ></drone-plate>
          `
        )}
      </div>
    `;
  }
}

customElements.define('app-root', App);
