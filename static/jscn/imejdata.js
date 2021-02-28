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

async function populate_image_information (imejiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishimej", {
            "passcode": passcode,
            "opername": "IDEN",
            "imejiden": imejiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                // Attributes
                if (data["id"] !== "") {
                    document.getElementById("attriden").innerText = data["id"];
                }
                if (data["name"] !== "") {
                    document.getElementById("attrname").innerText = data["name"];
                }
                if (data["attrs"]["Parent"] !== "") {
                    document.getElementById("attrprnt").innerText = data["attrs"]["Parent"];
                }
                if (data["attrs"]["Comment"] !== "") {
                    document.getElementById("attrcomt").innerText = data["attrs"]["Comment"];
                }
                if (data["attrs"]["Created"] !== "") {
                    document.getElementById("attrcton").innerText = data["attrs"]["Created"];
                }
                if (data["attrs"]["Container"] !== "") {
                    document.getElementById("attrcntr").innerText = data["attrs"]["Container"];
                }
                if (data["attrs"]["DockerVersion"] !== "") {
                    document.getElementById("attrdcvr").innerText = data["attrs"]["DockerVersion"];
                }
                if (data["attrs"]["Author"] !== "") {
                    document.getElementById("attrauth").innerText = data["attrs"]["Author"];
                }
                if (data["attrs"]["Architecture"] !== "") {
                    document.getElementById("attrarch").innerText = data["attrs"]["Architecture"];
                }
                if (data["attrs"]["Os"] !== "") {
                    document.getElementById("attropsy").innerText = data["attrs"]["Os"];
                }
                if (data["attrs"]["Size"] !== "") {
                    document.getElementById("attrsize").innerText = data["attrs"]["Size"] + " bytes";
                }
                if (data["attrs"]["VirtualSize"] !== "") {
                    document.getElementById("attrvrsz").innerText = data["attrs"]["VirtualSize"] + " bytes";
                }
                // Container configuration
                if (data["attrs"]["Config"]["Hostname"] !== "") {
                    document.getElementById("cocohost").innerText = data["attrs"]["Config"]["Hostname"];
                }
                if (data["attrs"]["Config"]["Domainname"] !== "") {
                    document.getElementById("cocodonm").innerText = data["attrs"]["Config"]["Domainname"];
                }
                if (data["attrs"]["Config"]["User"] !== "") {
                    document.getElementById("cocouser").innerText = data["attrs"]["Config"]["User"];
                }
                if (data["attrs"]["Config"]["AttachStdin"] === true) {
                    document.getElementById("cocoatin").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["AttachStdin"] === false) {
                    document.getElementById("cocoatin").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["AttachStdout"] === true) {
                    document.getElementById("cocoatot").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["AttachStdout"] === false) {
                    document.getElementById("cocoatot").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["AttachStderr"] === true) {
                    document.getElementById("cocoater").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["AttachStderr"] === false) {
                    document.getElementById("cocoater").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["Tty"] === true) {
                    document.getElementById("cocoatty").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["Tty"] === false) {
                    document.getElementById("cocoatty").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["OpenStdin"] === true) {
                    document.getElementById("cocoopin").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["OpenStdin"] === false) {
                    document.getElementById("cocoopin").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["StdinOnce"] === true) {
                    document.getElementById("cocostdo").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Config"]["StdinOnce"] === false) {
                    document.getElementById("cocostdo").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Config"]["Image"] !== "") {
                    document.getElementById("cocoimej").innerText = data["attrs"]["Config"]["Image"];
                }
                if (data["attrs"]["Config"]["WorkingDir"] !== "") {
                    document.getElementById("cocowrdr").innerText = data["attrs"]["Config"]["WorkingDir"];
                }
                // Graph driver
                document.getElementById("grafname").innerText = data["attrs"]["GraphDriver"]["Name"];
                document.getElementById("grafdvid").innerText = data["attrs"]["GraphDriver"]["Data"]["DeviceId"];
                document.getElementById("grafdvnm").innerText = data["attrs"]["GraphDriver"]["Data"]["DeviceName"];
                document.getElementById("grafdvsz").innerText = data["attrs"]["GraphDriver"]["Data"]["DeviceSize"];
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

async function image_information_operations(imejiden) {
    await authenticate_endpoint_access();
    await populate_image_name(imejiden);
    await populate_image_information(imejiden);
}
