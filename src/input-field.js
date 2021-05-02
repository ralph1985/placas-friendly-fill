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

  render() {
    return html`
      <label>Línea ${this.lineId}</label>
      <input type="text" maxlength=${this.maxChars} />
      <span>(max. ${this.maxChars})</span>
    `;
  }
}

customElements.define("input-field", InputField);
