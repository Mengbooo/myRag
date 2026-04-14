# RAG MVP 项目设计

## 概述

构建一个最小可用的 RAG（检索增强生成）应用，用于处理个人文档并提供智能问答和搜索功能。

## 目标

- 学习 AI/LLM 应用开发
- 产出可用的知识库工具
- 积累项目经验

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js + React | 前后端统一 JS/TS |
| 后端 | Next.js API Routes | 无需单独后端服务 |
| LLM | MiniMax API | 文本生成 |
| Embedding | MiniMax API | 向量嵌入 |
| 向量数据库 | Pinecone | 云端向量存储和检索 |

## 架构

```
┌─────────────────────────────────────────────┐
│                Next.js App                   │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │ 上传文档  │  │ 对话界面  │  │  搜索界面    │ │
│  └────┬─────┘  └────┬─────┘  └──────┬──────┘ │
│       │             │               │         │
│  ┌────▼─────────────▼───────────────▼────┐  │
│  │           API Routes (后端)            │  │
│  └────┬─────────────┬───────────────┬────┘  │
└───────┼─────────────┼───────────────┼───────┘
        │             │               │
        ▼             ▼               ▼
┌───────────┐   ┌──────────┐   ┌──────────┐
│ MiniMax   │   │  MiniMax │   │ Pinecone │
│ Embedding │   │   LLM    │   │ (Vector) │
└───────────┘   └──────────┘   └──────────┘
```

## 核心流程

### 文档处理（上传时）

1. 用户上传文档（Markdown/TXT）
2. 文本分块（chunking）- 按段落或固定长度
3. 调用 MiniMax Embedding 生成向量
4. 存储向量到 Pinecone（包含原始文本和元数据）

### 对话问答流程

1. 用户提问
2. 将问题转换为向量（MiniMax Embedding）
3. Pinecone 检索最相关的 Top-K 文档块
4. 将相关文档块 + 问题构建 Prompt
5. 调用 MiniMax LLM 生成答案
6. 返回答案及引用来源

### 搜索流程

1. 用户输入关键词
2. 转换为向量
3. Pinecone 检索相关文档
4. 返回匹配的文档列表

## 功能范围

### MVP 必须有

- 文档上传（支持 .md, .txt）
- 文档分块处理
- 对话问答界面
- 关键词搜索界面
- 答案引用来源显示

### 暂不做（后续迭代）

- 复杂文件格式（PDF、Word、Excel）
- 用户认证系统
- 多 index 管理
- 文档更新/删除
- 对话历史保存

## API 设计

### POST /api/upload

上传文档并处理

Request:
```
FormData: {
  file: File (md/txt)
}
```

Response:
```
{
  success: boolean,
  chunkCount: number,
  message: string
}
```

### POST /api/chat

对话问答

Request:
```
{
  question: string
}
```

Response:
```
{
  answer: string,
  sources: Array<{
    text: string,
    score: number,
    metadata: object
  }>
}
```

### POST /api/search

文档搜索

Request:
```
{
  query: string,
  topK?: number
}
```

Response:
```
{
  results: Array<{
    text: string,
    score: number,
    metadata: object
  }>
}
```

## 数据模型

### Pinecone Index Schema

```
Namespace: default
Vector Dimensions: 1024 (MiniMax embedding dimension)

Metadata:
  - text: string (原始文本块)
  - source: string (文件来源)
  - chunkIndex: number (块序号)
  - createdAt: string (时间戳)
```

## 项目结构

```
myRag/
├── app/
│   ├── page.tsx           # 首页（上传入口）
│   ├── chat/
│   │   └── page.tsx      # 对话页面
│   ├── search/
│   │   └── page.tsx      # 搜索页面
│   └── api/
│       ├── upload/
│       │   └── route.ts
│       ├── chat/
│       │   └── route.ts
│       └── search/
│           └── route.ts
├── components/
│   ├── Upload.tsx         # 上传组件
│   ├── Chat.tsx          # 对话组件
│   └── Search.tsx        # 搜索组件
├── lib/
│   ├── pinecone.ts       # Pinecone 客户端
│   ├── minimax.ts        # MiniMax API 封装
│   └── chunk.ts          # 文本分块工具
├── package.json
└── .env.local             # 环境变量
```

## 环境变量

```
PINECONE_API_KEY=xxx
PINECONE_INDEX_NAME=my-rag

MINIMAX_API_KEY=xxx
MINIMAX_EMBEDDING_MODEL=embo-01
MINIMAX_LLM_MODEL=abab6.5s-chat
```

## 下一步

1. 初始化 Next.js 项目
2. 配置环境变量
3. 实现 Pinecone 连接
4. 实现 MiniMax API 封装
5. 实现文本分块
6. 实现上传 API
7. 实现对话 API
8. 实现搜索 API
9. 开发前端界面
10. 测试完整流程
