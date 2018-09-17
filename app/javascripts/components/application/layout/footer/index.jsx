import React, {
  Component
} from 'react'

import './footer.scss'

export default class Footer extends Component {

  render () {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <strong>KETTE asset registry</strong> is based on <a href="https://github.com/chuckbergeron/etherplate">Etherplate</a> by <a href="https://chuckbergeron.io">Chuck Bergeron</a>
              <br />Built with ❤️ in Stuttgart.
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
