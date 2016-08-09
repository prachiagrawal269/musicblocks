function Tempo () {
    var canvas; 
    var ctx; 
    var x; 
    var y; 
    var mx = 1; 
    var my = 4; 
    var tempmx = -1;
    var WIDTH; 
    var HEIGHT;
    this.isMoving = 1; 
    this.Previousmx;
    this.Previoustempx;
    this.velocity = 0;
    this.BPM;
    this.BPMBlock;
    this.direction = 0;

    this.updateBPM = function(event) {
        console.log(event);
        var bpmnumberblock = blocks.blockList[this.BPMBlock].connections[1];
        this.logo.blocks.blockList[bpmnumberblock].value = parseFloat(this.BPM);
        this.logo.blocks.blockList[bpmnumberblock].text.text = this.BPM;
        this.logo.blocks.blockList[bpmnumberblock].updateCache();
        this.logo.refreshCanvas();
        saveLocally();
    };

    this.stop = function () {
          tempmx = mx;
          mx=0;
    };

    this.start = function () {
        tempx = this.Previoustempx;
        mx = this.Previousmx;
    };

    this.useBPM = function () {
        this.BPM = document.getElementById("BPMNUMBER").value
        this.updateBPM();        
        this.velocity = parseFloat(WIDTH) / 60 * this.BPM;
        mx = parseFloat(this.velocity) / 150 * this.direction;
    };

    this.speedUp = function () {
        this.BPM = parseFloat(this.BPM) + 5;
        this.updateBPM();
        this.velocity = parseFloat(this.BPM) / 60 * WIDTH;
        mx = parseFloat(this.velocity) / 150 * this.direction;
        document.getElementById("BPMNUMBER").value = this.BPM;
    };

    this.slowDown = function () {
        this.BPM = parseFloat(this.BPM) - 5;
        this.updateBPM();
        this.velocity = parseFloat(this.BPM) / 60 * WIDTH;
        mx = parseFloat(this.velocity) / 150 * this.direction;
        document.getElementById("BPMNUMBER").value = this.BPM;
    };

    this.circle = function (x,y,r) { 
          ctx.beginPath(); 
        ctx.fillStyle = ""; 
          ctx.arc(x, y, r, 0, Math.PI*2); 
        ctx.fill(); 
    }; 

    this.draw = function() { 
        var that = this;
        var canvasRect = canvas.getBoundingClientRect();
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.beginPath(); 
        ctx.fillStyle = ""; 
          ctx.arc(x, y, 25, 0, Math.PI * 2); 
        ctx.fill(); 
        ctx.closePath();
        x += mx; 
        if (this.direction === 1 && x + mx > canvas.width) {
            x = canvas.width;
            this.direction = -1;
            mx = -mx;
            this.logo.synth.trigger('C4', 0.125, 'poly');
        }
        if (this.direction === -1 && x + mx < 0) {
            x = 0;
            this.direction = 1; 
            mx = -mx;
            this.logo.synth.trigger('C4', 0.125, 'poly');
        }
    };

    this._addButton = function(row, colIndex, icon, iconSize, label) {
        var cell = row.insertCell();
        cell.innerHTML = '&nbsp;&nbsp;<img src="header-icons/' + icon + '" title="' + label + '" alt="' + label + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
        cell.style.width = Math.floor(MATRIXBUTTONHEIGHT * this._cellScale) + 'px';
        cell.style.minWidth = cell.style.width;
        cell.style.maxWidth = cell.style.width;
        cell.style.height = Math.floor(MATRIXBUTTONHEIGHT * this._cellScale) + 'px';
        cell.style.backgroundColor = MATRIXBUTTONCOLOR;

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        }

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        }

        return cell;
    };

    this.init = function (logo) {
        var that = this;
        that.logo = logo;
        console.log("init tempo");
        docById('TempoDiv').style.visibility = 'visible';
        docById('TempoCanvas').style.visibility = 'visible';
        docById('TempoCanvas').style.backgroundColor = 'white';
        console.log(this.BPM);

        var w = window.innerWidth;
        docById('TempoDiv').style.width = Math.floor(w / 2) + 'px';
        docById('TempoCanvas').style.width = Math.floor(w / 2) + 'px';
        docById('TempoCanvas').style.height = Math.floor(w / 12) + 'px';

        WIDTH = Math.floor(w / 2);
        HEIGHT = Math.floor(w / 12);

        this.cellScale = w / 1200;

        var TempoDiv = docById('TempoDiv');

        canvas = document.getElementById("TempoCanvas"); 

        canvas.style.left = TempoDiv.style.left;

        ctx = canvas.getContext("2d");
        console.log(ctx);
        var canvasRect = canvas.getBoundingClientRect();

        var iconSize = Math.floor(this.cellScale * 24);

        console.log(canvas.style.top)   ;
        x = canvas.width;
        y = this.cellScale * 200;

        var tables = document.getElementsByTagName('TABLE');
        var noofTables = tables.length;

        for (var i = 0; i < noofTables; i++) {
            tables[0].parentNode.removeChild(tables[0]);
        }

        var t = document.createElement('TABLE');
        t.setAttribute('id', 'buttonDiv');
        t.style.textAlign = 'center';
        t.style.borderCollapse = 'collapse';
        t.cellSpacing = 0;
        t.cellPadding = 0;

        var TempoDiv = docById('TempoDiv');
        TempoDiv.style.paddingTop = 0 + 'px';
        TempoDiv.style.paddingLeft = 0 + 'px';
        TempoDiv.appendChild(t);
        TempoDivPosition = TempoDiv.getBoundingClientRect();

        var table = docById('buttonDiv');
        var header = table.createTHead();
        var row = header.insertRow(-1);
        row.style.left = Math.floor(TempoDivPosition.left) + 'px';
        row.style.top = Math.floor(TempoDivPosition.top) + 'px';
        row.setAttribute('id', 'buttons');

        var cell = this._addButton(row, -1, 'pause-button.svg', iconSize, _('pause'));
        cell.onclick=function() {
            if(that.isMoving) {
                that.Previoustempx = tempmx;
                that.Previousmx = mx;
                that.stop();
                this.innerHTML = '&nbsp;&nbsp;<img src="header-icons/play-button.svg" title="' + _('pause') + '" alt="' + _('pause') + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
                that.isMoving = 0;
            } else {
                that.start();
                this.innerHTML = '&nbsp;&nbsp;<img src="header-icons/pause-button.svg" title="' + _('play') + '" alt="' + _('play') + '" height="' + iconSize + '" width="' + iconSize + '" vertical-align="middle">&nbsp;&nbsp;';
                that.isMoving = 1;
            }
        };

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        };

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        };

        var cell = this._addButton(row, 1, 'up.svg', iconSize, _('speed up'));
        cell.onclick=function() {
            that.speedUp();
        };

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        };

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        };

        var cell = this._addButton(row, 2, 'down.svg', iconSize, _('slow down'));
        cell.onclick=function() {
            that.slowDown();
        };

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        };

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        };

        var cell = row.insertCell(3);
        cell.style.top = 0;
        cell.style.left = 0;
        cell.innerHTML = '<input id="BPMNUMBER" style="-webkit-user-select: text;-moz-user-select: text;-ms-user-select: text;" class="BPMNUMBER" type="BPMNUMBER" value="' + this.BPM + '" />';
        cell.style.width = Math.floor(RHYTHMRULERHEIGHT * this.cellScale) + 'px';
        cell.style.minWidth = cell.style.width;
        cell.style.maxWidth = cell.style.width;
        cell.style.height = Math.floor(MATRIXBUTTONHEIGHT * this.cellScale) + 'px';
        cell.style.backgroundColor = MATRIXBUTTONCOLOR;  
        docById('BPMNUMBER').classList.add('hasKeyboard');
        docById('TempoCanvas').addEventListener('dblclick', function() {
            that.useBPM();
        })

        var cell = this._addButton(row, 4, 'close-button.svg', iconSize, _('close'));
        cell.onclick=function() {
            docById('TempoDiv').style.visibility = 'hidden';
            docById('TempoCanvas').style.visibility = 'hidden';
            clearInterval(that._intervalID);
        };

        cell.onmouseover=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLORHOVER;
        };

        cell.onmouseout=function() {
            this.style.backgroundColor = MATRIXBUTTONCOLOR;
        };

        this.velocity = parseFloat(WIDTH) / 60 * this.BPM;
        this.direction = 1;
        mx = parseFloat(that.velocity) / 150;

        this._intervalID = setInterval(function() {
            that.draw();
        }, 5);
    };

};