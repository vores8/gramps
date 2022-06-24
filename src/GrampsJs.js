import {LitElement, html, css} from 'lit'
import {installRouter} from 'pwa-helpers/router.js'
import {installMediaQueryWatcher} from 'pwa-helpers/media-query.js'
import '@material/mwc-drawer'
import '@material/mwc-tab'
import '@material/mwc-tab-bar'
import '@material/mwc-top-app-bar'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-icon-button'
import '@material/mwc-list'
import '@material/mwc-menu'
import '@material/mwc-list/mwc-list-item'
import '@material/mwc-linear-progress'
import '@material/mwc-snackbar'
import {mdiFamilyTree} from '@mdi/js'
import {renderIcon} from './icons.js'
import {apiGet, getSettings, getPermissions} from './api.js'
import {grampsStrings, additionalStrings} from './strings.js'
import {fireEvent} from './util.js'
import './dayjs_locales.js'

import './components/GrampsjsAppBar.js'
import './components/GrampsJsListItem.js'
import './components/GrampsjsLogin.js'
import './components/GrampsjsUpdateAvailable.js'
import './views/GrampsjsViewPeople.js'
import './views/GrampsjsViewFamilies.js'
import './views/GrampsjsViewPlaces.js'
import './views/GrampsjsViewEvents.js'
import './views/GrampsjsViewSources.js'
import './views/GrampsjsViewCitations.js'
import './views/GrampsjsViewRepositories.js'
import './views/GrampsjsViewNotes.js'
import './views/GrampsjsViewMediaObjects.js'
import './views/GrampsjsViewExport.js'
import './views/GrampsjsViewPerson.js'
import './views/GrampsjsViewFamily.js'
import './views/GrampsjsViewPlace.js'
import './views/GrampsjsViewEvent.js'
import './views/GrampsjsViewSource.js'
import './views/GrampsjsViewBlog.js'
import './views/GrampsjsViewCitation.js'
import './views/GrampsjsViewDashboard.js'
import './views/GrampsjsViewRepository.js'
import './views/GrampsjsViewNote.js'
import './views/GrampsjsViewMedia.js'
import './views/GrampsjsViewSearch.js'
import './views/GrampsjsViewSettings.js'
import './views/GrampsjsViewSettingsOnboarding.js'
import './views/GrampsjsViewRecent.js'
import './views/GrampsjsViewMap.js'
import './views/GrampsjsViewTree.js'
import './views/GrampsjsViewGraph.js'
import './views/GrampsjsViewNewPerson.js'
import './views/GrampsjsViewNewFamily.js'
import './views/GrampsjsViewNewEvent.js'
import './views/GrampsjsViewNewPlace.js'
import './views/GrampsjsViewNewSource.js'
import './views/GrampsjsViewNewCitation.js'
import './views/GrampsjsViewNewRepository.js'
import './views/GrampsjsViewNewNote.js'
import './views/GrampsjsViewNewMedia.js'
import {sharedStyles} from './SharedStyles.js'

const LOADING_STATE_INITIAL = 0
const LOADING_STATE_UNAUTHORIZED = 1
const LOADING_STATE_UNAUTHORIZED_NOCONNECTION = 2
const LOADING_STATE_MISSING_SETTINGS = 4
const LOADING_STATE_READY = 10

const BASE_DIR = ''

export class GrampsJs extends LitElement {
  static get properties () {
    return {
      wide: {type: Boolean},
      progress: {type: Boolean},
      loadingState: {type: Number},
      settings: {type: Object},
      canAdd: {type: Boolean},
      canEdit: {type: Boolean},
      canManageUsers: {type: Boolean},
      _homePersonDetails: {type: Object},
      _lang: {type: String},
      _strings: {type: Object},
      _dbInfo: {type: Object},
      _page: {type: String},
      _pageId: {type: String},
      _showShortcuts: {type: Boolean},
      _shortcutPressed: {type: String}
    }
  }

  constructor () {
    super()
    this.wide = false
    this.progress = false
    this.loadingState = LOADING_STATE_INITIAL
    this.settings = getSettings()
    this.canAdd = false
    this.canEdit = false
    this.canManageUsers = false
    this._homePersonDetails = {}
    this._lang = ''
    this._strings = {}
    this._dbInfo = {}
    this._page = 'home'
    this._pageId = ''
    this._showShortcuts = false
    this._shortcutPressed = ''
  }

