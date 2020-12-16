<p align="center">
  <img width="15%" src="https://github.com/t0xic0der/supervisor-frontend-service/blob/initial-documentation/pictures/mainicon.svg" />
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
- For people owning home or enterprise servers with lower system specifications and complexity
- For people having headless setup of Raspberry Pi (or any other single board computer of the kind)
- For people looking for a relatively easy-to-understand and user-friendly system management tool
- For people wanting to control devices from mobile phones, chromebooks and smart TVs (with browser)
- For people seeking a secure passcode-protected dashboard utility for process control
- For people aiming to analyse system performance using informative graphs and insights

## Features
- Simplistic implementation of asynchronous periodic AJAX calls to fetch information
- Rewritten entirely in Go's excellent [net/http](https://golang.org/pkg/net/http/) implementation for speed and efficiency
- Awesomely efficient frontend loading with very low overhead (consumes barely 512KB of memory)
- Easy and flexible customization of interface by replacing the assets with your own
- Decoupled structure allows for connection to remote driver service endpoints ([Check here](https://github.com/t0xic0der/supervisor-driver-service))
- Real-time performance analysis using live graphs, quantifiable values and active progress bars
- Protected endpoint access with passcode and URI entry during login in web interface
- Reworked process information modal with greater details and management controls
- Sessions restricted to single tab to allow multiple endpoint connections in the same browser window
- Hybrid theming controls with a variety of colour options are coming soon with the following release
- Complex process control with per-task authenticated **`TERMINATE`**, **`KILL`**, **`SUSPEND`** and **`RESUME`** ops

## Contribute
You may request for the addition of new features in the [issues](https://github.com/t0xic0der/supervisor-frontend-service/issues) page but as the project is singlehandedly maintained - it might take time to develop on them. Please consider forking the repository and contributing to its development. :heart:
