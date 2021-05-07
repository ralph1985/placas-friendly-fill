import { LitElement, html, css } from 'lit-element';

export default class InputField extends LitElement {
  static get properties() {
    return {
      index: { type: Number },
      maxChars: { type: Number },
      value: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 0.2em;
      }
    `;
  }

  constructor() {
    super();

    this.index = 0;
    this.maxChars = 10;
    this.value = '';
  }

  _change({ currentTarget }) {
    this.dispatchEvent(
      new CustomEvent('input-field-change', {
        detail: {
          index: this.index,
          value: currentTarget.value
        }
      })
    );
  }

  render() {
    return html`
      <label>Línea ${this.index}</label>
      <input
        value="${this.value}"
        type="text"
        maxlength="${this.maxChars}"
        @change=${this._change}
      />
      <span>(max. ${this.maxChars})</span>
    `;
  }
}

customElements.define('input-field', InputField);
