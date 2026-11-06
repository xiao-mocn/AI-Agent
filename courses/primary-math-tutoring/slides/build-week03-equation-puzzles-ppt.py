from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

out = Path(__file__).with_name('0004-week-03-equation-puzzles.pptx')
p = Presentation(); p.slide_width=Inches(13.333); p.slide_height=Inches(7.5)
INK='1F3440'; TEAL='126A70'; GOLD='E6AA45'; PAPER='FBF8F1'; MINT='E8F1E8'; MUTED='60727B'
def box(s,x,y,w,h,fill):
 z=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,Inches(x), Inches(y), Inches(w), Inches(h)); z.fill.solid(); z.fill.fore_color.rgb=RGBColor.from_string(fill); z.line.fill.background()
def text(s,v,x,y,w,h,size=24,color=INK,bold=False,align=PP_ALIGN.LEFT):
 sh=s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h)); f=sh.text_frame; f.clear(); f.word_wrap=True; f.vertical_anchor=MSO_ANCHOR.MIDDLE; f.margin_left=Pt(3); f.margin_right=Pt(3); f.margin_top=Pt(1); f.margin_bottom=Pt(1)
 for i,line in enumerate(v.split('\n')):
  q=f.paragraphs[0] if i==0 else f.add_paragraph(); q.text=line; q.alignment=align; q.font.name='Arial'; q.font.size=Pt(size); q.font.bold=bold; q.font.color.rgb=RGBColor.from_string(color); q.space_after=Pt(8)
def slide(label,title,main,foot='',size=30):
 s=p.slides.add_slide(p.slide_layouts[6]); s.background.fill.solid(); s.background.fill.fore_color.rgb=RGBColor.from_string(PAPER)
 text(s,'第 3 周｜算式猜谜',.65,.25,6,.35,12,TEAL,True); text(s,label,8,.25,4.65,.35,12,MUTED,False,PP_ALIGN.RIGHT)
 text(s,title,.85,1.0,11.7,.65,27,INK,True)
 box(s,.95,2.0,11.4,3.55,MINT); text(s,main,1.35,2.3,10.6,2.95,size,INK,False,PP_ALIGN.CENTER)
 if foot: text(s,foot,1.0,6.0,11.3,.75,17,TEAL,True,PP_ALIGN.CENTER)
 return s
slide('今天的任务','算式猜谜','从结果出发，\n一步一步找回未知数','第 3 周 · 前课复习与新方法',34)
slide('24 分钟｜前课复习','加减巧算：独立试一试','642 − 198 = □','怎样用凑整让计算更简便？',38)
slide('复习讲评','凑整后，记得补偿','642 − 198\n= 642 − 200 + 2\n= 444','多减了 2，需要加回 2。',30)
slide('方法总结','加减巧算：两种常用办法','换顺序、配一配：38 + 25 + 62 + 75\n\n凑整后、补一补：473 − 198','带着数字前的符号一起看；每一步都要相等。',25)
slide('复习讲评','两种方法，各看一次','(38 + 62) + (25 + 75) = 200\n\n473 − 200 + 2 = 275','找整百，检查符号和补偿。',29)
slide('独立检测','巧添符号：写全每一步','8 □ 8 □ 8 □ 8 = 3','按原顺序使用四个 8；可用四则运算和括号。',34)
slide('复习讲评','先算加法，括号要写出来','(8 + 8 + 8) ÷ 8\n= 24 ÷ 8 = 3','检查：数字用全了吗？按写出的式子重算。',30)
slide('36 分钟｜主例题','神秘数字是多少？','( □ + 8 ) × 3 − 6 = 30','先独立想：最后一步做了什么？',34)
slide('看见关系','先看正着走的步骤','□  →  加 8  →  乘 3  →  减 6  →  30','把括号里的整体先看成一个数。',26)
slide('关键突破','从 30 倒着走','30 + 6 = 36\n36 ÷ 3 = 12\n12 − 8 = 4','撤销减 6、撤销乘 3、撤销加 8。',30)
slide('规范解答','找到数字，还要代回','□ = 4\n\n(4 + 8) × 3 − 6 = 30','代回原式，检查每一步。',30)
slide('方法总结','算式猜谜四步法','① 找最后一步\n② 从结果倒着走\n③ 每次撤销一步\n④ 代回原式检验','加与减互逆；乘与除互逆。',25)
slide('42 分钟｜独立检测','这次你来试','( □ − 5 ) × 4 + 7 = 35','写出倒推过程，并代回原式。',34)
slide('检测讲评','倒推并检验','35 − 7 = 28  　28 ÷ 4 = 7\n7 + 5 = 12\n(12 − 5) × 4 + 7 = 35','你能解释为什么最后要加 5 吗？',26)
slide('同构检测','独立完成并验算','( □ + 6 ) ÷ 3 − 2 = 4','从最后一步开始倒推。',35)
slide('检测讲评','回到原式检查','4 + 2 = 6  　6 × 3 = 18\n18 − 6 = 12\n(12 + 6) ÷ 3 − 2 = 4','□ = 12',27)
slide('迁移挑战','未知数换了位置','48 ÷ □ + 3 = 9','先想 48 ÷ □ 等于多少。',36)
slide('挑战讲评','除数应该怎样找？','48 ÷ □ = 9 − 3 = 6\n48 ÷ 8 = 6，所以 □ = 8\n48 ÷ 8 + 3 = 9','代回去，等式成立。',27)
slide('18 分钟｜下次预习','填数游戏','□ + □ = □ + □','将 1、2、3、4 各填一次。怎样记录才能不遗漏？',32)
slide('课后回顾','今天学会了什么？','巧算：配对凑整，注意补偿\n添符号：括号写全，重算检查\n猜谜：从结果倒推，再代回','课后完成前两课巩固练习。',25)
p.save(out)
print(out)
