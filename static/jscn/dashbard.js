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
                            <span onclick="document.location.href='/contdata/${data[indx]["id"]}'" class="nav-link" type="button">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"].substring(0, 30)}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </span>
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
                            <span onclick="document.location.href='/imejdata/${data[indx]["id"]}'" class="nav-link" type="button">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"].substring(0, 30)}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx.substr(7,10)}
                                </span>
                            </span>
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
                            <span onclick="document.location.href='/ntwkdata/${data[indx]["id"]}'" class="nav-link" type="button">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"].substring(0, 30)}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </span>
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
                            <span onclick="document.location.href='/volmdata/${data[indx]["id"]}'" class="nav-link" type="button">
                                <span class="font-weight-bold">
                                    ${data[indx]["name"].substring(0, 30)}
                                </span>
                                <span class="float-right monotext text-olive text-uppercase">
                                    ${indx}
                                </span>
                            </span>
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

async function execute_when_authenticated () {
    await populate_container_list();
    await populate_image_list();
    await populate_network_list();
    await populate_volume_list();
    document.getElementById("contwrap").removeAttribute("hidden");
}

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

async function dashboard_operations() {
    await authenticate_endpoint_access();
}
