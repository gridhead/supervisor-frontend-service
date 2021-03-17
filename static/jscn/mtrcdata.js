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

async function initiate_dom_placeholder_creation_and_population (mtrciden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "mtrcrecv", {
            "passcode": passcode,
            "opername": "IDEN",
            "mtrciden": mtrciden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#abstrcrd").modal("show");
            } else {
                let mtrcdata = data["liveupdt"];
                let mtrctime = new Date(mtrciden * 1000);
                document.getElementById("mtrciden").innerText = data["hashiden"].substring(0, 25);
                document.getElementById("mtrctime").innerText = mtrctime.toString();
                // Physical memory data population
                let virttext = (mtrcdata["virtdata"]["used"] * 100 / mtrcdata["virtdata"]["total"]).toPrecision(3).toString();
                document.getElementById("physknob").value = virttext;
                document.getElementById("phystotl").innerText = mtrcdata["virtdata"]["total"] + " bytes";
                document.getElementById("physavbl").innerText = mtrcdata["virtdata"]["available"] + " bytes";
                document.getElementById("physused").innerText = mtrcdata["virtdata"]["used"] + " bytes";
                document.getElementById("physactv").innerText = mtrcdata["virtdata"]["active"] + " bytes";
                document.getElementById("physinac").innerText = mtrcdata["virtdata"]["inactive"] + " bytes";
                document.getElementById("physbuff").innerText = mtrcdata["virtdata"]["buffers"] + " bytes";
                document.getElementById("physcach").innerText = mtrcdata["virtdata"]["cached"] + " bytes";
                document.getElementById("physshar").innerText = mtrcdata["virtdata"]["shared"] + " bytes";
                document.getElementById("physslab").innerText = mtrcdata["virtdata"]["slab"] + " bytes";
                // Virtual memory data population
                let swaptext = (mtrcdata["swapinfo"]["used"] * 100 / mtrcdata["swapinfo"]["total"]).toPrecision(3).toString();
                document.getElementById("virtknob").value = swaptext;
                document.getElementById("virttotl").innerText = mtrcdata["swapinfo"]["total"] + " bytes";
                document.getElementById("virtused").innerText = mtrcdata["swapinfo"]["used"] + " bytes";
                document.getElementById("virtfree").innerText = mtrcdata["swapinfo"]["free"] + " bytes";
                document.getElementById("virtsine").innerText = mtrcdata["swapinfo"]["sin"] + " bytes";
                document.getElementById("virtsout").innerText = mtrcdata["swapinfo"]["sout"] + " bytes";
                // CPU statistics
                document.getElementById("cpstctxs").innerText = mtrcdata["cpustats"]["ctx_switches"];
                document.getElementById("cpstintr").innerText = mtrcdata["cpustats"]["interrupts"];
                document.getElementById("cpstcint").innerText = mtrcdata["cpustats"]["soft_interrupts"];
                document.getElementById("cpstsycl").innerText = mtrcdata["cpustats"]["syscalls"];
                // Battery statistics
                document.getElementById("snbtperc").innerText = mtrcdata["sensread"]["battstat"]["percent"].toPrecision(3);
                document.getElementById("snbttime").innerText = mtrcdata["sensread"]["battstat"]["secsleft"];
                document.getElementById("snbtplug").innerText = mtrcdata["sensread"]["battstat"]["power_plugged"];
                let cpuquant = Object.keys(mtrcdata["cputimes"]).length;
                for (let indx = 0; indx < cpuquant; indx ++) {
                    let cppctext = (mtrcdata["cpuclock"][indx]["current"] * 100 / mtrcdata["cpuclock"][indx]["max"]).toPrecision(3).toString();
                    $("#cppclist").append(
                        `
                        <h2 class="condqant ml-1">CPU #${indx} - <span class="condqant" id="cpuu-perc-${indx}">${cppctext}</span>%</h2>
                        <table class="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th class="pl-2" style="width: 25%;">Attributes</th>
                                    <th class="pl-2" style="width: 75%;">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="pl-2 font-weight-bold">Current</td>
                                    <td class="pl-2 monotext nogetout" id="cppc-curt-${indx}">${mtrcdata["cpuclock"][indx]["current"]} MHz</td>
                                </tr>
                                <tr>
                                    <td class="pl-2 font-weight-bold">Minimum</td>
                                    <td class="pl-2 monotext nogetout" id="cppc-minu-${indx}">${mtrcdata["cpuclock"][indx]["min"]} MHz</td>
                                </tr>
                                <tr>
                                    <td class="pl-2 font-weight-bold">Maximum</td>
                                    <td class="pl-2 monotext nogetout" id="cppc-maxu-${indx}">${mtrcdata["cpuclock"][indx]["max"]} MHz</td>
                                </tr>
                            </tbody>
                        </table>
                        `
                    );
                    $("#cptmlist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2">
                                CPU #${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">User</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-user-${indx}">${mtrcdata["cputimes"][indx]["user"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Nice</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-nice-${indx}">${mtrcdata["cputimes"][indx]["nice"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">System</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-syst-${indx}">${mtrcdata["cputimes"][indx]["system"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Idle</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-idle-${indx}">${mtrcdata["cputimes"][indx]["idle"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">IO wait</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-iowt-${indx}">${mtrcdata["cputimes"][indx]["iowait"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">IRQ</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-cirq-${indx}">${mtrcdata["cputimes"][indx]["irq"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Soft IRQ</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-sirq-${indx}">${mtrcdata["cputimes"][indx]["softirq"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Steal</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-stil-${indx}">${mtrcdata["cputimes"][indx]["steal"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Guest</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-gest-${indx}">${mtrcdata["cputimes"][indx]["guest"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Guest nice</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-gtnc-${indx}">${mtrcdata["cputimes"][indx]["guest_nice"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    $("#cpsllist").append(
                        `
                        <h2 class="condqant ml-1">CPU #${indx} - <span class="condqant" id="cpst-perc-${indx}">${mtrcdata["cpuprcnt"][indx].toPrecision(3)}</span>%</h2>
                        `
                    );
                }
                let diouqant = 0;
                for (let indx in mtrcdata["diousage"]) {
                    $("#dioulist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2" id="diou-name-${indx}">
                                ${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">Read count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdct-${indx}">${mtrcdata["diousage"][indx]["read_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrct-${indx}">${mtrcdata["diousage"][indx]["write_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read bytes</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdbt-${indx}">${mtrcdata["diousage"][indx]["read_bytes"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write bytes</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrbt-${indx}">${mtrcdata["diousage"][indx]["write_bytes"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdtm-${indx}">${mtrcdata["diousage"][indx]["read_time"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrtm-${indx}">${mtrcdata["diousage"][indx]["write_time"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read merged count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rmct-${indx}">${mtrcdata["diousage"][indx]["read_merged_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write merged count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wmct-${indx}">${mtrcdata["diousage"][indx]["write_merged_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Busy time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-bstm-${indx}">${mtrcdata["diousage"][indx]["busy_time"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    diouqant++;
                }
                document.getElementById("diouhead").innerText = "Disk I/O usage (" + diouqant + ")";
                let ntusqant = 0;
                for (let indx in mtrcdata["netusage"]) {
                    $("#ntuslist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2" id="ntus-name-${indx}">
                                ${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">Bytes sent</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-btst-${indx}">${mtrcdata["netusage"][indx]["bytes_sent"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Bytes received</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-btrc-${indx}">${mtrcdata["netusage"][indx]["bytes_recv"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Packets sent</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-pkst-${indx}">${mtrcdata["netusage"][indx]["packets_sent"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Packets received</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-pkrc-${indx}">${mtrcdata["netusage"][indx]["packets_recv"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Ingress errors</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-iger-${indx}">${mtrcdata["netusage"][indx]["errin"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Egress errors</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-eger-${indx}">${mtrcdata["netusage"][indx]["errout"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Ingress drops</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-igdp-${indx}">${mtrcdata["netusage"][indx]["dropin"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Egress drops</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-egdp-${indx}">${mtrcdata["netusage"][indx]["dropout"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    ntusqant++;
                }
                document.getElementById("ntushead").innerText = "Network usage (" + ntusqant + ")";
                let snthqant = 0;
                for (let indx in mtrcdata["sensread"]["senstemp"]) {
                    for (let jndx in mtrcdata["sensread"]["senstemp"][indx]) {
                        $("#snthlist").append(
                            `
                            <tr>
                                <td class="pl-2 condqant h2" id="snth-name-${indx}">
                                    ${indx}/${jndx}
                                </td>
                                <td class="pl-2">
                                    <dl class="row mb-0">
                                        <dt class="col-sm-3 font-weight-bold">Label</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-labl-${indx}-${jndx}">${mtrcdata["sensread"]["senstemp"][indx][jndx]["label"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold">Current</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-curt-${indx}-${jndx}">${mtrcdata["sensread"]["senstemp"][indx][jndx]["current"]} C</dd>
                                        <dt class="col-sm-3 font-weight-bold">High</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-high-${indx}-${jndx}">${mtrcdata["sensread"]["senstemp"][indx][jndx]["high"]} C</dd>
                                        <dt class="col-sm-3 font-weight-bold">Critical</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-crit-${indx}-${jndx}">${mtrcdata["sensread"]["senstemp"][indx][jndx]["critical"]} C</dd>
                                    </dl>
                                </td>
                            </tr>
                            `
                        );
                        snthqant++;
                    }
                }
                document.getElementById("snthhead").innerText = "Thermal readings (" + snthqant + ")";
                let snclqant = 0;
                for (let indx in mtrcdata["sensread"]["fanspeed"]) {
                    for (let jndx in mtrcdata["sensread"]["fanspeed"][indx]) {
                        $("#sncllist").append(
                            `
                            <tr>
                                <td class="pl-2 condqant h2" id="sncl-name-${indx}">
                                    ${indx}/${jndx}
                                </td>
                                <td class="pl-2">
                                    <dl class="row mb-0">
                                        <dt class="col-sm-3 font-weight-bold">Label</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="sncl-labl-${indx}-${jndx}">${mtrcdata["sensread"]["fanspeed"][indx][jndx]["label"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold">Current</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="sncl-curt-${indx}-${jndx}">${mtrcdata["sensread"]["fanspeed"][indx][jndx]["current"]} RPM</dd>
                                    </dl>
                                </td>
                            </tr>
                            `
                        );
                        snclqant++;
                    }
                }
                document.getElementById("snclhead").innerText = "Cooling (" + snclqant + ")";
                // Revealing wrapper when DOM rendering is completed
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        });
    }
}

async function metric_information_operations (mtrciden) {
    await authenticate_endpoint_access();
    await initiate_dom_placeholder_creation_and_population(mtrciden);
    $(function() {
        $(".dial").knob(
            {
                "width": 100,
                "height": 100,
                "readOnly": true,
                "font": "Barlow Condensed",
                "fontWeight": "normal",
                "thickness": 0.1,
                "fgColor": "#3D9970",
            }
        );
    });
}
