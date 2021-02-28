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

async function initiate_dom_placeholder_creation (contiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishcont", {
            "passcode": passcode,
            "opername": "STAT",
            "contiden": contiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#contntfd").modal("show");
            } else {
                let scpuqant = data["stats"]["cpu_stats"]["online_cpus"];
                for (let indx = 0; indx < scpuqant; indx++) {
                    $("#scpuperu").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold">CPU #${indx}</td>
                            <td class="pl-2 monotext" id="scpu-${indx}">${data["stats"]["cpu_stats"]["cpu_usage"]["percpu_usage"][indx]}</td>
                        </tr>
                        `
                    );
                }
                document.getElementById("scputotu").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["total_usage"];
                document.getElementById("scpukmus").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["usage_in_kernelmode"];
                document.getElementById("scpuumus").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["usage_in_usermode"];
                document.getElementById("scpusyus").innerText = data["stats"]["cpu_stats"]["system_cpu_usage"];
                document.getElementById("scpucpuo").innerText = data["stats"]["cpu_stats"]["online_cpus"];
                document.getElementById("scputhpd").innerText = data["stats"]["cpu_stats"]["throttling_data"]["periods"];
                document.getElementById("scputhtp").innerText = data["stats"]["cpu_stats"]["throttling_data"]["throttled_periods"];
                document.getElementById("scputhtm").innerText = data["stats"]["cpu_stats"]["throttling_data"]["throttled_time"];
                let pcpuqant = data["stats"]["cpu_stats"]["online_cpus"];
                for (let indx = 0; indx < pcpuqant; indx++) {
                    $("#pcpuperu").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold">CPU #${indx}</td>
                            <td class="pl-2 monotext" id="pcpu-${indx}">${data["stats"]["precpu_stats"]["cpu_usage"]["percpu_usage"][indx]}</td>
                        </tr>
                        `
                    );
                }
                document.getElementById("pcputotu").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["total_usage"];
                document.getElementById("pcpukmus").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["usage_in_kernelmode"];
                document.getElementById("pcpuumus").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["usage_in_usermode"];
                document.getElementById("pcpusyus").innerText = data["stats"]["precpu_stats"]["system_cpu_usage"];
                document.getElementById("pcpucpuo").innerText = data["stats"]["precpu_stats"]["online_cpus"];
                document.getElementById("pcputhpd").innerText = data["stats"]["precpu_stats"]["throttling_data"]["periods"];
                document.getElementById("pcputhtp").innerText = data["stats"]["precpu_stats"]["throttling_data"]["throttled_periods"];
                document.getElementById("pcputhtm").innerText = data["stats"]["precpu_stats"]["throttling_data"]["throttled_time"];
                for (indx in data["stats"]["memory_stats"]["stats"]) {
                    $("#memostat").append(
                        `
                        <tr>
                            <td class="pl-2 font-weight-bold">${indx}</td>
                            <td class="pl-2 monotext" id="msta-${indx}">${data["stats"]["memory_stats"]["stats"][indx]}&nbsp;bytes</td>
                        </tr>
                        `
                    );
                }
                document.getElementById("memuusej").innerText = data["stats"]["memory_stats"]["usage"] + " bytes";
                document.getElementById("memumaxu").innerText = data["stats"]["memory_stats"]["max_usage"] + " bytes";
                document.getElementById("memulimt").innerText = data["stats"]["memory_stats"]["limit"] + " bytes";
                for (indx in data["stats"]["networks"]) {
                    $("#ntwkstat").append(
                        `
                        <div class="card">
                            <div class="card-header bg-olive pl-2">
                                <h3 class="card-title font-weight-bold">${indx}</h3>
                            </div>
                            <div class="card-body p-0">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th class="pl-2" style="width: 25%;">Attribute</th>
                                            <th class="pl-2" style="width: 75%;">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Bytes received</td>
                                            <td class="pl-2 monotext" id="ntwk-btrc-${indx}">${data["stats"]["networks"][indx]["rx_bytes"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Packets received</td>
                                            <td class="pl-2 monotext" id="ntwk-pkrc-${indx}">${data["stats"]["networks"][indx]["rx_packets"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Errors on reception</td>
                                            <td class="pl-2 monotext" id="ntwk-errc-${indx}">${data["stats"]["networks"][indx]["rx_errors"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Drops on reception</td>
                                            <td class="pl-2 monotext" id="ntwk-dprc-${indx}">${data["stats"]["networks"][indx]["rx_dropped"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Bytes transmitted</td>
                                            <td class="pl-2 monotext" id="ntwk-bttx-${indx}">${data["stats"]["networks"][indx]["tx_bytes"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Packets transmitted</td>
                                            <td class="pl-2 monotext" id="ntwk-pktx-${indx}">${data["stats"]["networks"][indx]["tx_packets"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Errors on transmission</td>
                                            <td class="pl-2 monotext" id="ntwk-ertx-${indx}">${data["stats"]["networks"][indx]["tx_errors"]}</td>
                                        </tr>
                                        <tr>
                                            <td class="pl-2 font-weight-bold">Drops on transmission</td>
                                            <td class="pl-2 monotext" id="ntwk-dptx-${indx}">${data["stats"]["networks"][indx]["tx_dropped"]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        `
                    );
                }
                document.getElementById("contwrap").removeAttribute("hidden");
            }
        });
    }
}

