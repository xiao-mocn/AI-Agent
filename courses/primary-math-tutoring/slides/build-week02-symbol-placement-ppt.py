from pathlib import Path

from pptx import Presentation
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE as Shape
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt


OUT = Path(__file__).with_name("0003-week-02-symbol-placement.pptx")
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

INK, TEAL, GOLD = "1F3440", "126A70", "E6AA45"
PAPER, MINT, ROSE, WHITE, MUTED = "FBF8F1", "E8F1E8", "F8E9DE", "FFFFFF", "60727B"


def rgb(value):
    return RGBColor.from_string(value)


def shape(slide, kind, x, y, w, h, fill=WHITE, line=None, rounded=False):
    item = slide.shapes.add_shape(
        Shape.ROUNDED_RECTANGLE if rounded else kind,
        Inches(x), Inches(y), Inches(w), Inches(h),
    )
    item.fill.solid()
    item.fill.fore_color.rgb = rgb(fill)
    item.line.color.rgb = rgb(line or fill)
    return item


def text(slide, value, x, y, w, h, size=20, color=INK, bold=False,
         align=PP_ALIGN.LEFT, valign=MSO_ANCHOR.MIDDLE):
    item = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    frame = item.text_frame
    frame.clear()
    frame.word_wrap = True
    frame.vertical_anchor = valign
    frame.margin_left = frame.margin_right = frame.margin_top = frame.margin_bottom = Pt(0)
    paragraph = frame.paragraphs[0]
    paragraph.alignment = align
    run = paragraph.add_run()
    run.text = value
    run.font.name = "Arial"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = rgb(color)
    return item


def base(section):
    slide = prs.slides.add_slide(BLANK)
    shape(slide, Shape.RECTANGLE, 0, 0, 13.333, 7.5, PAPER)
    text(slide, "第 2 周｜从目标倒推，巧添符号", 0.55, 0.28, 6.5, 0.25, 9, TEAL, True)
    text(slide, section, 8.2, 0.28, 4.55, 0.25, 9, MUTED, False, PP_ALIGN.RIGHT)
    shape(slide, Shape.RECTANGLE, 0.55, 0.72, 12.2, 0.025, TEAL, TEAL)
    return slide


def card(slide, heading, body, x, y, w, h, fill=WHITE, accent=TEAL, body_size=16):
    shape(slide, Shape.ROUNDED_RECTANGLE, x, y, w, h, fill, fill, True)
    shape(slide, Shape.RECTANGLE, x, y, 0.07, h, accent, accent)
    text(slide, heading, x + 0.27, y + 0.2, w - 0.48, 0.34, 16, accent, True)
    text(slide, body, x + 0.27, y + 0.68, w - 0.5, h - 0.88, body_size, INK)


def chip(slide, label, x, y, w):
    shape(slide, Shape.ROUNDED_RECTANGLE, x, y, w, 0.4, GOLD, GOLD, True)
    text(slide, label, x + 0.08, y + 0.09, w - 0.16, 0.2, 10, INK, True, PP_ALIGN.CENTER)


# 1 cover
s = prs.slides.add_slide(BLANK)
shape(s, Shape.RECTANGLE, 0, 0, 13.333, 7.5, PAPER)
chip(s, "思维专题", 0.85, 0.8, 1.2)
text(s, "从目标倒推，巧添符号", 0.85, 1.72, 10.6, 0.7, 34, INK, True)
text(s, "第 2 周｜巧添符号", 0.87, 2.68, 6.4, 0.4, 19, MUTED)
text(s, "今天不比谁尝试得多，\n比谁能从 10 倒着想。", 0.87, 4.55, 6.6, 0.8, 20, TEAL, True)
shape(s, Shape.ROUNDED_RECTANGLE, 9.15, 2.35, 3.0, 0.88, MINT, MINT, True)
text(s, "1  2  3  4  5", 9.15, 2.65, 3.0, 0.22, 19, INK, True, PP_ALIGN.CENTER)
shape(s, Shape.ROUNDED_RECTANGLE, 9.15, 3.55, 3.0, 0.88, GOLD, GOLD, True)
text(s, "= 10", 9.15, 3.85, 3.0, 0.22, 19, INK, True, PP_ALIGN.CENTER)