  static get styles () {
    return [
      sharedStyles,
      css`
      :host {
        height: 100%;
      }

      main {
        padding: 0;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      mwc-drawer {
        --mdc-drawer-width: 230px;
        --mdc-typography-headline6-font-family: Roboto Slab;
        --mdc-typography-headline6-font-weight: 400;
        --mdc-typography-headline6-font-size: 19px;
      }

      mwc-drawer[open]:not([type="modal"]) {
        --mdc-top-app-bar-width: calc(100% - var(--mdc-drawer-width, 256px));
      }

      mwc-linear-progress {
        --mdc-theme-primary: #4FC3F7;
      }

      grampsjs-list-item span {
        color: #444;
      }

      #user-menu mwc-button {
        margin: 0.5em 1em;
      }

      #person-button {
        margin-left: 60px;
        margin-top: 10px;
        background-color: #E0E0E0;
        color: #444;
        border-radius: 50%;
      }

      #app-title:first-letter {
        text-transform:capitalize;
      }

      .center-xy {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        height: 100vh;
      }

      .center-xy  div {
        display: block;
        width: 20%;
      }

      .menu-bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #e0e0e0;
        background-color: white;
      }

      mwc-list {
        --mdc-list-item-graphic-margin: 20px;
        --mdc-list-side-padding: 20px;
      }

      #main-menu {
      }

      #onboarding {
        width: 100%;
        max-width: 30em;
      }

      grampsjs-view-settings-onboarding {
        width: 100%;
      }

      mwc-tab-bar {
        margin: 20px;
      }

      #shortcut-overlay-container {
        background-color: rgba(0, 0, 0, 0.1);
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        min-height: 100vh;
        width: 100vw;
        z-index: 10001;
        overflow:hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #shortcut-overlay {
        font-size: 16px;
        background-color: white;
        padding: 0.5em 1.5em;
        position: absolute;
        top: 15vh;
        overflow-y:auto;
        max-width: 100vw;
        max-height: 75vh;
        border-radius: 8px;
      }

      #shortcut-overlay section {
        display: flex;
        flex-direction: row;
        gap: 24px;
      }

      #shortcut-overlay h3 {
        margin-top: 0.5em;
        font-size: 1.3em;
        font-weight: 400;
      }

      #shortcut-overlay h4 {
        margin-top: 0.5em;
        font-weight: 400;
        font-size: 1em;
      }

      #shortcut-overlay dl {
        display: grid;
        grid-template-columns: max-content auto;
        margin: 0.5em 0em;
      }

      #shortcut-overlay dt {
        grid-column-start: 1;
        margin-right: 1.2em;
      }

      #shortcut-overlay dt span {
        font-family: 'Roboto Slab';
        font-size: 11px;
        font-weight: 400;
        display: inline-block;
        min-width: .75em;
        padding: 4px 6px;
        text-align: center;
        border: 1px solid #ccc;
        color: #555;
        border-radius: 6px;
        margin-bottom: 4px;
      }

      #shortcut-overlay dd {
        grid-column-start: 2;
        padding: 0;
      }
    `
    ]
  }

  render () {
    return html`
    ${this.renderContent()}
    ${this._renderKeyboardShortcuts()}
    <mwc-snackbar id="error-snackbar" leading></mwc-snackbar>
    <mwc-snackbar id="notification-snackbar" leading></mwc-snackbar>
    <grampsjs-update-available>
      <mwc-snackbar
        leading
        open
        timeoutMs="-1"
        labelText="${this._('A new version of the app is available.')}"
      >
        <mwc-button slot="action" @click=${this._postUpdateMessage}>${this._('Refresh')}</mwc-button>
      </mwc-snackbar>
    </grampsjs-update-available>
    `
  }

  _renderKeyboardShortcuts () {
    if (!this._showShortcuts) {
      return ''
    }
    return html`
    <div id="shortcut-overlay-container">
      <div id="shortcut-overlay">
        <h3>${this._('Keyboard Shortcuts')}</h3>
        <section>
          <div>
            <h4>${this._('Global')}</h4>
            <dl>
              <dt><span>?</span></dt>
              <dd>${this._('Show this dialog')}</dd>
              <dt><span>s</span></dt>
              <dd>${this._('Search')}</dd>
            </dl>
          </div>
          <div>
            <h4>${this._('Navigation')}</h4>
            <dl>
              <dt><span>g</span> <span>h</span></dt>
              <dd>${this._('Home Page')}</dd>
              <dt><span>g</span> <span>b</span></dt>
              <dd>${this._('Blog')}</dd>
              <dt><span>g</span> <span>m</span></dt>
              <dd>${this._('Map')}</dd>
              <dt><span>g</span> <span>t</span></dt>
              <dd>${this._('Family Tree')}</dd>
              <dt><span>g</span> <span>r</span></dt>
              <dd>${this._('History')}</dd>
            </dl>
          </div>
        </section>
      </div>
    </div>
      `
  }

