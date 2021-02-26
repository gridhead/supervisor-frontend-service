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

async function populate_information_section() {
    let dockfeat = {
        "featmmlt": {
            "keye": "MemoryLimit",
            "name": "Memory limit"
        },
        "featswap": {
            "keye": "SwapLimit",
            "name": "Swap limit"
        },
        "featkmem": {
            "keye": "KernelMemory",
            "name": "Kernel memory"
        },
        "featktcp": {
            "keye": "KernelMemoryTCP",
            "name": "Kernel memory TCP"
        },
        "featcfpd": {
            "keye": "CpuCfsPeriod",
            "name": "CPU Cfs period"
        },
        "featcfqt": {
            "keye": "CpuCfsQuota",
            "name": "CPU Cfs quota"
        },
        "featcpsh": {
            "keye": "CPUShares",
            "name": "CPU shares"
        },
        "featcpst": {
            "keye": "CPUSet",
            "name": "CPU set"
        },
        "featpidl": {
            "keye": "PidsLimit",
            "name": "PIDs limit"
        },
        "featip4f": {
            "keye": "IPv4Forwarding",
            "name": "IPv4 forwarding"
        },
        "featbnf4": {
            "keye": "BridgeNfIptables",
            "name": "Bridge Nf IP tables"
        },
        "featbnf6": {
            "keye": "BridgeNfIp6tables",
            "name": "Bridge Nf IPv6 tables"
        },
        "featdbug": {
            "keye": "Debug",
            "name": "Debug"
        },
        "featoomk": {
            "keye": "OomKillDisable",
            "name": "OOM kill disable"
        },
        "featlive": {
            "keye": "LiveRestoreEnabled",
            "name": "Live restore enabled"
        },
        "featexpb": {
            "keye": "ExperimentalBuild",
            "name": "Experimental build"
        }
    }
    let dockspec = {
        "spectime": {
            "keye": "SystemTime",
            "name": "System time"
        },
        "speclogr": {
            "keye": "LoggingDriver",
            "name": "Logging driver"
        },
        "speccgdv": {
            "keye": "CgroupDriver",
            "name": "CGroup driver"
        },
        "speccgvr": {
            "keye": "CgroupVersion",
            "name": "CGroup version"
        },
        "specevlt": {
            "keye": "NEventsListener",
            "name": "Events listeners"
        },
        "specknvr": {
            "keye": "KernelVersion",
            "name": "Kernel version"
        },
        "specopsy": {
            "keye": "OperatingSystem",
            "name": "Operating system"
        },
        "specosvr": {
            "keye": "OSVersion",
            "name": "OS version"
        },
        "specostp": {
            "keye": "OSType",
            "name": "OS type"
        },
        "specarch": {
            "keye": "Architecture",
            "name": "Architecture"
        },
        "specindx": {
            "keye": "IndexServerAddress",
            "name": "Indexing server"
        },
        "speccpuq": {
            "keye": "NCPU",
            "name": "CPU count"
        },
        "specphym": {
            "keye": "MemTotal",
            "name": "Physical memory"
        },
        "specdcrd": {
            "keye": "DockerRootDir",
            "name": "Docker root directory"
        },
        "spechost": {
            "keye": "Name",
            "name": "Name"
        },
        "specsrvr": {
            "keye": "ServerVersion",
            "name": "Server version"
        }
    }
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishplim", {
            "passcode": passcode,
            "opername": "INFO",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                document.getElementById("speciden").innerText = data["ID"];
                for (indx in data["DriverStatus"]) {
                    $("#drstatus").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold">${data["DriverStatus"][indx][0]}</td>
                            <td class="pl-2 monotext nogetout">${data["DriverStatus"][indx][1]}</td>
                        </tr>
                        `
                    )
                }
                for (indx in dockfeat) {
                    if (data[dockfeat[indx]["keye"]] === true) {
                        $("#dockfeat").append(
                            `
                            <tr>
                                <td class="pl-2"><i class="fas fa-check text-success"></i></td>
                                <td class="pl-2">${dockfeat[indx]["name"]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#dockfeat").append(
                            `
                            <tr>
                                <td class="pl-2"><i class="fas fa-times text-danger"></i></td>
                                <td class="pl-2">${dockfeat[indx]["name"]}</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in dockspec) {
                    if (data[dockspec[indx]["keye"]] !== "") {
                        $("#dockspec").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${dockspec[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout" id="spectime">${data[dockspec[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#dockspec").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${dockspec[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout" id="spectime">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in data["Warnings"]) {
                    $("#warnlist").append(
                        `
                        <tr>
                            <td class="pl-2">
                                <p class="monotext nogetout m-0">
                                    ${data["Warnings"][indx]}
                                </p>
                            </td>
                        </tr>
                        `
                    )
                }
            }
        })
    }
}

async function populate_version_section() {
    let revslist = {
        "revsvers": {
            "keye": "Version",
            "name": "Version"
        },
        "revsapiv": {
            "keye": "ApiVersion",
            "name": "API version"
        },
        "revsbild": {
            "keye": "GitCommit",
            "name": "Git commit"
        },
        "revsgovr": {
            "keye": "GoVersion",
            "name": "Go version"
        },
        "revsopsy": {
            "keye": "Os",
            "name": "Operating system"
        },
        "revsarch": {
            "keye": "Arch",
            "name": "Architecture"
        },
        "revskrnl": {
            "keye": "KernelVersion",
            "name": "Kernel version"
        },
        "revstime": {
            "keye": "BuildTime",
            "name": "Build time"
        }
    }
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishplim", {
            "passcode": passcode,
            "opername": "VERS",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                for (indx in revslist) {
                    if (data[revslist[indx]["keye"]] !== "") {
                        $("#revslist").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${revslist[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout" id="spectime">${data[revslist[indx]["keye"]]}</td>
                            </tr>
                            `
                        );
                    } else {
                        $("#revslist").append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${revslist[indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout" id="spectime">UNAVAILABLE</td>
                            </tr>
                            `
                        );
                    }
                }
                for (indx in data["Components"]) {
                    $("#tablsett").append(
                        `
                        <div class="card">
                            <div class="card-header bg-olive pl-2">
                                <h3 class="card-title font-weight-bold">${data["Components"][indx]["Name"]}&nbsp;${data["Components"][indx]["Version"]}</h3>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-sm table-hover">
                                    <thead>
                                        <tr>
                                            <th class="pl-2" style="width: 25%;">Attributes</th>
                                            <th class="pl-2" style="width: 75%;">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tablindx-${indx}">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        `
                    );
                    for (jndx in data["Components"][indx]["Details"]) {
                        $("#tablindx-" + indx).append(
                            `
                            <tr>
                                <td class="pl-2 font-weight-bold">${jndx}</td>
                                <td class="pl-2 monotext nogetout">${data["Components"][indx]["Details"][jndx]}</td>
                            </tr>
                            `
                        )
                    }
                }
            }
        })
    }
}

async function execute_when_authenticated () {
    await populate_information_section();
    await populate_version_section();
    document.getElementById("contwrap").removeAttribute("hidden");
}

async function authenticate_endpoint_access () {
    let darkmode = JSON.parse(sessionStorage.getItem("vsoniden"))["darkmode"];
    if (darkmode === 0) {
        $("body").removeClass("dark-mode");
        $("aside").addClass("sidebar-light-olive");
        $("aside").removeClass("sidebar-dark-olive");
    } else if (darkmode === 1) {
        $("body").addClass("dark-mode");
        $("aside").removeClass("sidebar-light-olive");
        $("aside").addClass("sidebar-dark-olive");
    }
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
                    execute_when_authenticated();
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

async function docker_statistics_operations () {
    await authenticate_endpoint_access();
}
