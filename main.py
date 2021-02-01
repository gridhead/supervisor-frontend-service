"""
##########################################################################
*
*   Copyright © 2019-2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
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
"""

import logging

import click
from flask import Flask, render_template, abort


main = Flask(__name__)
loge = logging.getLogger("werkzeug")
loge.setLevel(logging.ERROR)


@main.route("/mainpytm/")
def graphing():
    return render_template("mainpytm.html")


@main.route("/")
def logepage():
    return render_template("logepage.html")


@main.route("/dashbord/")
def dashbord():
    return render_template("dashbard.html")


@main.route("/dockstat/")
def dockstat():
    return render_template("dockstat.html")


@main.route("/contlist/")
def contlist():
    return render_template("contlist.html")


@main.route("/contdata/<contiden>")
def contdata(contiden):
    if len(contiden) == 64:
        return render_template("continfo.html", contiden=contiden)
    else:
        abort(404)


@click.command()
@click.option("-p", "--portdata", "portdata", help="Set the port value [0-65536]", default="9696")
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address")
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address")
@click.version_option(version="1.0.2", prog_name=click.style("SuperVisor Frontend Service", fg="magenta"))
def mainfunc(portdata, netprotc):
    try:
        click.echo(" * " + click.style("SuperVisor Frontend Service v1.0.2", fg="green"))
        click.echo(" * " + click.style("Port number    ", fg="magenta") + ": " + str(portdata))
        netpdata = ""
        if netprotc == "ipprotv6":
            click.echo(" * " + click.style("IP version     ", fg="magenta") + ": " + "6")
            netpdata = "::"
        elif netprotc == "ipprotv4":
            click.echo(" * " + click.style("IP version     ", fg="magenta") + ": " + "4")
            netpdata = "0.0.0.0"
        click.echo(" * " + click.style("Logs state     ", fg="magenta") + ": " + "Errors only")
        main.config["TEMPLATES_AUTO_RELOAD"] = True
        main.run(port=portdata, host=netpdata)
    except Exception as expt:
        click.echo(" * " + click.style("Error occurred : " + str(expt), fg="red"))


if __name__ == "__main__":
    mainfunc()