  _postUpdateMessage () {
    fireEvent(this, 'update:reload')
  }

  // eslint-disable-next-line class-methods-use-this
  _renderInitial () {
    return html`<div class="center-xy">
      <div>
        <mwc-linear-progress indeterminate></mwc-linear-progress>
      </div>
    </div>
`
  }

  _renderNoConn () {
    return html`<div class="center-xy">
      <div>
        No connection<br/><br/>
        <mwc-button raised @click=${this._handleReload}>Reload</mwc-button>
      </div>
    </div>
`
  }

  _renderLogin () {
    return html`
    <grampsjs-login .strings="${this._strings}"></grampsjs-login>
    `
  }

  _renderOnboarding () {
    return html`
    <div class="center-xy" id="onboarding">
      <grampsjs-view-settings-onboarding
        @onboarding:completed="${this._setReady}"
        class="page"
        active
        .strings="${this._strings}"
      ></grampsjs-view-settings-onboarding>
    </div>
    `
  }

  renderContent () {
    if (this.loadingState === LOADING_STATE_INITIAL) {
      return this._renderInitial()
    }
    if (this.loadingState === LOADING_STATE_UNAUTHORIZED_NOCONNECTION) {
      return this._renderNoConn()
    }
    if (this.loadingState === LOADING_STATE_UNAUTHORIZED) {
      window.history.pushState({}, '', 'login')
      return this._renderLogin()
    }
    if (!getSettings().lang || !getSettings().homePerson) {
      this.loadingState = LOADING_STATE_MISSING_SETTINGS
    }
    if (this.loadingState === LOADING_STATE_MISSING_SETTINGS) {
      return this._renderOnboarding()
    }
    if (this.settings.lang && Object.keys(this._strings).length === 0) {
      this._loadStrings(grampsStrings, this.settings.lang)
    }
    const tabs = {
      people: this._('People'),
      families: this._('Families'),
      events: this._('Events'),
      places: this._('Places'),
      sources: this._('Sources'),
      citations: this._('Citations'),
      repositories: this._('Repositories'),
      notes: this._('Notes'),
      medialist: this._('Media Objects')
    }
    return html`
      <mwc-drawer type="dismissible" id="app-drawer" ?open="${this.wide}">
        <div id="main-menu">
          <mwc-list>
            <grampsjs-list-item href="${BASE_DIR}/" graphic="icon">
              <span>${this._('Home Page')}</span>
              <mwc-icon slot="graphic">home</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/blog" graphic="icon">
              <span>${this._('Blog')}</span>
              <mwc-icon slot="graphic">rss_feed</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/people" graphic="icon">
              <span>${this._('Lists')}</span>
              <mwc-icon slot="graphic">list</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/map" graphic="icon">
              <span>${this._('Map')}</span>
              <mwc-icon slot="graphic">map</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/tree" graphic="icon">
              <span>${this._('Family Tree')}</span>
              <mwc-icon slot="graphic">${renderIcon(mdiFamilyTree)}</mwc-icon>
            </grampsjs-list-item>
            <li divider padded role="separator"></li>
            <grampsjs-list-item href="${BASE_DIR}/recent" graphic="icon">
              <span>${this._('History')}</span>
              <mwc-icon slot="graphic">history</mwc-icon>
            </grampsjs-list-item>
            <grampsjs-list-item href="${BASE_DIR}/export" graphic="icon">
              <span>${this._('Export')}</span>
              <mwc-icon slot="graphic">download_file</mwc-icon>
            </grampsjs-list-item>
          </mwc-list>
        </div>
        <div slot="appContent">
          <grampsjs-app-bar
            ?add="${this.canAdd}"
            .strings="${this._strings}"
          ></grampsjs-app-bar>
          <mwc-linear-progress indeterminate ?closed="${!this.progress}">
          </mwc-linear-progress>

        <main>


        ${this._tabHtml(tabs)}

        <grampsjs-view-dashboard class="page" ?active=${this._page === 'home'} .strings="${this._strings}" .dbInfo="${this._dbInfo}"></grampsjs-view-dashboard>
        <grampsjs-view-blog class="page" ?active=${this._page === 'blog'} .strings="${this._strings}"></grampsjs-view-blog>

        <grampsjs-view-people class="page" ?active=${this._page === 'people'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-people>
        <grampsjs-view-families class="page" ?active=${this._page === 'families'} .strings="${this._strings}" ?canAdd=${this.canAdd && this.canEdit}></grampsjs-view-families>
        <grampsjs-view-events class="page" ?active=${this._page === 'events'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-events>
        <grampsjs-view-places class="page" ?active=${this._page === 'places'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-places>
        <grampsjs-view-sources class="page" ?active=${this._page === 'sources'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-sources>
        <grampsjs-view-citations class="page" ?active=${this._page === 'citations'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-citations>
        <grampsjs-view-repositories class="page" ?active=${this._page === 'repositories'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-repositories>
        <grampsjs-view-notes class="page" ?active=${this._page === 'notes'} .strings="${this._strings}" ?canAdd=${this.canAdd}></grampsjs-view-notes>
        <grampsjs-view-media-objects class="page" ?active=${this._page === 'medialist'} .strings="${this._strings}" ?canAdd=${this.canAdd && this.canEdit}></grampsjs-view-media-objects>

        <grampsjs-view-map class="page" ?active=${this._page === 'map'} .strings="${this._strings}"></grampsjs-view-map>
        <grampsjs-view-tree class="page" ?active=${this._page === 'tree'} grampsId="${this.settings.homePerson}" .strings="${this._strings}" .settings="${this.settings}"></grampsjs-view-tree>
        <grampsjs-view-graph class="page" ?active=${this._page === 'graph'} grampsId="${this.settings.homePerson}" .strings="${this._strings}" .settings="${this.settings}"></grampsjs-view-graph>

        <grampsjs-view-person class="page" ?active=${this._page === 'person'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}" .homePersonDetails=${this._homePersonDetails}></grampsjs-view-person>
        <grampsjs-view-family class="page" ?active=${this._page === 'family'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-family>
        <grampsjs-view-event class="page" ?active=${this._page === 'event'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-event>
        <grampsjs-view-place class="page" ?active=${this._page === 'place'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-place>
        <grampsjs-view-source class="page" ?active=${this._page === 'source'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-source>
        <grampsjs-view-citation class="page" ?active=${this._page === 'citation'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-citation>
        <grampsjs-view-repository class="page" ?active=${this._page === 'repository'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-repository>
        <grampsjs-view-note class="page" ?active=${this._page === 'note'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-note>
        <grampsjs-view-media class="page" ?active=${this._page === 'media'} grampsId="${this._pageId}" .strings="${this._strings}" ?canEdit="${this.canEdit}"></grampsjs-view-media>

        <grampsjs-view-export class="page" ?active=${this._page === 'export'} .strings="${this._strings}"></grampsjs-view-export>
        <grampsjs-view-search class="page" ?active=${this._page === 'search'} .strings="${this._strings}"></grampsjs-view-search>
        <grampsjs-view-recent class="page" ?active=${this._page === 'recent'} .strings="${this._strings}"></grampsjs-view-recent>
        <grampsjs-view-settings class="page" ?active=${this._page === 'settings'} .strings="${this._strings}" ?users="${this.canManageUsers}"></grampsjs-view-settings>

        <grampsjs-view-new-person class="page" ?active=${this._page === 'new_person'} .strings="${this._strings}"></grampsjs-view-new-person>
        <grampsjs-view-new-family class="page" ?active=${this._page === 'new_family'} .strings="${this._strings}"></grampsjs-view-new-family>
        <grampsjs-view-new-event class="page" ?active=${this._page === 'new_event'} .strings="${this._strings}"></grampsjs-view-new-event>
        <grampsjs-view-new-place class="page" ?active=${this._page === 'new_place'} .strings="${this._strings}"></grampsjs-view-new-place>
        <grampsjs-view-new-source class="page" ?active=${this._page === 'new_source'} .strings="${this._strings}"></grampsjs-view-new-source>
        <grampsjs-view-new-citation class="page" ?active=${this._page === 'new_citation'} .strings="${this._strings}"></grampsjs-view-new-citation>
        <grampsjs-view-new-repository class="page" ?active=${this._page === 'new_repository'} .strings="${this._strings}"></grampsjs-view-new-repository>
        <grampsjs-view-new-note class="page" ?active=${this._page === 'new_note'} .strings="${this._strings}"></grampsjs-view-new-note>
        <grampsjs-view-new-media class="page" ?active=${this._page === 'new_media'} .strings="${this._strings}"></grampsjs-view-new-media>

        </main>

      </div>
      </mwc-drawer>

    `
  }

