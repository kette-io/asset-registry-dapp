import nfToken from '@/contracts/nfTokenFactory'

export default async function (tokenId, web3) {
  var instance = await nfToken(web3)

  const uniqueId = await instance.getUniqueIdForIndex(tokenId);
  console.log(uniqueId)
  const response = await instance.getToken(uniqueId);

  return [
    response[0].toString(),
    response[1].toString()
  ]
}

