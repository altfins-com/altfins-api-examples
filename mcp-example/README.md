# altFINS MCP Server — Code Examples

Connect to the [altFINS MCP Server](https://mcp.altfins.com/mcp) programmatically using Python, TypeScript, or Java (LangChain4j).

These examples demonstrate how to connect to the altFINS MCP Server, discover available tools, and call them to retrieve real-time crypto market data, technical analysis, news, and more.

## Prerequisites

- An altFINS API key — [Get your API key here](https://altfins.com/knowledge-base/how-to-create-an-altfins-api-key-step-by-step-guide/)
- The MCP server endpoint: `https://mcp.altfins.com/mcp`
- Authentication header: `X-Api-Key: YOUR_API_KEY`

---

## Python

### Installation

```bash
pip install mcp httpx
```

### Basic Example — Connect & List Tools

```python
import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp"
ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY"  # Replace with your key


async def main():
    headers = {"X-Api-Key": ALTFINS_API_KEY}

    async with streamablehttp_client(ALTFINS_MCP_URL, headers=headers) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # List all available tools
            tools = await session.list_tools()
            print("Available tools:")
            for tool in tools.tools:
                print(f"  - {tool.name}: {tool.description[:80]}...")

            # Call the screener tool — find top 5 coins by market cap
            result = await session.call_tool(
                "screener_getAltfinsScreenerData",
                arguments={
                    "size": 5,
                    "sortField": "MARKET_CAP",
                    "sortDirection": "DESC",
                    "displayTypes": ["MARKET_CAP", "RSI14", "SHORT_TERM_TREND"],
                    "coinTypeFilter": "REGULAR",
                },
            )

            print("\nTop 5 coins by market cap:")
            for item in result.content:
                print(item.text)


asyncio.run(main())
```

### Example — Get Technical Analysis for BTC

```python
import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp"
ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY"


async def get_btc_analysis():
    headers = {"X-Api-Key": ALTFINS_API_KEY}

    async with streamablehttp_client(ALTFINS_MCP_URL, headers=headers) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # Get curated trade setup for BTC
            result = await session.call_tool(
                "technicalAnalysis_getTechnicalAnalysisData",
                arguments={"symbol": "BTC"},
            )

            for item in result.content:
                print(item.text)


asyncio.run(get_btc_analysis())
```

### Example — Get Latest Crypto News

```python
import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession

ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp"
ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY"


async def get_crypto_news():
    headers = {"X-Api-Key": ALTFINS_API_KEY}

    async with streamablehttp_client(ALTFINS_MCP_URL, headers=headers) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # Search for recent Ethereum news
            result = await session.call_tool(
                "news_getCryptoNewsMessages",
                arguments={
                    "assetSymbolsKeywords": "ETH",
                    "from": "last 7 days",
                    "size": 5,
                },
            )

            for item in result.content:
                print(item.text)


asyncio.run(get_crypto_news())
```

---

## TypeScript

### Installation

```bash
npm install @modelcontextprotocol/sdk
```

### Basic Example — Connect & List Tools

```typescript
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp";
const ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY"; // Replace with your key

async function main() {
  const transport = new StreamableHTTPClientTransport(
    new URL(ALTFINS_MCP_URL),
    {
      requestInit: {
        headers: {
          "X-Api-Key": ALTFINS_API_KEY,
        },
      },
    }
  );

  const client = new Client({
    name: "altfins-example",
    version: "1.0.0",
  });

  await client.connect(transport);

  // List all available tools
  const tools = await client.listTools();
  console.log("Available tools:");
  for (const tool of tools.tools) {
    console.log(`  - ${tool.name}: ${tool.description?.slice(0, 80)}...`);
  }

  // Call the screener — find oversold coins (RSI < 30)
  const result = await client.callTool({
    name: "screener_getAltfinsScreenerData",
    arguments: {
      size: 10,
      sortField: "MARKET_CAP",
      sortDirection: "DESC",
      coinTypeFilter: "REGULAR",
      numericFilters: [
        { numericFilterType: "RSI14", gteFilter: 0, lteFilter: 30 },
      ],
      displayTypes: ["RSI14", "MARKET_CAP", "PRICE_CHANGE_1D"],
    },
  });

  console.log("\nOversold coins (RSI < 30):");
  for (const item of result.content as Array<{ type: string; text: string }>) {
    if (item.type === "text") {
      console.log(item.text);
    }
  }

  await client.close();
}

main().catch(console.error);
```

### Example — Get OHLCV Price History

```typescript
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp";
const ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY";

async function getOhlcvHistory() {
  const transport = new StreamableHTTPClientTransport(
    new URL(ALTFINS_MCP_URL),
    {
      requestInit: {
        headers: { "X-Api-Key": ALTFINS_API_KEY },
      },
    }
  );

  const client = new Client({
    name: "altfins-ohlcv-example",
    version: "1.0.0",
  });

  await client.connect(transport);

  // Get BTC daily candles for the last 30 days
  const result = await client.callTool({
    name: "ohlc_getHistoryData",
    arguments: {
      symbol: "BTC",
      from: "last 30 days",
      to: "today",
      timeInterval: "DAILY",
      size: 30,
      sortDirection: "ASC",
    },
  });

  console.log("BTC OHLCV — Last 30 days:");
  for (const item of result.content as Array<{ type: string; text: string }>) {
    if (item.type === "text") {
      console.log(item.text);
    }
  }

  await client.close();
}

getOhlcvHistory().catch(console.error);
```

### Example — Get Calendar Events

```typescript
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const ALTFINS_MCP_URL = "https://mcp.altfins.com/mcp";
const ALTFINS_API_KEY = "YOUR_ALTFINS_API_KEY";

async function getUpcomingEvents() {
  const transport = new StreamableHTTPClientTransport(
    new URL(ALTFINS_MCP_URL),
    {
      requestInit: {
        headers: { "X-Api-Key": ALTFINS_API_KEY },
      },
    }
  );

  const client = new Client({
    name: "altfins-events-example",
    version: "1.0.0",
  });

  await client.connect(transport);

  // Get upcoming SOL events this week
  const result = await client.callTool({
    name: "getCryptoCalendarEvents",
    arguments: {
      assetSymbols: "SOL",
      eventFrom: "today",
      eventTo: "this week",
      size: 10,
    },
  });

  console.log("Upcoming SOL events:");
  for (const item of result.content as Array<{ type: string; text: string }>) {
    if (item.type === "text") {
      console.log(item.text);
    }
  }

  await client.close();
}

getUpcomingEvents().catch(console.error);
```

---

## Java (LangChain4j)

### Maven Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-mcp</artifactId>
        <version>1.7.1-beta14</version>
    </dependency>
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>
        <version>1.7.1-beta14</version>
    </dependency>
    <!-- or use any other LLM provider supported by LangChain4j -->
</dependencies>
```

### Gradle Dependencies

```groovy
implementation 'dev.langchain4j:langchain4j-mcp:1.7.1-beta14'
implementation 'dev.langchain4j:langchain4j-open-ai-spring-boot-starter:1.7.1-beta14'
```

### Basic Example — Connect & Use Tools with an AI Agent

```java
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.http.StreamableHttpMcpTransport;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolProvider;

import java.time.Duration;
import java.util.Map;

public class AltFinsMcpExample {

    // Define your AI assistant interface
    interface CryptoAnalyst {
        String chat(String userMessage);
    }

    public static void main(String[] args) {

        String altfinsApiKey = "YOUR_ALTFINS_API_KEY"; // Replace with your key
        String openaiApiKey = "YOUR_OPENAI_API_KEY";   // Or use any other LLM

        // 1. Create the MCP transport with API key authentication
        StreamableHttpMcpTransport transport = new StreamableHttpMcpTransport.Builder()
                .url("https://mcp.altfins.com/mcp")
                .timeout(Duration.ofSeconds(60))
                .customHeaders(Map.of("X-Api-Key", altfinsApiKey))
                .logRequests(true)
                .logResponses(true)
                .build();

        // 2. Create the MCP client
        McpClient mcpClient = new DefaultMcpClient.Builder()
                .transport(transport)
                .build();

        // 3. Create the tool provider from the MCP client
        ToolProvider toolProvider = McpToolProvider.builder()
                .mcpClients(mcpClient)
                .build();

        // 4. Create the LLM (using OpenAI here, but any LangChain4j model works)
        ChatModel chatModel = OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName("gpt-4o")
                .build();

        // 5. Build the AI agent with MCP tools
        CryptoAnalyst analyst = AiServices.builder(CryptoAnalyst.class)
                .chatModel(chatModel)
                .toolProvider(toolProvider)
                .build();

        // 6. Ask questions — the agent will automatically use altFINS MCP tools
        System.out.println("=== Technical Analysis ===");
        String taResult = analyst.chat(
            "Give me a complete technical analysis of BTC"
        );
        System.out.println(taResult);

        System.out.println("\n=== Screener ===");
        String screenerResult = analyst.chat(
            "Find the top 5 AI coins with bullish momentum sorted by market cap"
        );
        System.out.println(screenerResult);

        System.out.println("\n=== News ===");
        String newsResult = analyst.chat(
            "What are the latest crypto news about Ethereum?"
        );
        System.out.println(newsResult);

        // Clean up
        mcpClient.close();
    }
}
```

### Example — Direct Tool Call (without AI agent)

```java
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.http.StreamableHttpMcpTransport;
import dev.langchain4j.agent.tool.ToolSpecification;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class AltFinsDirectToolCall {

    public static void main(String[] args) {

        String altfinsApiKey = "YOUR_ALTFINS_API_KEY";

        // Create transport and client
        StreamableHttpMcpTransport transport = new StreamableHttpMcpTransport.Builder()
                .url("https://mcp.altfins.com/mcp")
                .timeout(Duration.ofSeconds(60))
                .customHeaders(Map.of("X-Api-Key", altfinsApiKey))
                .build();

        McpClient mcpClient = new DefaultMcpClient.Builder()
                .transport(transport)
                .build();

        // List available tools
        List<ToolSpecification> tools = mcpClient.listTools();
        System.out.println("Available tools:");
        for (ToolSpecification tool : tools) {
            System.out.println("  - " + tool.name() + ": "
                + tool.description().substring(0, Math.min(80, tool.description().length()))
                + "...");
        }

        // Call a tool directly
        String result = mcpClient.executeTool(
            "ohlc_getLatestData",
            Map.of(
                "symbols", "BTC,ETH,SOL",
                "timeInterval", "DAILY"
            )
        );
        System.out.println("\nLatest OHLCV for BTC, ETH, SOL:");
        System.out.println(result);

        mcpClient.close();
    }
}
```

---

## Available MCP Tools

Once connected, the following tools are available:

| Tool | Description |
|------|-------------|
| `screener_getAltfinsScreenerData` | Screen and filter crypto assets by technical indicators, trends, patterns, categories, exchanges |
| `technicalAnalysis_getTechnicalAnalysisData` | Get curated trade setups and professional analyst views |
| `ohlc_getLatestData` | Get latest OHLCV price candles for one or more symbols |
| `ohlc_getHistoryData` | Get historical OHLCV candle data over a time range |
| `analytics_getHistoryData` | Get historical time-series data for any technical indicator |
| `analytics_getAllLatestHistoryData` | Get the most recent value of a specific indicator |
| `analytics_getAnalyticsTypes` | List all available analytics types |
| `screener_getAltfinsScreenerDataTypes` | List all available screener filter/display types |
| `news_getCryptoNewsMessages` | Search and filter crypto news articles |
| `news_getCryptoNewsSources` | List available crypto news sources |
| `getCryptoCalendarEvents` | Search upcoming crypto events (AMAs, listings, airdrops, etc.) |
| `getUserPortfolio` | Get the user's connected crypto portfolio |

---

## Links

- **altFINS Platform:** [altfins.com](https://altfins.com)
- **Get API Key:** [Step-by-step guide](https://altfins.com/knowledge-base/how-to-create-an-altfins-api-key-step-by-step-guide/)
- **MCP Server Documentation:** [altFINS MCP Docs](https://altfins.com/crypto-market-and-analytical-data-api/documentation/mcp-server)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io/)

---

## License

These code examples are provided as-is for integration with the altFINS MCP Server. Use of the altFINS API is subject to [altFINS Terms of Service](https://altfins.com/terms-conditions/).