  _tabHtml (tabs) {
    if (!(this._page in tabs)) {
      return ''
    }
    return html`
    <mwc-tab-bar activeIndex="${Object.keys(tabs).indexOf(this._page)}">
    ${Object.keys(tabs).map(key => html`<mwc-tab isMinWidthIndicator label="${tabs[key]}" @click="${() => this._handleTab(key)}"></mwc-tab>`)}
    </mwc-tab-bar>
  `
  }

  _toggleDrawer () {
    const drawer = this.shadowRoot.getElementById('app-drawer')
    if (drawer !== null) {
      drawer.open = !drawer.open
    }
  }

  _closeDrawer () {
    const drawer = this.shadowRoot.getElementById('app-drawer')
    if (drawer !== null && drawer.open) {
      drawer.open = false
    }
  }

  _handleReload () {
    this.loadingState = LOADING_STATE_INITIAL
    this._loadDbInfo()
  }

  connectedCallback () {
    super.connectedCallback()
    this._loadDbInfo()
    window.addEventListener('db:changed', () => this._loadDbInfo())
    this.addEventListener('drawer:toggle', this._toggleDrawer)
    window.addEventListener('keydown', (event) => this._handleKey(event))
  }

  firstUpdated () {
    installRouter((location) => this._loadPage(decodeURIComponent(location.pathname)))
    installMediaQueryWatcher('(min-width: 768px)', (matches) => { this.wide = matches })
    this.addEventListener('nav', this._handleNav.bind(this))
    this.addEventListener('grampsjs:error', this._handleError.bind(this))
    this.addEventListener('grampsjs:notification', this._handleNotification.bind(this))
    this.addEventListener('progress:on', this._progressOn.bind(this))
    this.addEventListener('progress:off', this._progressOff.bind(this))
    window.addEventListener('user:loggedout', this._handleLogout.bind(this))
    window.addEventListener('settings:changed', this._handleSettings.bind(this))
  }

