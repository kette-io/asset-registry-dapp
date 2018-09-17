import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Loading from '@/components/loading'
import getToken from '@/services/get-token'

import PlaceholderImg from '@/../images/placeholder.png'

const TokenListItem = class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ipfsHash: '',
      description: ''
    }
  }

  async componentDidMount() {
    if (typeof this.props.token.args !== 'undefined')
      await this.getTokenFromBlockchain();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.type === null
      && typeof prevProps.token.args === 'undefined'
      && typeof this.props.token.args !== 'undefined'
    )
      this.getTokenFromBlockchain();
  }

  async getTokenFromBlockchain() {
    let tokenId = this.props.token.args.tokenId.toNumber();
    const values = await getToken(tokenId, window.web3);
    this.setState({
      ipfsHash: values[0],
      description: values[1]
    })
  }

  render() {
    var image
    var description

    if (typeof this.props.token.args === 'undefined') {
      image = <Loading />
      description = 'Confirming ...'
    } else if (this.state.ipfsHash.length > 0) {
      image =
        <figure className="image is-square">
          <Link to={`/tokens/${this.props.token.args.tokenId}`}>
            <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} />
          </Link>
        </figure>
      description =
        <Link to={`/tokens/${this.props.token.args.tokenId}`}>
          {this.state.description}
        </Link>
    } else {
      image =
        <figure className="image is-square">
          <img src={`/${PlaceholderImg}`} />
        </figure>
      description = '...'
    }

    return (
      <div className="card">
        <div className="card-image">
          {image}
        </div>

        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TokenListItem.propTypes = {
  token: PropTypes.object.isRequired
}

export default TokenListItem;
