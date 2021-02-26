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
    $("#custmode").modal("show");
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

function enable_light_mode() {
    let vsoniden = JSON.parse(sessionStorage.getItem("vsoniden"));
    if (vsoniden["darkmode"] === 1) {
        vsoniden["darkmode"] = 0;
        sessionStorage.setItem("vsoniden", JSON.stringify(vsoniden));
        show_toast_notification(
            "fas fa-check-circle",
            "Illuminance applied",
            "Please refresh the page to ensure that the changes for light mode take effect"
        );
    } else {
        show_toast_notification(
            "fas fa-exclamation-circle",
            "Illuminance failed",
            "Light mode is already active so the changes for it could not be applied again"
        );
    }
    $("#custmode").modal("hide");
}

function enable_dark_mode() {
    let vsoniden = JSON.parse(sessionStorage.getItem("vsoniden"));
    if (vsoniden["darkmode"] === 0) {
        vsoniden["darkmode"] = 1;
        sessionStorage.setItem("vsoniden", JSON.stringify(vsoniden));
        show_toast_notification(
            "fas fa-check-circle",
            "Illuminance applied",
            "Please refresh the page to ensure that the changes for dark mode take effect"
        );
    } else {
        show_toast_notification(
            "fas fa-exclamation-circle",
            "Illuminance failed",
            "Dark mode is already active so the changes for it could not be applied again"
        );
    }
    $("#custmode").modal("hide");
}
