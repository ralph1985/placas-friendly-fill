import { LitElement, html, css } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
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
      drone-plate {
      }
    `;
  }

  constructor() {
    super();

    this.plates = [];
    this.selectedTabIndex = 0;
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

    this._selectedPlate = this.plates[0];
  }

  _changeTab({ currentTarget: { id } } = {}) {
    this._selectedPlate = this.plates.find(plate => plate.id === id);
    this.requestUpdate();
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
      this._selectedPlate = null;
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

      <mwc-tab-bar>
        ${this.plates.map(
          ({ id, model }, index) => html`
            <mwc-tab
              label="Plancha ${index + 1} (modelo ${model})"
              id="${id}"
              @click=${this._changeTab}
            ></mwc-tab>
          `
        )}
      </mwc-tab-bar>

      ${this._selectedPlate &&
        html`
          <drone-plate
            id=${this._selectedPlate.id}
            model=${this._selectedPlate.model}
            .types=${this._selectedPlate.types ?? {}}
            @change-plate=${this._changePlate}
            @delete-plate=${this._deletePlate}
          ></drone-plate>
        `}
    `;
  }
}

customElements.define('app-root', App);
