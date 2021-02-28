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

async function populate_volume_list () {
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
                        <div class="col-md-6 col-sm-12 col-12">
                            <span class="info-box mb-1 mt-1" onclick="document.location.href='/volmdata/${data[indx]["id"]}'" type="button">
                                <span class="info-box-icon bg-olive"><i class="fas fa-database"></i></span>
                                <div class="info-box-content ellipsis">
                                    <span class="info-box-text monotext">${data[indx]["id"].substring(0,10)}</span>
                                    <span class="info-box-number h2 mt-0 mb-0 condqant font-weight-normal">${data[indx]["name"]}</span>
                                </div>
                            </span>
                        </div>
                        `
                    )
                    volmlent++;
                }
                document.getElementById("volmnumb").innerText = volmlent;
            }
        })
    }
}

async function volume_list_operations () {
    await authenticate_endpoint_access();
    await populate_volume_list();
    document.getElementById("contwrap").removeAttribute("hidden");
}
