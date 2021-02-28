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

function show_toast_notification (icontype, ttletext, conttext) {
    $(document).Toasts(
        "create", {
            title: ttletext,
            body: conttext,
            autohide: true,
            autoremove: true,
            icon: icontype,
            delay: 2500,
            class: "m-2"
        }
    );
}

async function terminate_said_process (prociden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basetool", {
            "passcode": passcode,
            "prociden": prociden,
            "opername": "TERM"
        }, function (data) {
            if (data["retnmesg"] === true) {
                show_toast_notification(
                    "fas fa-check-circle",
                    "Process terminated",
                    "Termination request for PID #" + prociden + " was accepted."
                );
            } else if (data["retnmesg"] === false) {
                show_toast_notification(
                    "fas fa-exclamation-circle",
                    "Termination failed",
                    "Termination request for PID #" + prociden + " was declined."
                );
            } else {
                $("#connfail").modal("show");
            }
        });
    }
}

async function kill_said_process (prociden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basetool", {
            "passcode": passcode,
            "prociden": prociden,
            "opername": "KILL"
        }, function (data) {
            if (data["retnmesg"] === true) {
                show_toast_notification(
                    "fas fa-check-circle",
                    "Process killed",
                    "Killing request for PID #" + prociden + " was accepted."
                );
            } else if (data["retnmesg"] === false) {
                show_toast_notification(
                    "fas fa-exclamation-circle",
                    "Killing failed",
                    "Killing request for PID #" + prociden + " was declined."
                );
            } else {
                $("#connfail").modal("show");
            }
        });
    }
}

async function resume_said_process (prociden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basetool", {
            "passcode": passcode,
            "prociden": prociden,
            "opername": "CONT"
        }, function (data) {
            if (data["retnmesg"] === true) {
                show_toast_notification(
                    "fas fa-check-circle",
                    "Process resumed",
                    "Resuming request for PID #" + prociden + " was accepted."
                );
            } else if (data["retnmesg"] === false) {
                show_toast_notification(
                    "fas fa-exclamation-circle",
                    "Resuming failed",
                    "Resuming request for PID #" + prociden + " was declined."
                );
            } else {
                $("#connfail").modal("show");
            }
        });
    }
}

async function suspend_said_process (prociden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basetool", {
            "passcode": passcode,
            "prociden": prociden,
            "opername": "HANG"
        }, function (data) {
            if (data["retnmesg"] === true) {
                show_toast_notification(
                    "fas fa-check-circle",
                    "Process suspended",
                    "Suspension request for PID #" + prociden + " was accepted."
                );
            } else if (data["retnmesg"] === false) {
                show_toast_notification(
                    "fas fa-exclamation-circle",
                    "Suspension failed",
                    "Suspension request for PID #" + prociden + " was declined."
                );
            } else {
                $("#connfail").modal("show");
            }
        });
    }
}

async function invoke_particular_process_information (prociden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basepsin", {
            "passcode": passcode,
            "prociden": prociden,
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                document.getElementById("prochead").innerText = "#" + data["pid"] + " " + data["name"];
                document.getElementById("prel-user-mode").innerText = data["username"];
                document.getElementById("prel-time-mode").innerText = data["create_time"];
                document.getElementById("prel-memo-mode").innerText = data["memory_percent"].toPrecision(3);
                document.getElementById("prel-cpuu-mode").innerText = data["cpu_percent"].toPrecision(3);
                document.getElementById("prel-stat-mode").innerText = data["status"].toUpperCase();
                document.getElementById("prel-tdct-mode").innerText = data["num_threads"];
                document.getElementById("prel-term-mode").innerText = data["terminal"];
                document.getElementById("uids-real-mode").innerText = data["uids"]["real"];
                document.getElementById("uids-eftv-mode").innerText = data["uids"]["effective"];
                document.getElementById("uids-save-mode").innerText = data["uids"]["saved"];
                document.getElementById("gids-real-mode").innerText = data["gids"]["real"];
                document.getElementById("gids-eftv-mode").innerText = data["gids"]["effective"];
                document.getElementById("gids-save-mode").innerText = data["gids"]["saved"];
                document.getElementById("ctxs-voln-mode").innerText = data["num_ctx_switches"]["voluntary"];
                document.getElementById("ctxs-invo-mode").innerText = data["num_ctx_switches"]["involuntary"];
                document.getElementById("cput-user-mode").innerText = data["cpu_times"]["user"];
                document.getElementById("cput-syst-mode").innerText = data["cpu_times"]["system"];
                document.getElementById("cput-chus-mode").innerText = data["cpu_times"]["children_user"];
                document.getElementById("cput-chsy-mode").innerText = data["cpu_times"]["children_system"];
                document.getElementById("cput-iowt-mode").innerText = data["cpu_times"]["iowait"];
                document.getElementById("memo-mrss-mode").innerText = data["memory_info"]["rss"];
                document.getElementById("memo-mvms-mode").innerText = data["memory_info"]["vms"];
                document.getElementById("memo-shar-mode").innerText = data["memory_info"]["shared"];
                document.getElementById("memo-text-mode").innerText = data["memory_info"]["data"];
                document.getElementById("memo-mlib-mode").innerText = data["memory_info"]["lib"];
                document.getElementById("memo-data-mode").innerText = data["memory_info"]["data"];
                document.getElementById("memo-drty-mode").innerText = data["memory_info"]["dirty"];
                document.getElementById("termbutn").setAttribute("onclick", "terminate_said_process('" + prociden + "')");
                document.getElementById("killbutn").setAttribute("onclick", "kill_said_process('" + prociden + "')");
                document.getElementById("contbutn").setAttribute("onclick", "resume_said_process('" + prociden + "')");
                document.getElementById("hangbutn").setAttribute("onclick", "suspend_said_process('" + prociden + "')");
                $("#procinfo").modal("show");
            }
        });
    }
}

async function initiate_process_list_fetching_and_refreshing (rfrstime) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        while (1) {
            await new Promise(r => setTimeout(r, rfrstime * 1000));
            let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
            let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
            await $.getJSON(drivloca + "basestat", {
                "passcode": passcode,
                "opername": "livesync",
            }, function (data) {
                if (data["retnmesg"] === "deny") {
                    $("#connfail").modal("show");
                } else {
                    document.getElementById("proclist").innerHTML = "";
                    for (let indx in data["procinfo"]) {
                        $("#proclist").append(
                            `
                            <tr onclick="invoke_particular_process_information('${indx}')">
                                <td class="pl-2 monotext">${data["procinfo"][indx]["pid"]}</td>
                                <td class="pl-2 monotext nogetout">${data["procinfo"][indx]["name"]}</td>
                                <td class="pl-2 monotext nogetout">${data["procinfo"][indx]["username"]}</td>
                                <td class="pl-2 monotext nogetout">${data["procinfo"][indx]["memory_percent"].toPrecision(3)}%</td>
                                <td class="pl-2 monotext nogetout">${data["procinfo"][indx]["cpu_percent"].toPrecision(3)}%</td>
                            </tr>
                            `
                        );
                    }
                    document.getElementById("contwrap").removeAttribute("hidden");
                }
            });
        }
    }
}

async function process_listing_operations () {
    let rfrstime = 1;
    await authenticate_endpoint_access();
    await initiate_process_list_fetching_and_refreshing(rfrstime);
}
