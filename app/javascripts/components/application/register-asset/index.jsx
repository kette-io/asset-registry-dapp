import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import ipfs from '@/services/ipfs'
import classnames from 'classnames'

import nfToken from '@/contracts/nfTokenFactory'

import { addTokenAction } from '@/redux/actions'

import Ether from '@/components/ether'
import openSocket from 'socket.io-client';

const AssetRegistry = class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: '',
      description: '',
      descriptionError: '',
      errorMessage: '',
      redirectToTokenList: false,
      uniqueId: '',//Math.random().toString().substr(0,6),
      socket: openSocket('http://localhost:1445')
    }

    this.state.socket.on('nfc', uniqueId => {
      this.setState({ uniqueId: uniqueId })
    });
  }

  async componentDidMount() {
    try {
      let contractInstance = await nfToken(window.web3);
      let price = await contractInstance.getCurrentRegistrationPrice();

      this.setState({ price: price.toString() })
    } catch (error) {
      toastr.error('Error', error.message)
    }
  }

  async onClickSave() {
    // Reset the error handling

    this.setState({ descriptionError: '' })
    const addResult = await ipfs.files.add(this.state.imageBuffer);

    const ipfsHash = addResult[0].hash;
    this.setState({ ipfsHash: ipfsHash })

    console.log(this.state.ipfsHash)
    console.log(this.state.description)

    if (this.state.description.length < 1) {
      this.setState({ descriptionError: 'Please enter at least 1 character for the description' })
    } else {
      try {
        let contractInstance = await nfToken(window.web3);

        const txHash = await contractInstance.buyToken.sendTransaction(
          this.state.ipfsHash,
          this.state.description,
          this.state.uniqueId,
          { value: this.state.price }
        )

        this.props.addToken({ transactionHash: txHash })
        this.setState({ redirectToTokenList: true })
        toastr.success('Success', 'The transaction has been broadcast.')
      } catch (err) {
        toastr.error('Error', 'The transaction was cancelled or rejected.')
        console.log(err)
      }
    }
  }

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];
      const arrayReader = new FileReader();
      arrayReader.onloadend = (e) => {
        //result is image as buffer
        this.setState({ imageBuffer: Buffer(e.target.result) })
      }
      arrayReader.readAsArrayBuffer(file)

      const dataUrlReader = new FileReader();
      dataUrlReader.onloadend = (e) => {
        //result is image as dataURL
        this.setState({ image: e.target.result })
      }
      dataUrlReader.readAsDataURL(file)
    }
  }

  render() {
    if (this.state.redirectToTokenList)
      return <Redirect to={'/tokens/all'} />

    if (this.state.descriptionError) {
      var descriptionError = <p className="help is-danger">{this.state.descriptionError}</p>
    }

    if (this.state.errorMessage) {
      var errorMessage = <p className='help is-danger'>{this.state.errorMessage}</p>
    }

    if (this.state.image) {
      var image = <img src={this.state.image} />
    }

    return (
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-one-half-desktop'>
              <div className="etherplate-form">
                <div className="etherplate-form--wrapper">
                  <div className="field">
                    <label className="label">Unique ID of the asset</label>
                    <div className="control">
                      <input
                        disabled="true"
                        placeholder={"Will be read from NFC"}
                        className="input"
                        value={this.state.uniqueId}
                        onChange={(e) => this.setState({ uniqueId: e.target.value })} />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                      <input
                        placeholder={"Give a description of your asset"}
                        className="input"
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })} />
                    </div>
                    {descriptionError}
                  </div>
                  <div className="field">
                    <label className="label">Image</label>
                    <div className="control">
                      <input
                        type="file"
                        className="input"
                        onChange={this.onImageChange.bind(this)} />
                    </div>
                  </div>
                  <br />
                  <div className="field">
                    <label className="label">Price</label>
                    <div className="control">
                      <Ether wei={this.state.price} />
                    </div>
                  </div>
                  <button
                    disabled={this.state.description === ''}
                    className={classnames('button is-success is-medium')}
                    onClick={(e) => this.onClickSave()}>
                    Register Asset
                    </button>
                  {errorMessage}
                </div>
              </div>
            </div>
            <div className='column is-one-third'>
              {image}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToken: (token) => {
      dispatch(addTokenAction(token))
    }
  }
}

export default connect(null, mapDispatchToProps)(AssetRegistry)