# 2 route
s = base("本周学习路线")
text(s, "一节思维课：回顾 → 发现 → 迁移 → 预热", 0.85, 1.15, 11.5, 0.5, 26, INK, True)
card(s, "方法卡回顾", "加减巧算\n能说出方法吗？", 0.85, 2.35, 2.65, 1.65, MINT)
card(s, "主专题", "巧添符号\n从目标倒推", 3.85, 2.35, 2.65, 1.65, WHITE, GOLD)
card(s, "独立迁移", "24 点、最值\n有序尝试", 6.85, 2.35, 2.65, 1.65, ROSE, GOLD)
card(s, "下一次", "算式猜谜\n多步倒推", 9.85, 2.35, 2.65, 1.65, MINT)
text(s, "括号改变运算顺序，从结果倒推是重要策略。", 0.85, 5.05, 11.5, 0.35, 18, TEAL, True, PP_ALIGN.CENTER)

# 3 method card review
s = base("第 1 节｜方法卡 1 回顾")
chip(s, "独立完成", 0.8, 1.0, 1.2)
text(s, "上次学的方法，还记得吗？", 0.8, 1.63, 11.5, 0.45, 24, INK, True)
card(s, "回顾题", "38 + 25 + 62 + 75 = ____\n\n说出：为什么 38 和 62 可以先算？", 2.0, 2.72, 9.3, 1.8, MINT, body_size=19)
text(s, "方法卡不是重讲，而是检查你能不能独立提取方法。", 1.05, 5.32, 10.8, 0.35, 17, TEAL, True)

# 4 school content review
s = base("第 1 节｜校内乘法诊断")
text(s, "3 × 8 + 4 × 7", 0.85, 1.3, 11.6, 0.5, 29, INK, True, PP_ALIGN.CENTER)
card(s, "先算什么？", "写出每一步的\n运算顺序。", 1.3, 2.75, 4.6, 1.7, MINT, body_size=20)
card(s, "如果改成", "(3 + 4) × 8 = ?\n结果为什么不同？", 7.1, 2.75, 4.6, 1.7, ROSE, GOLD, 19)
text(s, "括号改变运算顺序，这是今天的关键。", 1.0, 5.3, 11.3, 0.35, 18, TEAL, True, PP_ALIGN.CENTER)

# 5 figure warm-up
s = base("数数图形｜复习热身")
text(s, "三角形分层数图，怎样保证不重复、不遗漏？", 0.85, 1.2, 11.5, 0.45, 24, INK, True, PP_ALIGN.CENTER)
shape(s, Shape.RECTANGLE, 3.5, 2.9, 6.3, 0.02, TEAL, TEAL)
shape(s, Shape.RECTANGLE, 4.65, 3.65, 3.95, 0.02, TEAL, TEAL)
shape(s, Shape.RECTANGLE, 5.8, 4.4, 1.65, 0.02, TEAL, TEAL)
for idx, x in enumerate([3.5, 5.05, 6.6, 4.65, 6.2, 5.8]):
    y = 2.6 if idx < 3 else 3.35 if idx < 5 else 4.1
    shape(s, Shape.OVAL, x, y, 0.5, 0.5, MINT if idx % 2 == 0 else ROSE, TEAL)
