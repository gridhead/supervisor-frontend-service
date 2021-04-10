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

from hashlib import sha256
from json import dumps
from time import time

import click
from __init__ import __version__ as frntvers
from flask import (
    Flask,
    abort,
    redirect,
    render_template,
    request,
    session,
    url_for,
)


main = Flask(__name__)
main.secret_key = "3a5dfd3ed7a259994165c88dedf54130a68368be06e71c786de9c2346273d88f"
sessdict = {}


def retnilum():
    """
    Returns the session-bound illumination value
    If the session does not exist, the default illumination value is LIGHT MODE
    """
    if session["sessiden"] in sessdict:
        darkmode = sessdict[session["sessiden"]]["darkmode"]
    else:
        darkmode = 0
    return darkmode


@main.errorhandler(404)
def e404page(ertx):
    """
    Custom 404 ERROR page
    """
    return render_template("e404page.html", frntvers=frntvers), 404


@main.errorhandler(403)
def e403page(ertx):
    """
    Custom 403 ERROR page
    """
    return render_template("e403page.html", frntvers=frntvers), 403


@main.errorhandler(500)
def e403page(ertx):
    """
    Custom 500 ERROR page
    """
    return render_template("e500page.html", frntvers=frntvers), 500


@main.route("/credpull/", methods=["POST"])
def credpull():
    """
    Fetch credentials stored at server-end
    """
    if "sessiden" in session:
        if request.method == "POST":
            if session["sessiden"] in sessdict:
                retndict = {
                    "retnmesg": "allow",
                    "drivloca": sessdict[session["sessiden"]]["drivloca"],
                    "sockloca": sessdict[session["sessiden"]]["sockloca"],
                    "passcode": sessdict[session["sessiden"]]["passcode"],
                }
            else:
                retndict = {
                    "retnmesg": "deny"
                }
        else:
            retndict = {
                "retnmesg": "deny"
            }
    else:
        retndict = {
            "retnmesg": "deny"
        }
    return dumps(retndict)


@main.route("/svlogout/")
def svlogout():
    """
    Logout and pop session data from session dictionary
    """
    if "sessiden" in session:
        if session["sessiden"] in sessdict:
            sessdict.pop(session["sessiden"])
        session.pop("sessiden", None)
        return redirect(url_for("logepage"))
    else:
        abort(403)


@main.route("/lightset/", methods=["POST"])
def lightset():
    """
    Enable/disable session-bound illuminance setting
    """
    if "sessiden" in session:
        if request.method == "POST":
            darkmode = request.values["darkmode"]
            if darkmode == "STRT":
                if session["sessiden"] in sessdict:
                    sessdict[session["sessiden"]]["darkmode"] = 1
                    retndict = {
                        "retnmesg": "allow"
                    }
                else:
                    retndict = {
                        "retnmesg": "deny"
                    }
            else:
                if session["sessiden"] in sessdict:
                    sessdict[session["sessiden"]]["darkmode"] = 0
                    retndict = {
                        "retnmesg": "allow"
                    }
                else:
                    retndict = {
                        "retnmesg": "deny"
                    }
        else:
            retndict = {
                "retnmesg": "deny"
            }
    else:
        retndict = {
            "retnmesg": "deny"
        }
    return dumps(retndict)


@main.route("/", methods=["GET", "POST"])
def logepage():
    """
    Endpoint for login page
    """
    if "sessiden" in session:
        return redirect(url_for("dashbord"))
    else:
        if request.method == "POST":
            sessdata = {
                "drivloca": request.values["drivloca"],
                "sockloca": request.values["sockloca"],
                "passcode": request.values["passcode"],
                "darkmode": request.values["darkmode"]
            }
            # Following adds timestamp to add extra uniqueness to the identity
            sessiden = sha256((dumps(sessdata) + str(time())).encode()).hexdigest()
            session["sessiden"] = sessiden
            sessdict[sessiden] = sessdata
            return dumps({"retnmesg": "allow"})
    return render_template("logepage.html", frntvers=frntvers)


