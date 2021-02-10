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

function make_terminal(element, size, ws_url, contiden) {
    var ws = new WebSocket(ws_url);
    var term = new Terminal({
        cols: size.cols,
        rows: size.rows,
        screenKeys: true,
        useStyle: true
    });
    ws.onopen = function(event) {
        ws.send(JSON.stringify(["set_size", size.rows, size.cols, window.innerHeight, window.innerWidth]));
        term.on('data', function (data) {
            ws.send(JSON.stringify(['stdin', data]));
        });
        term.on('title', function (title) {
            document.title = title;
        });
        term.open(element);
        term.write("\u001b[33m\u001b[1m" + "SuperVisor v1.1.0-beta" + "\u001b[0m\u001b[0m" +
            "\r\n" +
            "\u001b[32m" + "Please press BACK button to return to SUPERVISOR" + "\u001b[0m" +
            "\r\n" +
            "\u001b[32m" + "Closing this tab will LOG you out of your current session" + "\u001b[0m" +
            "\r\n\r\n"
        );
        if (contiden.length === 64) {
            if (contiden === "0000000000000000000000000000000000000000000000000000000000000000") {
                term.write(
                    "\u001b[31m\u001b[1m" +
                    "[SYSTEM CONSOLE]" +
                    "\u001b[0m\u001b[0m" +
                    "\r\n\r\n"
                );
            } else {
                term.write(
                    "\u001b[36m\u001b[1m" +
                    "[CONTAINER CONSOLE]" +
                    "\u001b[0m\u001b[0m" +
                    "\r\n\r\n"
                );
            }
        }
        ws.onmessage = function(event) {
            json_msg = JSON.parse(event.data);
            switch(json_msg[0]) {
                case "stdout":
                    term.write(json_msg[1]);
                    break;
                case "disconnect":
                    term.write("\r\n" +
                        "\u001b[33m\u001b[1m" +
                        "CONSOLE EXITED" +
                        "\u001b[0m\u001b[0m" +
                        "\r\n" +
                        "\u001b[32m" +
                        "Please press BACK button to return to SUPERVISOR" +
                        "\u001b[0m" +
                        "\r\n" +
                        "\u001b[32m" + "Closing this tab will LOG you out of your current session" +
                        "\u001b[0m"
                    );
                    break;
            }
        };
    };
    return {
        socket: ws,
        term: term
    };
}

function generate_system_console (contiden) {
    var term_rows_high = 0.0 + 1.02 * document.getElementById("dummy-screen").offsetHeight / 31.25;
    var term_cols_wide = 0.0 + 1.02 * document.getElementById("dummy-screen-rows").offsetWidth / 100;
    document.getElementById("dummy-screen").setAttribute("style", "display: none");
    var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
    let wbscloca = ""
    if (contiden === "0000000000000000000000000000000000000000000000000000000000000000") {
        wbscloca = JSON.parse(sessionStorage.getItem("vsoniden"))["sockloca"] + "websocket";
    } else {
        wbscloca = JSON.parse(sessionStorage.getItem("vsoniden"))["sockloca"] + contiden;
    }
    //var wbscloca = "ws://localhost:6969/websocket";
    function calculate_size(element) {
        var rows = Math.max(2, Math.floor(element.innerHeight / term_rows_high) - 1);
        var cols = Math.max(3, Math.floor(element.innerWidth / term_cols_wide) - 1);
        console.log("resize:", term_rows_high, term_cols_wide, element.innerHeight, element.innerWidth, rows, cols);
        return {
            rows: rows,
            cols: cols
        };
    }
    size = calculate_size(window);
    var terminal = make_terminal(document.body, size, wbscloca, contiden);
    window.onresize = function() {
        var geometry = calculate_size(window);
        terminal.term.resize(geometry.cols, geometry.rows);
        terminal.socket.send(
            JSON.stringify(["set_size", geometry.rows, geometry.cols, window.innerHeight, window.innerWidth])
        );
    };
}

async function authenticate_endpoint_access (contiden) {
    if (sessionStorage.getItem("vsoniden") === null) {
        $("#abstcred").modal("show");
        return false;
    } else {
        let drivloca = JSON.parse(sessionStorage.getItem("vsoniden"))["drivloca"];
        let passcode = JSON.parse(sessionStorage.getItem("vsoniden"))["passcode"];
        let sockloca = JSON.parse(sessionStorage.getItem("vsoniden"))["sockloca"];
        try {
            await $.getJSON(drivloca + "testconn", {
                "passcode": passcode
            }, function (data) {
                if (data["retnmesg"] === "allow") {
                    generate_system_console(contiden);
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

async function system_console_operations (contiden) {
    if (contiden.length === 64) {
        await authenticate_endpoint_access(contiden);
    } else {
        document.location.href = "/e404/";
    }
}
