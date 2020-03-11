var startDate = '1/22/20';
var curDate = startDate.toString();

loadTimelineMap();

const interval = setInterval(function() {    
    loadTimelineMap();
    curDate = getNextDate();
}, 300);

function getNextDate() {
    if(new Date(curDate).getMonth() >= new Date().getMonth() && new Date(curDate).getDate() >= new Date().getDate()) {
        curDate = startDate; 
        return curDate;
    }

    curDate = new Date(curDate);
    curDate.setDate(curDate.getDate() + 1);
    curDate = (curDate.getMonth() + 1 + '/' + curDate.getDate() + '/' + curDate.getFullYear().toString().substring(0, 2));
    return curDate;
}

function loadTimelineMap() {
    Plotly.d3.csv("https://raw.githubusercontent.com/ZacharyMcGee/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var cityName = unpack(rows, 'Province/State'),
            cityPop = unpack(rows, curDate),
            cityLat = unpack(rows, 'Lat'),
            cityLon = unpack(rows, 'Long'),
            color = [,"rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"],
            citySize = [],
            hoverText = [],
            scale = 3;
        
        var currentInfected = 0;

        for (var i = 0; i < rows.length; i++) {
            if(rows[i]["Country/Region"] == "US") {
                if(curDate == "3/10/20") {
                console.log(rows[i]);
                }
                currentInfected = parseInt(currentInfected) + parseInt(cityPop[i]);
            }
        }

        for ( var i = 0 ; i < cityPop.length; i++) {
            var currentSize = cityPop[i] / scale;
            var currentText = cityName[i] + " pop: " + cityPop[i];
            citySize.push(currentSize);
            hoverText.push(currentText);

        }
    
        var data = [{
            type: 'scattergeo',
            locationmode: 'USA-states',
            lat: cityLat,
            lon: cityLon,
            hoverinfo: 'text',
            text: hoverText,
            marker: {
                size: citySize,
                line: {
                    color: 'black',
                    width: 2
                },
            }
        }];
    
        var layout = {
            title: 'US Coronavirus(COVID-19) Outbreak Timeline' + ' : ' + curDate + '<br>' + 'Infected Count: ' + currentInfected,
            showlegend: false,
            geo: {
                scope: 'usa',
                projection: {
                    type: 'albers usa'
                },
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitwidth: 1,
                countrywidth: 1,
                subunitcolor: 'rgb(255,255,255)',
                countrycolor: 'rgb(255,255,255)'
            },
        };
    
        Plotly.newPlot("CoronaTimelineMap", data, layout, {showLink: false});
    
    });
}
