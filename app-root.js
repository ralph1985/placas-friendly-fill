import { LitElement, html, css } from 'lit-element';
import { models } from './config';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-dialog';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-icon-button';
import '@material/mwc-menu';
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

      .add-plates-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 10em;
      }

      #selectPlates {
        width: 70%;
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

  _openMenu() {
    this.shadowRoot.getElementById('menu').show();
  }

  _changeSelectedPlate({ currentTarget: { id } } = {}) {
    const index = this.plates.findIndex(plate => plate.id === id);
    this._selectedPlate = { ...this.plates[index], index };
    this.requestUpdate();
  }

  _addPlate() {
    const modelId = this.shadowRoot.getElementById('selectPlates').value;

    if (!modelId || modelId === '') {
      return;
    }

    this.plates = [...this.plates, { id: uuid(), model: modelId }];

    const index = this.plates.length - 1;
    this._selectedPlate = { ...this.plates[index], index };

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

  _openDialogForDeletePlate({ detail: { id } } = {}) {
    const dialog = this.shadowRoot.getElementById('deleteDialog');

    dialog.setAttribute('data-id', id);
    dialog.show();
  }

  _deletePlate({
    detail: { action },
    currentTarget: {
      dataset: { id: selectedId }
    }
  } = {}) {
    if (action === 'ok') {
      const index = this.plates.findIndex(({ id }) => id === selectedId);

      this.plates.splice(index, 1);

      this._save();
      this._selectedPlate = null;
      this.requestUpdate();
    }
  }

  _save() {
    window.localStorage.setItem('plates', JSON.stringify(this.plates));
  }

  _getDeleteDialog() {
    return html`
      <mwc-dialog
        id="deleteDialog"
        scrimClickAction=""
        @closed=${this._deletePlate}
      >
        <div>¿Eliminar esta plancha?</div>
        <mwc-button slot="primaryAction" dialogAction="ok">
          Aceptar
        </mwc-button>
        <mwc-button slot="secondaryAction" dialogAction="close">
          Cancelar
        </mwc-button>
      </mwc-dialog>
    `;
  }

  _getMenu() {
    return html`
      <mwc-menu id="menu">
        <mwc-list-item @click=${this._changeSelectedPlate}>
          Añadir planchas
        </mwc-list-item>
        ${this.plates.map(
          ({ id, model }, index) =>
            html`
              <mwc-list-item id="${id}" @click=${this._changeSelectedPlate}>
                Plancha ${index + 1} (Modelo ${model})
              </mwc-list-item>
            `
        )}
      </mwc-menu>
    `;
  }

  _getTopBar() {
    const title =
      this._selectedPlate?.index >= 0
        ? `Plancha ${this._selectedPlate.index + 1} (Modelo ${
            this._selectedPlate?.model
          })`
        : 'Añadir planchas';

    return html`
      <mwc-top-app-bar-fixed centerTitle>
        <mwc-icon-button
          icon="menu"
          slot="navigationIcon"
          @click=${this._openMenu}
        ></mwc-icon-button>
        <div slot="title">${title}</div>
        <div><!-- content --></div>
      </mwc-top-app-bar-fixed>
    `;
  }

  render() {
    return html`
      ${this._getTopBar()}${this._getMenu()}
      ${this._selectedPlate?.index >= 0
        ? html`
            <drone-plate
              id=${this._selectedPlate.id}
              model=${this._selectedPlate.model}
              .types=${this._selectedPlate.types ?? {}}
              @change-plate=${this._changePlate}
              @delete-plate=${this._openDialogForDeletePlate}
            ></drone-plate>
          `
        : html`
            <div class="add-plates-wrapper">
              <mwc-select id="selectPlates" label="Selecciona un modelo">
                ${models.map(
                  ({ id }) =>
                    html`
                      <mwc-list-item value="${id}">Modelo ${id}</mwc-list-item>
                    `
                )}
              </mwc-select>
              <mwc-button @click=${this._addPlate}>Añadir plancha</mwc-button>
            </div>
          `}
      ${this._getDeleteDialog()}
    `;
  }
}

customElements.define('app-root', App);
