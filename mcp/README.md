# iconLake MCP Server

Welcome to the iconLake MCP Server. This server is designed to handle requests for the Model Context Protocol (MCP) using the iconLake service.

## Getting Started

### Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "iconlake": {
      "command": "npx",
      "args": [
        "-y",
        "@iconlake/mcp"
      ],
      "env": {
        "ICONLAKE_ENDPOINT": "https://iconlake.com",
        "ICONLAKE_ACCESS_KEY": ""
      }
    }
  }
}
```

### Configuration

The server configuration is defined in `claude_desktop_config.json`. Ensure the following environment variables are set correctly:

- `ICONLAKE_ENDPOINT`: The endpoint for the iconLake server.
- `ICONLAKE_ACCESS_KEY`: Your access key for authentication. You can get it from here(<https://iconlake.com/manage/user/setting/bind>).
