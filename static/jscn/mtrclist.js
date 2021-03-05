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

async function initiate_metric_list_fetching_and_refreshing (rfrstime) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        await new Promise(r => setTimeout(r, rfrstime * 1000));
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "mtrcrecv", {
            "passcode": passcode,
            "opername": "LIST",
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                let timecrnt = new Date();
                document.getElementById("rfrsfreq").innerText = data["duration"] + " seconds";
                document.getElementById("rtnsqant").innerText = data["mtrclist"].length + "/" + data["recsqant"] + " records";
                document.getElementById("lastupdt").innerText = timecrnt.toString();
                for (let indx = 0; indx < data["mtrclist"].length; indx ++) {
                    let mtrctime = new Date(data["mtrclist"][indx] * 1000);
                    $("#mtrclist").append(
                        `
                        <tr onclick="document.location.href = '/mtrcdata/${data["mtrclist"][indx]}';">
                            <td class="pl-2 monotext">${data["mtrclist"][indx]}</td>
                            <td class="pl-2 monotext nogetout">${mtrctime.toString()}</td>
                        </tr>
                        `
                    );
                }
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        });
    }
}

async function metric_listing_operations () {
    let rfrstime = 1;
    await authenticate_endpoint_access();
    await initiate_metric_list_fetching_and_refreshing(rfrstime);
}
