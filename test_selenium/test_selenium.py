# Reference: https://www.selenium.dev/documentation/en/webdriver/

from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By

driver = Chrome()


driver.get("chrome://webrtc-internals")
# refer to current window as `original_window`
original_window = driver.current_window_handle

driver.switch_to.new_window('tab')
driver.get("https://ip.voidsec.com")
driver.switch_to.new_window('tab')
driver.get("https://blog.csdn.net/myan/article/details/647511")

driver.switch_to.window(original_window)
elements = driver.find_elements(By.CLASS_NAME, 'tab-head')
print([e.text for e in elements])

driver.quit()