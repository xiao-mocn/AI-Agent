"""Build a four-column visual review grid from exported PowerPoint slide PNGs."""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


def main():
    parser = ArgumentParser()
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--cols", type=int, default=4)
    args = parser.parse_args()

    images = sorted(args.input_dir.glob("slide-*.png"))
    if not images:
        raise SystemExit("未找到导出的幻灯片 PNG")

    width, height, padding, label_height = 300, 169, 20, 26
    rows = (len(images) + args.cols - 1) // args.cols
    grid = Image.new(
        "RGB",
        (padding + args.cols * (width + padding), padding + rows * (height + label_height + padding)),
        "#FBF8F1",
    )
    draw = ImageDraw.Draw(grid)
    for index, image_path in enumerate(images):
        row, col = divmod(index, args.cols)
        x = padding + col * (width + padding)
        y = padding + row * (height + label_height + padding)
        with Image.open(image_path) as image:
            preview = ImageOps.contain(image.convert("RGB"), (width, height))
            grid.paste(preview, (x, y))
        draw.rectangle((x, y, x + width - 1, y + height - 1), outline="#126A70", width=2)
        draw.text((x, y + height + 4), f"{index + 1:02d}", fill="#1F3440")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    grid.save(args.output, quality=95)
    print(f"created {args.output} with {len(images)} slides in {args.cols} columns")


if __name__ == "__main__":
    main()
