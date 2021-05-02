import { LitElement, html, css } from "lit-element";

export default class InputField extends LitElement {
  static get properties() {
    return {
      lineId: { type: Number },
      maxChars: { type: Number }
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

    this.maxChars = 10;
  }

  _change({ currentTarget }) {
    this.dispatchEvent(
      new CustomEvent("input-change", {
        detail: { value: currentTarget.value }
      })
    );
  }

  render() {
    return html`
      <label>Línea ${this.lineId}</label>
      <input type="text" maxlength=${this.maxChars} @change=${this._change} />
      <span>(max. ${this.maxChars})</span>
    `;
  }
}

customElements.define("input-field", InputField);
