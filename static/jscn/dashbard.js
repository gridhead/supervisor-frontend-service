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

async function populate_container_list() {
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
                for (indx in data) {
                    $("#contlist").append(
                        `
                        <li class="nav-item">
                            <a href="/contdata/${data[indx]["id"]}" class="nav-link">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"]}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </a>
                        </li>
                        `
                    )
                    contlent++;
                }
                document.getElementById("contnumb").innerText = contlent;
            }
        })
    }
}

async function populate_image_list() {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishimej", {
            "passcode": passcode,
            "opername": "LIST",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                let imejlent = 0;
                for (indx in data) {
                    $("#imejlist").append(
                        `
                        <li class="nav-item">
                            <a href="/imejdata/${data[indx]["id"]}" class="nav-link">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"]}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx.substr(7,10)}
                                </span>
                            </a>
                        </li>
                        `
                    )
                    imejlent++;
                }
                document.getElementById("imejnumb").innerText = imejlent;
            }
        })
    }
}

async function populate_network_list() {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishntwk", {
            "passcode": passcode,
            "opername": "LIST",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                let ntwklent = 0;
                for (indx in data) {
                    $("#ntwklist").append(
                        `
                        <li class="nav-item">
                            <a href="/ntwkdata/${data[indx]["id"]}" class="nav-link">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"]}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </a>
                        </li>
                        `
                    )
                    ntwklent++;
                }
                document.getElementById("ntwknumb").innerText = ntwklent;
            }
        })
    }
}

async function populate_volume_list() {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishvolm", {
            "passcode": passcode,
            "opername": "LIST",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                let volmlent = 0;
                for (indx in data) {
                    $("#volmlist").append(
                        `
                        <li class="nav-item">
                            <a href="/volmdata/${data[indx]["id"]}" class="nav-link">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"]}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </a>
                        </li>
                        `
                    )
                    volmlent++;
                }
                document.getElementById("volmnumb").innerText = volmlent;
            }
        })
    }
}

function dashboard_operations() {
    authenticate_endpoint_access();
    populate_container_list();
    populate_image_list();
    populate_network_list();
    populate_volume_list();
}
