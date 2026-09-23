
# 商业分析
  - 人类迈向AI时代需要设计一个大脑
  - 

# 模型
## 国际
### SpaceXAI
#### Grok 4.7：260922

来源：[IT之家 260922](https://m.ithome.com/html/1005494.htm) + 官方对比表。定位：编码 + 知识工作；更大基座 + 更长 RL；难任务更耐久、自我校验与长上下文更强；对 Grok Bot harness 原生训练；文档/演示改进；新安全防护。价格与 Grok 4.6 同档：输入 $2 / 输出 $6（每百万词元）；高速版速度与价格翻倍。已上 Cursor、Grok Build、API。

**基线**：Grok 4.6（表内上代 High 档）。几乎所有「提升」都相对 4.6。

**验证基准**

| 类型 | 基准 | 作用 |
|---|---|---|
| 稿内主打 | CursorBench 4.0 | 长时间编程 / IDE |
| 稿内主打 | GDPval、AA-Briefcase | 专业岗位 / 长时间办公 |
| 稿内安全 | LatchBio 62.4%；HackerBench v0.3 高风险仅 3.3% 放行 | 生安 / 网安双用途 |
| 对比表补充 | DeepSWE、EEBench、Terminal-Bench 4.0、Harvey Legal、HealthBench Pro | 工程 / 电气 / 终端 / 法律 / 临床 |

**对比表分数（橙框 = Grok 4.7；跨行勿比绝对分）**

| 场景 | 基准 | Grok 4.7 | 一眼看 |
|---|---|---:|---|
| 价格 | Input / Output $/MTok | 2 / 6 | 同 4.6；约为 GPT Max 输出价 1/3、Opus Max 1/8 |
| 软件工程 | CursorBench 4.0 | 46.3% | 次于 Opus Max（51.8%），高于 GPT Max |
| 软件工程 | DeepSWE v1.1 | 71.0%* High Effort | 接近 GPT Max（72.7%） |
| 电气 | EEBench | **64.0%** | 表内第一 |
| 长时间办公 | AA-Briefcase v1.1 | 1657 | 接近 Opus（1678） |
| 长时间终端 | Terminal-Bench 4.0 | 38.0% | 弱于 Opus（57.9%）；显著强于 4.6（20.3%） |
| 法律 | Harvey Legal Agent | **19.6%** | 表内第一，远超 GPT/Opus |
| 临床 | HealthBench Pro | 56.7% | 中上；Opus 62.1% 更高 |

**和谁比过 / 算不算对标 SOTA**

- 明确对比：Grok 4.6；营销表含 GPT Sol Max 档、Opus Max 档  
- 稿内多写「同类 / 其他前沿模型」，无完整公开 SOTA 全榜  
- 结论：有抽样对标贵价旗舰，不是完整 SOTA 评测报告  

**记笔记用三句话**

- 特点：长时编程与知识工作、自检、性价比同 4.6  
- 强项：电气、法律；办公与 SWE 接近贵价旗舰  
- 短板：长时间终端、临床推理仍落后 Opus Max 档  

### OpenAI
#### GPT-5.6（Sol / Terra / Luna）：260709

来源：[OpenAI 中文发布页](https://openai.com/zh-Hans-CN/index/gpt-5-6/)。2026-07-09 正式推出；07-30 下调 Terra/Luna 价。三档：旗舰 **Sol**、日常 **Terra**、性价比 **Luna**。主打每 Token 更有用、编程/知识工作/网安/科学；默认高效，`max` 加深推理，`ultra` 默认约 4 智能体并行。可编程工具调用 + Responses API 多智能体（测试中）。设计判断与计算机使用增强；分层安全防护，网安有「受信访问」。已上 ChatGPT、Codex、API。

**价格（$/MTok，稿内标价）**：Sol 5/30；Terra 2.5/15；Luna 1/6。提示词缓存：写入 1.25× 非缓存输入，读取约 9 折。

**基线**：GPT-5.5（主对照）；部分表含 GPT-5.4。

**验证基准（节选）**

| 类型 | 基准 | Sol 代表分 / 说法 |
|---|---|---|
| Agent / 专业 | Agents’ Last Exam、GDPval-AA、Big Finance、管理咨询（内部） | ALE 约 53 分档，称大幅超 Fable 5 |
| 综合 | Artificial Analysis Intelligence Index | ≈Fable 5（差 &lt;1），更省时省钱 |
| 编程 | Coding Agent Index / DeepSWE / Terminal-Bench 2.1 / SWE-Bench Pro | Index **80 称 SOTA**；DeepSWE 72.7%；TB2.1 88.8%（Ultra 91.9%）；SWE-Pro 64.6% |
| 计算机使用 | BrowseComp、OSWorld 2.0、BenchCAD | BrowseComp 等称 SOTA |
| 网安 | ExploitBench、ExploitGym、SEC-Bench Pro | 相对 5.5 大幅提升（放宽防护下测） |
| 学术 / 多模态 | GPQA、FrontierMath、MMMU Pro 等 | 与 Claude/Gemini 同档拉锯 |

**和谁比过 / 算不算对标 SOTA**

- 明确对比：GPT-5.5；Claude Fable 5 / Opus 4.8 / Mythos；Gemini 3.1 Pro / 3.5 Flash  
- 自称 SOTA：Coding Agent Index、DeepSWE、Terminal-Bench 2.1、BrowseComp、Agents’ Last Exam 等  
- **不是全面 SOTA**：SWE-Bench Pro 明显落后 Mythos/Fable（~80% vs Sol 64.6%）；Intelligence Index 与 Fable 5 持平，卖点是效率  

**记笔记用三句话**

- 特点：Sol/Terra/Luna 分档 + max/ultra 按需加力；更省 Token 追前沿  
- 强项：编程智能体指数、终端、DeepSWE、浏览/工具、相对 5.5 全面效率提升  
- 短板：SWE-Bench Pro 仍让 Claude 顶档；网安高能力需受信访问与防护策略  

#### GPT-6 Astra：260903

来源：[观察者网/网易](https://m.163.com/dy/article/L5VRRQDQ051481US.html)、[新华社/中国经济网](http://intl.ce.cn/sjjj/qy/202609/t20260904_3193774.shtml)。GPT-5.6 后约两月的新旗舰；官方自称「迄今最强 / 全球最智能、对齐最好」（第三方有保留）。卖点是 **会用电脑的智能体**：浏览、操作软件、编程、网安与科研，而不只聊天。规格约 **105 万** 上下文、最大输出 **12.8 万**；文本+图像入、文本出；网页/文件搜索、代码执行。API **$10 / $50**（明显高于 5.6 Sol 的 5/30）。先可信访问企业 → 数日内扩 API 与 ChatGPT Plus/Pro/Business/Enterprise，并升 Codex。自称首个 **「关键」级网安能力**；发布前加强防护与限权（此前因安全事件曾放缓前沿节奏，仍按计划推出）。

**基线**：GPT-5.6 Sol。

**验证基准（官方自评为主）**

| 基准 | Astra | 一眼看 |
|---|---:|---|
| FrontierMath Tier 4 | 98% | 自称协助解决长期未决数学题；基准与 OpenAI 关系有争议 |
| ARC-AGI-3 | 99.9% → 标准框架约 62.7% | 自有 Adapter 高分；标准配置大幅回落 |
| ExploitBench | 满分 | 官方网安叙事 |
| Terminal-Bench 4.0 | 57.9% | 高于 Sol；后被 Claude Opus 5.5（66.4%）超过 |
| Agents’ Last Exam | 59.3% | 高于 Sol |
| Terminal-Bench Science / HealthBench Pro | 称新高 | 稿内未给完整对照表 |

**和谁比过 / 算不算对标 SOTA**

- 官方：对标 Sol，多项自称「新最先进」  
- 第三方：Artificial Analysis Intelligence Index v4.1.1 上 Astra max **61** = Sol max，**低于** Claude Fable 5.1 的 **66**  
- 内测观感：未必智能遥遥领先，**环境理解与电脑操作**更被看好  
- 结论：营销 SOTA 很满；独立综合智力未压过 Fable；部分高分依赖自有评测配置  

**记笔记用三句话**

- 特点：贵价 GPT-6 旗舰，主打电脑操作型 Agent；网安达「关键」级并严限权  
- 强项：官方终端/Agent/数学/利用榜相对 Sol 抬升；操作电脑叙事  
- 短板：Intelligence Index 未超 Fable；ARC 等分数缩水；成色待开放后独立复测  

### Anthropic
#### Claude Fable 5.1 / Mythos 5.1：260901

来源：[InfoQ](https://www.infoq.cn/article/K8OwgoWM1gHNi2i4yLkU)（官方约 9/1）。同一底层模型双轨： **Fable 5.1** 面向公众/企业（风险可拦或改路由较弱 Opus）；**Mythos 5.1** 受信计划（网安/生安机构，保留更多原始能力）。叙事：长时 Agent + **可部署性**（缓存价、数据留存、安全误判、企业架构）约占发布一半。科学案例：蛋白设计外实验验证、金星雷达制图、开源模型 GPU Kernel 加速等。企业：**Enterprise Frontier Safeguards**——日志在客户云、客户密钥与审计；Anthropic 自动风控，默认不人工翻客户数据。

**价格（$/MTok）**：标准输入/输出仍 **10 / 50**；缓存读取 **1 → 0.25（-75%）**；缓存写入维持约 12.5。普通负载综合成本约 **-25%**，高度 Agent 化最高约 **-45%**。拉满推理时单任务仍可能更贵（输出 Token 约 1.7×）。上下文 100 万；文本+图像入。

**基线**：Fable 5（主）；多项对照 Opus 5、GPT-5.6 Sol。

**验证基准 / 观察**

| 类型 | 基准或观察 | Fable 5.1 | 一眼看 |
|---|---|---:|---|
| 终端 Agent | Terminal-Bench 4.0 | 55.8% | Mythos（关部分限制）60.9%；安全介入影响分 |
| 科学终端 | Terminal-Bench-Science 0.1 | **52.6%** | Fable 5 24.7%；Opus 5 29%；Sol 22.4%（约翻倍） |
| 知识工作 | GDPval-AA v2 / AA-Briefcase | 1853 / 1694 Elo | 较前代 +130 / +122；相对 Opus 差距不大 |
| 代码评审 | CodeRabbit | 召回接近、精确率↑ | 更克制；耗时约 +49%；High 未必优于 Low |
| 行为叙事 | 百万次级偶发崩溃根因 | — | 少走捷径、追根因（合作方案例） |

安全防护介入时，部分 OSWorld / Automation / 网安生安任务可能记零或由较弱 Opus 代跑。

**和谁比过 / 算不算对标 SOTA**

- 对比：Fable 5、Opus 5、GPT-5.6 Sol；Mythos 为同模高权限形态  
- 相对强：科学终端 Agent；复杂根因/长任务上限；Agent 任务总成本（靠缓存）  
- **不是最便宜通用 SOTA**：单价仍贵；日常小 PR 可能过慢过贵；争夺高价值长任务  

**记笔记用三句话**

- 特点：同模双轨（开放 Fable / 受信 Mythos）+ 缓存大降服务长时 Agent  
- 强项：科学终端翻倍级提升；企业可部署（留存/安全路由）；任务总成本叙事  
- 短板：标准 Token 价未降；max 仍可能更烧；不适合当所有任务的默认便宜模型  

#### Claude Opus 5.5（Claude 5.5 家族首款）：260923

来源：[爱范儿](https://www.ifanr.com/1681629)。Claude 5.5 家族首发；后续还有 Sonnet / Haiku 5.5。定位：长时间编程 Agent + 知识工作主力；官方称多数任务达 **Fable 5.1** 水平。相对 Opus 5：典型任务成本约 **-40%**，输出速度约 **+30%**。100 万上下文、最大输出 12.8 万；思考常开、默认 effort=medium；长任务可上下文压缩。表达更干净、少堆术语。已上 Claude / Claude Code / Platform 与 AWS、GCP、Azure；API：`claude-opus-5-5`；成付费默认模型。安全：外部评估 + 行为审计；越界尝试较 Opus 5 / Mythos 约 **-85%**；生安/网安近 Mythos，多数网安转 Opus 4.8，完整能力需验证用户；preserved thinking、可零数据留存。

**价格（$/MTok）**：输入/输出 **4 / 20**（较 Opus 5 约 -20%）；缓存读取 **0.20**（约 -60%）；Fast mode 最高约 2.5× 速，**8 / 40**。

**基线**：Claude Opus 5（主）；性能叙事对标自家 Fable 5.1。

**验证基准 / 案例**

| 类型 | 基准或案例 | Opus 5.5 | 一眼看 |
|---|---|---:|---|
| 终端 Agent | Terminal-Bench 4.0 | **66.4%** | > GPT-6 Astra 57.9%、Opus 5 52.3% |
| 编程 | FrontierCode v1.1 | 54.4% | 略高于 Astra 53.3% |
| IDE | CursorBench 4.0 | 57.8% | Opus 5 为 46.6% |
| 知识工作 | GDPval-AA v2.1 | **1846 Elo** | > Fable 5.1 1735、Opus 5 1708 |
| 电脑操作 | OSWorld 2.0 | 81.8% | Opus 5 为 74.0% |
| 自动化 | AutomationBench | 40.0% | 略低于 Astra 41.4% |
| 科学终端 | Terminal-Bench-Science 0.1 | 58.7% | 落后 Astra 64.6% |
| 长任务案例 | 大库迁移/审计、HAProxy→Rust、季报/并购文稿 | — | 小时级；较 Opus 5 / Fable 更省时省钱 |

官方提醒：榜差分已难代表真实体验，内部用起来与 Fable 5.1 差距比部分榜更小。

**和谁比过 / 算不算对标 SOTA**

- 明确对比：Opus 5；Fable 5.1；**GPT-6 Astra**；社区另有 Grok 4.7 等创意向实测  
- 相对强：TB4.0、CursorBench、GDPval、OSWorld、多项长时/知识案例  
- 相对弱：AutomationBench、Terminal-Bench-Science；音乐等创意项社区认为可能不如 Grok  
- **不是全榜 SOTA 声明**：卖点是「半代 Opus 摸到 Fable + 降价提速」，竞争转向可全天调用的成本与耐力  

**记笔记用三句话**

- 特点：降价后的长时编程/知识工作主力；接近 Fable、比 Opus 5 更快更便宜  
- 强项：Terminal-Bench 4.0、CursorBench、GDPval、OSWorld、数小时 Agent  
- 短板：部分自动化/科学终端仍逊 Astra；max 档 Token 消耗可能仍高  

## 国内
### 深度求索
#### DeepSeek-V4.1-Flash：260910

来源：官方对比表（蓝框列为该模型）。跨行勿比绝对分；Codeforces 为 Elo，其余多为准确率/%。`*` = 仅 HLE 纯文本子集。

| 能力 | 基准 | 分数 | 一眼看 |
|---|---|---:|---|
| 知识问答 | GPQA Diamond | 90.9 | 很强 |
| 知识问答 | HLE | 36.8（39.1*） | 难题偏难，仍属前沿档 |
| 知识问答 | HLE (w/tools) | 63.9 | 上工具后明显抬分 |
| 编程 | Codeforces | 3921 | 竞赛 Elo，表内前列 |
| 编程 | MathArena Apex | 65.6 | 高难度数学中上 |
| 编程 | Terminal-Bench 2.1 | 90.6 | 终端任务很强 |
| 编程 | Terminal-Bench 3.0 | 30.0 | 更高难版本掉分明显 |
| 编程 | Terminal-Bench 4.0 | 31.2 | 同上 |
| 编程 | DeepSWE v1.1 | 74.2 | 仓库级工程偏强 |
| 编程 | ProgramBench | 20.3 | 相对偏弱 |
| 编程 | NL2Repo-Bench | 65.4 | 听需求改仓库中上 |
| Agent | Automation-Bench | 54.8 | 中等 |
| Agent | Agents' Last Exam | 31.8 | 自主 agent 仍难 |
| Agent | ZeroBench-main (w/tools) | 49.0 | 带工具综合中等 |
| 安全 | CyberGym | — | 未报 |
| 安全 | SEC-Bench Pro | 62.8 | 中上 |
| 安全 | ExploitGym | 15.3 | 偏弱 |
| 视觉 | Chartography | 78.9 | 读图较强 |
| 视觉 | BabyVision (w/tools) | 89.6 | 视觉+工具很强 |

**记笔记用三句话**

- 知识问答：GPQA 高；裸考 HLE 一般，上工具后上去一截  
- 编程：竞赛与 Terminal 2.1 / SWE 强；ProgramBench、Terminal 3/4 一般  
- 推理与 Agent：工具链有增益；纯自主 Agent、Exploit 类仍是短板  

# 数据集

> 下列多为评测基准（benchmark），不是训练语料。同一行比模型；跨行勿直接比绝对分（准确率 / Elo 等量纲不同）。`*` 常表示仅测 HLE 纯文本子集。

## 知识与难题推理
- GPQA Diamond：研究生级理工科问答，题面难靠搜索蒙对，测硬知识与推理
- HLE（Humanity's Last Exam）：极难跨学科综合题，测前沿天花板
- HLE (w/tools)：同上，允许浏览器 / 代码执行等工具

## 数学与竞赛编程
- Codeforces：竞赛编程，常报 Elo / 百分位
- MathArena Apex（或同类数学 apex）：高难度数学解题与证明式推理
- ProgramBench：通用编程能力（不限于竞赛）

## 软件工程与仓库级任务
- DeepSWE / SWE 类：真实仓库修 bug、改功能
- NL2Repo-Bench：自然语言 → 多文件仓库改动
- Terminal-Bench（2.1 / 3.0 / 4.0）：终端多步操作与排错，测 agent 控环境

## 安全相关
- CyberGym：网络安全场景与挑战
- SEC-Bench Pro：漏洞理解、安全编码与分析
- ExploitGym：漏洞利用相关任务（偏攻防评估）

## Agent / 自动化
- Automation-Bench：多步骤自动化能否跑通
- Agents' Last Exam：自主 agent 的规划、决策与抗干扰
- ZeroBench-main (w/tools)：带工具的综合任务求解

## 视觉 / 多模态
- Chartography：图表理解与推理
- BabyVision (w/tools)：视觉问答 / 识别，可带工具

## 专业工作与安全（Grok / GPT 稿常用）
- CursorBench：长时间编程 / IDE 向任务
- GDPval / AA-Briefcase：律师、护士、金融等专业日常工作代理
- EEBench：电气工程
- Harvey Legal Agent：法律 agent
- HealthBench Pro：临床推理
- LatchBio：生物安全相关
- HackerBench：网安双用途提示的放行 / 拒答
- Agents’ Last Exam：长周期专业工作流（55 领域向）
- Artificial Analysis Coding Agent / Intelligence Index：第三方综合指数
- SWE-Bench Pro：仓库级软件工程（公开难榜）
- BrowseComp / OSWorld：网页浏览与桌面计算机使用
- ExploitBench / ExploitGym / SEC-Bench Pro：网安利用与 PoC（常注明放宽防护）
- FrontierCode：前沿编程综合（Claude 5.5 稿）
- Terminal-Bench-Science：科学向终端任务

## 和模型能力维度的对应（便于记笔记）
- 知识问答：GPQA、HLE
- 编程：Codeforces、ProgramBench、DeepSWE、NL2Repo、Terminal-Bench、CursorBench、SWE-Bench Pro、Coding Agent Index、FrontierCode
- 推理：HLE、数学 apex、Agent / Automation（偏工具链推理）
- 专业工作：GDPval、AA-Briefcase、EEBench、Harvey Legal、HealthBench Pro、Agents’ Last Exam
- 安全双用途：LatchBio、HackerBench、ExploitBench、ExploitGym、SEC-Bench Pro
- 计算机使用：BrowseComp、OSWorld