@main.route("/dashbord/")
def dashbord():
    """
    Endpoint for station dashboard
    """
    if "sessiden" in session:
        return render_template("dashbard.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/dockstat/")
def dockstat():
    """
    Endpoint for container station page
    """
    if "sessiden" in session:
        return render_template("dockstat.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/contlist/")
def contlist():
    """
    Endpoint for container listing page
    """
    if "sessiden" in session:
        return render_template("contlist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/mtrclist/")
def mtrclist():
    """
    Endpoint for metric listing page
    """
    if "sessiden" in session:
        return render_template("mtrclist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/mtrcdata/<mtrciden>")
def mtrcdata(mtrciden):
    """
    Endpoint for per-metric information page
    """
    if "sessiden" in session:
        return render_template("mtrcdata.html", mtrciden=mtrciden, darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/imejlist/")
def imejlist():
    """
    Endpoint for image listing page
    """
    if "sessiden" in session:
        return render_template("imejlist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/volmlist/")
def volmlist():
    """
    Endpoint for volume listing page
    """
    if "sessiden" in session:
        return render_template("volmlist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/ntwklist/")
def ntwklist():
    """
    Endpoint for network listing page
    """
    if "sessiden" in session:
        return render_template("ntwklist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/systdata/")
def systdata():
    """
    Endpoint for host system performance data
    """
    if "sessiden" in session:
        return render_template("systdata.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/proclist/")
def proclist():
    """
    Endpoint for host system process listing page
    """
    if "sessiden" in session:
        return render_template("proclist.html", darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/imejdata/<imejiden>")
def imejdata(imejiden):
    """
    Endpoint for viewing image data
    """
    if "sessiden" in session:
        if len(imejiden) == 71:
            return render_template("imejinfo.html", imejiden=imejiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/imejrevs/<imejiden>")
def imejrevs(imejiden):
    """
    Endpoint for viewing image revisions
    """
    if "sessiden" in session:
        if len(imejiden) == 71:
            return render_template("imejrevs.html", imejiden=imejiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/contdata/<contiden>")
def contdata(contiden):
    """
    Endpoint for viewing container information
    """
    if "sessiden" in session:
        if len(contiden) == 64:
            return render_template("continfo.html", contiden=contiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/ntwkdata/<ntwkiden>")
def ntwkdata(ntwkiden):
    """
    Endpoint for viewing network information
    """
    if "sessiden" in session:
        if len(ntwkiden) == 64:
            return render_template("ntwkinfo.html", ntwkiden=ntwkiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/volmdata/<volmiden>")
def volmdata(volmiden):
    """
    Endpoint for viewing volume information
    """
    if "sessiden" in session:
        return render_template("volminfo.html", volmiden=volmiden, darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


@main.route("/contlogs/<contiden>")
def contlogs(contiden):
    """
    Endpoint for viewing container logging data
    """
    if "sessiden" in session:
        if len(contiden) == 64:
            return render_template("contlogs.html", contiden=contiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/contstat/<contiden>")
def contstat(contiden):
    """
    Endpoint for viewing container statistics
    """
    if "sessiden" in session:
        if len(contiden) == 64:
            return render_template("contstat.html", contiden=contiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/conthtop/<contiden>")
def conthtop(contiden):
    """
    Endpoint for viewing container process listing
    """
    if "sessiden" in session:
        if len(contiden) == 64:
            return render_template("conthtop.html", contiden=contiden, darkmode=retnilum(), frntvers=frntvers)
        else:
            abort(404)
    else:
        abort(403)


@main.route("/termpage/<contiden>")
def termpage(contiden):
    """
    Endpoint for system console page
    """
    if "sessiden" in session:
        return render_template("termpage.html", contiden=contiden, darkmode=retnilum(), frntvers=frntvers)
    else:
        abort(403)


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
        click.echo(" * " + click.style("SuperVisor Frontend Service " + frntvers, fg="green"))
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
