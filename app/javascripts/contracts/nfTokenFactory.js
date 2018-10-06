import TruffleContract from 'truffle-contract'
import AssetRegistryABI from '../../../AssetRegistry.json'

const nfTokenContract = TruffleContract(AssetRegistryABI)

export default function (web3) {
  nfTokenContract.setProvider(web3.currentProvider)
  nfTokenContract.web3.eth.defaultAccount = web3.eth.accounts[0]

  return nfTokenContract.deployed()
}
