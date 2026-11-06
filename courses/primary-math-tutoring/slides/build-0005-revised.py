from pathlib import Path
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
p=Path(__file__).resolve().parent
items=json.loads((p/'0005-revised-content.json').read_text(encoding='utf-8'))
r=Presentation(); r.slide_width=Inches(13.333); r.slide_height=Inches(7.5)
def add(slide, content, x,y,w,h,size,color='1F3440',bold=False,align=PP_ALIGN.LEFT):
 shape=slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h)); f=shape.text_frame; f.clear(); f.word_wrap=True; f.vertical_anchor=MSO_ANCHOR.MIDDLE; f.margin_left=Pt(0); f.margin_right=Pt(0); f.margin_top=Pt(0); f.margin_bottom=Pt(0)
 for i,line in enumerate(content.split('\n')):
  q=f.paragraphs[0] if i==0 else f.add_paragraph(); q.text=line; q.alignment=align; q.font.name='Arial'; q.font.size=Pt(size); q.font.bold=bold; q.font.color.rgb=RGBColor.from_string(color); q.space_after=Pt(3)
for i,d in enumerate(items,1):
 s=r.slides.add_slide(r.slide_layouts[6]); s.background.fill.solid(); s.background.fill.fore_color.rgb=RGBColor.from_string('FBF8F1')
 add(s,d['kind'],.65,.3,9,.35,13,'126A70',True); add(s,f'{i:02}',11.8,.3,.7,.35,13,'60727B',False,PP_ALIGN.RIGHT)
 add(s,d['title'],.65,.95,12, .75,29,'1F3440',True)
 n=len(d['body'].split('\n')); size=23 if n>7 else 25 if n>5 else 28
 add(s,d['body'],.8,1.95,11.7,4.65,size)
 add(s,'先独立思考，再说明理由与检查过程。' if d['kind'] in ['例题','独立题','检测'] else '加减巧算与巧添符号',.8,6.87,11.7,.3,12,'60727B')
 s.notes_slide.notes_text_frame.text='来源：'+d['source']
r.save(p/'0005-revised-classroom.pptx')
print('Created',len(items),'slides')
