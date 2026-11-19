"""Exercise the built tool at a project subpath in Chromium."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import json
import shutil
import tempfile
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main():
    screenshots = ROOT / "browser-checks"
    screenshots.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as temporary:
        shutil.copytree(ROOT / "dist", Path(temporary) / "example-tool")
        server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=temporary))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH") or None)
                page = browser.new_page(viewport={"width": 1280, "height": 1000})
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.goto(f"http://127.0.0.1:{server.server_port}/example-tool/")
                page.wait_for_selector("#receipt h2")
                assert "Tugboat challenge" in page.locator("#receipt h2").inner_text()
                assert "71 days" in page.locator(".dates").inner_text()
                assert page.locator(".documents a").nth(1).get_attribute("href").endswith("#page=2")
                page.locator("#outcome").select_option("unavailable")
                page.locator("#meeting").select_option("15")
                assert "Stimulus and household debt" == page.locator("#receipt h2").inner_text()
                page.locator("#outcome").select_option("unlocated")
                assert "No matching" in page.locator("#receipt h2").inner_text()
                page.locator("#meeting").select_option("")
                assert "ineligible CERB" in page.locator("#receipt h2").inner_text()
                page.locator("#outcome").select_option("")
                page.locator("#search").fill("Phoenix")
                assert "Phoenix" in page.locator("#receipt h2").inner_text()
                page.locator("#search").fill("")
                page.locator("#records a").first.click()
                page.reload()
                page.wait_for_selector("#receipt h2")
                assert "Tugboat" in page.locator("#receipt h2").inner_text()
                page.screenshot(path=str(screenshots / "desktop.png"), full_page=True)
                page.set_viewport_size({"width": 390, "height": 844})
                assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
                page.screenshot(path=str(screenshots / "mobile.png"), full_page=True)
                assert not errors, errors
                browser.close()
            print("Browser checks passed: project subpath, source data, interactive filters and mobile layout")
        finally:
            server.shutdown()


if __name__ == "__main__":
    main()
