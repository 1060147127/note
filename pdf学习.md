
- 《pdf解析》
    https://zxyle.github.io/PDF-Explained/

    - 概要
        - 在文本编辑器中从头开始构建简单的PDF文件
        - 了解PDF文件的布局和内容，以及其对象的语法
        - 检查PDF对象的逻辑结构，并了解如何将页面及其资源安排到文档中
        - 在PDF中创建矢量图形和光栅图像，并处理透明度，色彩空间和图案
        - 探索pdf运算符以构建和显示文本字符串
        - 快速了解书签，元数据，超链接，注释和文件附件
        - 了解PDF中的加密和文档权限如何工作
        - 使用pdftk程序从命令行处理PDF文件
    - 目录
        - 前言
        - 第1章 - 介绍
            - 1. 页面描述语言
                - pdf
                    - 优点
                        - 随机访问和线性化：访问任意页面的时间是一样的
                        - 流创建和增量更新
                        - 嵌入字体
                        - 可搜索的文本
                - PostScript
                    - 缺点
                        - 访问第50页需要加载前49页
                    - 优点
                - PCL
            - 2. ISO标准化
                - 
            - 3. 专业的PDF格式
                - PDF/A
                - PDF/X
            - 4. 什么是PDF
                - 典型的PDF文件包含数千个对象，多种压缩机制，不同的字体格式， 以及矢量和光栅图形的混合以及各种元数据和辅助内容。 我们在这里简要介绍这些元素，以供上下文使用 - 在后面的 章节中将对它们进行更全面的介绍。
                - 1. 文本和字体
                - 2. 矢量图像
                - 3. 光栅图像
                - 4. 色彩空间
                - 5. 元数据
                - 6. 导航
                - 7. 可选内容
                - 8. 多媒体
                - 9. 互动表格
                - 10. 逻辑结构和回流
                - 11. 安全
                - 12. 压缩
        - 第2章 - 构建一个简单PDF文件
            - 1. 基本PDF组成
                - 1. Header
                    - %PDF版本声明
                - 2. Body
                    - Objects（obj。。。endobj） 字体、页面、图片、内容流等
                        |—— 文本对象（Tj/TJ）
                        |—— 字体对象（Font）    字体定义 + 编码映射（CMap，ToUnicode）
                        |—— 图片对象（XObject）
                        |—— 页面对象（Page）    含MedieBox，Resources（页面引用的字体、图片、颜色空间等）等，Page Tree（/Type/Pages，层级树结构组织所有页面）
                        |—— 内容流（Contents）  页面绘制指令序列，页面实际显示的指令（画线、放文字、贴图片）
                - 3. Cross-reference Table   xref（交叉引用）表：每个对象的字节偏移量
                - 4. 
                    - Trailer               /Root，/Size，/Info，根对象指向
                    - startxref             xref表的起始位置
                    - %%EOF                 文件结束标志
        - 第3章 - 文件结构
        - 第4章 - 文档结构
        - 第5章 - 图形
        - 第6章 - 文本和字体
        - 第7章 - 文档元数据和导航
        - 第8章 - 加密文档
        - 第9章 - 使用Pdftk
        - 第10章 - PDF软件和文档
        - 译者注


- pdf相关工具
    - pdf解析
        - pdfplumber
        - pymupdf(fitz)
            - 解析层（MuPDF完成）
                - 1. pdf文件---》
                - 2. 解析交叉引用表（xref）
                    - 1. 读取第四部分中的startxref找到xref的起始位置
                    - 2. 解析xref表，得到每个Object的字节偏移量
                    - 3. 通过偏移随机访问Body中的任意Object
                - 3. 读取内容流（Content Stream）---》逐个解析操作符---》构建字形列表（每个字符的glyph + 坐标）
            - 分组层（pymupdf将散落字形结构化）
                - 单个字形（characters---》按相同字体/字号颜色/聚合为span---》按y坐标聚合同行span为line---》按空间邻近度聚类lines为block）
        - pdfminer.six
        - pikepdf
        - camelot-py
        - unstructured
    - pdf编辑