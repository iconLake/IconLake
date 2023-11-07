import { getConfig } from '../../config/index.js'

const config = getConfig()

export async function renderProject (req, res) {
  const [project, nfts] = await Promise.all([
    fetch(
      `${config.blockchain.public.lcd}/iconlake/icon/class?id=${req.params.projectId}`
    ).then((res) => res.json()).then(res => res.class),
    fetch(
      `${config.blockchain.public.lcd}/iconlake/icon/nfts?class_id=${req.params.projectId}`
    ).then((res) => res.json())
  ])
  console.log(project, nfts)
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <meta name="description" content="${project.description}">
  </head>
  <body>
    <h1>${project.name}</h1>
    <h2>${project.description}</h2>
    <h3>${project.data.author}</h3>
    <ul>
      ${nfts.nfts.map((nft) => `<li><h4><a href="/exhibition/${req.params.projectId}/${nft.id}">${nft.data.name}</a></h4><h5>${nft.data.description}</h5></li>`).join('')}
    </ul>
  </body>
  </html>`)
}
