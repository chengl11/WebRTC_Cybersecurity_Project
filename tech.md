#  Technology Selection

The crucial part of our project is the analysis part, that is, to analyze if some web page is running WebRTC service. From another perspective, if we know the difference between a "normal" website from a website running with WebRTC, we can know if some website is running WebRTC. Also, we can learn from current tools, such as chrome://webrtc-internals and [WebRTC Leak Prevent](https://github.com/aghorler/WebRTC-Leak-Prevent). Based on these inspirations, we came up with some possible solutions. 

## 1. Embed JavaScript Code

Comparing with "normal" website, website running WebRTC service include script using WebRTC API.

WebRTC JavaScript API usually contains three collections of APIs, `getUserMedia`, `RTCPeerConnection`, and `RTCDataChannel`, which respectively represents getting access to media services, signaling and direct data transmission. 

However, not all APIs are used, for example, [tencent sports livestream](sports.qq.com) does not uses `getUserMedia` API, and [IP Leakage Detection](ip.voidse.com), [CSDN Blogs](blog.csdn.net) does not use both `getUserMedia` and `RTCDataChannel` API. Only `RTCPeerConnection` API is essential to create WebRTC service. So we can differentiate WebRTC website from other websites by detecting if this website uses `RTCPeerConnection`. To be specific, we can detect if this website executes script that creates a `RTCPeerConnection` instance or uses methods like `createOffer()`.

While learning Chrome Extension development in sprint1, we learned that we can run `content scripts` in the context of webpage visited, and can read details of the webpage and pass information back to the father extension.<sup>[1]</sup> It seems make it possible to detect the website JavaScripts.

After some research, we realized that simply embedding some content scripts will not work because of three obstacles:
1. Content scripts are run "in an isolated world"<sup>[1]</sup>, which means content scripts cannot access variables nor functions from the website script. 
2. If the WebRTC-related instances and methods are not global, and only functions in a certain scope, our embeded code cannot interact with them.
3. If the website JavaScript code is obfuscated, it will be really hard to parse the code and analyze it.

## 2. Monitor Network Behavior

Another big difference between website running WebRTC and other websites is network behavior. WebRTC technology create direct peer-to-peer connection for clients using UDP by default. In the signaling, it might also behave differently. It sends session description information to remote server and also communicate with ICE servers (STUN and TURN servers).

Like the previous part, the peer-to-peer connection is not necessarily established, and what we can analyze is the network behavior while signaling. We are still researching the feasibility of monitoring network behavior.

## 3. Webrtc-internals

From the previous study, we already knew that there is a Chrome built-in tool, chrome://webrtc-internals, which will presents statistics about WebRTC usage in the current browser. 

### 3.1 Simulate Visiting and Monitor

Webrtc-internals page changes in real time. When WebRTC starts to run, it presents statistics immediately, and vice versa. So if we can interact with webrtc-internals, and get information from it, we can know if some website runs WebRTC. We didn't find direct access to webrtc-internals, so we considered about simulating visiting it in the background and monitoring its change. One direct change is its UI change, some HTML elements was appended and removed when WebRTC starts and terminates.

![UI Change](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/sprint2/images/UI-change.png)