text(s, "单个、两个拼、三个拼，按层次有序记录。", 1.1, 5.45, 11.1, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 6 main example intro
s = base("第 1 节｜主例题")
text(s, "1  2  3  4  5  =  10", 0.85, 1.5, 11.6, 0.55, 31, INK, True, PP_ALIGN.CENTER)
text(s, "在相邻数字之间添加 +、−、×、÷ 或括号，使结果等于 10。", 0.95, 2.65, 11.3, 0.35, 19, TEAL, True, PP_ALIGN.CENTER)
card(s, "任务", "找到至少一种方法，\n并说明运算顺序。", 2.1, 3.7, 9.1, 1.35, MINT, body_size=19)

# 7 silent think
s = base("静想一下")
text(s, "从 10 倒着想：10 可能是哪些数得到的？", 0.85, 1.28, 11.6, 0.5, 26, INK, True, PP_ALIGN.CENTER)
card(s, "可能性", "10 = 6 + 4\n10 = 12 − 2\n10 = 5 × 2\n...", 1.35, 2.75, 4.65, 1.7, MINT, body_size=19)
card(s, "再想", "1 2 3 4 5 里\n能凑出这些数吗？", 7.25, 2.75, 4.65, 1.7, ROSE, GOLD, 20)
text(s, "先收集可能性，再尝试，不要无序乱试。", 1.0, 5.4, 11.2, 0.34, 18, TEAL, True, PP_ALIGN.CENTER)

# 8 solution 1
s = base("第 1 节｜方法示范")
text(s, "1 + 2 + 3 + 4 = 10", 0.85, 1.4, 11.6, 0.5, 28, TEAL, True, PP_ALIGN.CENTER)
text(s, "（最直接，5 不用）", 0.85, 2.15, 11.6, 0.35, 18, MUTED, True, PP_ALIGN.CENTER)
card(s, "如果必须用 5", "能调整吗？\n试试看。", 2.05, 3.3, 9.25, 1.4, MINT, body_size=20)
text(s, "有一个不行，就调整思路，不要卡住。", 1.0, 5.35, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 9 solution 2
s = base("第 1 节｜找到可行解")
text(s, "(1 + 2) × 3 − 4 + 5", 0.85, 1.3, 11.6, 0.5, 28, INK, True, PP_ALIGN.CENTER)
text(s, "= 3 × 3 − 4 + 5", 0.85, 2.2, 11.6, 0.35, 24, TEAL, True, PP_ALIGN.CENTER)
text(s, "= 9 − 4 + 5", 0.85, 3.05, 11.6, 0.35, 24, TEAL, True, PP_ALIGN.CENTER)
text(s, "= 10 ✓", 0.85, 3.9, 11.6, 0.4, 28, GOLD, True, PP_ALIGN.CENTER)
text(s, "括号改变运算顺序，先算 1 + 2，再乘 3。", 1.0, 5.25, 11.3, 0.35, 18, TEAL, True, PP_ALIGN.CENTER)

# 10 why parentheses
s = base("第 1 节｜为什么需要括号")
text(s, "如果不加括号：", 0.85, 1.2, 11.6, 0.4, 24, INK, True, PP_ALIGN.CENTER)
text(s, "1 + 2 × 3 − 4 + 5", 1.2, 2.15, 10.9, 0.35, 26, MUTED, True, PP_ALIGN.CENTER)
text(s, "= 1 + 6 − 4 + 5 = 8 ✗", 1.2, 3.0, 10.9, 0.35, 24, ROSE, True, PP_ALIGN.CENTER)
text(s, "加括号后：", 0.85, 4.0, 11.6, 0.4, 24, INK, True, PP_ALIGN.CENTER)
text(s, "(1 + 2) × 3 − 4 + 5 = 10 ✓", 1.2, 4.8, 10.9, 0.35, 24, TEAL, True, PP_ALIGN.CENTER)
text(s, "括号让加法先算，改变了乘法优先的默认顺序。", 1.0, 5.85, 11.3, 0.32, 17, MUTED, True, PP_ALIGN.CENTER)

# 11 operation order
s = base("第 1 节｜运算顺序规则")
card(s, "有括号", "先算括号里的", 1.05, 2.2, 3.15, 1.85, MINT, body_size=20)
card(s, "没括号", "乘除优先于加减", 5.05, 2.2, 3.15, 1.85, WHITE, GOLD, 19)
card(s, "同级运算", "从左到右计算", 9.05, 2.2, 3.15, 1.85, ROSE, GOLD, 20)
text(s, "每次变形，都要说清「为什么这样算」。", 1.0, 5.25, 11.3, 0.35, 18, TEAL, True, PP_ALIGN.CENTER)

# 12 independent check
s = base("第 2 节｜独立检测")
chip(s, "独立完成", 0.8, 1.0, 1.2)
text(s, "2  3  4  5  6  =  20", 0.65, 1.75, 12.0, 0.5, 28, INK, True, PP_ALIGN.CENTER)
card(s, "要求", "① 至少找到一种方法。\n② 说明运算顺序和括号作用。\n③ 用计算器检验。", 2.0, 3.05, 9.3, 1.6, MINT, body_size=19)
text(s, "从 20 倒推：20 可能是哪些数相加、相乘得到的？", 1.0, 5.38, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 13 check solution
s = base("第 2 节｜检测反馈")
text(s, "2 + 3 + 4 + 5 + 6 = 20 ✓", 0.85, 1.5, 11.6, 0.5, 26, TEAL, True, PP_ALIGN.CENTER)
text(s, "（最直接的方法）", 0.85, 2.2, 11.6, 0.3, 18, MUTED, True, PP_ALIGN.CENTER)
card(s, "其他方法", "(2 + 3) × 4 + 6 − 5\n(2 × 3 + 4) + 5 + 6\n...", 2.2, 3.3, 8.9, 1.4, MINT, body_size=19)
text(s, "方法不唯一，关键是能说清运算顺序。", 1.0, 5.35, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 14 24 challenge
s = base("第 2 节｜24 点挑战")
text(s, "用 3  3  7  7 和 +、−、×、÷ 及括号，使结果等于 24。", 0.65, 1.3, 12.0, 0.45, 22, INK, True, PP_ALIGN.CENTER)
card(s, "提示", "从 24 倒推：\n24 = 4 × 6\n24 = 3 × 8\n...", 1.8, 2.75, 4.8, 1.7, MINT, body_size=19)
card(s, "观察", "3 3 7 7 里\n能凑出这些数吗？", 6.75, 2.75, 4.8, 1.7, ROSE, GOLD, 19)
text(s, "有序尝试，遇到不行就调整，不要无头绪乱试。", 1.0, 5.35, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 15 max min challenge
s = base("第 2 节｜最值挑战")
text(s, "在 1  2  3  4 的相邻数字间添加 +、−、×，使结果：", 0.65, 1.2, 12.0, 0.4, 21, INK, True, PP_ALIGN.CENTER)
card(s, "最大", "怎样能让数\n变得更大？", 1.55, 2.65, 4.5, 1.7, MINT, body_size=21)
card(s, "最小", "允许负数，\n怎样最小？", 7.2, 2.65, 4.5, 1.7, ROSE, GOLD, 21)
text(s, "说出：为什么这样能最大 / 最小。", 1.0, 5.35, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 16 max min solution
s = base("第 2 节｜最值反馈")
text(s, "最大：1 + 2 × 3 × 4 = 1 + 24 = 25", 0.85, 1.7, 11.6, 0.45, 24, TEAL, True, PP_ALIGN.CENTER)
text(s, "（先乘后加，让数变大）", 0.85, 2.3, 11.6, 0.3, 17, MUTED, True, PP_ALIGN.CENTER)
text(s, "最小：1 − 2 × 3 × 4 = 1 − 24 = −23", 0.85, 3.4, 11.6, 0.45, 24, ROSE, True, PP_ALIGN.CENTER)
text(s, "（先乘后减，让负数更大）", 0.85, 4.0, 11.6, 0.3, 17, MUTED, True, PP_ALIGN.CENTER)
text(s, "乘法让数变大，这是理由，不是技巧。", 1.0, 5.35, 11.3, 0.32, 18, TEAL, True, PP_ALIGN.CENTER)

# 17 method card
s = base("本周方法卡｜巧添符号")
card(s, "从目标倒推", "结果是 10，\n可能是哪些数？", 1.0, 2.2, 3.2, 1.85, MINT, body_size=19)
card(s, "有序尝试", "括号、乘除、加减，\n按规则调整。", 5.05, 2.2, 3.2, 1.85, WHITE, GOLD, 18)
card(s, "说清顺序", "为什么先算这个，\n再算那个。", 9.1, 2.2, 3.2, 1.85, ROSE, GOLD, 18)
text(s, "逆推不是猜，而是从目标缩小尝试范围。", 1.0, 5.25, 11.3, 0.35, 18, TEAL, True, PP_ALIGN.CENTER)

# 18 preview
s = base("第 2 节｜课末预习")
chip(s, "算式猜谜｜预热", 0.78, 1.0, 1.65)
text(s, "□ + △ = 10", 2.5, 2.0, 8.3, 0.5, 28, INK, True, PP_ALIGN.CENTER)
text(s, "□ − △ = 4", 2.5, 2.85, 8.3, 0.5, 28, INK, True, PP_ALIGN.CENTER)
card(s, "思考", "□ 和 △ 各是多少？\n如果告诉你答案，怎么检查对不对？", 1.9, 4.0, 9.5, 1.25, MINT, body_size=19)
text(s, "今天只记录「把答案代回去」的想法，下次再完整求解。", 1.0, 5.9, 11.3, 0.28, 17, TEAL, True, PP_ALIGN.CENTER)

prs.core_properties.title = "第 2 周｜从目标倒推，巧添符号"
prs.core_properties.subject = "三年级数学学生课堂演示稿"
prs.core_properties.author = "Codex"
prs.save(OUT)
print(f"created {OUT} with {len(prs.slides)} slides")
