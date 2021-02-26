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

async function populate_volume_information (volmiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishvolm", {
            "passcode": passcode,
            "opername": "IDEN",
            "volmiden": volmiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#volmntfd").modal("show");
            } else {
                document.getElementById("volmname").innerText = data["name"];
                document.getElementById("attriden").innerText = data["name"];
                document.getElementById("attrmkdt").innerText = data["attrs"]["CreatedAt"];
                document.getElementById("attrdrvr").innerText = data["attrs"]["Driver"];
                document.getElementById("attrmtpt").innerText = data["attrs"]["Mountpoint"];
                document.getElementById("attrscop").innerText = data["attrs"]["Scope"];
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        })
    }
}

async function volume_information_operations (volmiden) {
    await authenticate_endpoint_access();
    await populate_volume_information(volmiden);
}
