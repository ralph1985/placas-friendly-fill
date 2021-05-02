import { LitElement, html, css } from "lit-element";
import "./input-field";

export default class DroneSheet extends LitElement {
  static get properties() {
    return {
      model: { type: Number },
      type: { type: Number }
    };
  }

  static get styles() {
    return css`
      .model1,
      .model2 {
        display: inline-block;
        border: 1px solid black;
        margin: 0.5em 1em;
      }

      .model1 {
        background-color: red;
      }

      .model2 {
        background-color: green;
      }

      .model2.type2 {
        background-color: blue;
      }

      .model2.type3 {
        background-color: yellow;
      }
    `;
  }

  constructor() {
    super();

    this.model = 1;
  }

  _getModel1() {
    return html`
      <div class="model1">
        <input-field lineId="1" maxChars="20"></input-field>
        <input-field lineId="2" maxChars="20"></input-field>
        <input-field lineId="3" maxChars="20"></input-field>
      </div>
    `;
  }

  _getModel2(type) {
    switch (type) {
      case 2:
        return html`
          <div class="model2 type${type}">
            <input-field lineId="1" maxChars="20"></input-field>
            <input-field lineId="2" maxChars="20"></input-field>
            <input-field lineId="3" maxChars="20"></input-field>
            <input-field lineId="4" maxChars="20"></input-field>
            <input-field lineId="5" maxChars="20"></input-field>
          </div>
        `;
      case 3:
        return html`
          <div class="model2 type${type}">
            <input-field lineId="1" maxChars="13"></input-field>
            <input-field lineId="2" maxChars="13"></input-field>
            <input-field lineId="3" maxChars="13"></input-field>
            <input-field lineId="4" maxChars="13"></input-field>
            <input-field lineId="5" maxChars="13"></input-field>
            <input-field lineId="6" maxChars="13"></input-field>
            <input-field lineId="7" maxChars="13"></input-field>
          </div>
        `;
      default:
        return html`
          <div class="model2">
            <input-field lineId="1" maxChars="20"></input-field>
            <input-field lineId="2" maxChars="20"></input-field>
            <input-field lineId="3" maxChars="20"></input-field>
          </div>
        `;
    }
  }

  render() {
    return html`
      ${this.model === 1 ? this._getModel1() : this._getModel2(this.type)}
    `;
  }
}

customElements.define("drone-sheet", DroneSheet);
