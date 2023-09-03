export function renderExhibition (data) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} [iconLake - You create, you own!]</title>
  </head>
  <body>
    <h1>${data.name}</h1>
  </body>
  </html>`
}
