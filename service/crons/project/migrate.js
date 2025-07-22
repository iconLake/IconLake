import { getConfig } from '../../config/index.js'

const config = getConfig()

export async function migrate (project) {
  const len = project.icons.length
  let updateNum = 0
  let nfts
  for (let i = 0; i < len; i++) {
    const icon = project.icons[i]
    if (!icon.txHash) {
      continue
    }
    if (!nfts) {
      const res = await fetch(`${config.blockchain.public.lcd}/iconlake/icon/nfts?class_id=${project._id}`).then(res => res.json())
      nfts = res.nfts
      if (!nfts || nfts.length === 0) {
        continue
      }
    }
    const url = icon.svg?.url || icon.img?.url
    const nft = nfts.find(n => {
      return n.uri.substr(-url.length) === url
    })
    if (!nft) {
      continue
    }
    icon.blockchain = {
      txHash: icon.txHash,
      height: 0,
      classId: nft.class_id,
      nftId: nft.id
    }
    icon.txHash = undefined
    updateNum++
  }
  if (updateNum === 0) {
    return
  }
  await project.save()
  console.log(`migrate project ${project._id} ${updateNum} icons`)
}
