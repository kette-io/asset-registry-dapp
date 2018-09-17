import React, {
  Component
} from 'react'
import { Link } from 'react-router-dom'

import Hero from '@/components/hero'

export default class Landing extends Component {

  render () {
    return (
      <Hero>
        <div className="columns">
          <div className="column"></div>

          <div className="column is-two-thirds">
            <p className="title">
              What is KETTE?
            </p>
            <p>
              KETTE is the <strong> global decentralized asset registry</strong>. Scan the NFC-Tag on your asset and register it with its globally unique Id. From now on you can always proof that you are the owner of your most valuable assets.
            </p>

            <br />
            <Link to="/tokens/register" className="button is-info is-large">
              <span>Register Asset now</span>
            </Link>
          </div>

          <div className="column"></div>
        </div>
      </Hero>
    )
  }

}
