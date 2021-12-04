let grid = [];

class TeamMember {
    constructor(name, position, start, end) {
        this.name = name;
        this.position = position;
        this.start = start;
        this.end = end;
        this.breaks = [];
    }

    toRow() {
        let tr = document.createElement('div');
        tr.className = "tr";
        tr.appendChild(cell(this.name));
        tr.appendChild(cell(this.position));
        tr.appendChild(cell(this.start.twelveHr));
        tr.appendChild(cell(this.breaks[0]));
        tr.appendChild(cell(this.breaks[1]));
        tr.appendChild(cell(this.breaks[2]));
        tr.appendChild(cell(this.end.twelveHr));
        return tr;
    }

    createBreaks() {
        let i = this.start;
        let o = this.end;
        let duration = Time.difference(i, o);
        let hasMeal = duration.hrs >= 6;
        let has2nd = duration.f >= 35;

        let b1 = this.start.clone();
        let b2 = this.start.clone();
        let b3 = this.start.clone();

        b1.add(2, 0);
        if(hasMeal) {
            b2.add(5, 0);
        }
        if(has2nd) {
            b3.add(7, 0);
        }

        this.breaks = [b1.twelveHr, hasMeal ? b2.twelveHr: "", has2nd ? b3.twelveHr: ""];
    }
}

class Time {
    constructor(hrs, mins) {
        this.hrs = parseInt(hrs);
        this.mins = parseInt(mins);
    }

    add(hrs, mins) {
        this.hrs = this.hrs + hrs + Math.floor((this.mins + mins) / 60);
        this.mins = (this.mins + mins) % 60;
    }

    clone() {
        return new Time(this.hrs, this.mins);
    }
    

    get twelveHr() {
        if(this.hrs > 12) {
            return `${this.hrs - 12}:${("00" + this.mins).slice(-2)}`;
        } else {
            return `${this.hrs}:${("00" + this.mins).slice(-2)}`;
        }
    }

    get twentyfourHr() {
        return `${this.hrs}:${this.mins}`;
    }

    get f() {
        return this.hrs * 4 + (this.mins / 15);
    }

    set s(v) {
        this.hrs = v.split(":")[0];
        this.mins = v.split(":")[1];
    }

    set f(v) {
        this.hrs = Math.floor(v / 4);
        this.mins = (v % 4) * 15; 
    }

    static difference(time1, time2) {
        let fs = Math.abs(time1.f - time2.f);
        let t = new Time(0, 0);
        t.f = fs;
        return t;
    }
}

function addTeamMember(n, p, s, e) {
    event.preventDefault();
    let name = n || document.querySelector("#name").value;
    let position = p || document.querySelector("#position").value;
    let start = s || document.querySelector("#start").value;
    let end = e || document.querySelector("#end").value;

    let startTime = new Time();
    startTime.s = start;

    let endTime = new Time();
    endTime.s = end;

    let member = new TeamMember(name, position, startTime, endTime);
    grid.push(member);

    generate();
}

function cell(val) {
    let td = document.createElement('span');
    td.className = "cell";
    td.appendChild(document.createTextNode(val));
    return td;
}

function createHead() {
    let tr = document.createElement("div");
    tr.className = "tr";
    tr.appendChild(cell("Name"));
    tr.appendChild(cell("Position"));
    tr.appendChild(cell("Start"));
    tr.appendChild(cell("1st 15"));
    tr.appendChild(cell("Meal"));
    tr.appendChild(cell("2nd 15"));
    tr.appendChild(cell("End"));
    return tr;
}

function generate() {
    let schedule = document.querySelector("#schedule");
    schedule.innerHTML = "";
    schedule.appendChild(createHead());
    grid.sort((a, b) => {
        return a.start.f < b.start.f ? -1: 1;
    });
    for(let member of grid) {
        member.createBreaks();
        schedule.appendChild(member.toRow());
    }
}

function printDiv(divId, title) {
    let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
  
    mywindow.document.write(`<html><head><title>${title}</title>`);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementById(divId).innerHTML);
    mywindow.document.write('</body></html>');
  
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
  
    mywindow.print();
    mywindow.close();
  
    return true;
  }