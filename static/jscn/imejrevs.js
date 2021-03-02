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
    await $.post(
        "/credpull/",
        {},
        async function (data) {
            let retndict = JSON.parse(data)
            if (retndict["retnmesg"] === "allow") {
                let vsondict = {
                    "drivloca": retndict["drivloca"],
                    "sockloca": retndict["sockloca"],
                    "passcode": retndict["passcode"]
                };
                sessionStorage.setItem("vsoniden", JSON.stringify(vsondict));
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
            } else {
                $("#abstcred").modal("show");
                return false;
            }
        }
    );
}

async function populate_image_revision_list (imejiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishimej", {
            "passcode": passcode,
            "opername": "REVS",
            "imejiden": imejiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#imejntfd").modal("show");
            } else {
                let revslent = 0;
                for (indx in data["history"]) {
                    let comt = "UNAVAILABLE";
                    let cret = "UNAVAILABLE";
                    let crby = "UNAVAILABLE";
                    let iden = "UNAVAILABLE";
                    let imsz = "UNAVAILABLE";
                    if (data["history"][indx]["Comment"] !== "") {
                        comt = data["history"][indx]["Comment"];
                    }
                    if (data["history"][indx]["Created"] !== "") {
                        cret = data["history"][indx]["Created"];
                    }
                    if (data["history"][indx]["CreatedBy"] !== "") {
                        crby = data["history"][indx]["CreatedBy"];
                    }
                    if (data["history"][indx]["Id"] !== "" || data["history"][indx]["Id"] !== "<missing>") {
                        iden = data["history"][indx]["Id"];
                    }
                    if (data["history"][indx]["Size"] !== "") {
                        imsz = data["history"][indx]["Size"];
                    }
                    $("#revslist").append(
                        `
                        <div class="col-md-12 col-sm-12 col-12">
                            <div class="card">
                                <div class="card-header bg-olive pl-2">
                                    <h3 class="card-title font-weight-bold">#${indx}</h3>
                                </div>
                                <div class="card-body p-0">
                                    <table class="table table-sm table-hover">
                                        <thead>
                                            <tr>
                                                <th class="pl-2" style="width: 25%;">Attributes</th>
                                                <th class="pl-2" style="width: 75%;">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="pl-2 font-weight-bold">Comment</td>
                                                <td class="pl-2 monotext nogetout">${comt}</td>
                                            </tr>
                                            <tr>
                                                <td class="pl-2 font-weight-bold">Created on</td>
                                                <td class="pl-2 monotext nogetout">${cret}</td>
                                            </tr>
                                            <tr>
                                                <td class="pl-2 font-weight-bold">Created by</td>
                                                <td class="pl-2 monotext nogetout">${crby}</td>
                                            </tr>
                                            <tr>
                                                <td class="pl-2 font-weight-bold">Identity</td>
                                                <td class="pl-2 monotext nogetout">${iden}</td>
                                            </tr>
                                            <tr>
                                                <td class="pl-2 font-weight-bold">Size</td>
                                                <td class="pl-2 monotext nogetout">${imsz}&nbsp;bytes</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        `
                    )
                    revslent++;
                }
                document.getElementById("revsnumb").innerText = revslent;
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        })
    }
}

async function populate_image_name (imejiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishimej", {
            "passcode": passcode,
            "opername": "IDEN",
            "imejiden": imejiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#imejntfd").modal("show");
            } else {
                document.getElementById("imejname").innerText = data["name"].substring(0, 25);
            }
        });
    }
}

async function revision_list_operations (imejiden) {
    await authenticate_endpoint_access();
    await populate_image_name(imejiden);
    await populate_image_revision_list(imejiden);
}
