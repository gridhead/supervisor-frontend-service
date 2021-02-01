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

async function populate_image_list () {
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
                        <div class="col-md-12 col-sm-12 col-12">
                            <a class="info-box mb-1 mt-1" href="/imejdata/${data[indx]["id"]}">
                                <span class="info-box-icon bg-olive"><i class="fas fa-box-open"></i></span>
                                <div class="info-box-content">
                                    <span class="info-box-text monotext">${data[indx]["id"].substring(7,17)}</span>
                                    <span class="info-box-number h2 mb-0 condqant font-weight-normal">${data[indx]["name"]}</span>
                                </div>
                            </a>
                            <span class="float-right text-olive text-uppercase pl-0 pr-0">
                                <button type="button" class="btn btn-default btn-sm" onclick="document.location.href = '/imejrevs/${data[indx]["id"]}'"><i class="fas fa-clock"></i>&nbsp;View revisions</button>
                            </span>
                        </div>
                        `
                    )
                    imejlent++;
                }
                document.getElementById("imejnumb").innerText = imejlent;
            }
        })
    }
}

async function image_list_operations () {
    await authenticate_endpoint_access();
    await populate_image_list();
    document.getElementById("contwrap").removeAttribute("hidden");
}
