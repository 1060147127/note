

- Agent开发
    1.按能力闭环拆分
    2.串行为主、少量并行
    3.每个窗口必须带交界物
    4.要维护开发文档



# 多模态数据处理
  - 1. pdf
    - 1. 文字型PDF
        - 命令行首选pdftotext
        - Python库pypdf
        - 需要保留布局时用pdfplumber
    - 2. 扫描型PDF
        - 本地OCR工具smartocr
        - 传统OCR引擎：Tesseract
        - AI视觉识别
    - 3. 混合型PDF（文字和扫描并存）
        - 前置分类器：pdf-inspector，判断是文字层还是需要走OCR
        - 四型自动适配工具pdf-wzq：文本型/纯图/PPT转PDF/混合
    - 4. 表格密集型PDF
        - pdfplumber
        - 高性能库tablers
  - 2. word
    - docx
        - mammoth
        - dxpars
        - python-docx
    - doc
        - antiword
- 3. excel
    - xlsx
    - xls
- 4. 图片
- 5. 纯文本/csv/Markdown
    - 