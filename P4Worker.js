"use strict";

// Received message
addEventListener("message", ev => {
    let count = 0;
    let { lowRange, highRange } = ev.data;
    for (let i = lowRange; i <= highRange; i++) {
        if (Math.sqrt(Math.sqrt(i)) % 1 > 0.93) {
            count++;
        }
    }
    console.log("sending", count);
    postMessage(count);
});