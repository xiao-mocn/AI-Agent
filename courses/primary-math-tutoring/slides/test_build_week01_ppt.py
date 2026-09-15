"""Guard against passing a color string where a layout helper expects a height."""
import ast
from pathlib import Path

SOURCE = Path(__file__).with_name("build-week01-ppt.py")
tree = ast.parse(SOURCE.read_text(encoding="utf-8"))
invalid = []

for node in ast.walk(tree):
    if not (isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "card"):
        continue
    if len(node.args) < 7 or not isinstance(node.args[6], ast.Constant) or not isinstance(node.args[6].value, (int, float)):
        invalid.append(node.lineno)

assert not invalid, f"card() 的第 7 个位置参数必须是数值高度，异常行：{invalid}"

from pptx import Presentation

DECK = Path(__file__).with_name("0002-week-01-quantity-modeling-and-patterns.pptx")
if DECK.exists():
    presentation = Presentation(DECK)
    count = len(presentation.slides)
    assert 22 <= count <= 28, f"教师 PPT 页数应为 22–28 页，当前为 {count} 页"
    deck_text = "\n".join(
        shape.text for slide in presentation.slides for shape in slide.shapes
        if hasattr(shape, "text")
    )
    for marker in (
        "课内提升｜8 分钟关键复习", "课内主例题｜完整题干", "课内主例题｜建模", "课内主例题｜关键突破", "课内主例题｜规范解答与检验", "课内变式迁移｜完整题干",
        "思维主例题｜完整题干", "思维主例题｜建模", "思维主例题｜关键突破", "思维主例题｜规范解答与检验", "思维变式一｜完整题干", "思维变式二｜完整题干",
    ):
        assert marker in deck_text, f"缺少例题先行课堂环节：{marker}"
