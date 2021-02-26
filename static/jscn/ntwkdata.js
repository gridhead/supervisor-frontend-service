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

async function populate_network_information (ntwkiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishntwk", {
            "passcode": passcode,
            "opername": "IDEN",
            "ntwkiden": ntwkiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#ntwkntfd").modal("show");
            } else {
                // Attributes
                document.getElementById("ntwkname").innerText = data["name"];
                document.getElementById("attriden").innerText = data["name"];
                document.getElementById("attrmkdt").innerText = data["attrs"]["Created"];
                document.getElementById("attrscop").innerText = data["attrs"]["Scope"];
                document.getElementById("attrdrvr").innerText = data["attrs"]["Driver"];
                if (data["attrs"]["EnableIPv6"] === true) {
                    document.getElementById("attripv6").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["EnableIPv6"] === false) {
                    document.getElementById("attripv6").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Internal"] === true) {
                    document.getElementById("attrintl").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Internal"] === false) {
                    document.getElementById("attrintl").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Attachable"] === true) {
                    document.getElementById("attratbl").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Attachable"] === false) {
                    document.getElementById("attratbl").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["Ingress"] === true) {
                    document.getElementById("attrings").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["Ingress"] === false) {
                    document.getElementById("attrings").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                if (data["attrs"]["ConfigOnly"] === true) {
                    document.getElementById("attrcfol").innerHTML = "<i class='fas fa-check text-success'></i>";
                } else if (data["attrs"]["ConfigOnly"] === false) {
                    document.getElementById("attrcfol").innerHTML = "<i class='fas fa-times text-danger'></i>";
                }
                // Containers
                for (indx in data["attrs"]["Containers"]) {
                    $("#ntcnlist").append(
                        `
                        <div class="card">
                            <div class="card-header bg-olive pl-2">
                                <h3 class="card-title font-weight-bold">${data["attrs"]["Containers"][indx]["Name"]}</h3>
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
                                            <td class="pl-2 font-weight-bold">Identity</td>
                                            <td class="pl-2 monotext nogetout">${indx}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Endpoint ID</td>
                                            <td class="pl-2 monotext nogetout">${data["attrs"]["Containers"][indx]["EndpointID"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">MAC address</td>
                                            <td class="pl-2 monotext nogetout">${data["attrs"]["Containers"][indx]["MacAddress"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">IPv4 address</td>
                                            <td class="pl-2 monotext nogetout">${data["attrs"]["Containers"][indx]["IPv4Address"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">IPv6 address</td>
                                            <td class="pl-2 monotext nogetout">${data["attrs"]["Containers"][indx]["IPv6Address"]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        `
                    );
                }
                // Additional settings
                for (indx in data["attrs"]["Options"]) {
                    $("#ntwkadcf").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold nogetout">${indx}</td>
                            <td class="pl-2 monotext nogetout">${data["attrs"]["Options"][indx]}</td>
                        </tr>
                        `
                    );
                }
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        })
    }
}

async function network_information_operations (ntwkiden) {
    await authenticate_endpoint_access();
    await populate_network_information(ntwkiden);
}
