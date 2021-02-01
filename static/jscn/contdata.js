/*
##########################################################################
*
*   Copyright © 2019-2021 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <https://www.gnu.org/licenses/>.
*
##########################################################################
*/

async function authenticate_endpoint_access () {
    if (sessionStorage.getItem("vsoniden") === null) {
        $("#abstcred").modal("show");
        return false;
    } else {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        try {
            await $.getJSON(drivloca + "testconn", {
                "passcode": passcode
            }, function (data) {
                if (data["retnmesg"] === "allow") {
                    return true;
                } else {
                    $("#connfail").modal("show");
                    return false;
                }
            })
        } catch (err) {
            $("#connfail").modal("show");
            return false;
        }
    }
}

async function populate_container_information(contiden) {
    let contattr = {
        "attrimej": {
            "keye": "Image",
            "name": "Origin image"
        },
        "attrmake": {
            "keye": "Created",
            "name": "Created on"
        },
        "attrexec": {
            "keye": "Path",
            "name": "Execution path"
        },
        "attrrscf": {
            "keye": "ResolvConfPath",
            "name": "ResolvConf path"
        },
        "attrhsnm": {
            "keye": "HostnamePath",
            "name": "Hostname path"
        },
        "attrhspt": {
            "keye": "HostsPath",
            "name": "Hosts path"
        },
        "attrlgpt": {
            "keye": "LogPath",
            "name": "Log path"
        },
        "attrrtct": {
            "keye": "RestartCount",
            "name": "Restart count"
        },
        "attrdrvr": {
            "keye": "Driver",
            "name": "Driver"
        },
        "attrptfm": {
            "keye": "Platform",
            "name": "Platform"
        },
        "attrmtlb": {
            "keye": "MountLabel",
            "name": "Mount label"
        },
        "attrpslb": {
            "keye": "ProcessLabel",
            "name": "Process label"
        },
        "attraapf": {
            "keye": "AppArmorProfile",
            "name": "AppArmor profile"
        },
    };
    let hostconf = {
        "hostcidf": {
            "keye": "ContainerIDfile",
            "name": "Container ID file",
        },
        "hostnwmd": {
            "keye": "NetworkMode",
            "name": "Network mode",
        },
        "hostaurm": {
            "keye": "AutoRemove",
            "name": "Auto-remove",
        },
        "hostvmdr": {
            "keye": "VolumeDriver",
            "name": "Volume driver",
        },
        "hostcgmd": {
            "keye": "CgroupnsMode",
            "name": "CGroupns mode",
        },
        "hostipcm": {
            "keye": "IpcMode",
            "name": "IPC mode",
        },
        "hostooms": {
            "keye": "OomScoreAdj",
            "name": "OOM score adj",
        },
        "hostpidm": {
            "keye": "PidMode",
            "name": "PID mode",
        },
        "hostpvgd": {
            "keye": "Privileged",
            "name": "Privileged?",
        },
        "hostpbap": {
            "keye": "PublishAllPorts",
            "name": "Publish all ports?",
        },
        "hostrorf": {
            "keye": "ReadonlyRootfs",
            "name": "Read-only root FS",
        },
        "hostusnm": {
            "keye": "UsernsMode",
            "name": "Userns mode",
        },
        "hostshms": {
            "keye": "ShmSize",
            "name": "Shm size",
        },
        "hostrntm": {
            "keye": "Runtime",
            "name": "Runtime",
        },
        "hostisol": {
            "keye": "",
            "name": "Isolation",
        },
        "hostcpus": {
            "keye": "CpuShares",
            "name": "CPU shares",
        },
        "hostmmry": {
            "keye": "Memory",
            "name": "Memory",
        },
        "hostncpu": {
            "keye": "NanoCpus",
            "name": "Nano CPUs",
        },
        "hostcgpr": {
            "keye": "CgroupParent",
            "name": "CGroup parent",
        },
        "hostblkw": {
            "keye": "BlkioWeight",
            "name": "BlkIO weight",
        },
        "hostcppd": {
            "keye": "CpuPeriod",
            "name": "CPU period",
        },
        "hostcpqt": {
            "keye": "CpuQuota",
            "name": "CPU quota",
        },
        "hostcprp": {
            "keye": "CpuRealtimePeriod",
            "name": "CPU realtime period",
        },
        "hostcprr": {
            "keye": "CpuRealtimeRuntime",
            "name": "CPU realtime runtime",
        },
        "hostcpcp": {
            "keye": "CpusetCpus",
            "name": "CPUsets CPUs",
        },
        "hostcpmm": {
            "keye": "CpusetMems",
            "name": "CPUset mems",
        },
        "hostkrmm": {
            "keye": "KernelMemory",
            "name": "Kernel memory",
        },
        "hostktcp": {
            "keye": "KernelMemoryTCP",
            "name": "Kernel memory TCP",
        },
        "hostmmrs": {
            "keye": "MemoryReservation",
            "name": "Memory reservation",
        },
        "hostmswp": {
            "keye": "MemorySwap",
            "name": "Memory swap",
        },
        "hostswpn": {
            "keye": "MemorySwappiness",
            "name": "Memory swappiness",
        },
        "hostoomk": {
            "keye": "OomKillDisable",
            "name": "OOM kill disable",
        },
        "hostcpqn": {
            "keye": "CpuCount",
            "name": "CPU count",
        },
        "hostcppc": {
            "keye": "CpuPercent",
            "name": "CPU percent",
        },
        "hostmxio": {
            "keye": "IOMaximumIOps",
            "name": "IO maximum IOps",
        },
        "hostmxbw": {
            "keye": "IOMaximumBandwidth",
            "name": "IO maximum bandwidth",
        },
    }
    let ntwkconf = {
        "ntwkbrdg": {
            "keye": "Bridge",
            "name": "Bridge"
        },
        "ntwksbid": {
            "keye": "SandboxID",
            "name": "Sandbox ID"
        },
        "ntwkhpmd": {
            "keye": "HairpinMode",
            "name": "Hairpin mode"
        },
        "ntwki6ad": {
            "keye": "LinkLocalIPv6Address",
            "name": "Link local IPv6 addr"
        },
        "ntwki6pl": {
            "keye": "LinkLocalIPv6PrefixLen",
            "name": "Link local IPv6 pxln"
        },
        "ntwksbky": {
            "keye": "SandboxKey",
            "name": "Sandbox key"
        },
        "ntwkepid": {
            "keye": "EndpointID",
            "name": "Endpoint ID"
        },
        "ntwkgtwy": {
            "keye": "Gateway",
            "name": "Gateway"
        },
        "ntwkgi6a": {
            "keye": "GlobalIPv6Address",
            "name": "Global IPv6 address"
        },
        "ntwkgi6p": {
            "keye": "GlobalIPv6PrefixLen",
            "name": "Global IPv6 pxln"
        },
        "ntwkipad": {
            "keye": "IPAddress",
            "name": "IP address"
        },
        "ntwkippl": {
            "keye": "IPPrefixLen",
            "name": "IP prefix len"
        },
        "ntwki6gw": {
            "keye": "IPc6Gateway",
            "name": "IPv6 gateway"
        },
        "ntwkmcad": {
            "keye": "MacAddress",
            "name": "MAC address"
        }
    }
    let graphdrv = {
        "grafdvid": {
            "keye": "DeviceId",
            "name": "Device ID"
        },
        "grafdvnm": {
            "keye": "DeviceName",
            "name": "Device name"
        },
        "grafdvsz": {
            "keye": "DeviceSize",
            "name": "Device size"
        }
    }
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishcont", {
            "passcode": passcode,
            "opername": "IDEN",
            "contiden": contiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#contntfd").modal("show");
            } else {
                document.getElementById("contname").innerText = data["name"];
                if (data["attrs"]["State"]["Status"] === "running") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-success");
                } else if (data["attrs"]["State"]["Status"] === "created") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-pink");
                } else if (data["attrs"]["State"]["Status"] === "restarting") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-orange");
                } else if (data["attrs"]["State"]["Status"] === "paused") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-teal");
                } else if (data["attrs"]["State"]["Status"] === "exited") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-red");
                }
                for (indx in contattr) {
                    if (data["attrs"][contattr[indx]["keye"]] !== "") {
                        $("#contattr").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${contattr[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">${data["attrs"][contattr[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#contattr").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${contattr[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in hostconf) {
                    if (data["attrs"]["HostConfig"][hostconf[indx]["keye"]] !== "") {
                        $("#hostconf").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${hostconf[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">${data["attrs"]["HostConfig"][hostconf[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#hostconf").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${hostconf[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in data["attrs"]["HostConfig"]["MaskedPaths"]) {
                    $("#maskpath").append(
                        `
                        <tr>
                            <td class="pl-2 monotext nogetout">${data["attrs"]["HostConfig"]["MaskedPaths"][indx]}</td>
                        </tr>
                        `
                    );
                }
                for (indx in data["attrs"]["HostConfig"]["ReadonlyPaths"]) {
                    $("#rdolpath").append(
                        `
                        <tr>
                            <td class="pl-2 monotext nogetout">${data["attrs"]["HostConfig"]["ReadonlyPaths"][indx]}</td>
                        </tr>
                        `
                    );
                }
                for (indx in ntwkconf) {
                    if (data["attrs"]["NetworkSettings"][ntwkconf[indx]["keye"]] !== "") {
                        $("#ntwkconf").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${ntwkconf[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">${data["attrs"]["NetworkSettings"][ntwkconf[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#ntwkconf").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${ntwkconf[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in data["labels"]) {
                    $("#labllist").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold">${indx}</td>
                            <td class="pl-2 monotext nogetout">${data["labels"][indx]}</td>
                        </tr>
                        `
                    );
                }
                for (indx in graphdrv) {
                    if (data["attrs"]["GraphDriver"]["Data"][graphdrv[indx]["keye"]] !== "") {
                        $("#graphdrv").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${graphdrv[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">${data["attrs"]["GraphDriver"]["Data"][graphdrv[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#graphdrv").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${graphdrv[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        })
    }
}


async function container_information_operations(contiden) {
    await authenticate_endpoint_access();
    await populate_container_information(contiden);
}