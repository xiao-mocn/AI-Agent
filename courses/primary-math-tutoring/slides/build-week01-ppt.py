from pathlib import Path

from pptx import Presentation
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE as Shape
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt

OUT = Path(r"E:\project\AI-Agent\courses\primary-math-tutoring\slides\0002-week-01-quantity-modeling-and-patterns.pptx")
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]

INK = "1F3440"; TEAL = "126A70"; GOLD = "E6AA45"; PAPER = "FBF8F1"; MINT = "E8F1E8"; ROSE = "F8E9DE"; PALE = "EFF3F1"; WHITE = "FFFFFF"; MUTED = "60727B"

def rgb(value): return RGBColor.from_string(value)
def shape(slide, kind, x, y, w, h, fill=PAPER, line=None, radius=False):
    shp = slide.shapes.add_shape(Shape.ROUNDED_RECTANGLE if radius else kind, Inches(x), Inches(y), Inches(w), Inches(h))
    shp.fill.solid(); shp.fill.fore_color.rgb = rgb(fill)
    shp.line.color.rgb = rgb(line or fill)
    return shp
def text(slide, value, x, y, w, h, size=20, color=INK, bold=False, align=PP_ALIGN.LEFT, font="Arial", valign=MSO_ANCHOR.MIDDLE):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame; tf.clear(); tf.word_wrap = True; tf.vertical_anchor = valign
    p = tf.paragraphs[0]; p.alignment = align
    run = p.add_run(); run.text = value; run.font.name = font; run.font.size = Pt(size); run.font.bold = bold; run.font.color.rgb = rgb(color)
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = Pt(0)
    return box
def base(kicker="第 1 周｜看见关系，发现规律", section=""):
    s = prs.slides.add_slide(BLANK); bg = shape(s, Shape.RECTANGLE, 0, 0, 13.333, 7.5, PAPER)
    text(s, kicker, .55, .28, 5.8, .25, 9, TEAL, True)
    if section: text(s, section, 10.2, .28, 2.55, .25, 9, MUTED, False, PP_ALIGN.RIGHT)
    shape(s, Shape.RECTANGLE, .55, .7, 12.2, .025, TEAL)
    return s
def title_slide(title, subtitle, color=TEAL):
    s = prs.slides.add_slide(BLANK); shape(s, Shape.RECTANGLE, 0, 0, 13.333, 7.5, PAPER)
    shape(s, Shape.ROUNDED_RECTANGLE, .75, .7, 1.25, .4, GOLD, GOLD, True); text(s, "数学任务卡", .82, .78, 1.1, .2, 10, INK, True, PP_ALIGN.CENTER)
    text(s, title, .8, 1.55, 10.8, 1.25, 32, INK, True)
    text(s, subtitle, .82, 3.0, 9.6, .6, 17, MUTED)
    shape(s, Shape.OVAL, 10.55, 1.5, 1.45, 1.45, MINT, MINT); shape(s, Shape.OVAL, 11.45, 2.75, .75, .75, ROSE, ROSE)
    shape(s, Shape.OVAL, 9.75, 3.55, .52, .52, GOLD, GOLD)
    text(s, "先想一想，再说一说；\n先看关系，再动笔算。", .82, 5.6, 5.7, .65, 16, color, True)
    text(s, "教师版｜两次课合并", .82, 6.65, 4.3, .25, 10, MUTED)
    return s
def chip(slide, label, x, y, w, fill, color=INK):
    shape(slide, Shape.ROUNDED_RECTANGLE, x, y, w, .37, fill, fill, True); text(slide, label, x+.08, y+.08, w-.16, .18, 10, color, True, PP_ALIGN.CENTER)
def card(slide, heading, body, x, y, w, h, fill=WHITE, accent=TEAL):
    shape(slide, Shape.ROUNDED_RECTANGLE, x, y, w, h, fill, fill, True); shape(slide, Shape.RECTANGLE, x, y, .07, h, accent, accent)
    text(slide, heading, x+.25, y+.22, w-.45, .34, 16, accent, True)
    text(slide, body, x+.25, y+.72, w-.48, h-.9, 13, INK)
