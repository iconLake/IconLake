import express from "express"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { server } from "./server.js"

const port = 9900

const app = express()
app.use(express.json())

// Store transports for each session type
const transports = {
  streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>
}

// Modern Streamable HTTP endpoint
app.all('/mcp', async (req, res) => {
  // Disable session tracking by setting sessionIdGenerator to undefined  
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  
  // Connect to server and handle the request
  await server.connect(transport);
  await transport.handleRequest(req, res);
})

// Legacy SSE endpoint for older clients
app.get('/sse', async (req, res) => {
  // Create SSE transport for legacy clients
  const transport = new SSEServerTransport('/messages', res)
  transports.sse[transport.sessionId] = transport
  
  res.on("close", () => {
    delete transports.sse[transport.sessionId]
  })
  
  await server.connect(transport)
})

// Legacy message endpoint for older clients
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string
  const transport = transports.sse[sessionId]
  if (transport) {
    await transport.handlePostMessage(req, res, req.body)
  } else {
    res.status(400).send('No transport found for sessionId')
  }
})

app.listen(port, () => {
  console.log(`MCP SSE Server listening on http://127.0.0.1:${port}`)
})
