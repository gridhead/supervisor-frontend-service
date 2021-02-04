<p align="center">
  <img width="15%" src="https://raw.githubusercontent.com/t0xic0der/supervisor-frontend-service/container-monitoring/pictures/mainicon.svg" />
</p>

<h1 align="center">SuperVisor</h1>
<h3 align="center">Frontend Service</h3>
<p align="center">Reference frontend service for SuperVisor written in Go</p>


<p align="center">
    <img src="https://img.shields.io/github/issues/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/forks/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/stars/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/license/t0xic0der/supervisor-frontend-service?style=flat-square&logo=appveyor&color=teal">
    <img src="https://img.shields.io/github/watchers/t0xic0der/supervisor-frontend-service?style=flat-square&color=teal&logo=appveyor">
</p>

## Use-cases
- For people owning home or enterprise host servers with lower system specifications and complexity 
- For people having headless setup of any single board computer acting as container station
- For people looking for a relatively easy-to-understand and user-friendly container monitoring toolkit
- For people wanting to control container stations from mobile phones, chromebooks and smart TVs (with browser)
- For people seeking a secure passcode-protected dashboard utility for container management and process control
- For people aiming to analyse host system and container performance using informative graphs and insights

## Note
This project works as a web-interface client for users to view their host system performance, container statistics, 
image information, volume information and network details of a container station from the browser applications of their 
choice but they need to have the [SuperVisor Driver Service](https://github.com/t0xic0der/supervisor-driver-service/) 
running on their server setup and connect to the same with the synchronization URI and passcode provided on the driver 
service startup.

## Features
- Simplistic implementation of asynchronous periodic AJAX calls to fetch information
- Written entirely in Flask with special attention provided to code customizability and maintainability
- Awesomely efficient frontend loading with low overhead for DOM element generation and population
- Easy and flexible customization of interface by replacing the assets with your own
- Decoupled structure allows for connection to remote driver service endpoints ([Check here](https://github.com/t0xic0der/supervisor-driver-service))
- Real-time performance analysis using live graphs, quantifiable values and active progress bars
- Complex process control with per-task authenticated **`TERMINATE`**, **`KILL`**, **`SUSPEND`** and **`RESUME`** ops
- Active container performance monitoring using preliminaries, statistics, logging and process listing
- Detailed image information provided using preliminaries and revision history
- Preliminaries of volume and network information are also provided wherever applicable
- Protected endpoint access with passcode and synchronization URI entry during login in web interface
- Reworked process information modal with greater details and management controls
- Sessions restricted to single tab to allow multiple endpoint connections in the same browser window
- Hybrid theming controls with a variety of colour options are coming soon with the following release

## Table of contents
1. [Home](https://github.com/t0xic0der/supervisor-frontend-service/wiki)
2. [Installation](https://github.com/t0xic0der/supervisor-frontend-service/wiki/Installation)
3. [Download releases](https://github.com/t0xic0der/supervisor-frontend-service/releases)
4. [SuperVisor Driver Service](https://github.com/t0xic0der/supervisor-driver-service)

## Contribute
You may request for the addition of new features in the [issues](https://github.com/t0xic0der/supervisor-frontend-service/issues) 
page but as the project is singlehandedly maintained - it might take time to develop on them. Please consider forking 
the repository and contributing to its development. :heart:
