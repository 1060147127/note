# fastapi
- 介绍：python异步web框架，基于类型注解自动生成接口文档与参数校验，高性能、易写
- Pydantic：Python 数据校验与序列化库，用类型注解定义模型，自动校验、转换数据。FastAPI 用它做请求体校验
- 参数校验：
    - BaseModel：用于数据模型（含请求/响应/schema）
    - Field：为Pydantic 模型字段添加元数据与校验规则，如默认值、范围、长度、正则等

# 服务器
- 能提供某种服务的东西都叫服务器，软件硬件都可以


- 常见服务器
    - 1. Web/HTTP服务器---收 HTTP 请求，回 HTML/JSON/文件等---Nginx、Apache、IIS、Caddy、Uvicorn
    - 2. 应用服务器---跑业务代码（常和 Web 层叠在一起）---广义上 FastAPI 进程；Java 的 Tomcat；.NET Kestrel
    - 3. 数据库服务器---存取结构化数据---MySQL、PostgreSQL、SQL Server
    - 4. 缓存服务器---高速键值、会话---Redis、Memcached
    - 5. 文件 / 对象存储---存大文件、图片---MinIO、S3、NAS
    - 6. 邮件服务器---收发邮件---Postfix、Exchange
    - 7. DNS 服务器---域名 → IP---BIND、云 DNS
    - 8. 代理 / 网关---转发、负载均衡、鉴权---Nginx、Envoy、API Gateway
    - 9. 游戏 / 实时服务器---长连接、帧同步等---自研 TCP/UDP 服务
    - 10. AI / 推理服务器---跑模型推理 API---vLLM、自建 GPU 服务

- 常见的HTTP服务器（按HTTP协议说话的程序）
    - 特征
        - 1. 监听TCP端口（80、443、8000）
        - 2. 读请求行、Header、Body
        - 3. 决定怎么响应（自己处理、或转给别人）
        - 4. 写回状态码、Header、Body
    - 分类
        - 1. 通用/反向代理型（很强、常放在最外层）
            - 1. Nginx、Caddy、Apache HTTP Server、IIS
            - 2. 擅长：静态文件、HTTPS、反向代理、负载均衡、限流
            - 3. 也可以直接当「网站服务器」吐 HTML/图片
        - 2. 语言运行时里的应用服务器（跑你的代码）
            - 1. Python：Uvicorn、Gunicorn、Hypercorn、Waitress
            - 2. Node：内置 http、或 Express 外面的进程管理
            - 3. Go：net/http 自己就能当服务器
            - 4. Java：Tomcat、Jetty、Undertow
            - 5. .NET：Kestrel
        - 3. 开发用内置服务器
            - 各框架自带的dev server（方便，生产通常换成上面那些）

- 分类
    - 机器
        - 一台或一堆开着的电脑：阿里云ECS、192.168.3.222
    - 软件/角色
        - 提供某种服务的程序：听端口、应答请求。Uvicorn、Nginx、MySQL、Redis

# uvicorn
- 概念
    - ASGI web服务器；专门用来跑python异步web应用（FastAPI、Starlette、Django ASGI）；监听端口
    - python web应用本身不直接监听端口，而是实现某种【接口约定】，让服务器去跑
- 职责
    - 1. 监听端口
    - 2. 解析HTTP/WebSocket
    - 3. 按ASGI协议调用定义好的app
    - 4. 把响应返回给客户端
    - 5. （可选）热重载、多worker、HTTP/2、SSL等

        ```
        输入                                          uvicorn                              输出
        ────                                          ───────                              ────

        ① CLI 参数 ─────────────────────────────────┐
           uvicorn app.main:app                     │
                   ↑ 导入路径                       │
                   --host 0.0.0.0 --port 8000       │
                   ↑ 监听                           │
                   --workers 1                      │
                   ↑ 进程数                         │
                   --log-level info --access-log    │
                   ↑ 日志级别 / 访问日志            │
                                                    │
        ② ASGI 应用对象 ────────────────────────────┤
           app.main:app = import app.main           │
                                                    │     ┌────────────┐
        ③ 网络输入 ─────────────────────────────────┼────►│  uvicorn   │────► ① HTTP 响应 ──► nginx ──► 客户端
           nginx → TCP 连接 + HTTP 报文             │     │            │
                                                    │     │  跑 ASGI   │────► ② 日志 (access+error)
        ④ 环境（环境变量 / 工作目录等）──────────────┘     │  app       │         stdout/stderr
                                                          │            │           → Docker 收走
                                                          │            │           → docker logs / Makefile logs-app
                                                          │            │
                                                          │            │────► ③ 进程状态 / 退出码 ──► Docker
                                                          │            │         （决定 restart: always 要不要拉起）
                                                          │            │
                                                          └─────┬──────┘
                                                                │
                                                                └────► ④ /health 可达性
                                                                         Dockerfile:60 HEALTHCHECK
                                                                         + nginx healthcheck（经 /health 直通）
        ```

