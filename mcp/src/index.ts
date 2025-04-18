#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { getEnvs } from "./utils.js"
import { server } from "./server.js"

async function main() {
  await getEnvs()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err) => {
  console.error(err.message || err)
})