def dots(slide, rows, x, y, gap=.33):
    for r in range(rows):
        for c in range(r + 1): shape(slide, Shape.OVAL, x + (rows-r-1)*gap/2 + c*gap, y+r*gap, .14, .14, GOLD, GOLD)

# 01–02 opening
title_slide("看见关系，发现规律", "第 1 周｜两次课合并教学 PPT")
s = base(section="本周路线")
text(s, "本周有两张任务卡", .7, 1.1, 7, .55, 27, INK, True)
card(s, "任务 A｜看见关系", "把两次购买放在一起看：\n哪些量相同？多出的 12 元表示什么？", .8, 2.0, 5.45, 2.5, MINT)
card(s, "任务 B｜发现规律", "不只说“我看出来了”：\n要描述变化、提出猜想，再验证。", 6.95, 2.0, 5.45, 2.5, ROSE, GOLD)
text(s, "每次课都留下一个出口题：它决定下次课怎样调难度。", .8, 5.25, 10.5, .4, 16, TEAL, True)

# 03–11 lesson A
s = base(section="课内提升｜8 分钟关键复习")
chip(s, "先复习，再挑战", .7, 1.0, 1.5, GOLD)
text(s, "两道小题：运算顺序决定关系顺序", .7, 1.6, 10.8, .5, 26, INK, True)
card(s, "复习 1", "18 − 3 × 4 = ____\n先算哪一步？为什么？", 1.0, 2.55, 4.6, 1.65, MINT)
card(s, "复习 2", "36 ÷ 4 + 7 = ____\n算完后怎样检验？", 7.0, 2.55, 4.6, 1.65, WHITE, GOLD)
text(s, "答案：6，16。今天的难题也要先把关系对齐，再计算。", 1.0, 5.15, 10.5, .35, 17, TEAL, True)
s = base(section="课内主例题｜完整题干")
text(s, "校内拓展例题：两种买法，怎样消去一个未知量？", .7, 1.08, 11.3, .45, 24, INK, True)
card(s, "购买 A｜27 元", "3 本练习本\n+ 2 支签字笔", .9, 2.0, 4.85, 2.2, MINT)
card(s, "购买 B｜35 元", "1 本练习本\n+ 5 支签字笔", 7.05, 2.0, 4.85, 2.2, ROSE, GOLD)
text(s, "求：一本练习本和一支签字笔各多少元？", .9, 5.0, 10.0, .35, 18, TEAL, True)
chip(s, "独立想 2 分钟", 9.75, 4.92, 1.65, PALE, TEAL)
s = base(section="课内主例题｜建模")
text(s, "先把两次购买里的“练习本数量”变得一样", .85, 1.1, 11.2, .48, 24, INK, True)
card(s, "购买 A", "3 本练习本\n+ 2 支笔 = 27 元", .95, 2.15, 3.35, 1.85, MINT)
card(s, "购买 B 的 3 倍", "3 本练习本\n+ 15 支笔 = 105 元", 4.95, 2.15, 3.35, 1.85, WHITE, GOLD)
card(s, "现在可比较", "练习本相同\n只剩 13 支笔的价钱", 8.95, 2.15, 3.35, 1.85, ROSE, GOLD)
text(s, "建模关键：不是直接相减，而是先把一个数量对齐。", .95, 5.2, 11.1, .35, 17, TEAL, True)
s = base(section="课内主例题｜关键突破")
text(s, "为什么先把购买 B 变成 3 倍？", .7, 1.05, 10.7, .45, 25, INK, True)
shape(s, Shape.ROUNDED_RECTANGLE, 1.0, 2.1, 4.25, 1.7, MINT, MINT, True); text(s, "这样两边都有\n3 本练习本", 1.45, 2.58, 3.35, .45, 19, TEAL, True, PP_ALIGN.CENTER)
shape(s, Shape.ROUNDED_RECTANGLE, 8.05, 2.1, 4.25, 1.7, ROSE, ROSE, True); text(s, "相减后练习本抵消，\n剩下 13 支笔", 8.45, 2.58, 3.45, .45, 19, "9A6411", True, PP_ALIGN.CENTER)
text(s, "105 − 27 = 78（元），78 元正好是 13 支笔的价钱。", 1.0, 5.05, 10.9, .35, 18, TEAL, True)
s = base(section="课内主例题｜规范解答与检验")
text(s, "对齐后相减，再代回原题", .7, 1.0, 10.7, .45, 25, INK, True)
card(s, "签字笔", "105 − 27 = 78（元）\n78 ÷ 13 = 6（元）", .9, 2.0, 3.4, 2.2, MINT)
card(s, "练习本", "27 − 2 × 6 = 15（元）\n15 ÷ 3 = 5（元）", 4.95, 2.0, 3.4, 2.2, WHITE, GOLD)
card(s, "检验", "1 × 5 + 5 × 6\n= 35（元），符合 B", 9.0, 2.0, 3.4, 2.2, ROSE, GOLD)
s = base(section="课内变式迁移｜完整题干")
text(s, "《举一反三》同思想变式：先把什么数量对齐？", .75, 1.05, 11.2, .42, 24, INK, True)
text(s, "甲：4 张贴纸 + 2 支铅笔 = 32 元", .75, 1.8, 9.6, .35, 21, INK, True)
text(s, "乙：2 张贴纸 + 5 支铅笔 = 40 元", .75, 2.35, 9.6, .35, 21, INK, True)
shape(s, Shape.ROUNDED_RECTANGLE, .9, 3.25, 5.25, 1.65, WHITE, "D7DED8", True); text(s, "提示：\n把哪一张小票变成 2 倍？\n为什么？", 1.3, 3.62, 4.4, .6, 17, TEAL, True)
shape(s, Shape.ROUNDED_RECTANGLE, 7.05, 3.25, 5.25, 1.65, MINT, MINT, True); text(s, "算完后验证：\n4 × 贴纸价 + 2 × 铅笔价\n是否等于 32？", 7.45, 3.62, 4.4, .6, 17, INK, True)
s = base(section="课内变式迁移｜规范解答")
text(s, "把乙的购买变成 2 倍，再和甲比较", .8, 1.1, 10.5, .45, 25, INK, True)
card(s, "对齐", "2 × 40 = 80（元）\n4 张贴纸 + 10 支铅笔", 1.0, 2.1, 4.8, 1.85, MINT)
card(s, "相减并代回", "80 − 32 = 48（元）\n8 支铅笔 = 48 元，每支 6 元\n贴纸每张 5 元", 7.0, 2.1, 4.8, 1.85, ROSE, GOLD)
text(s, "迁移不变：先对齐一个量，再从差量中找另一个量。", 1.0, 5.15, 9.8, .35, 18, TEAL, True)
s = base(section="方法卡 + 出口题")
chip(s, "今天的方法", .7, 1.0, 1.3, GOLD)
text(s, "先找相同的量，再看多出的量。", .7, 1.55, 10.8, .5, 26, INK, True)
card(s, "出口题", "甲：5 本笔记本 + 2 支笔 = 34 元\n乙：3 本笔记本 + 2 支笔 = 24 元\n一本笔记本和一支笔各多少元？写一个检验方法。", .9, 2.55, 8.4, 2.15, WHITE)
card(s, "离场前写下", "我先比较了：______\n我用 ________ 检验。", 9.75, 2.55, 2.55, 2.15, ROSE, GOLD)
s = base(section="教师复盘｜不投屏也可以")
text(s, "记录的是思路，不只是对错", .7, 1.05, 9, .42, 24, INK, True)
for i, lab in enumerate(["学生第一反应", "是否能解释依据", "卡点", "有效引导语", "下次调整"]):
    card(s, lab, "", .85 + (i%3)*4.05, 2.0 + (i//3)*1.7, 3.55, 1.2, PALE, TEAL)

# 12–23 lesson B
s = base(section="第 2 次课｜40–45 分钟")
chip(s, "任务 B", .7, 1.0, .9, GOLD)
text(s, "规律不是“看起来像”，要能说清和验证", .7, 1.65, 11.5, .6, 25, INK, True)
text(s, "观察 → 描述 → 猜想 → 验证 → 表达", .72, 2.55, 9.8, .42, 18, TEAL, True)
card(s, "热身", "数数图形：\n不重数，也不漏数", .85, 3.45, 3.15, 1.55, MINT)
card(s, "挑战", "找规律：\n先找“怎样变”", 4.7, 3.45, 3.15, 1.55, WHITE, GOLD)
card(s, "迁移", "用一个例子\n证明不是巧合", 8.55, 3.45, 3.15, 1.55, ROSE, GOLD)
s = base(section="思维主例题｜完整题干")
text(s, "经典例题：第 8 个三角点阵一共有多少个点？", .7, 1.0, 11.2, .45, 24, INK, True)
dots(s, 1, 1.5, 2.1); dots(s, 2, 4.2, 1.9); dots(s, 3, 7.1, 1.55)
text(s, "1 个", 1.35, 3.2, 1, .25, 15, MUTED, True, PP_ALIGN.CENTER); text(s, "3 个", 4.0, 3.2, 1.2, .25, 15, MUTED, True, PP_ALIGN.CENTER); text(s, "6 个", 7.0, 3.2, 1.2, .25, 15, MUTED, True, PP_ALIGN.CENTER)
text(s, "第 1、2、3 个点阵分别有 1、3、6 个点。第 8 个呢？先别急着列算式。", .9, 5.2, 10.7, .35, 16, TEAL, True)
s = base(section="思维主例题｜建模")
text(s, "先把“每次增加几个点”写清楚", 1.0, 1.05, 11.2, .48, 25, INK, True, PP_ALIGN.CENTER)
text(s, "1，3，6，10，____，____", 1.0, 1.85, 11.2, .6, 29, INK, True, PP_ALIGN.CENTER)
shape(s, Shape.ROUNDED_RECTANGLE, 1.3, 3.15, 10.7, 1.25, WHITE, "D7DED8", True)
text(s, "请写：每次增加多少？\n+2，+3，+4，____，____", 1.8, 3.5, 9.7, .5, 21, TEAL, True, PP_ALIGN.CENTER)
chip(s, "先独立 90 秒", 5.35, 5.35, 1.7, GOLD)
s = base(section="思维主例题｜关键突破")
text(s, "不是每次都加 4，而是“增加的数”每次多 1", .72, 1.05, 11.2, .48, 24, INK, True)
card(s, "变化量", "+2，+3，+4，+5，+6", .9, 2.0, 3.4, 1.6, MINT)
card(s, "下一项", "10 + 5 = 15\n15 + 6 = 21", 4.95, 2.0, 3.4, 1.6, WHITE, GOLD)
card(s, "怎样验证", "看点阵：\n下一行正好多 1 个点", 9.0, 2.0, 3.4, 1.6, ROSE, GOLD)
text(s, "规律要能被别人照着做出来。", .92, 5.15, 8.5, .35, 18, TEAL, True)
s = base(section="思维主例题｜规范解答与检验")
text(s, "第 8 个点阵：依次加 2、3、4、5、6、7、8", .7, 1.05, 11.5, .42, 23, INK, True)
card(s, "逐步得到", "1 → 3 → 6 → 10 → 15\n→ 21 → 28 → 36", 1.0, 2.05, 4.8, 2.0, MINT)
card(s, "图形检验", "第 8 层比第 7 层\n正好多 8 个点：\n28 + 8 = 36", 7.0, 2.05, 4.8, 2.0, ROSE, GOLD)
text(s, "答案：第 8 个点阵有 36 个点。每一步都能在图形上找到依据。", 1.0, 5.2, 10.9, .35, 17, TEAL, True)
s = base(section="思维变式一｜完整题干")
text(s, "变式一：圆、圆、三角，圆、圆、三角，……", .7, 1.05, 11.1, .42, 24, INK, True)
for i in range(12):
    kind = Shape.OVAL if i % 3 < 2 else Shape.ISOSCELES_TRIANGLE
    fill = TEAL if i % 3 < 2 else GOLD
    shape(s, kind, 1.0+i*.78, 2.35, .38, .38, fill, fill)
text(s, "第 20 个图案是什么？", .9, 4.0, 5.4, .38, 21, TEAL, True)
text(s, "先找一组有几个，再看 20 ÷ 3 的余数。", .9, 4.7, 8.7, .35, 17, MUTED)
s = base(section="思维变式一｜规范解答")
text(s, "20 ÷ 3 = 6（组）……2（个）", 1.0, 1.45, 11.2, .55, 28, INK, True, PP_ALIGN.CENTER)
card(s, "余数 2 表示", "第 20 个图案\n是一组中的第 2 个", 1.25, 3.05, 4.6, 1.55, MINT)
card(s, "所以答案是", "圆形。\n检验：第 18 个正好结束一组，\n第 19、20 个都是圆。", 7.45, 3.05, 4.6, 1.55, ROSE, GOLD)
s = base(section="思维变式二｜完整题干")
text(s, "变式二：一台数字机器每次都“先 ×2，再 +1”", .7, 1.05, 11.2, .42, 23, INK, True)
text(s, "2   →   5   →   11   →   23   →   ____", 1.0, 2.2, 11.1, .55, 29, TEAL, True, PP_ALIGN.CENTER)
card(s, "请写规则", "不是只写“翻倍”。\n要把两个操作都说完整。", 1.05, 4.1, 4.45, 1.35, MINT)
card(s, "再做反向检验", "从 23 回到 11，\n应怎样操作？", 7.75, 4.1, 4.45, 1.35, ROSE, GOLD)
s = base(section="思维变式二｜规范解答")
text(s, "23 × 2 + 1 = 47，所以空格填 47", .9, 1.2, 11.0, .45, 25, INK, True, PP_ALIGN.CENTER)
card(s, "正向", "每一步都：\n前一个数 × 2 + 1", 1.25, 2.75, 4.6, 1.6, MINT)
card(s, "反向检验", "23 − 1 = 22\n22 ÷ 2 = 11", 7.45, 2.75, 4.6, 1.6, ROSE, GOLD)
s = base(section="思维方法复盘｜说清楚才算会")
text(s, "观察 → 描述 → 猜想 → 验证 → 表达", .7, 1.05, 11.2, .55, 27, INK, True)
card(s, "观察", "变化了什么？\n量、图形还是操作？", .9, 2.8, 2.2, 1.45, MINT)
card(s, "描述", "每一步怎样变？\n用具体数字说。", 3.45, 2.8, 2.2, 1.45, WHITE, GOLD)
card(s, "验证", "能用已有例子\n倒着检查吗？", 6.0, 2.8, 2.2, 1.45, ROSE, GOLD)
card(s, "表达", "别人能照着规则\n继续做下去吗？", 8.55, 2.8, 2.2, 1.45, WHITE, TEAL)
text(s, "答案不是终点：能解释、能验证，才算真正发现了规律。", .9, 5.25, 10.7, .35, 18, TEAL, True)
s = base(section="教师复盘｜下周从哪里开始")
text(s, "只记三件事，就足够调整下一课", .7, 1.05, 10.5, .42, 24, INK, True)
card(s, "学生的表达", "能否说出“为什么”？\n还是只报出答案？", .9, 2.05, 3.55, 2.1, MINT)
card(s, "学生的检验", "会不会用一个已有例子\n验证自己的猜想？", 4.9, 2.05, 3.55, 2.1, WHITE, GOLD)
card(s, "下次调整", "加深图形规律？\n还是补足变化量描述？", 8.9, 2.05, 3.55, 2.1, ROSE, GOLD)
text(s, "下一周：根据两道出口题，决定课内进阶的提问深度与规律题的层级。", .9, 5.35, 11.0, .35, 16, TEAL, True)

OUT.parent.mkdir(parents=True, exist_ok=True)
prs.core_properties.title = "第 1 周｜看见关系，发现规律"
prs.core_properties.subject = "三年级数学辅导教师版"
prs.core_properties.author = "Codex"
prs.save(OUT)
print(f"created {OUT} with {len(prs.slides)} slides")
