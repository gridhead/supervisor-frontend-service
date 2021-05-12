<p align="center">
  <img width="15%" src="https://raw.githubusercontent.com/t0xic0der/supervisor-frontend-service/8ef30b5bcdc17496cfafb438837e517657ce8c27/pictures/mainicon.svg" />
</p>

<h1 align="center">SuperVisor</h1>
<h3 align="center">Frontend Service</h3>
<p align="center">Reference frontend service for SuperVisor written in Python</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/veggiemonk/awesome-docker/master/badge.svg">
    <img src="https://camo.githubusercontent.com/e5d3197f63169393ee5695f496402136b412d5e3b1d77dc5aa80805fdd5e7edb/68747470733a2f2f617765736f6d652e72652f6d656e74696f6e65642d62616467652e737667">
</p>

<p align="center">
    <img src="https://img.shields.io/github/issues/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/forks/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/stars/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/license/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/watchers/t0xic0der/supervisor-frontend-service?style=flat-square&color=teal&logo=appveyor">
</p>

## Note
This project works as a web-interface client for users to view their host system performance, container statistics, 
image information, volume information and network details of a container station from the browser applications of their 
choice but they need to have the [SuperVisor Driver Service](https://github.com/t0xic0der/supervisor-driver-service/) 
running on their server setup and connect to the same with the synchronization URI and passcode provided on the driver 
service startup.

## Native deployment

If you use Fedora (32, 33, 34 ELN, Rawhide or above), CentOS (Stream 8 or above), RHEL (8 or above), 
Mageia (7, Cauldron or above), OpenSUSE (Leap or Tumbleweed) - you can deploy the frontend service natively using 
a COPR. Just execute the following commands in succession to install the service.

```shell
# dnf install dnf-plugins-core -y
# dnf copr enable t0xic0der/supervisor -y
# dnf install svfrontend -y
```

## In action 

![](https://raw.githubusercontent.com/t0xic0der/t0xic0der/master/supervisor-frontend-service-v1.1.0-beta.gif)

## Table of contents
1. [Home](https://github.com/t0xic0der/supervisor-frontend-service/wiki)
2. [Installation](https://github.com/t0xic0der/supervisor-frontend-service/wiki/Installation)
3. [Obtain releases](https://github.com/t0xic0der/supervisor-frontend-service/releases)
4. [SuperVisor Driver Service](https://github.com/t0xic0der/supervisor-driver-service)

## Contribute
You may request for the addition of new features in the [issues](https://github.com/t0xic0der/supervisor-frontend-service/issues) 
page but as the project is singlehandedly maintained - it might take time to develop on them. Please consider forking 
the repository and contributing to its development. :heart:
