/* eslint-disable */
/**
 * Build styles
 */
require('./index.module.css').toString();

/**
 * Delimiter Block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

/**
 * @typedef {Object} DelimiterData
 * @description Tool's input and output data format
 */
class Delimiter {
  /**
   * Allow Tool to have no content
   * @return {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: DelimiterData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-toc',
    };

    this._data = {};
    this._element = this.drawView();

    this.data = data;
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    const div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper, this._CSS.block);

    return div;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {DelimiterData} - saved data
   * @public
   */
  save(toolsContent) {
    return {};
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon:
        '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path stroke="null" id="svg_1" d="m3.231982,4.85l10.659151,0a1.296383,1.125 0 0 1 0,2.25l-10.659151,0a1.296383,1.125 0 0 1 0,-2.25zm0,-4.85l10.659151,0a1.296383,1.125 0 0 1 0,2.25l-10.659151,0a1.296383,1.125 0 0 1 0,-2.25zm0,9.85l10.659151,0a1.296383,1.125 0 0 1 0,2.25l-10.659151,0a1.296383,1.125 0 0 1 0,-2.25zm-5.185533,-5a1.296383,1.125 0 1 1 0,2.25a1.296383,1.125 0 0 1 0,-2.25zm0,-4.85a1.296383,1.125 0 1 1 0,2.25a1.296383,1.125 0 0 1 0,-2.25zm0,9.85a1.296383,1.125 0 1 1 0,2.25a1.296383,1.125 0 0 1 0,-2.25z"/></svg>',
      title: 'Table of contents',
    };
  }
}

export default Delimiter;
