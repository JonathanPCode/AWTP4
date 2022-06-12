"use strict";

// This js takes information from the HTML form, numThreads, lowRange, and highRange,
// and uses webworkers to break the work up near-equally. The webworkers find the sqrt(sqrt())
// of every number in the range, and records a count if the decimal place is > .93

window.onload = () => {
    let databox = document.getElementById("databox");
    let button = document.getElementById("button");
    // Send func
    let workers = [];
    button.addEventListener("click", ev => {
        console.log("clicked");
        let numThreads = Number(document.getElementById("numThreads").value);
        let lowRange = Number(document.getElementById("lowRange").value);
        let highRange = Number(document.getElementById("highRange").value);
        let incSize = Math.floor((highRange-lowRange+1) / numThreads);
        let threadDivs = [];
        let start = new Date();
        databox.innerHTML = "";

        for (let worker of workers) {
            worker.terminate();
        }

        for (let i = 0; i < numThreads; i++) {
            threadDivs[i] = document.createElement('div');
            databox.appendChild(threadDivs[i]);
        }
        let totalCount = 0;
        let finishedWorker = 0;
        for (let i = 0; i < numThreads; i++) {
            let worker = new Worker("./P4Worker.js");
            workers.push(worker);
            worker.onmessage = ev => {
                threadDivs[i].innerHTML = "Thread: " + ev.data;
                totalCount += ev.data;
                finishedWorker++;
                if (finishedWorker == numThreads) {
                    let timeTracker = document.createElement('div');
                    databox.appendChild(timeTracker);
                    timeTracker.innerHTML = "TOTAL: " + totalCount + "<br>TIME: " + ((new Date() - start)/1000);
                }
            }
            if (i == numThreads-1) {
                worker.postMessage({
                    id: i,
                    lowRange: lowRange+(incSize*i),
                    highRange,
                });
            } else {
                worker.postMessage({
                    id: i,
                    lowRange: lowRange+(incSize*i),
                    highRange: lowRange+(incSize*(i+1))-1
                });
            }
        }
    });
}