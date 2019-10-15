
var processes = {};
var memory = [];
var memoryLeft = 15;

var attDiv = $("#attending-div");
var waiDiv = $("#waiting-div");

for (var i = 0; i < memoryLeft; i++) {
    memory.push(null);
}

$("#add-btn").click(function () {
    var name = $("#name-input").val();
    var size = $("#size-input").val();
    
    if (name != '' && size > 0) {
        if (name in processes) { alert("El proceso ya está en el sistema"); return; }
        if (size <= memoryLeft) {
            processes[name] = {
                name: name,
                size: size,
                state: 'attending',
                color: 'rgb(' + Math.floor(Math.random() * 150) + ',' +
                    Math.floor(Math.random() * 150) + ',' + Math.floor(Math.random() * 150) + ')'
            }
            fillMemory(processes[name]);
            memoryLeft -= size;
        } else {
            processes[name] = {
                name: name,
                size: size,
                state: 'waiting',
                color: 'rgb(' + Math.floor(Math.random() * 150) + ',' +
                    Math.floor(Math.random() * 150) + ',' + Math.floor(Math.random() * 150) + ')'
            }
        }
        redrawDivs();
        redrawMemory();
    } 

});

$("#remove-btn").click(function () {
    var name = $("#name-input").val();
    if (name != '' && name in processes) {
        memoryLeft += parseInt(processes[name]['size']);
        clearMemory(processes[name]);
        delete processes[name];
        redrawDivs();
        redrawMemory();
    } else { alert("El proceso no está en el sistema"); return; }
});

$("#upload-btn").click(function () {
    var name = $("#name-input").val();
    if (name != '' && name in processes) {
        var size = processes[name]['size'];
        if (size <= memoryLeft) {
            processes[name]['state'] = 'attending';
            fillMemory(processes[name]);
            memoryLeft -= size;
        } else { alert("El proceso " + name + " aún no cabe en memoria"); return; }
    }
    redrawDivs();
    redrawMemory();
});

function redrawDivs() {
    attDiv.empty();
    waiDiv.empty();
    for (var name in processes) {
        var state = processes[name]['state'];
        var size = processes[name]['size'];
        if (state == 'attending') {
            attDiv.append(`
                <label class="label" style="text-align: center; 
                    color: white;">` + name + ` <span style="font-weight: normal;">
                    (` + size + `kB)</span></label>
            `);
        } else {
            waiDiv.append(`
                <label class="label" style="text-align: center; 
                    color: white;">` + name + ` <span style="font-weight: normal;">
                    (` + size + `kB)</span></label>
            `);
        }
    }
}

function redrawMemory() {
    for (var i = 0; i < memory.length; i++) {
        if (memory[i] != null) {
            $("#mem" + i + " div").css("background-color", memory[i]['color']);
            $("#mem" + i + " div").css("height", 100 + "%");
            $("#mem" + i + " div").text(memory[i]['name']);
        } else {
            $("#mem" + i + " div").css("background-color", "white");
            $("#mem" + i + " div").css("height", 0 + "%");
            $("#mem" + i + " div").text("");
        }
    }
}

function fillMemory(process) {
    var left = process['size'];
    for (var i = 0; i < memory.length; i++) {
        if (memory[i] == null) {
            memory[i] = process;
            left--;
        }
        if (left <= 0) break;
    }
}

function clearMemory(process) {
    var name = process['name'];
    for (var i = 0; i < memory.length; i++) {
        if (memory[i] != null && memory[i]['name'] == name) {
            memory[i] = null;
        }
    }
}
