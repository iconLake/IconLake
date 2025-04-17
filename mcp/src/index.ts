#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { getEnvs, query, upload } from "./utils.js"

const server = new McpServer({
  name: "iconLake MCP server",
  version: "0.1.3"
})

server.tool(
  "icon_add",
  "Add a image to a iconLake project. `projectId`, `name`, `desc` and `code` are required. `code` is a unique identifier, without spaces, and can be an English name or a link. `img` is a image of data URL format. `svg` is a SVG image. When the type of project is 2, `img` is required. When the type of project is 1, `svg` is required.",
  {
    projectId: z.string(),
    name: z.string(),
    desc: z.string(),
    code: z.string(),
    img: z.string().optional(),
    svg: z.string().optional()
  },
  async ({ projectId, name, desc, code, img, svg }) => {
    const fileRes = await upload({ projectId, img, svg })
    const body = JSON.stringify({
      projectId,
      icons: [{
        name,
        desc,
        code,
        img: img ? {
          url: fileRes.url,
        } : undefined,
        svg: svg ? {
          url: fileRes.url
        } : undefined
      }]
    })
    const res = await query('/api/project/icon/add', {
      method: 'POST',
      body
    })
    if (res.error) {
      throw new Error(res.error)
    }
    return {
      content: [{ type: "text", text: 'Icon is added successfully.' }]
    }
  }
)

server.tool(
  "project_list",
  'Return a list of iconLake projects. Project type of 1 is SVG, project type of 2 is image.',
  async () => {
    const list = await query('/api/project/list')
    return {
      content: [{
        type: "text",
        text: JSON.stringify(list, null, 2)
      }]
    }
  }
)

async function main() {
  await getEnvs()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
