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

async function populate_container_name_and_status (contiden) {
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
                document.getElementById("contname").innerText = data["name"].substring(0, 25);
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
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        });
    }
}

async function refresh_container_process_list_periodically (contiden, rfrstime) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        while (1) {
            await new Promise(r => setTimeout(r, rfrstime * 1000));
            let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
            let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
            await $.getJSON(drivloca + "dishcont", {
                "passcode": passcode,
                "opername": "HTOP",
                "contiden": contiden
            }, function (data) {
                if (data["retnmesg"] === "deny") {
                    $("#contntfd").modal("show");
                } else {
                    document.getElementById("proclist").innerHTML = "";
                    for (indx in data["top"]["Processes"]) {
                        $("#proclist").append(
                            `
                            <tr>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][0]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][1]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][2]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][3]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][4]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][5]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][6]}</td>
                                <td class="pl-2 monotext nogetout">${data["top"]["Processes"][indx][7]}</td>
                            </tr>
                            `
                        );
                    }
                }
            });
        }
    }
}

async function container_process_list_operations (contiden) {
    let rfrstime = 1;
    await authenticate_endpoint_access();
    await populate_container_name_and_status(contiden);
    await refresh_container_process_list_periodically(contiden, rfrstime);
}
