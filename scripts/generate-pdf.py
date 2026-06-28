#!/usr/bin/env python3

from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "../public"
PUBLIC.mkdir(exist_ok=True)

URL = "http://localhost:3000/"
OUT_PDF = PUBLIC / "cv.pdf"
MARGIN = "0.6in"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 2000})

    page.goto(URL, wait_until="networkidle")
    page.emulate_media(media="print")

    page.pdf(
        path=str(OUT_PDF),
        margin={
            "top": MARGIN,
            "left": MARGIN,
            "right": MARGIN,
            "bottom": MARGIN,
        },
        format="A4",
        print_background=True,
    )

    browser.close()
