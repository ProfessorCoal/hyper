/* global Blob,URL,requestAnimationFrame */
import React from 'react';
import Terminal from 'xterm';
import Component from '../component';
import './xterm.css';

export default class Term extends Component {

  constructor(props) {
    super(props);
    props.ref_(this);
  }

  componentDidMount() {
    const {props} = this;
    this.term = props.term || new Terminal();
    this.term.open(this.termRef);
    this.term.charMeasure.on('charsizechanged', () => {
      const cols = Math.ceil(this.termRef.offsetWidth / this.term.charMeasure.width);
      const rows = Math.ceil(this.termRef.offsetHeight / this.term.charMeasure.height);
      this.term.resize(cols, rows);
    });
    this.term.on('data', this.props.onData);
  }

  write(text) {
    this.term.write(text);
  }

  focus() {
    this.term.focus();
  }

  getTermDocument() {
    return document;
  }

  componentWillUnmount() {
    this.term.destroy();
  }

  template(css) {
    return (<div
      ref={component => {
        this.termWrapperRef = component;
      }}
      className={css('fit', this.props.isTermActive && 'active')}
      onMouseDown={this.handleMouseDown}
      style={{padding: this.props.padding}}
      >
      { this.props.customChildrenBefore }
      <div
        ref={component => {
          this.termRef = component;
        }}
        className={css('fit', 'term')}
        />
      { this.props.url ?
        <webview
          key="hyper-webview"
          src={this.props.url}
          onFocus={this.handleFocus}
          style={{
            background: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-flex',
            width: '100%',
            height: '100%'
          }}
          /> : null
      }
      { this.props.customChildren }
    </div>);
  }

  styles() {
    return {
      fit: {
        display: 'block',
        width: '100%',
        height: '100%'
      },

      term: {
        position: 'relative'
      }
    };
  }
}
