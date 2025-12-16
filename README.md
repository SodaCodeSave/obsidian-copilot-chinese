<h1 align="center">Copilot for Obsidian</h1>

**注意：此仓库为非官方汉化仓库，遇到问题请去原仓库反馈**

<h2 align="center">
你的第二大脑，终极AI助手
</h2>

<p align="center">
  <img src="https://img.shields.io/github/v/release/logancyang/obsidian-copilot?style=for-the-badge&sort=semver" alt="GitHub release (latest SemVer)">
  <img src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22copilot%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge" alt="Obsidian Downloads">
</p>

<p align="center">
  <a href="https://www.obsidiancopilot.com/en/docs">文档</a> |
  <a href="https://www.youtube.com/@loganhallucinates">YouTube</a> |
  <a href="https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md">报告Bug</a> |
  <a href="https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md">请求功能</a>
</p>

<p align="center">
  <a href="https://obsidian.md/blog/2024-goty-winners/">
    <img src="./images/reward-banner.svg" alt="奖励横幅" width="400"/>
  </a>
</p>

## 是什么

_Copilot for Obsidian_ 是你的库内AI助手，具有基于聊天的库搜索、网页和YouTube支持、强大的上下文处理能力，以及在Obsidian高度可定制工作区中不断扩展的智能代理功能 - 同时将你的数据置于**你的**控制之下。

## 为什么

如今的AI巨头希望**你被困住**：你的数据在他们的服务器上，提示词锁定在他们的模型中，切换成本让你不断付费。当他们更改定价、关闭功能或终止你的账户时，你会失去所有建立的东西。

我们正在构建相反的东西。我们的目标是创建一个没有供应商锁定的可移植智能代理体验。**数据始终属于你**。使用任何你喜欢的LLM。想象一下，一个全新的模型发布了，你在自己的硬件上运行它，它已经了解你（_长期记忆_），知道如何运行你随时间定义的*相同命令和工具*（仅作为markdown文件），并成为你*拥有*的思维伙伴和助手。这是与你一起成长的AI，而不是你被绑架的订阅服务。

这是我们相信的未来。如果你认同这个愿景，请支持这个项目！

## 关键特性

- **🔒 你的数据100%属于你**：本地搜索和存储，如果你使用自托管模型，完全控制你的数据。
- **🧠 自带模型**：使用任何OpenAI兼容或本地模型来发现见解、激发联系并创建内容。
- **🖼️ 多媒体理解**：支持网页、YouTube视频、图像、PDF、EPUB或实时网络搜索，快速获取见解。
- **🔍 智能库搜索**：通过聊天搜索你的库，无需设置。嵌入是可选的。Copilot立即提供结果。
- **✍️ 编辑器和快速命令**：通过聊天与你的写作互动，一键应用更改。
- **🗂️ 项目模式**：基于文件夹和标签创建AI就绪上下文。想象一下NotebookLM，但在你的库内！
- **🤖 代理模式（Plus）**：解锁具有内置工具调用功能的自主代理。无需命令。Copilot在相关时自动触发库、网络搜索或任何其他相关工具。

<p align="center">
  <em>Copilot的代理可以根据你的请求自行调用适当的工具。</em>
</p>
<p align="center">
  <img src="./images/product-ui-screenshot.png" alt="产品UI截图" width="800"/>
</p>

## 目录

