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

function hidepass() {
    document.getElementById("passcode").type = "password"
    document.getElementById("eyeslash").style.display = "none"
    document.getElementById("eyeimage").style.display = "block"
}

function showpass() {
    document.getElementById("passcode").type = "text"
    document.getElementById("eyeslash").style.display = "block"
    document.getElementById("eyeimage").style.display = "none"
}

function fetchapi() {
    let drivloca = document.getElementById("drivloca").value;
    let sockloca = document.getElementById("sockloca").value;
    let passcode = document.getElementById("passcode").value;
    if (drivloca.trim() !== "" &&
        sockloca.trim() !== "" &&
        passcode.trim() !== "") {
        let credjson = {
            "drivloca": drivloca,
            "sockloca": sockloca,
            "passcode": passcode
        }
        sessionStorage.setItem("vsoniden", JSON.stringify(credjson));
    }
    testconn();
}

async function testconn() {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let sockloca = JSON.parse(sessionStorage.getItem("vsoniden"))["sockloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        try {
            await $.getJSON(drivloca + "testconn", {
                "passcode": passcode
            }, async function (data) {
                let sockobjc = await new WebSocket(sockloca + "websocket");
                await new Promise(r => setTimeout(r, 1000));
                if (sockobjc.readyState !== 3) {
                    if (data["retnmesg"] === "allow") {
                        document.getElementById("inptform").remove();
                        document.getElementById("textordr").innerText = "Endpoint authentication complete";
                        document.getElementById("versinfo").innerText = "Redirecting to dashboard";
                        document.location.href = "/dashbord/";
                    } else {
                        $("#connfail").modal("show");
                    }
                } else {
                    $("#connfail").modal("show");
                }
            });
        } catch (err) {
            $("#connfail").modal("show");
        }
    }
}