async function refresh_container_stats_periodically (contiden, rfrstime, physgraf, physline, cpuugraf, cpuuline) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        while (1) {
            await new Promise(r => setTimeout(r, rfrstime * 1000));
            let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
            let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
            await $.getJSON(drivloca + "dishcont", {
                "passcode": passcode,
                "opername": "STAT",
                "contiden": contiden
            }, function (data) {
                if (data["retnmesg"] === "deny") {
                    $("#contntfd").modal("show");
                } else {
                    let scpuqant = data["stats"]["cpu_stats"]["online_cpus"];
                    for (let indx = 0; indx < scpuqant; indx++) {
                        document.getElementById("scpu-" + indx).innerText = data["stats"]["precpu_stats"]["cpu_usage"]["percpu_usage"][indx];
                    }
                    document.getElementById("scputotu").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["total_usage"];
                    document.getElementById("scpukmus").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["usage_in_kernelmode"];
                    document.getElementById("scpuumus").innerText = data["stats"]["cpu_stats"]["cpu_usage"]["usage_in_usermode"];
                    document.getElementById("scpusyus").innerText = data["stats"]["cpu_stats"]["system_cpu_usage"];
                    document.getElementById("scpucpuo").innerText = data["stats"]["cpu_stats"]["online_cpus"];
                    document.getElementById("scputhpd").innerText = data["stats"]["cpu_stats"]["throttling_data"]["periods"];
                    document.getElementById("scputhtp").innerText = data["stats"]["cpu_stats"]["throttling_data"]["throttled_periods"];
                    document.getElementById("scputhtm").innerText = data["stats"]["cpu_stats"]["throttling_data"]["throttled_time"];
                    let pcpuqant = data["stats"]["cpu_stats"]["online_cpus"];
                    for (let indx = 0; indx < pcpuqant; indx++) {
                        document.getElementById("pcpu-" + indx).innerText = data["stats"]["cpu_stats"]["cpu_usage"]["percpu_usage"][indx];
                    }
                    document.getElementById("pcputotu").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["total_usage"];
                    document.getElementById("pcpukmus").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["usage_in_kernelmode"];
                    document.getElementById("pcpuumus").innerText = data["stats"]["precpu_stats"]["cpu_usage"]["usage_in_usermode"];
                    document.getElementById("pcpusyus").innerText = data["stats"]["precpu_stats"]["system_cpu_usage"];
                    document.getElementById("pcpucpuo").innerText = data["stats"]["precpu_stats"]["online_cpus"];
                    document.getElementById("pcputhpd").innerText = data["stats"]["precpu_stats"]["throttling_data"]["periods"];
                    document.getElementById("pcputhtp").innerText = data["stats"]["precpu_stats"]["throttling_data"]["throttled_periods"];
                    document.getElementById("pcputhtm").innerText = data["stats"]["precpu_stats"]["throttling_data"]["throttled_time"];
                    for (indx in data["stats"]["memory_stats"]["stats"]) {
                        document.getElementById("msta-" + indx).innerText = data["stats"]["memory_stats"]["stats"][indx] + " bytes";
                    }
                    document.getElementById("memuusej").innerText = data["stats"]["memory_stats"]["usage"] + " bytes";
                    document.getElementById("memumaxu").innerText = data["stats"]["memory_stats"]["max_usage"] + " bytes";
                    document.getElementById("memulimt").innerText = data["stats"]["memory_stats"]["limit"] + " bytes";
                    for (indx in data["stats"]["networks"]) {
                        document.getElementById("ntwk-btrc-" + indx).innerText = data["stats"]["networks"][indx]["rx_bytes"];
                        document.getElementById("ntwk-pkrc-" + indx).innerText = data["stats"]["networks"][indx]["rx_packets"];
                        document.getElementById("ntwk-errc-" + indx).innerText = data["stats"]["networks"][indx]["rx_errors"];
                        document.getElementById("ntwk-dprc-" + indx).innerText = data["stats"]["networks"][indx]["rx_dropped"];
                        document.getElementById("ntwk-bttx-" + indx).innerText = data["stats"]["networks"][indx]["tx_bytes"];
                        document.getElementById("ntwk-pktx-" + indx).innerText = data["stats"]["networks"][indx]["tx_packets"];
                        document.getElementById("ntwk-ertx-" + indx).innerText = data["stats"]["networks"][indx]["tx_errors"];
                        document.getElementById("ntwk-dptx-" + indx).innerText = data["stats"]["networks"][indx]["tx_dropped"];
                    }

                    // Thank you TomasTomecek for your code snippet for finding out CPU usage percent!
                    // https://github.com/TomasTomecek/sen/blob/master/sen/util.py#L158

                    let percqant = data["stats"]["cpu_stats"]["online_cpus"];
                    let cpuuperc = 0.0;
                    let cpudelta = data["stats"]["cpu_stats"]["cpu_usage"]["total_usage"] - data["stats"]["precpu_stats"]["cpu_usage"]["total_usage"];
                    let sysdelta = data["stats"]["cpu_stats"]["system_cpu_usage"] - data["stats"]["precpu_stats"]["system_cpu_usage"];
                    if (sysdelta > 0.0) {
                        cpuuperc = (cpudelta / sysdelta) * 100.0 * percqant;
                    }
                    document.getElementById("cpuuperc").innerText = cpuuperc.toPrecision(3) + "%";
                    cpuuline.append(new Date().getTime(), cpuuperc.toPrecision(3));
                    cpuugraf.streamTo(document.getElementById("cpuuover"), rfrstime * 1000);

                    let usejperc = data["stats"]["memory_stats"]["usage"]/data["stats"]["memory_stats"]["limit"];
                    document.getElementById("physperc").innerText = usejperc.toPrecision(3) + "%";
                    physline.append(new Date().getTime(), usejperc.toPrecision(3));
                    physgraf.streamTo(document.getElementById("physover"), rfrstime * 1000);
                }
            });
        }
    }
}