- ASGI
    - 同时挂起很多I/O（等数据库、调llm、读文件）而不堵死整个进程
    - 长连接（SSE、WebSocket）自然支持

# 计算机网络
- 通信方式
    - CS
        - 客户端（Client）：主动发起请求的一方（浏览器、App、curl）
        - 服务端（Server）：等待连接、处理请求、返回结果的一方
- 套接字
    - OS给进程的一块【网络通信句柄】
    - 理解
        - 某个进程创建套接字并绑定到该端口后，才占用这个端口来监听
        - Uvicorn监听端口 = 监听套接字
        - 信息从网卡进内核，按端口找到对应套接字，再交给持有他的进程

- URL：前端来构造的用来寻址的。用户点击会触发URL的变化，js会监听url的变化，变化之后会渲染对应的视图，但视图中可能会有数据的请求，这时候就会对后端发起请求
- HTTP：
    - 请求方法：GET、POST、PUT、DELETE、PATCH
    - 幂等性：同一操作执行多次结果与执行一次相同

- OSI七层：应用层、表示层、会话层、传输层、网络层、数据链路层、物理层（物联网淑慧试用）
    - 物理层
        - 传输原始比特流，定义电器/接口/线缆标准
        - 硬件：网线、集线器、网卡、中继器---放大信号，不算节点
        - 协议：RS-232、IEEE802.3
    - 数据链路层
        - 相邻节点（这里只有经过交换机才算一个节点）间成帧传输，负责寻址（MAC）、差错检测
        - 设备：交换机
        - 协议：以太网、PPP、Wi-Fi
        - MAC地址：48 位（6 字节），通常写成 6 组十六进制，如 00:1A:2B:3C:4D:5E。前 3 字节厂商，后 3 字节设备唯一。
        - 我们不需要知道目标主机MAC地址，只需要IP地址，然后网关（路由器）会根据IP地址，一步一步通过相邻节点MAC地址转发到目标主机
    - 网络层
        - 负责逻辑寻址（IP）与跨网络路由转发，尽力交付、不保证可靠
        - 设备：路由器（内含路由协议）
        - 协议：IP、ICMP、ARP
        - 默认网关：192.168.x.1
        - 这么多路由器IP地址不够分，会出现多个家庭共享一个公网IP
    - 传输层
        - 提供端到端（源端口和目标端口，标识两端的具体进程）通信，负责分段、端口寻址、可靠/不可靠传输
        - 协议：TCP/UDP
        - 设备：无。是由主机操作系统协议栈（软件）实现，标识进程，非物理接口。套接字（tocket）
    - 会话层
        - 管理应用间（端到端）会话的建立、维持与同步，负责对话控制、断点恢复。实际中常并入应用层
        - 设备：无。Cookie/Session作为会话层的一部分
    - 表示层
        - 负责数据格式转换、加密解密、压缩。实际多并入应用层
        - 软件：编码、SSL/TLS
    - 应用层
        - 为用户程序提供网络服务接口，不是具体的应用，而是用户和这个应用进行对话的方式/接口。定义如何通信
        - HTTP
            - HTTP 报文分请求/响应，含起始行（方法、路径、版本或状态码）、头部、空行、正文
        - DNS、FTP、SMTP、WebSocket
        - Uvicorn：应用层服务器（接收HTTP交给应用）
        - Nginx：应用层反向代理/负载均衡，也处理传输层连接