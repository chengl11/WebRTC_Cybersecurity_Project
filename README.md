# WebRTC Notifier

**Author Name:** [Lin Cheng](https://github.com/chengl11), [Wenqiang Yang](https://github.com/wq-yang)

**Product Name:** WebRTC Notifier

Course project for EC601: Product Design in Electrical and Computer Engineering.

## Description

WebRTC Notifier is a Chrome Extension. When a user opens a new website, if the site is using WebRTC, a window will pop up to indicate that the user is currently using WebRTC. Users can choose to ban WebRTC from the site or continue.

## Why You Might Need WebRTC Notifier

- Chrome does not notify users of the usage of WebRTC, except for asking for microphone / camera permission. But users have the right to know.

- WebRTC may be abused. It might:
  - Leak your public IP address behind VPN;
  - Leak your private IP address;
  - Scan active ports and attack intranet;
  - Result in network congestion.

## Features

- Notify users about the usage of WebRTC;
- Display details about WebRTC like *chrome://webrtc-internals/*;
- Block WebRTC for specific domain (new feature since 1.1.0);
- Offer two ways to activate WebRTC Notifier.

## Usage

- Download webrtc-notifier.zip in [Releases](https://github.com/chengl11/WebRTC_Cybersecurity_Project/releases). Unzip it.

- Open `Chrome - Extensions - Manage Extensions`. Click `Load unpacked` button and select the folder `webrtc-notifier` (what you got after unzipping webrtc-notifier.zip)

- You can choose a way to activate this extension, and enjoy it.

## Limitations

- Once blocking WebRTC for some page, it will block WebRTC for that page forever(as long as this extension is running in user's Chrome).

  will add a "blocklist" in Options page in later versions, so users choose to start/stop blocking WebRTC for a certain domain.

- If a web page is only calling `getUserMedia` method of WebRTC, we can detect it but cannot block WebRTC usage, unless it uses other WebRTC components later.

## Technology Selection

includes technology selection part of our project. We analyzed different ways to detect the usage of WebRTC and the feasibility of these possible solutions. We worked on this both in sprint 2 and sprint 3.