async function populate_container_name_and_status (contiden) {
    if (sessionStorage.getItem("vsoniden") !== null) {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        await $.getJSON(drivloca + "dishcont", {
            "passcode": passcode,
            "opername": "IDEN",
            "contiden": contiden
        }, function (data) {
            if (data["retnmesg"] === "deny") {
                $("#contntfd").modal("show");
            } else {
                document.getElementById("contname").innerText = data["name"].substring(0, 25);
                if (data["attrs"]["State"]["Status"] === "running") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-success");
                } else if (data["attrs"]["State"]["Status"] === "created") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-pink");
                } else if (data["attrs"]["State"]["Status"] === "restarting") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-orange");
                } else if (data["attrs"]["State"]["Status"] === "paused") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-teal");
                } else if (data["attrs"]["State"]["Status"] === "exited") {
                    document.getElementById("contstat").innerText = data["attrs"]["State"]["Status"].toUpperCase();
                    document.getElementById("contstat").classList.add("bg-red");
                }
            }
        });
    }
}

async function container_statistics_operations (contiden) {
    let rfrstime = 1;
    let physgraf = new SmoothieChart(grafstyl);
    let physline = new TimeSeries();
    physgraf.addTimeSeries(physline, linestyl);
    let cpuugraf = new SmoothieChart(grafstyl);
    let cpuuline = new TimeSeries();
    cpuugraf.addTimeSeries(cpuuline, linestyl);
    await authenticate_endpoint_access();
    await populate_container_name_and_status(contiden);
    await initiate_dom_placeholder_creation(contiden);
    await refresh_container_stats_periodically(contiden, rfrstime, physgraf, physline, cpuugraf, cpuuline);
}