We found another Chrome extension, [Distill](https://distill.io/), which can monitor HTML elements changes. But Distill does not support monitoring Chrome built-in web pages, because it runs in the cloud. We will verify if we can monitor webrtc-internals in some way, locally, in the further research.

### 3.2 Learn from JavaScript Implementation

Webrtc-internals is a WebUI in Chrome. Like normal web pages, it is implemented with web technologies such as HTML, CSS and JavaScript. We analyzed its JavaScript implementation. We found that it uses `chrome.send()` method to get messages from the browser, which can only be used by WebUI (those whose "URL" starts from "chrome://".)<sup>[2]</sup>



------------------------

***sprint 3 update:*** 

- We examined Chrome Built-in APIs, which are provided for Chrome extension developers, to find possible solutions. To be specific, we analyzed `WebRTCIPHandeling`, and then analyzed APIs about network traffic and requests based on the [part 2. Monitor Network Behavior](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/tech.md#2-monitor-network-behavior).
- We came up with a new possible solution. It is about block WebRTC by default, and catch the error message when WebRTC service fails to established. The error message indicates if some website uses WebRTC
- Based on some possible solutions in [part 3](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/tech.md#3-webrtc-internals), we considered about monitoring changes in webrtc-internals in a remote server.



## 4. Chrome Built-in APIs

### 4.1 chrome.privacy.network.WebRTCIPHandlingPolicy

A types.BrowserSetting object whose underlying value is a string. This setting allows users to specify the media performance/privacy tradeoffs which affect how WebRTC traffic will be routed and how much local address information is exposed. It may take any one of the following values, from least private to most private:<sup>[3]</sup>

* default
* default_public_and_private_interfaces
* default_public_interface_only
* disable_non_proxied_udp
* proxy_only (only connections using TURN on a TCP connection through a proxy are allowed)

![Image of rtciphandlingpolicy](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/rtciphandlingpolicy.png)

### 4.2 APIs About Network Traffic

We can use `chrome.webRequest` to observe and analyze traffic and intercept, block, or modify requests in-flight.<sup>[4]</sup> It gives developers access to the request headers.

There are some extensions based on this API, like [behave](https://github.com/mindedsecurity/behave), which is a Chrome extension that can detect if some web page access to private IP address and ports.

But it seems that this API cannot help us to tell the difference between a normal web page and a web page running WebRTC. 

We used https://ip.voidsec.com as an example, and monitored if something special happened in the network traffic, comparing to other web page that does not use WebRTC. 

We used the Chrome DevTools network to monitor it, and found that the HTTP requests have nothing special. We also found that we cannot monitor requests using TCP, UDP or STUN protocols in Chrome like we did using WireShark (because they belong to more bottom layers of OSI model).

## 5. Error Catching

Similar to the "WebRTC Control" plug-in, when users open Chrome, all the WebRTC components in the browser will be disabled. When a site wants to use one of the WebRTC components, the console should report an error. Then, our product will capture these errors and analyze the results. Therefore, we can build our products around these errors.

![Image of change-rtc-func](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/change-rtc-func.png)

For example, when opening https://ip.voidsec.com with WebRTC Control, we got the error message in the console. When we catch error messages like this, we know that this website runs WebRTC.

```javascript
Uncaught TypeError: myPeerConnection is not a constructor
    at findIP (<anonymous>:4:14)
    at <anonymous>:37:4
    at t.activateScript (rocket-loader.min.js:1)
    at rocket-loader.min.js:1
    at t.run (rocket-loader.min.js:1)
    at rocket-loader.min.js:1
    at rocket-loader.min.js:1
```

## 6. WebRTC-internals

### 6.1 Basic Solution

The MVP of this scenario is Chrome built-in WebRTC-Internals website, which opens in another TAB when the users run our plug-in. This site automatically detects if other sites the user has opened are running WebRTC, and if WebRTC runs are detected, the data and results are fed back to the site. Our plug-in will use this data to pop up a window to prompt the user.

#### 6.1.1 WebRTC Externals

We already found an exist Chrome Extension called "WebRTC Externals" that could open a similar WebRTC-Internals website in another tab. "WebRTC Externals" is a WebExtension that aims to allow much of the same workflow that developers are using on Chrome's webrtc-internals internal page. However, it is implemented as an extension and therefore does not rely on any internal infrastructure.

### 6.2 Solution With A Server

The basic solution of "detecting" process is not totally invisible to users, as it opens a tab in user's browser. To make it completely invisible, another solution is visiting WebRTC-internals in the browser of a remote server.

The whole procedures are:

1. The user opens a web page, the extension sends the URL of the web page to our server. 
2. When the server receives the URL, it opens the URL in its browser. And the browser is always opening WebRTC-internals. If the newly opened webpage runs WebRTC, there will be some content changes in WebRTC-internals.
3. The server sends back to user's browser if this web page runs WebRTC or not. 
4. The extension receives the message and notify the user.

If we use a server to help us "detect", we can use many powerful tools, like [Selenium](https://www.selenium.dev/) or [Puppeteer](https://pptr.dev/), to simulate browser behavior, and to get results about if some web pages use WebRTC. We did tests both locally and in the server side. Test code sees [here](https://github.com/chengl11/WebRTC_Cybersecurity_Project/tree/master/test_selenium). 

Running the local test script, it automatically opens a browser, and visits those URLs. With the help of Selenium, we can select elements we want using CSS selector. For example, we can get the URLs of webpages which run WebRTC using `driver.find_elements(By.CLASS_NAME, 'tab-head')`

![local_test_selenium](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/local_test_selenium.png)

In the server side, we did some modifications to run headless Chrome as the server does not support GUI. It can also speed up the process.

![server_test_selenium](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/server_test_selenium.png)

Inspite of advantages like invisible detection, working with a remote server also have some disadvantages.

- We cannot detect web pages that require login, which means we cannot detect most video conference websites. Luckily, our user stories mainly focus about potential IP address leak and malicious attack, video conference websites are less likely to have these malicious behaviors.
- The cost can be relatively high, comparing to the basic solution. So it can be an advanced function of our product, and let users to decide.
- There are also privacy issues. We can use encryption when transmitting URL and browser ID.  Also, we can open source our code. So users can review our code, or run the same code in their server.

## Conclusion

As we are doing agile development, we will firstly develop the basic solution that uses WebRTC-internals in the user's browser, which is the Minimum Value Product of our project. And after developing MVP, we can develop advanced functions, for example, developing the solution with a server, and blocking all WebRTC functions.

## Reference

[1] Google, "Content Scripts", https://developer.chrome.com/extensions/content_scripts (Accessed: 18 October 2020)

[2] Google, "WebUI Explainer", https://chromium.googlesource.com/chromium/src/+/master/docs/webui_explainer.md (Accessed: 18 October 2020)

[3] Mozilla | MDN, Privacy.network. (n.d.). Retrieved October 26, 2020, from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy/network

[4] Google, "chrome.webRequest", https://developer.chrome.com/extensions/webRequest (Accessed: 26 October 2020)