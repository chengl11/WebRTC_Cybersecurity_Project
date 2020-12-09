# Reference: https://www.selenium.dev/documentation/en/webdriver/
from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

options = Options()
driver = Chrome(options=options)

driver.get("chrome://webrtc-internals")
# refer to current window as `original_window`
print("Opening chrome://webrtc-internals...")
original_window = driver.current_window_handle

urls = ["https://ip.voidsec.com",
    "https://jacob-baines.github.io/turnscan.js/index.html",
    "https://www.baidu.com"
    ]

def open(url):
    driver.switch_to.new_window('tab')
    driver.get(url)
    print("Opening {}...".format(url))

for url in urls:
    open(url)

driver.switch_to.window(original_window)
elements = driver.find_elements(By.CLASS_NAME, 'tab-head')
print("Found these webpages running WebRTC")
print([e.text for e in elements])

# driver.quit()