  _loadDbInfo () {
    apiGet('/api/metadata/')
      .then(data => {
        if ('error' in data) {
          this.loadingState = LOADING_STATE_UNAUTHORIZED
        }
        if ('data' in data) {
          this._dbInfo = data.data
          if (this.language === '' && this._dbInfo?.locale?.language !== undefined) {
            this.language = this._dbInfo.locale.language
          }
          this._setReady()
        }
      })
    this._loadHomePersonInfo()
  }

  _loadHomePersonInfo () {
    const grampsId = this.settings.homePerson
    if (!grampsId) {
      return null
    }
    apiGet(`/api/people/?gramps_id=${grampsId}`)
      .then(data => {
        if ('data' in data) {
          [this._homePersonDetails] = data.data
        } else if ('error' in data) {
          this._showError(data.error)
        }
      })
  }

  _setReady () {
    this.loadingState = LOADING_STATE_READY
    this.setPermissions()
  }

  _loadPage (path) {
    this._disableEditMode()
    if (path === '/' || path === `${BASE_DIR}/`) {
      this._page = 'home'
      this._pageId = ''
    } else if (BASE_DIR === '') {
      const pathId = path.slice(1)
      const page = pathId.split('/')[0]
      const pageId = pathId.split('/')[1]
      this._page = page
      this._pageId = pageId || ''
    } else if (path.split('/')[0] === BASE_DIR.split('/')[0]) {
      const pathId = path.slice(1)
      const page = pathId.split('/')[1]
      const pageId = pathId.split('/')[2]
      this._page = page
      this._pageId = pageId || ''
    }

    if (!this.wide) {
      this._closeDrawer()
    }
  }

  _progressOn () {
    this.progress = true
  }

  _progressOff () {
    this.progress = false
  }