- [开始使用](#开始使用)
  - [安装Obsidian Copilot](#安装obsidian-copilot)
  - [设置API密钥](#设置api密钥)
- [使用方法](#使用方法)
  - [免费用户](#免费用户)
  - [Copilot Plus/Believer](#copilot-plusbeliever)
- [需要帮助？](#需要帮助)
- [常见问题](#常见问题)

## Copilot V3 开启新时代 🔥

经过几个月的努力，我们重新设计了代码库，并为我们的智能代理基础设施采用了新的范式。它为更容易添加智能代理工具打开了大门（即将支持MCP）。我们将很快提供新版本的文档。以下是你不能错过的几件新功能！

- 对所有用户：你可以**无需先构建索引**即可开箱即用库搜索（索引仍然可用，但在QA设置中的"语义搜索"切换后是可选的）。
- 对免费用户：从v3.0.0开始，所有用户都可以使用图像支持和聊天上下文菜单！
- 对Plus用户：**自主代理**可用，支持库搜索、网络搜索、YouTube、编辑器，以及即将推出的许多其他工具！从3.1.0开始，**长期记忆**也是代理可以自行使用的工具！

阅读[更新日志](https://github.com/logancyang/obsidian-copilot/releases/tag/3.0.0)。

## 为什么人们喜欢它 ❤️

- _"Copilot是将Obsidian转变为真正第二大脑的缺失环节。我用它来起草包含文本、代码和视觉效果的投资备忘录——所有内容都在一个地方。这是第一个真正统一我搜索、处理、组织和检索知识方式的工具，无需离开Obsidian。通过内置在我的笔记中的AI驱动搜索、组织和推理，它解锁了我否则会错过的见解。我的工作流程比以往任何时候都更快、更深入、更互联——我无法想象没有它工作。"_ - @jasonzhangb，投资者和研究分析师
- _"自从发现Copilot以来，我的写作过程完全改变了。与我自己的文章和思想对话是我几十年来经历过的最令人耳目一新的体验。"_ - Mat QV，作家
- _"Copilot改变了我们的家庭——不仅作为生产力助手，还作为治疗师。我把它介绍给了我不懂技术的妻子Mania，她对女儿即将到来的考试感到压力；在一个小时内，她对自己的心态和下一步行动有了清晰的认识，找到了平静和信心。"_ - @screenfluent，一位慈爱的丈夫

## 开始使用

### 安装Obsidian Copilot

1. 打开 **Obsidian → 设置 → 社区插件**。
2. 关闭 **安全模式**（如果已启用）。
3. 点击 **浏览**，搜索 **"Copilot for Obsidian"**。
4. 点击 **安装**，然后 **启用**。

### 设置API密钥

**免费用户**

1. 转到 **Obsidian → 设置 → Copilot → 基本**，点击 **设置密钥**。
2. 选择你的AI提供商（例如，**OpenRouter、Gemini、OpenAI、Anthropic、Cohere**）并粘贴你的API密钥。**推荐使用OpenRouter**。

**Copilot Plus/Believer**

1. 在你的[仪表板](https://www.obsidiancopilot.com/en/dashboard)上复制你的许可证密钥。_别忘了加入我们精彩的Discord社区！_
2. 转到 **Obsidian → 设置 → Copilot → 基本**，并将密钥粘贴到 **Copilot Plus** 卡片中。

## 使用方法

### 目录

- [免费用户](#免费用户)
  - [聊天模式](#聊天模式-引用笔记并与copilot讨论想法)
  - [库QA模式](#库qa模式-与你的整个库聊天)
  - [命令面板](#copilot的命令面板)
  - [相关笔记](#相关笔记-基于语义相似性和链接的笔记建议)
- [Copilot Plus/Believer](#copilot-plusbeliever)
  - [基于时间的查询](#从特定时间窗口获取精确见解)
  - [代理模式](#代理模式-自主工具调用)
  - [图像理解](#理解你的笔记中的图像)
  - [多源分析](#一个提示-所有来源从pdf视频和网络即时摘要)

### 免费用户

#### **聊天模式：引用笔记并与Copilot讨论想法**

使用 `@` 添加上下文并与你的笔记聊天。

<p align="center">
    <img src="./images/Add-Context.png" alt="聊天模式" width="700">
</p>

询问Copilot：

> _总结 [[Q3回顾]] 并根据 {01-项目} 中的笔记确定Q4的前3个行动项目。_

<p align="center">
    <img src="./images/Chat-Mode.png" alt="聊天模式" width="700">
</p>

#### **库QA模式：与你的整个库聊天**

询问Copilot：

> _我关于AI和SaaS交集的研究中有哪些反复出现的主题？_

<p align="center">
    <img src="./images/Vault-Mode.png" alt="库模式" width="700">
</p>

#### Copilot的命令面板

**将选择添加到聊天上下文**

选择文本并将其添加到上下文。推荐快捷键：`ctrl/cmd + L`

<p align="center">
    <img src="./images/Add-Selection-to-Context.png" alt="将选择添加到上下文" width="700">
</p>

**快速命令**

选择文本并应用操作，无需打开聊天。推荐快捷键：`ctrl/cmd + K`

<p align="center">
    <img src="./images/Quick-Command.png" alt="快速命令" width="700">
</p>

**一键编辑和应用**

选择文本并右键单击进行编辑。

<p align="center">
    <img src="./images/One-Click-Commands.png" alt="一键命令" width="700">
</p>

**创建你的命令**

在 `设置 → Copilot → 命令 → 添加命令` 中创建命令和工作流。

<p align="center">
    <img src="./images/Create-Command.png" alt="创建命令" width="700">
</p>

**聊天中的命令面板**

在聊天窗口中输入 `/` 以使用命令面板。

<p align="center">
    <img src="./images/Prompt-Palette.png" alt="提示面板" width="700">
</p>

#### **相关笔记：基于语义相似性和链接的笔记建议**

当有有用的相关内容和链接时自动出现。

使用它快速引用过去的研究、想法或决定——无需搜索或切换标签。

<p align="center">
    <img src="./images/Relevant-Notes.png" alt="相关笔记" width="700">
</p>

### Copilot Plus/Believer

Copilot Plus带来强大的AI智能代理功能、上下文感知操作和无缝工具集成——旨在提升你在Obsidian中的知识工作。

#### **从特定时间窗口获取精确见解**

在代理模式下，询问copilot：

> _我上周做了什么？_

<p align="center">
    <img src="./images/Time-Based-Queries.png" alt="基于时间的查询" width="700">
</p>

#### **代理模式：自主工具调用**

Copilot的代理会自动调用正确的工具——无需手动命令。只需提问，它就会搜索网络、查询你的库，并无缝整合见解。

在代理模式下询问Copilot：

> _研究网络和我的库，并起草一篇关于AI SaaS入职最佳实践的笔记。_

<p align="center">
    <img src="./images/Agent-Mode.png" alt="代理模式" width="700">
</p>

#### **理解你的笔记中的图像**

Copilot可以分析嵌入在你笔记中的图像——从线框图和图表到截图和照片。根据视觉内容获取详细的反馈、建议和见解。

要求Copilot分析你的线框图：

> _分析 [[UX设计 - 移动应用线框图]] 中的线框图，并就导航流程提出改进建议。_

<p align="center">
    <img src="./images/Note-Image.png" alt="图像理解" width="700">
</p>

#### **一个提示，所有来源——从PDF、视频和网络即时摘要**

在代理模式下，询问Copilot：

> _比较关于[Agent Memory]的信息，来自这个YouTube视频：[URL]、这个PDF [文件] 和 @web[搜索结果]。在你的回复中以要点形式开始你的结论。_

<p align="center">
    <img src="./images/One-Prompt-Every-Source.png" alt="一个提示，所有来源" width="700">
</p>

## **需要帮助？**

- 查看 [文档](https://www.obsidiancopilot.com/en/docs) 了解设置指南、使用方法和高级功能。
- 观看 [YouTube](https://www.youtube.com/@loganhallucinates) 上的教程。
- 如果你遇到bug或有功能想法，请按照以下步骤帮助我们更快地帮助你：
  - 🐛 Bug报告清单
    - ☑️ 报告问题时使用 [bug报告模板](https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md)
    - ☑️ 在Copilot设置 → 高级中启用调试模式以获取更详细的日志
    - ☑️ 打开开发控制台收集错误消息：
      - Mac：Cmd + Option + I
      - Windows：Ctrl + Shift + I
    - ☑️ 关闭所有其他插件，只启用Copilot
    - ☑️ 将相关控制台日志附加到你的报告中
    - ☑️ 在此处提交你的bug报告 [here](https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md)
  - 💡 功能请求清单
    - ☑️ 请求新功能时使用 [功能请求模板](https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md)
    - ☑️ 清晰描述功能、为什么重要以及它将如何帮助
    - ☑️ 在此处提交你的功能请求 [here](https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md)

## **常见问题**

<details>
  <summary><strong>为什么库搜索找不到我的笔记？</strong></summary>

如果你使用的是库QA模式（或Plus中的<code>@vault</code>工具），请尝试以下方法：

- 确保你有一个来自AI模型提供商的可用嵌入模型（例如OpenAI）。观看此视频：[AI模型设置（API密钥）](https://www.youtube.com/watch?v=mzMbiamzOqM)
- 确保你的Copilot索引是最新的。观看此视频：[库模式](https://www.youtube.com/watch?v=hBLMWE8WRFU)
- 如果问题仍然存在，运行 **强制重新索引** 或使用命令面板中的 **列出索引文件** 来检查索引中包含的内容。
- ⚠️ <strong>不要在索引后切换嵌入模型</strong>——这可能会破坏结果。
</details>

<details>
  <summary><strong>为什么我的AI模型返回错误代码429：'Insufficient Quota'？</strong></summary>

最可能的原因是你尚未在所选模型提供商处配置计费——或者你已达到每月配额。例如，OpenAI通常将个人账户限制在每月120美元。要解决：

- ▶️ 观看 "AI模型设置" 视频：[AI模型设置（API密钥）](https://www.youtube.com/watch?v=mzMbiamzOqM)
- 🔍 验证你的OpenAI仪表板中的计费设置
- 💳 如果没有，请添加支付方式
- 📊 检查你的使用情况仪表板是否有任何配额或限制警告

如果你使用的是其他提供商，请参考他们的文档和计费政策了解等效步骤。

</details>

<details>
  <summary><strong>为什么我收到令牌限制错误？</strong></summary>

请参考你的模型提供商的文档了解上下文窗口大小。

⚠️ 如果你在Copilot设置中设置了较大的 <strong>最大令牌限制</strong>，你可能会遇到此错误。

- <strong>最大令牌数</strong> 指的是 <em>完成令牌</em>，而不是输入令牌。
- 更高的输出令牌限制意味着输入空间更少！

🧠 Copilot命令的幕后提示也会消耗令牌，因此：

- 保持你的消息长度简短
- 设置合理的最大令牌值以避免达到上限

💡 对于无限上下文的QA，请在下拉菜单中切换到 <strong>库QA</strong> 模式（需要Copilot v2.1.0+）。

</details>

## **🙏 感谢**

如果你认同构建最强大的第二大脑AI代理的愿景，请考虑 [赞助这个项目](https://github.com/sponsors/logancyang) 或请我喝杯咖啡。通过在Twitter/X、Reddit或你喜欢的平台上分享Copilot for Obsidian来帮助传播消息！

<p align="center">
  <img src="https://camo.githubusercontent.com/7b8f7343bfc6e3c65c7901846637b603fd812f1a5f768d8b0572558bde859eb9/68747470733a2f2f63646e2e6275796d6561636f666665652e636f6d2f627574746f6e732f76322f64656661756c742d79656c6c6f772e706e67" alt="BuyMeACoffee" width="200">
</p>

**致谢**

特别感谢我们的顶级赞助商：@mikelaaron, @pedramamini, @Arlorean, @dashinja, @azagore, @MTGMAD, @gpythomas, @emaynard, @scmarinelli, @borthwick, @adamhill, @gluecode, @rusi, @timgrote, @JiaruiYu-Consilium, @ddocta, @AMOz1, @chchwy, @pborenstein, @GitTom, @kazukgw, @mjluser1, @joesfer, @rwaal, @turnoutnow-harpreet, @dreznicek, @xrise-informatik, @jeremygentles, @ZhengRui, @bfoujols, @jsmith0475, @pagiaddlemon, @sebbyyyywebbyyy, @royschwartz2, @vikram11, @amiable-dev, @khalidhalim, @DrJsPBs, @chishaku, @Andrea18500, @shayonpal, @rhm2k, @snorcup, @JohnBub, @obstinatelark, @jonashaefele, @vishnu2kmohan

## **Copilot Plus 披露**

Copilot Plus是Brevilabs LLC的高级产品，与Obsidian无关。它提供了强大的AI智能代理与Obsidian的集成。请查看我们的网站 [obsidiancopilot.com](https://obsidiancopilot.com/) 了解更多详情！

- 需要账户和付款才能完全访问。
- Copilot Plus需要网络使用来支持AI代理。
- **隐私与数据处理**:
  - **免费层级**: 你的消息和笔记仅发送到你配置的LLM提供商（OpenAI、Anthropic、Google等）。不会发送到Brevilabs服务器。
  - **Plus层级**: 消息发送到你配置的LLM提供商。文件转换（PDF、DOCX、EPUB、图像等）仅在你通过`@`命令明确触发这些功能时由Brevilabs服务器处理。
  - **处理与保留**: 我们处理你的数据以提供你请求的功能，然后丢弃它。处理后，我们的服务器上不会保留任何消息内容、文件上传或文档。
  - **用户ID**: 随机生成的UUID随Plus API请求一起发送，用于服务交付（防止许可证滥用、速率限制），但不用于用户跟踪、分析或统计。
- 请查看网站上的隐私政策了解更多详情。
- Copilot插件的前端代码是完全开源的。然而，支持AI代理的后端代码是闭源和专有的。
- 如果你在购买后14天内对产品不满意，我们提供全额退款，无需任何问题。

## **作者**

Brevilabs团队 | 电子邮件：logan@brevilabs.com | X/Twitter：[@logancyang](https://twitter.com/logancyang)
