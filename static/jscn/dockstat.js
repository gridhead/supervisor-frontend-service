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

async function populate_information_section() {
    let dockfeat = {
        "featmmlt": "MemoryLimit",
        "featswap": "SwapLimit",
        "featkmem": "KernelMemory",
        "featktcp": "KernelMemoryTCP",
        "featcfpd": "CpuCfsPeriod",
        "featcfqt": "CpuCfsQuota",
        "featcpsh": "CPUShares",
        "featcpst": "CPUSet",
        "featpidl": "PidsLimit",
        "featip4f": "IPv4Forwarding",
        "featbnf4": "BridgeNfIptables",
        "featbnf6": "BridgeNfIp6tables",
        "featdbug": "Debug",
        "featoomk": "OomKillDisable",
        "featlive": "LiveRestoreEnabled",
        "featexpb": "ExperimentalBuild"
    }
    let dockspec = {
        "spectime": "SystemTime",
        "speclogr": "LoggingDriver",
        "speccgdv": "CgroupDriver",
        "speccgvr": "CgroupVersion",
        "specevlt": "NEventsListener",
        "specknvr": "KernelVersion",
        "specopsy": "OperatingSystem",
        "specosvr": "OSVersion",
        "specostp": "OSType",
        "specarch": "Architecture",
        "specindx": "IndexServerAddress",
        "speccpuq": "NCPU",
        "specphym": "MemTotal",
        "specdcrd": "DockerRootDir",
        "spechost": "Name",
        "specsrvr": "ServerVersion"
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
                            <td class="pl-2 monotext">${data["DriverStatus"][indx][1]}</td>
                        </tr>
                        `
                    )
                }
                for (indx in dockfeat) {
                    if (data[dockfeat[indx]] === true) {
                        document.getElementById(indx).innerHTML = `<i class="fas fa-check text-success"></i>`;
                    } else {
                        document.getElementById(indx).innerHTML = `<i class="fas fa-times text-danger"></i>`;
                    }
                }
                for (indx in dockspec) {
                    if (data[dockspec[indx]] !== "") {
                        document.getElementById(indx).innerHTML = data[dockspec[indx]];
                    } else {
                        document.getElementById(indx).innerHTML = "UNAVAILABLE";
                    }
                }
                for (indx in data["Warnings"]) {
                    $("#warnlist").append(
                        `
                        <tr>
                            <td class="pl-2">
                                <code class="monotext">
                                    ${data["Warnings"][indx]}
                                </code>
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
        "revsvers": "Version",
        "revsapiv": "ApiVersion",
        "revsbild": "GitCommit",
        "revsgovr": "GoVersion",
        "revsopsy": "Os",
        "revsarch": "Arch",
        "revskrnl": "KernelVersion",
        "revstime": "BuildTime"
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
                    document.getElementById(indx).innerText = data[revslist[indx]];
                }
                for (indx in data["Components"]) {
                    $("#tablsett").append(
                        `
                        <div class="card">
                            <div class="card-header bg-olive pl-2">
                                <h3 class="card-title font-weight-bold">${data["Components"][indx]["Name"]}&nbsp;${data["Components"][indx]["Version"]}</h3>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th class="pl-2">Attributes</th>
                                            <th class="pl-2">Data</th>
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
                                <td class="pl-2 monotext">${data["Components"][indx]["Details"][jndx]}</td>
                            </tr>
                            `
                        )
                    }
                }
            }
        })
    }
}

async function docker_statistics_operations () {
    await authenticate_endpoint_access();
    await populate_information_section();
    await populate_version_section();
    document.getElementById("contwrap").removeAttribute("hidden");
}