  _handleTab (page) {
    if (page !== this._page) {
      const href = `${BASE_DIR}/${page}`
      this._loadPage(href)
      window.history.pushState({}, '', href)
      this._disableEditMode()
    }
  }

  _handleNav (e) {
    const {path} = e.detail
    const page = path.split('/')[0]
    const pageId = path.split('/')[1]
    if (page !== this._page || pageId !== this._pageId) {
      const href = `${BASE_DIR}/${path}`
      this._loadPage(href)
      window.history.pushState({}, '', href)
      this._disableEditMode()
    }
  }

  _disableEditMode () {
    fireEvent(this, 'edit-mode:off', {})
  }

  _handleError (e) {
    const {message} = e.detail
    this._showError(message)
  }

  _handleNotification (e) {
    const {message} = e.detail
    this._showToast(message)
  }

  update (changed) {
    super.update(changed)
    if (changed.has('settings') && this.loadingState > LOADING_STATE_UNAUTHORIZED_NOCONNECTION) {
      if (this.settings.lang && this.settings.lang !== this._lang) {
        this._loadStrings(grampsStrings, this.settings.lang)
      }
    }
  }

  _loadStrings (strings, lang) {
    apiGet(`/api/translations/${lang}?strings=${JSON.stringify(strings)}`)
      .then(data => {
        if ('data' in data) {
          this._strings = data.data.reduce((obj, item) => Object.assign(obj, {[item.original]: item.translation}), {})
          if (lang in additionalStrings) {
            this._strings = Object.assign(additionalStrings[lang], this._strings)
          }
          this._strings.__lang__ = lang
          this._lang = lang
          fireEvent(this, 'language:changed', {lang: lang})
        }
        if ('error' in data) {
          this._showError(data.error)
        }
      })
  }

  _showError (msg) {
    const snackbar = this.shadowRoot.getElementById('error-snackbar')
    snackbar.labelText = `Error: ${msg}`
    snackbar.show()
  }

  _showToast (msg) {
    const snackbar = this.shadowRoot.getElementById('notification-snackbar')
    snackbar.labelText = msg
    snackbar.show()
  }

  _openUserMenu () {
    const userMenu = this.shadowRoot.getElementById('user-menu')
    userMenu.open = true
  }

  _handleLogout () {
    this.loadingState = LOADING_STATE_UNAUTHORIZED
  }

  _handleSettings () {
    this.settings = getSettings()
    if (
      this.settings?.homePerson &&
      this._homePersonDetails?.gramps_id &&
      (this.settings.homePerson !== this._homePersonDetails.gramps_id)
    ) {
      this._loadHomePersonInfo()
    }
  }

  _handleKey (e) {
    const target = e.composedPath()[0]
    if (['input', 'textarea', 'select', 'option', 'mwc-list-item'].includes(target.tagName.toLowerCase())) {
      return null
    }
    if (this._showShortcuts) {
      this._showShortcuts = false
    }
    if (this._shortcutPressed) {
      if (e.key === 'h') {
        fireEvent(this, 'nav', {path: ''})
      } else if (e.key === 'b') {
        fireEvent(this, 'nav', {path: 'blog'})
      } else if (e.key === 'm') {
        fireEvent(this, 'nav', {path: 'map'})
      } else if (e.key === 't') {
        fireEvent(this, 'nav', {path: 'tree'})
      } else if (e.key === 'r') {
        fireEvent(this, 'nav', {path: 'recent'})
      }
      this._shortcutPressed = ''
    } else {
      if (e.key === 'g') {
        this._shortcutPressed = 'g'
      } else if (e.key === 's') {
        fireEvent(this, 'nav', {path: 'search'})
      } else if (e.key === '?') {
        this._showShortcuts = true
      } else {
        return null
      }
    }
    e.preventDefault()
    e.stopPropagation()
  }

  setPermissions () {
    const permissions = getPermissions()
    // If permissions is null, authorization is disabled and anything goes
    if (permissions === null) {
      this.canAdd = true
      this.canEdit = true
      // managing users not meaningful in this case
      this.canManageUsers = false
    } else {
      this.canAdd = permissions.includes('AddObject')
      this.canEdit = permissions.includes('EditObject')
      this.canManageUsers = permissions.includes('EditOtherUser')
    }
  }

  _ (s) {
    if (s in this._strings) {
      return this._strings[s]
    }
    return s
  }
}