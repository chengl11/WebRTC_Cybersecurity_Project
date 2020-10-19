# WebRTC Cybersecurity Project Sprint 02
**Author Name:** Lin Cheng, Wenqiang Yang\
**Due Date:** 10/19/2020\
**Project Name:** WebRTC & Cybersecurity Project Sprint 02

## Description

This is a description for EC601 WebRTC Cybersecurity Project Sprint 02. The expectation of this sprint is to:
1. Definition of architecture
2. Functional demonstration of major user story
3. Technology Selection and justification


## Definition of Architecture

![Image of architecture](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/sprint2/images/Architecture.png)

The basic structure of our product can be divided into four parts: the user behavior part, the code part, the Google built-in WebRTC Detection web page part, and the "WebRTC Notifier" plug-in part.\

For the code part, our current idea is to divide it into four components: the listening component, the analysis component, the interaction component and the interface component(or UI component).\

#### User Behavior Part
First the user needs to install and turn on our "WebRTC Notifier" plug-in. 
Then, when the user opens a website, the listening part of our code begins to execute. It will collect the URLs of all the opening sites and save them in a list. \

#### Code Part
The analysis part will create the connection between Google's built-in WebRTC website and our project. It sends the list of saved sites to the Google built-in website and analyzes the results. This section will then return all results if Google's built-in monitoring system detects that the current URL wants to use WebRTC. 


#### The Google built-in WebRTC Detection web page Part
The interactive section takes the results collecting from the Google built-in site and passes them to our Google extension application. Our application will pop up a window telling the user that the current site wants to use your WebRTC. Users can then choose to continue browsing the site or exit. 


#### Interface Part
The interface part(or UI part) is the design part of the entire plug-in interface.


## Functional demonstration of major user story

![Image of architecture](https://github.com/chengl11/WebRTC_Cybersecurity_Project/blob/master/sprint2/images/User-story.png)

A very simple user story might happen when using Google Hangouts. When the user wants to use the voice or video calls with others in the Google Hangouts, our product will first send the URL to Google's built-in detection WebRTC website, if the Google's built-in monitoring system detects that the current url is using WebRTC, all the results from the monitoring system will be collected and passed to our application, then the user will see a popup window that shows “The current website will use your WebRTC data.” At the end, the user can choose to continue the video chat or exit the current site.

