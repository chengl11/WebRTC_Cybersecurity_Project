##  Technology Selection

The crucial part of our project is the analysis part, that is, to analyze if some web page is running WebRTC service. From another perspective, if we know the difference between a "normal" website from a website running with WebRTC, we can know if some website is running WebRTC. Also, we can learn from current tools, such as chrome://webrtc-internals and [WebRTC Leak Prevent](https://github.com/aghorler/WebRTC-Leak-Prevent). Based on these inspirations, we came up with some possible solutions. 

### 1 Embed JavaScript Code

Comparing with "normal" website, website running WebRTC service include script using WebRTC API.

WebRTC JavaScript API usually contains three collections of APIs, `getUserMedia`, `RTCPeerConnection`, and `RTCDataChannel`, which respectively represents getting access to media services, signaling and direct data transmission. 

However, not all APIs are used, for example, [tencent sports livestream](sports.qq.com) does not uses `getUserMedia` API, and [IP Leakage Detection](ip.voidse.com), [CSDN Blogs](blog.csdn.net) does not use both `getUserMedia` and `RTCDataChannel` API. Only `RTCPeerConnection` API is essential to create WebRTC service. So we can differentiate WebRTC website from other websites by detecting if this website uses `RTCPeerConnection`. To be specific, we can detect if this website executes script that creates a `RTCPeerConnection` instance or uses methods like `createOffer()`.

While learning Chrome Extension development in sprint1, we learned that we can run `content scripts` in the context of webpage visited, and can read details of the webpage and pass information back to the father extension.<sup>[1]</sup> It seems make it possible to detect the website JavaScripts.

After some research, we realized that simply embedding some content scripts will not work because of three obstacles:
1. Content scripts are run "in an isolated world"<sup>[1]</sup>, which means content scripts cannot access variables nor functions from the website script. 
2. If the WebRTC-related instances and methods are not global, and only functions in a certain scope, our embeded code cannot interact with them.
3. If the website JavaScript code is obfuscated, it will be really hard to parse the code and analyze it.

### 2 Monitor Network Behavior

Another big difference between website running WebRTC and other websites is network behavior. WebRTC technology create direct peer-to-peer connection for clients using UDP by default. In the signaling, it might also behave differently. It sends session description information to remote server and also communicate with ICE servers (STUN and TURN servers).

Like the previous part, the peer-to-peer connection is not necessarily established, and what we can analyze is the network behavior while signaling. We are still researching the feasibility of monitoring network behavior.

### 3 Webrtc-internals

From the previous study, we already knew that there is a Chrome built-in tool, chrome://webrtc-internals, which will presents statistics about WebRTC usage in the current browser. 

#### 3.1 Simulate Visiting and Monitor

Webrtc-internals page changes in real time. When WebRTC starts to run, it presents statistics immediately, and vice versa. So if we can interact with webrtc-internals, and get information from it, we can know if some website runs WebRTC. We didn't find direct access to webrtc-internals, so we considered about simulating visiting it in the background and monitoring its change. One direct change is its UI change, some HTML elements was appended and removed when WebRTC starts and terminates.

![UI Change](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/sprint2/images/UI-change.png)

We found another Chrome extension, [Distill](https://distill.io/), which can monitor HTML elements changes. But Distill does not support monitoring Chrome built-in web pages, because it runs in the cloud. We will verify if we can monitor webrtc-internals in some way, locally, in the further research.

#### 3.2 Learn from JavaScript Implementation

Webrtc-internals is a WebUI in Chrome. Like normal web pages, it is implemented with web technologies such as HTML, CSS and JavaScript. We analyzed its JavaScript implementation. We found that it uses `chrome.send()` method to get messages from the browser, which can only be used by WebUI (those whose "URL" starts from "chrome://".)<sup>[2]</sup>

------------------------

sprint 3 update 

### 4. Error Catching
Similar to the "WebRTC Control" plug-in, when a user opens a Web page, all the WebRTC components of that page are disabled. When the site wants to use one of the WebRTC components, it should report an error or the error appears on the page. If you can capture these errors and analyze the results, it indicates that the site wants to use WEbrTC. We can build our products around these errors.

![Image of change-rtc-func](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/change-rtc-func.png)

### 5. Network Analysis 

#### 5.1 Chrome Build-in APIs

##### 5.1.1 chrome.privacy.network.WebRTCIPHandlingPolicy
A types.BrowserSetting object whose underlying value is a string. This setting allows users to specify the media performance/privacy tradeoffs which affect how WebRTC traffic will be routed and how much local address information is exposed. It may take any one of the following values, from least private to most private:<sup>[3]</sup>

* default
* default_public_and_private_interfaces
* default_public_interface_only
* disable_non_proxied_udp
* proxy_only (only connections using TURN on a TCP connection through a proxy are allowed)

![Image of rtciphandlingpolicy](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/img/rtciphandlingpolicy.png)

### 6. WebRTC-internals


## Reference
[1] Google, "Content Scripts", https://developer.chrome.com/extensions/content_scripts (Accessed: 18 October 2020)

[2] Google, "WebUI Explainer", https://chromium.googlesource.com/chromium/src/+/master/docs/webui_explainer.md (Accessed: 18 October 2020)

[3] Mozilla | MDN, Privacy.network. (n.d.). Retrieved October 26, 2020, from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/privacy/network
