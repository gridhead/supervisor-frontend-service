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

function show_theming_modal () {
    if (sessionStorage.getItem("colriden") === null) {
        $("#abstcred").modal("show");
        return false;
    } else {
        $("#custmode").modal("show");
    }
}

function show_toast_notification (icontype, ttletext, conttext) {
    $(document).Toasts(
        "create", {
            title: ttletext,
            body: conttext,
            autohide: true,
            autoremove: true,
            icon: icontype,
            delay: 2500,
            class: "m-2"
        }
    );
}

async function enable_light_mode() {
    let colriden = JSON.parse(sessionStorage.getItem("colriden"));
    if (colriden["darkmode"] === 1) {
        await $.post(
            "/lightset/",
            {
                "darkmode": "STOP"
            },
            function (data) {
                if (JSON.parse(data)["retnmesg"] === "allow") {
                    colriden["darkmode"] = 0;
                    sessionStorage.setItem("colriden", JSON.stringify(colriden));
                    show_toast_notification(
                        "fas fa-check-circle",
                        "Illuminance applied",
                        "Please refresh the page to ensure that the changes for light mode take effect"
                    );
                } else {
                    colriden["darkmode"] = 0;
                    sessionStorage.setItem("colriden", JSON.stringify(colriden));
                    show_toast_notification(
                        "fas fa-exclamation-circle",
                        "Restart your session",
                        "Illumination was reset to the default mode due to an improper server response"
                    );
                }
            }
        )
    } else {
        show_toast_notification(
            "fas fa-exclamation-circle",
            "Illuminance failed",
            "Light mode is already active so the changes for it could not be applied again"
        );
    }
    $("#custmode").modal("hide");
}

async function enable_dark_mode() {
    let colriden = JSON.parse(sessionStorage.getItem("colriden"));
    if (colriden["darkmode"] === 0) {
        await $.post(
            "/lightset/",
            {
                "darkmode": "STRT"
            },
            function (data) {
                if (JSON.parse(data)["retnmesg"] === "allow") {
                    colriden["darkmode"] = 1;
                    sessionStorage.setItem("colriden", JSON.stringify(colriden));
                    show_toast_notification(
                        "fas fa-check-circle",
                        "Illuminance applied",
                        "Please refresh the page to ensure that the changes for dark mode take effect"
                    );
                } else {
                    colriden["darkmode"] = 0;
                    sessionStorage.setItem("colriden", JSON.stringify(colriden));
                    show_toast_notification(
                        "fas fa-exclamation-circle",
                        "Restart your session",
                        "Illumination was reset to the default mode due to an improper server response"
                    );
                }
            }
        )
    } else {
        show_toast_notification(
            "fas fa-exclamation-circle",
            "Illuminance failed",
            "Dark mode is already active so the changes for it could not be applied again"
        );
    }
    $("#custmode").modal("hide");
}
