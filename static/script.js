var socket = io.connect('http://' + document.domain + ':' + location.port);

var width = 960,
    height = 500,
    twoPi = 2 * Math.PI,
    progress = 0,
    total = 1308573, // must be hard-coded if server doesn't report Content-Length
    formatPercent = d3.format(".0%");

var progress = {};

function buildProgress() {
    var arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(180)
        .outerRadius(240);
    progress.arc = arc;

    var svg = d3.select("#loader").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    progress.svg = svg;

    var meter = svg.append("g")
        .attr("class", "progress-meter");

    meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(twoPi));
    progress.meter = meter;    

    var foreground = meter.append("path")
        .attr("class", "foreground");
    progress.foreground = foreground;

    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");
    progress.text = text;
    progress.currentProgess = 0.0;
}

socket.on('update', function(data){
    var i = d3.interpolate(progress.currentProgess, data.progress);
    d3.transition().tween("progress", function() {
      return function(t) {
        p = i(t);
        progress.foreground.attr("d", progress.arc.endAngle(twoPi * p));
        progress.text.text(formatPercent(p));
      };
    });
    progress.currentProgess = data.progress;
    if(progress.currentProgess == 1.0) {
        progress.meter.transition().delay(250).attr("transform", "scale(0)");
    }
});

function send(){
    d3.select("#start").style("display","none");
    socket.emit('send_message', {message : "hi!"});
    buildProgress();
}