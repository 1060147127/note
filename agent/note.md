- 流程
    - 1. 概念
    - 2. 练习
    - 3. 前沿

# agent
- 概念
    - Agent（智能体）是能感知环境、自主决策、采取行动以达成目标的实体
    - 定义：能自主规划、调用工具、执行多步任务并观察反馈的智能体，核心是「大模型 + 工具 + 循环」
        - 1. 自主规划：llm拆解任务、制定步骤并决策下一步，而非固定流程

- 任务分解：把复杂目标拆成可执行的子任务，按依赖排序逐步解决
- 思维链（CoT）：让LLM分步推理、显式写出中间过程，提升复杂问题正确率
    - 在提示词中添加一些推理逻辑（或范例），引导llm按流程分步思考，最终得到更准确的答案
    - 思维树（ToT）

- 范式
    - ReAct：让LLM交替进行推理（Thought）和行动（Action），观察结果再推理，循环直到完成
    - Plan-and-Execute
    - Reflection
    - 多智能体协作

- 工具调用
    - Agent 不直接生成最终答案，而是让 LLM 输出结构化调用指令（函数名+参数），由程序执行工具并回传结果
    - 具体实现：
        - Function Calling（OpenAI 等提供的机制）

- 经典架构
    - Single Agent
        - user--->Agent---> llm--->答案
        - 简单问答、信息查询、轻量级任务
    - ReAct
        - 单一llm循环执行“思考-执行-观察”
    - Plan-and-Execute
        - 先计划在执行，必要时重新思考
    - Reflexion 
        - 执行后自我反思、并将失败原因存入记忆，用于重试改进
    - Multi-agent
    - router + skill
    - blackboard
    - graph/workflow
    - ReWOO：规划阶段一次性想好所有工具调用，执行时不再调用大模型推理
    - CodeAct：将行动统一为生成并执行代码，而非逐个调用工具
    - LATS（Language Agent Tree Search）是把蒙特卡洛树搜索（MCTS）引入语言模型智能体的框架
- router
- user 
    ---> Router ---> Agent A/B/C
    ---> Tools ---> MCP/RAG/Memory
    ---> workflow ---> ERP/CRM/MES/数据库

- 如何判断某个环节是不是适合agent
    - 1. 可描述：能写成 SOP，不靠老师傅直觉
    - 2. 可验证：结果能自动判对错（对账、编译、格式校验）
    - 3. 可容错：错了能回滚或有人兜底
    - 4. 工具可达：需要的信息和操作有 API/系统接口
    - 5. 够高频：收益盖过 token 成本与延迟
## 多智能体（MAS）
- 


## 
- 实现可衡量结果与有价值应用
- 明确能力边界、场景路径和商业回报
- 一站式智能体方案
