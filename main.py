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
from flask import Flask, abort, render_template


main = Flask(__name__)
loge = logging.getLogger("werkzeug")
loge.setLevel(logging.ERROR)


@main.errorhandler(404)
def e404page(ertx):
    """
    Custom 404 ERROR page
    """
    return render_template("e404page.html"), 404


@main.route("/")
def logepage():
    """
    Endpoint for login page
    """
    return render_template("logepage.html")


@main.route("/dashbord/")
def dashbord():
    """
    Endpoint for station dashboard
    """
    return render_template("dashbard.html")


@main.route("/dockstat/")
def dockstat():
    """
    Endpoint for container station page
    """
    return render_template("dockstat.html")


@main.route("/contlist/")
def contlist():
    """
    Endpoint for container listing page
    """
    return render_template("contlist.html")


@main.route("/imejlist/")
def imejlist():
    """
    Endpoint for image listing page
    """
    return render_template("imejlist.html")


@main.route("/volmlist/")
def volmlist():
    """
    Endpoint for volume listing page
    """
    return render_template("volmlist.html")


@main.route("/ntwklist/")
def ntwklist():
    """
    Endpoint for network listing page
    """
    return render_template("ntwklist.html")


@main.route("/systdata/")
def systdata():
    """
    Endpoint for host system performance data
    """
    return render_template("systdata.html")


@main.route("/proclist/")
def proclist():
    """
    Endpoint for host system process listing page
    """
    return render_template("proclist.html")


@main.route("/imejdata/<imejiden>")
def imejdata(imejiden):
    """
    Endpoint for viewing image data
    """
    if len(imejiden) == 71:
        return render_template("imejinfo.html", imejiden=imejiden)
    else:
        abort(404)


@main.route("/imejrevs/<imejiden>")
def imejrevs(imejiden):
    """
    Endpoint for viewing image revisions
    """
    if len(imejiden) == 71:
        return render_template("imejrevs.html", imejiden=imejiden)
    else:
        abort(404)


@main.route("/contdata/<contiden>")
def contdata(contiden):
    """
    Endpoint for viewing container information
    """
    if len(contiden) == 64:
        return render_template("continfo.html", contiden=contiden)
    else:
        abort(404)


@main.route("/ntwkdata/<ntwkiden>")
def ntwkdata(ntwkiden):
    """
    Endpoint for viewing network information
    """
    if len(ntwkiden) == 64:
        return render_template("ntwkinfo.html", ntwkiden=ntwkiden)
    else:
        abort(404)


@main.route("/volmdata/<volmiden>")
def volmdata(volmiden):
    """
    Endpoint for viewing volume information
    """
    return render_template("volminfo.html", volmiden=volmiden)


@main.route("/contlogs/<contiden>")
def contlogs(contiden):
    """
    Endpoint for viewing container logging data
    """
    if len(contiden) == 64:
        return render_template("contlogs.html", contiden=contiden)
    else:
        abort(404)


@main.route("/contstat/<contiden>")
def contstat(contiden):
    """
    Endpoint for viewing container statistics
    """
    if len(contiden) == 64:
        return render_template("contstat.html", contiden=contiden)
    else:
        abort(404)


@main.route("/conthtop/<contiden>")
def conthtop(contiden):
    """
    Endpoint for viewing container process listing
    """
    if len(contiden) == 64:
        return render_template("conthtop.html", contiden=contiden)
    else:
        abort(404)


@main.route("/termpage/<contiden>")
def termpage(contiden):
    """
    Endpoint for system console page
    """
    return render_template("termpage.html", contiden=contiden)


@click.command()
@click.option("-p", "--portdata", "portdata", help="Set the port value [0-65536]", default="9696")
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address")
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address")
@click.version_option(version="1.1.0-beta", prog_name=click.style("SuperVisor Frontend Service", fg="magenta"))
def mainfunc(portdata, netprotc):
    """
    Main function
    """
    try:
        click.echo(" * " + click.style("SuperVisor Frontend Service v1.1.0-beta", fg="green"))
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
