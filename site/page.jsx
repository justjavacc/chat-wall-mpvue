import React from 'react';
import ScrollToTop from 'react-scroll-up';
import classnames from 'classnames';

import { i18n } from '../src';

import en from '../src/locale/lang/en';
import zh from '../src/locale/lang/zh-CN';

import locales from './locales';
import pages from './pages';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    window.addEventListener("hashchange", () => {
      window.scrollTo(0, 0);

      this.setPage();
    }, false);
  }

  componentDidMount() {
    this.setPage(() => {
      if (!this.state.locale) {
        this.setLocale(localStorage.getItem('ELEMENT_LANGUAGE') || 'zh-CN');
      }
    });
  }

  componentDidUpdate(props, state) {
    if (state.locale != this.state.locale) {
      switch(this.state.locale) {
        case 'en-US':
          i18n.use(en); break;
        default:
          i18n.use(zh); break;
      }
    }
  }

  getLocale(key) {
    const map = locales[this.state.locale] || {};
    return key.split('.').reduce((a, b) => {
      const parent = map[a];

      if (b) {
        return (parent || {})[b];
      }

      return parent;
    });
  }

  setLocale(locale) {
    window.location.hash = `/${locale}/${this.state.page}`;
  }

  getPage() {
    // ?: 不捕获分组
    const routes = location.hash.match(/(?:\/(.+))?\/(.+)/);
    if (routes) {
      if (locales.hasOwnProperty(routes[1])) {
        this.setState({ locale: routes[1] }, () => {
          localStorage.setItem('ELEMENT_LANGUAGE', this.state.locale);
        });
      }

      return routes[2];
    }

    return 'quick-start';
  }

  setPage(fn) {
    this.setState({ page: this.getPage() }, fn);
  }

  // 获取组件
  getComponent(page) {
    this.components = this.components || Object.assign(Object.values(pages.components).reduce((a, b) => {
      return Object.assign(a, b);
    }, {}), pages.documents);
    const result = this.components[page];
    
    if (result) {
      // React.createElement(tagType/reactClass, props, children)
      return React.createElement(result.default, {
        locale: {
          show: this.getLocale('markdown.show'),
          hide: this.getLocale('markdown.hide')
        }
      });
    }
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="container">
            <h1>UI
              {/* <img src={require('./assets/github.png')} /> */}
            </h1>
            <ul className="nav">
              <li className="nav-item">
                <a className="active">{this.getLocale('misc.component')}</a>
              </li>
              <li className="nav-item">
                <span className={classnames('nav-lang', { active: this.state.locale === 'zh-CN'})} onClick={this.setLocale.bind(this, 'zh-CN')}>中文</span>
                <span> / </span>
                <span className={classnames('nav-lang', { active: this.state.locale === 'en-US'})} onClick={this.setLocale.bind(this, 'en-US')}>En</span>
              </li>
            </ul>
          </div>
        </header>
        <div className="main container">
          <nav className="side-nav">
            <ul>
              <li className="nav-item">
                <a>{this.getLocale('misc.development')}</a>
                <ul className="pure-menu-list sub-nav">
                  {
                    Object.keys(pages.documents).map(page => {
                      return (
                        <li className="nav-item" key={page}>
                          <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                        </li>
                      )
                    })
                  }
                </ul>
              </li>
              <li className="nav-item">
                <a>{this.getLocale('misc.components')}</a>
                {
                  Object.keys(pages.components).map(group => {
                    return (
                      <div className="nav-group" key={group}>
                        <div className="nav-group__title">{group}</div>
                        <ul className="pure-menu-list">
                          {
                            Object.keys(pages.components[group]).map(page => {
                              return (
                                <li key={page} className="nav-item">
                                  <a href={`#/${this.state.locale}/${page}`} className={page === this.state.page ? 'active' : ''}>{this.getLocale(`page.${page}`)}</a>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    )
                  })
                }
              </li>
            </ul>
          </nav>
          <div className="content">
            { this.getComponent(this.state.page) }
            <ScrollToTop showUnder={210}>
              <div className="page-component-up">
                <i className="el-icon-caret-top"></i>
              </div>
            </ScrollToTop>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="footer-main">
              <p className="footer-main-title">UI</p>
              <a href="" target="_blank" rel="noopener noreferrer" className="footer-main-link">page1</a>
              <a href="" target="_blank" rel="noopener noreferrer" className="footer-main-link">page2</a>
              <a href="" target="_blank" rel="noopener noreferrer" className="footer-main-link">page3</a>
            </div>
            <div className="footer-social">
                <a href="//github.com/leesipeng/UI" target="_blank" rel="noopener noreferrer">
                <img src={require('./assets/github.png')} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}