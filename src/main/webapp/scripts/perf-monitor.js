var PerfMonitor = (function (warningDOMElement) {

    var curFPS = 58;
    var idealFPS = 58;
    fpsFilter = 40;

    var isPerfWarningVisible = false;

    var opStartTime;
    var opEndTime;

    (function () {
        opStartTime = Date.now();
    })();

    var updatePerfCounter = function () {
        if (curFPS < 30 && !isPerfWarningVisible)
            setTimeout(function () {
                if (curFPS < 30) {
                    isPerfWarningVisible = true;
                    warningDOMElement.className = 'g-warning-visible';
                }
            }, 2000);
        else
            setTimeout(function () {
                if (curFPS > 35) {
                    warningDOMElement.className = '';
                    isPerfWarningVisible = false;
                }
            }, 5000);

        var thisFrameFPS = 1000 / ((opEndTime = Date.now()) - opStartTime);
        curFPS += (thisFrameFPS - curFPS) / fpsFilter;
        // In case somehow login operation completes in same nanosecond ~_~
        if(isNaN(curFPS))
            curFPS = 58;
        opStartTime = opEndTime;
    };

    var getPerfFactor = function () {
        updatePerfCounter();
        return curFPS / idealFPS;
    };

    return {
        getPerfFactor: getPerfFactor
    };

});