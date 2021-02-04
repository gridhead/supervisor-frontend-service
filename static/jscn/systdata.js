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

let grafstyl = {
    responsive: true,
    minValue: 0,
    maxValue: 100,
    grid: {
        strokeStyle: '#c0c0c0',
        fillStyle: 'rgba(0, 0, 0, 0)',
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 10,
    },
    labels: {
        fillStyle: '#008080'
    }
};

let linestyl = {
    strokeStyle: '#00c080',
    fillStyle: 'rgba(0, 128, 128, 0.25)',
    lineWidth: 2
};

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

async function initiate_dom_placeholder_creation_and_refreshing (rfrstime) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "basestat", {
            "passcode": passcode,
            "opername": "deadsync"
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#connfail").modal("show");
            } else {
                document.getElementById("hostname").innerText = data["osnmdata"]["Username"] + "@" + data["osnmdata"]["Host name"];
                document.getElementById("bsicuser").innerText = data["osnmdata"]["Username"];
                document.getElementById("bsicsyst").innerText = data["osnmdata"]["System name"];
                document.getElementById("bsichost").innerText = data["osnmdata"]["Host name"];
                document.getElementById("bsicvers").innerText = data["osnmdata"]["Version"];
                document.getElementById("contwrap").removeAttribute("hidden");
                let cpuquant = data["cpuquant"];
                for (let indx = 0; indx < data["cpuquant"]; indx ++) {
                    $("#cppclist").append(
                        `
                        <h2 class="condqant ml-1">CPU #${indx} - <span class="condqant" id="cpuu-perc-${indx}">0</span>%</h2>
                        <canvas id="cpuu-over-${indx}" style="width:100%; height:20vh;"></canvas>
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
                                    <td class="pl-2 monotext nogetout" id="cppc-curt-${indx}">${data["cpuclock"][indx]["current"]} MHz</td>
                                </tr>
                                <tr>
                                    <td class="pl-2 font-weight-bold">Minimum</td>
                                    <td class="pl-2 monotext nogetout" id="cppc-minu-${indx}">${data["cpuclock"][indx]["min"]} MHz</td>
                                </tr>
                                <tr>
                                    <td class="pl-2 font-weight-bold">Maximum</td>
                                    <td class="pl-2 monotext nogetout" id="cppc-maxu-${indx}">${data["cpuclock"][indx]["max"]} MHz</td>
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
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-user-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Nice</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-nice-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">System</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-syst-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Idle</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-idle-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">IO wait</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-iowt-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">IRQ</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-cirq-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Soft IRQ</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-sirq-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Steal</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-stil-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Guest</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-gest-${indx}">UNAVAILABLE</dd>
                                    <dt class="col-sm-3 font-weight-bold">Guest nice</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="cptm-gtnc-${indx}">UNAVAILABLE</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    $("#cpsllist").append(
                        `
                        <h2 class="condqant ml-1">CPU #${indx} - <span class="condqant" id="cpst-perc-${indx}">0</span>%</h2>
                        <canvas id="cpst-over-${indx}" style="width:100%; height:20vh;"></canvas>
                        `
                    );
                }
                let mtdvqant = 0;
                for (mtdvqant = 0; mtdvqant < data["diskpart"].length; mtdvqant ++) {
                    $("#mtdvlist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2">
                                #${mtdvqant}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">Device</dt>
                                    <dd class="col-sm-9 monotext nogetout">${data["diskpart"][mtdvqant]["device"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Mount point</dt>
                                    <dd class="col-sm-9 monotext nogetout">${data["diskpart"][mtdvqant]["mountpoint"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">File system</dt>
                                    <dd class="col-sm-9 monotext nogetout">${data["diskpart"][mtdvqant]["fstype"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">OPTS</dt>
                                    <dd class="col-sm-9 monotext nogetout">${data["diskpart"][mtdvqant]["opts"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                }
                document.getElementById("mtdvhead").innerText = "Mounted devices (" + mtdvqant + ")";
                let diouqant = 0;
                for (let indx in data["diousage"]) {
                    $("#dioulist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2" id="diou-name-${indx}">
                                ${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">Read count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdct-${indx}">${data["diousage"][indx]["read_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrct-${indx}">${data["diousage"][indx]["write_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read bytes</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdbt-${indx}">${data["diousage"][indx]["read_bytes"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write bytes</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrbt-${indx}">${data["diousage"][indx]["write_bytes"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rdtm-${indx}">${data["diousage"][indx]["read_time"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wrtm-${indx}">${data["diousage"][indx]["write_time"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Read merged count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-rmct-${indx}">${data["diousage"][indx]["read_merged_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Write merged count</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-wmct-${indx}">${data["diousage"][indx]["write_merged_count"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Busy time</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="diou-bstm-${indx}">${data["diousage"][indx]["busy_time"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    diouqant++;
                }
                document.getElementById("diouhead").innerText = "Disk I/O usage (" + diouqant + ")";
                let ntusqant = 0;
                for (let indx in data["netusage"]) {
                    $("#ntuslist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2" id="ntus-name-${indx}">
                                ${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">Bytes sent</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-btst-${indx}">${data["netusage"][indx]["bytes_sent"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Bytes received</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-btrc-${indx}">${data["netusage"][indx]["bytes_recv"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Packets sent</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-pkst-${indx}">${data["netusage"][indx]["packets_sent"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Packets received</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-pkrc-${indx}">${data["netusage"][indx]["packets_recv"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Ingress errors</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-iger-${indx}">${data["netusage"][indx]["errin"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Egress errors</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-eger-${indx}">${data["netusage"][indx]["errout"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Ingress drops</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-igdp-${indx}">${data["netusage"][indx]["dropin"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Egress drops</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntus-egdp-${indx}">${data["netusage"][indx]["dropout"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    ntusqant++;
                }
                document.getElementById("ntushead").innerText = "Network usage (" + ntusqant + ")";
                let ntadqant = 0;
                for (let indx in data["netaddrs"]) {
                    for (let jndx in data["netaddrs"][indx]) {
                        $("#ntadlist").append(
                            `
                            <tr>
                                <td class="pl-2 condqant h2" id="ntad-name-${indx}">
                                    ${indx}/${jndx}
                                </td>
                                <td class="pl-2">
                                    <dl class="row mb-0">
                                        <dt class="col-sm-3 font-weight-bold"><i class="fas fa-location-arrow"></i>&nbsp;Address</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="ntad-addr-${indx}-${jndx}">${data["netaddrs"][indx][jndx]["address"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold"><i class="fas fa-mask"></i>&nbsp;Netmask</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="ntad-mask-${indx}-${jndx}">${data["netaddrs"][indx][jndx]["netmask"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold"><i class="fas fa-wifi"></i>&nbsp;Broadcast</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="ntad-bdct-${indx}-${jndx}">${data["netaddrs"][indx][jndx]["broadcast"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold"><i class="fas fa-peace"></i>&nbsp;PTP</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="ntad-ptpe-${indx}-${jndx}">${data["netaddrs"][indx][jndx]["ptp"]}</dd>
                                    </dl>
                                </td>
                            </tr>
                            `
                        );
                        ntadqant++;
                    }
                }
                document.getElementById("ntadhead").innerText = "Network addresses (" + ntadqant + ")";
                let ntssqant = 0;
                for (let indx in data["netstats"]) {
                    $("#ntsslist").append(
                        `
                        <tr>
                            <td class="pl-2 condqant h2" id="ntss-name-${indx}">
                                ${indx}
                            </td>
                            <td class="pl-2">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3 font-weight-bold">State</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntss-isup-${indx}">${data["netstats"][indx]["isup"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Duplex</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntss-dplx-${indx}">${data["netstats"][indx]["duplex"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">Speed</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntss-spid-${indx}">${data["netstats"][indx]["speed"]}</dd>
                                    <dt class="col-sm-3 font-weight-bold">MTU</dt>
                                    <dd class="col-sm-9 monotext nogetout" id="ntss-nmtu-${indx}">${data["netstats"][indx]["mtu"]}</dd>
                                </dl>
                            </td>
                        </tr>
                        `
                    );
                    ntssqant++;
                }
                document.getElementById("ntsshead").innerText = "Network statistics (" + ntssqant + ")";
                let snthqant = 0;
                for (let indx in data["sensread"]["senstemp"]) {
                    for (let jndx in data["sensread"]["senstemp"][indx]) {
                        $("#snthlist").append(
                            `
                            <tr>
                                <td class="pl-2 condqant h2" id="snth-name-${indx}">
                                    ${indx}/${jndx}
                                </td>
                                <td class="pl-2">
                                    <dl class="row mb-0">
                                        <dt class="col-sm-3 font-weight-bold">Label</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-labl-${indx}-${jndx}">${data["sensread"]["senstemp"][indx][jndx]["label"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold">Current</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-curt-${indx}-${jndx}">${data["sensread"]["senstemp"][indx][jndx]["current"]} C</dd>
                                        <dt class="col-sm-3 font-weight-bold">High</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-high-${indx}-${jndx}">${data["sensread"]["senstemp"][indx][jndx]["high"]} C</dd>
                                        <dt class="col-sm-3 font-weight-bold">Critical</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="snth-crit-${indx}-${jndx}">${data["sensread"]["senstemp"][indx][jndx]["critical"]} C</dd>
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
                for (let indx in data["sensread"]["fanspeed"]) {
                    for (let jndx in data["sensread"]["fanspeed"][indx]) {
                        $("#sncllist").append(
                            `
                            <tr>
                                <td class="pl-2 condqant h2" id="sncl-name-${indx}">
                                    ${indx}/${jndx}
                                </td>
                                <td class="pl-2">
                                    <dl class="row mb-0">
                                        <dt class="col-sm-3 font-weight-bold">Label</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="sncl-labl-${indx}-${jndx}">${data["sensread"]["fanspeed"][indx][jndx]["label"]}</dd>
                                        <dt class="col-sm-3 font-weight-bold">Current</dt>
                                        <dd class="col-sm-9 monotext nogetout" id="sncl-curt-${indx}-${jndx}">${data["sensread"]["fanspeed"][indx][jndx]["current"]} RPM</dd>
                                    </dl>
                                </td>
                            </tr>
                            `
                        );
                        snclqant++;
                    }
                }
                document.getElementById("snclhead").innerText = "Cooling (" + snclqant + ")";
                refresh_system_stats_periodically(rfrstime, cpuquant);
            }
        });
    }
}


async function refresh_system_stats_periodically (rfrstime, cpuuqant) {
    let physgraf = new SmoothieChart(grafstyl);
    let physline = new TimeSeries();
    physgraf.addTimeSeries(physline, linestyl);
    let swapgraf = new SmoothieChart(grafstyl);
    let swapline = new TimeSeries();
    swapgraf.addTimeSeries(swapline, linestyl);
    let cppcgraf = [];
    let cppcline = [];
    let cpstgraf = [];
    let cpstline = [];
    for (let indx = 0; indx < cpuuqant;  indx ++) {
        cppcgraf[indx] = new SmoothieChart(grafstyl);
        cppcline[indx] = new TimeSeries();
        cppcgraf[indx].addTimeSeries(cppcline[indx], linestyl);
        cpstgraf[indx] = new SmoothieChart(grafstyl);
        cpstline[indx] = new TimeSeries();
        cpstgraf[indx].addTimeSeries(cpstline[indx], linestyl);
    }
    let battgraf = new SmoothieChart(grafstyl);
    let battline = new TimeSeries();
    battgraf.addTimeSeries(battline, linestyl);
    if (sessionStorage.getItem("vsoniden") !== null) {
        while (1) {
            await new Promise(r => setTimeout(r,  rfrstime * 1000));
            let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
            let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
            await $.getJSON(drivloca + "basestat", {
                "passcode": passcode,
                "opername": "livesync"
            }, function (data) {
                if (data["retnmesg"] === "deny") {
                    $("#connfail").modal("show");
                } else {
                    // Physical memory
                    let usejperc = data["virtdata"]["percent"];
                    document.getElementById("physperc").innerText = usejperc.toPrecision(3);
                    physline.append(new Date().getTime(), usejperc.toPrecision(3));
                    physgraf.streamTo(document.getElementById("physover"), rfrstime * 1000);
                    document.getElementById("phystotl").innerText = data["virtdata"]["total"] + " bytes";
                    document.getElementById("physavbl").innerText = data["virtdata"]["available"] + " bytes";
                    document.getElementById("physused").innerText = data["virtdata"]["used"] + " bytes";
                    document.getElementById("physactv").innerText = data["virtdata"]["active"] + " bytes";
                    document.getElementById("physinac").innerText = data["virtdata"]["inactive"] + " bytes";
                    document.getElementById("physbuff").innerText = data["virtdata"]["buffers"] + " bytes";
                    document.getElementById("physcach").innerText = data["virtdata"]["cached"] + " bytes";
                    document.getElementById("physshar").innerText = data["virtdata"]["shared"] + " bytes";
                    document.getElementById("physslab").innerText = data["virtdata"]["slab"] + " bytes";
                    // Virtual memory
                    let swapperc = data["swapinfo"]["percent"];
                    document.getElementById("virtperc").innerText = swapperc.toPrecision(3);
                    swapline.append(new Date().getTime(), swapperc.toPrecision(3));
                    swapgraf.streamTo(document.getElementById("virtover"), rfrstime * 1000);
                    document.getElementById("virttotl").innerText = data["swapinfo"]["total"] + " bytes";
                    document.getElementById("virtused").innerText = data["swapinfo"]["used"] + " bytes";
                    document.getElementById("virtfree").innerText = data["swapinfo"]["free"] + " bytes";
                    document.getElementById("virtsine").innerText = data["swapinfo"]["sin"] + " bytes";
                    document.getElementById("virtsout").innerText = data["swapinfo"]["sout"] + " bytes";
                    // CPU clock speed
                    for (let indx = 0; indx < cpuuqant; indx ++) {
                        document.getElementById("cppc-curt-" + indx).innerText = data["cpuclock"][indx]["current"].toPrecision(5) + "MHz";
                        document.getElementById("cppc-minu-" + indx).innerText = data["cpuclock"][indx]["min"].toPrecision(5) + "MHz";
                        document.getElementById("cppc-maxu-" + indx).innerText = data["cpuclock"][indx]["max"].toPrecision(5) + "MHz";
                        let cppcperc = ( data["cpuclock"][indx]["current"] / data["cpuclock"][indx]["max"] ) * 100.0
                        cppcline[indx].append(new Date().getTime(), cppcperc.toPrecision(3));
                        cppcgraf[indx].streamTo(document.getElementById("cpuu-over-" + indx), rfrstime * 1000);
                        document.getElementById("cpuu-perc-" + indx).innerText = cppcperc.toPrecision(3);
                    }
                    // CPU times
                    for (let indx = 0; indx < cpuuqant; indx ++) {
                        document.getElementById("cptm-user-" + indx).innerText = data["cputimes"][indx]["user"];
                        document.getElementById("cptm-nice-" + indx).innerText = data["cputimes"][indx]["nice"];
                        document.getElementById("cptm-syst-" + indx).innerText = data["cputimes"][indx]["system"];
                        document.getElementById("cptm-idle-" + indx).innerText = data["cputimes"][indx]["idle"];
                        document.getElementById("cptm-iowt-" + indx).innerText = data["cputimes"][indx]["iowait"];
                        document.getElementById("cptm-cirq-" + indx).innerText = data["cputimes"][indx]["irq"];
                        document.getElementById("cptm-sirq-" + indx).innerText = data["cputimes"][indx]["softirq"];
                        document.getElementById("cptm-stil-" + indx).innerText = data["cputimes"][indx]["steal"];
                        document.getElementById("cptm-gest-" + indx).innerText = data["cputimes"][indx]["guest"];
                        document.getElementById("cptm-gtnc-" + indx).innerText = data["cputimes"][indx]["guest_nice"];
                    }
                    // CPU stress levels
                    for (let indx = 0; indx < cpuuqant; indx ++) {
                        let cpstperc = data["cpuprcnt"][indx];
                        cpstline[indx].append(new Date().getTime(), cpstperc.toPrecision(3));
                        cpstgraf[indx].streamTo(document.getElementById("cpst-over-" + indx), rfrstime * 1000);
                        document.getElementById("cpst-perc-" + indx).innerText = cpstperc.toPrecision(3);
                    }
                    // CPU statistics
                    document.getElementById("cpstctxs").innerText = data["cpustats"]["ctx_switches"];
                    document.getElementById("cpstintr").innerText = data["cpustats"]["interrupts"];
                    document.getElementById("cpstcint").innerText = data["cpustats"]["soft_interrupts"];
                    document.getElementById("cpstsycl").innerText = data["cpustats"]["syscalls"];
                    // Storage IO usage
                    for (indx in data["diousage"]) {
                        document.getElementById("diou-rdct-" + indx).innerText = data["diousage"][indx]["read_count"];
                        document.getElementById("diou-wrct-" + indx).innerText = data["diousage"][indx]["write_count"];
                        document.getElementById("diou-rdbt-" + indx).innerText = data["diousage"][indx]["read_bytes"];
                        document.getElementById("diou-wrbt-" + indx).innerText = data["diousage"][indx]["write_bytes"];
                        document.getElementById("diou-rdtm-" + indx).innerText = data["diousage"][indx]["read_time"];
                        document.getElementById("diou-wrtm-" + indx).innerText = data["diousage"][indx]["write_time"];
                        document.getElementById("diou-rmct-" + indx).innerText = data["diousage"][indx]["read_merged_count"];
                        document.getElementById("diou-wmct-" + indx).innerText = data["diousage"][indx]["write_merged_count"];
                        document.getElementById("diou-bstm-" + indx).innerText = data["diousage"][indx]["busy_time"];
                    }
                    // Network usage
                    for (indx in data["netusage"]) {
                        document.getElementById("ntus-btst-" + indx).innerText = data["netusage"][indx]["bytes_sent"];
                        document.getElementById("ntus-btrc-" + indx).innerText = data["netusage"][indx]["bytes_recv"];
                        document.getElementById("ntus-pkst-" + indx).innerText = data["netusage"][indx]["packets_sent"];
                        document.getElementById("ntus-pkrc-" + indx).innerText = data["netusage"][indx]["packets_recv"];
                        document.getElementById("ntus-iger-" + indx).innerText = data["netusage"][indx]["errin"];
                        document.getElementById("ntus-eger-" + indx).innerText = data["netusage"][indx]["errout"];
                        document.getElementById("ntus-igdp-" + indx).innerText = data["netusage"][indx]["dropin"];
                        document.getElementById("ntus-egdp-" + indx).innerText = data["netusage"][indx]["dropout"];
                    }
                    // Thermal readings
                    for (let indx in data["sensread"]["senstemp"]) {
                        for (let jndx in data["sensread"]["senstemp"][indx]) {
                            document.getElementById("snth-labl-" + indx + "-" + jndx).innerText = data["sensread"]["senstemp"][indx][jndx]["label"];
                            document.getElementById("snth-curt-" + indx + "-" + jndx).innerText = data["sensread"]["senstemp"][indx][jndx]["current"] + " C";
                            document.getElementById("snth-high-" + indx + "-" + jndx).innerText = data["sensread"]["senstemp"][indx][jndx]["high"] + " C";
                            document.getElementById("snth-crit-" + indx + "-" + jndx).innerText = data["sensread"]["senstemp"][indx][jndx]["critical"] + " C";
                        }
                    }
                    // Cooling
                    for (let indx in data["sensread"]["fanspeed"]) {
                        for (let jndx in data["sensread"]["fanspeed"][indx]) {
                            document.getElementById("sncl-labl-" + indx + "-" + jndx).innerText = data["sensread"]["fanspeed"][indx][jndx]["label"];
                            document.getElementById("sncl-curt-" + indx + "-" + jndx).innerText = data["sensread"]["fanspeed"][indx][jndx]["current"] + " RPM";
                        }
                    }
                    // Battery
                    let battperc = data["sensread"]["battstat"]["percent"];
                    let secsleft = data["sensread"]["battstat"]["secsleft"];
                    document.getElementById("snbtperc").innerText = battperc.toPrecision(3);
                    document.getElementById("snbttime").innerText = secsleft.toPrecision(5);
                    document.getElementById("snbtplug").innerText = data["sensread"]["battstat"]["power_plugged"];
                    battline.append(new Date().getTime(), battperc.toPrecision(3));
                    battgraf.streamTo(document.getElementById("battover"), rfrstime * 1000);
                }
            });
        }
    }
}


async function system_information_operations () {
    let rfrstime = 1;
    await authenticate_endpoint_access();
    await initiate_dom_placeholder_creation_and_refreshing(rfrstime);
}
