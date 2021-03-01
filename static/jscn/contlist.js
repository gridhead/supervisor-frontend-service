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

async function initiate_container_attachment (contiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        let sockloca = JSON.parse(sessionStorage.getItem("vsoniden"))["sockloca"];
        let atchrqst = sockloca.replace("ws", "http");
        let idenattc = document.getElementById("idenattc").value;
        let comdattc = document.getElementById("comdattc").value;
        if (idenattc.trim() !== "" && comdattc.trim() !== "") {
            await $.getJSON(atchrqst + "atchcons/", {
                "contiden": idenattc,
                "comdexec": comdattc,
            }, function (data) {
                if (data["retnmesg"] === "deny") {
                    $("#connfail").modal("show");
                } else {
                    document.location.href = "/termpage/" + data["urlpatrn"];
                }
            });
        }
    }
}

function open_container_console_attachment_modal (contiden) {
    document.getElementById("idenattc").value = contiden;
    document.getElementById("comdattc").value = "";
    $("#attcmode").modal("show");
}

async function populate_container_list () {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishcont", {
            "passcode": passcode,
            "opername": "LIST",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                let contlent = 0;
                // Sorting JSON on the basis of key first before populating DOM elements
                data = Object.keys(data).sort().reduce(
                    (obj, key) => {
                        obj[key] = data[key];
                        return obj;
                    }, {}
                );
                for (indx in data) {
                    $("#contlist").append(
                        `
                        <div class="col-md-6 col-sm-12 col-12">
                            <div class="card card-widget shadow-sm">
                                <div class="info-box mb-0 mt-0">
                                    <span class="info-box-icon bg-olive"><i class="fas fa-box-open"></i></span>
                                    <div class="info-box-content ellipsis">
                                        <span class="info-box-text monotext">${data[indx]["id"].substring(0,10)}</span>
                                        <span class="info-box-number h2 mt-0 mb-0 condqant font-weight-normal">${data[indx]["name"]}</span>
                                    </div>
                                </div>
                                <div class="card-footer p-0">
                                    <ul class="nav flex-column">
                                        <li class="nav-item">
                                            <span onclick="document.location.href= '/contdata/${data[indx]['id']}'" class="nav-link" type="button">View preliminaries<span class="float-right"><i class="fas fa-info-circle text-olive"></i></span></span>
                                        </li>
                                        <li class="nav-item">
                                            <span onclick="open_container_console_attachment_modal('${data[indx]['id']}')" class="nav-link" type="button">Attach console<span class="float-right"><i class="fas fa-terminal text-olive"></i></span></span>
                                        </li>
                                        <li class="nav-item">
                                            <span onclick="document.location.href= '/contstat/${data[indx]['id']}'" class="nav-link" type="button">Watch statistics<span class="float-right"><i class="fas fa-tachometer-alt text-olive"></i></span></span>
                                        </li>
                                        <li class="nav-item">    
                                            <span onclick="document.location.href= '/contlogs/${data[indx]['id']}'" class="nav-link" type="button">Check logs<span class="float-right"><i class="fas fa-file-alt text-olive"></i></span></span>
                                        </li>
                                        <li class="nav-item">
                                            <span onclick="document.location.href= '/conthtop/${data[indx]['id']}'" class="nav-link" type="button">Manage processes<span class="float-right"><i class="fas fa-chart-line text-olive"></i></span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        `
                    )
                    contlent++;
                }
                document.getElementById("contnumb").innerText = contlent;
            }
        })
    }
}

async function container_list_operations () {
    await authenticate_endpoint_access();
    await populate_container_list();
    document.getElementById("contwrap").removeAttribute("hidden");
}
