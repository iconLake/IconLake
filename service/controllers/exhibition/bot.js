import { getConfig } from '../../config/index.js'

const config = getConfig()

export async function renderProject (req, res) {
  const [project, nfts] = await Promise.all([
    fetch(
      `${config.blockchain.public.lcd}/iconlake/icon/class?id=${req.params.projectId}`
    ).then((res) => res.json()).then(res => res.class).catch(console.error),
    fetch(
      `${config.blockchain.public.lcd}/iconlake/icon/nfts?class_id=${req.params.projectId}`
    ).then((res) => res.json()).catch(console.error)
  ])
  if (!project || !nfts || !nfts.nfts || !nfts.nfts.length) {
    return res.status(404).end()
  }
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <meta name="description" content="${project.description}">
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${project.name}" />
    <meta property="og:description" content="${project.description}" />
    <meta property="og:image" content="${project.uri}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${project.name}" />
    <meta name="twitter:description" content="${project.description}" />
    <meta name="twitter:image" content="${project.uri}" />
  </head>
  <body>
    <img src="${project.uri}" alt="${project.name}">
    <h1>${project.name}</h1>
    <h2>${project.description}</h2>
    <h3>${project.data.author}</h3>
    <ul>
      ${nfts.nfts.map((nft) => `<li><h4><a href="/exhibition/${req.params.projectId}/${nft.id}">${nft.data.name}</a></h4><h5>${nft.data.description}</h5></li>`).join('')}
    </ul>
  </body>
  </html>`)
}

export async function renderNft (req, res) {
  const nft = await fetch(
    `${config.blockchain.public.lcd}/iconlake/icon/nft?class_id=${req.params.projectId}&id=${req.params.nftId}`
  ).then((res) => res.json()).then(res => res.nft).catch(console.error)
  if (!nft) {
    return res.status(404).end()
  }
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nft.data.name}</title>
    <meta name="description" content="${nft.data.description}">
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${nft.data.name}" />
    <meta property="og:description" content="${nft.data.description}" />
    <meta property="og:image" content="${nft.uri}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${nft.data.name}" />
    <meta name="twitter:description" content="${nft.data.description}" />
    <meta name="twitter:image" content="${nft.uri}" />
  </head>
  <body>
    <img src="${nft.uri}" alt="${nft.data.name}">
    <h1>${nft.data.name}</h1>
    <h2>${nft.data.description}</h2>
    <h3>${nft.data.author}</h3>
  </body>
  </html>`)
}

export async function renderCreator (req, res) {
  const creator = await fetch(
    `${config.blockchain.public.lcd}/iconlake/icon/creator/${req.params.address}`
  ).then((res) => res.json()).then(res => res.creator).catch(console.error)
  if (!creator) {
    return res.status(404).end()
  }
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${creator.name}</title>
    <meta name="description" content="${creator.description}">
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${creator.name}" />
    <meta property="og:description" content="${creator.description}" />
    <meta property="og:image" content="${creator.avatar}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${creator.name}" />
    <meta name="twitter:description" content="${creator.description}" />
    <meta name="twitter:image" content="${creator.avatar}" />
  </head>
  <body>
    <img src="${creator.avatar}" alt="${creator.name}">
    <h1>${creator.name}</h1>
    <h2>${creator.description}</h2>
    <h3>${creator.address}</h3>
  </body>
  </html>`)
}
