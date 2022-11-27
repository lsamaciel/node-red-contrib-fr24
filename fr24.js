/* eslint-disable no-inner-declarations */

module.exports = function(RED) {
    'use strict'
    const radar = require('flightradar24-client/lib/radar')
    RED.log.info("fr24 version " + require('./package.json').version );

    function FlighRadar24Node(config) {
        var err = null;
        var node = this;
        RED.nodes.createNode(node,config);
        node.north = +config.north;
        node.west = +config.west;
        node.south = +config.south;
        node.east = +config.east;
        node.log('North: ' + node.north)
        node.log('West: ' + node.west)
        node.log('South: ' + node.south)
        node.log('East: ' + node.east)
        if (node.north < -90 || this.north > 90) {
            err = "North should be a number between -90 and 90";
        } else if (this.west < -180 || this.west > 180) {
            err = "West should be a number between -180 and 180";
        } else if (this.south < -90 || this.north > 90) {
            err = "North should be a number between -90 and 90";
        } else if (this.east < -180 || this.east > 180) {
            err = "East should be a number between -180 and 180";
        } else if (this.north <= this.south) {
            err = "North should be greater than South";
        } else if (this.east <= this.west) {
            err = "East should be greater than West";
        }
        node.on('input', function(msg, send, done) {
            if (err) {
                node.error(err)
                node.status({fill:"red",shape:"ring",text:"invalid params"});
                done(err)
                return
            }
            node.status({fill:"yellow",shape:"dot",text:"requesting..."});
            radar(node.north, node.west, node.south, node.east)
            .then((flights) => {
                var outputMsgs = [];
                for (var f in flights) {
                    var flight = flights[f]
                    outputMsgs.push({payload: flight})
                }
                node.debug(flights.length + " flights received")
                send([outputMsgs]);
                node.status({fill:"grey",shape:"dot",text:"sucessful"});
                done();
              })
            .catch((e) => {
                console.log(e.statusCode)
                if (e.message.includes(520))
                    node.status({fill:"red",shape:"dot",text:"too many requests"});
                else
                    node.status({fill:"red",shape:"dot",text:"error"});
                node.error(err)
                done(err)
            });
        });
        node.on('close', function(removed, done) {
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("fr24",FlighRadar24Node);
}