(function Home() {
	"use strict";

	var startStopBtn_worker;
	var startStopBtn_main;
	var fibsList;
	var worker;
	var incCountBtn;
	var countText;
	var resetCountBtn;

	var count = 0;;
	var currFib = 0;
	var stopFibFx = false

	document.addEventListener("DOMContentLoaded", ready, false);


	// **********************************

	function ready() {
		startStopBtn_worker = document.getElementById("star-stop_worker");
		fibsList = document.getElementById("fibs");
		startStopBtn_worker.addEventListener("click", startFibs, false);

		startStopBtn_main = document.getElementById("start-stop_main");
		startStopBtn_main.addEventListener("click", startFibsOnMain, false);

		incCountBtn = document.getElementById("incCount");
		countText = document.getElementById("count");
		resetCountBtn = document.getElementById("resetCount");
		incCountBtn.addEventListener("click", incrementCounter, false);

		resetCountBtn.addEventListener('click', resetCount, false)
	}

	function renderFib(num, fib) {
		var p = document.createElement("div");
		p.innerText = `Fib(${num}): ${fib}`;
		if (fibsList.childNodes.length > 0) {
			fibsList.insertBefore(p, fibsList.childNodes[0]);
		}
		else {
			fibsList.appendChild(p);
		}
	}

	function startFibs() {
		startStopBtn_main.disabled = true;
		startStopBtn_worker.removeEventListener("click", startFibs, false);
		startStopBtn_worker.addEventListener("click", stopFibs, false);

		startStopBtn_worker.innerText = "Stop";
		fibsList.innerHTML = "";

		// TODO
		worker = new Worker('/js/worker.js')
		worker.addEventListener('message', onMessage)
		worker.postMessage({ start: true })
	}

	function stopFibs() {
		startStopBtn_main.disabled = false;
		startStopBtn_worker.removeEventListener("click", stopFibs, false);
		startStopBtn_worker.addEventListener("click", startFibs, false);

		startStopBtn_worker.innerText = "Start";

		// TODO
		worker.terminate()
	}

	function onMessage(e) {
		renderFib(e.data.idx, e.data.fib)
	}


	function startFibsOnMain() {
		startStopBtn_worker.disabled = true;
		startStopBtn_main.removeEventListener("click", startFibsOnMain, false);
		startStopBtn_main.addEventListener("click", stopFibsOnMain, false);

		startStopBtn_main.innerText = "Stop";
		fibsList.innerHTML = "";
		stopFibFx = false
		getNextFib()

	}


	function stopFibsOnMain() {
		startStopBtn_worker.disabled = false;
		startStopBtn_main.removeEventListener("click", stopFibsOnMain, false);
		startStopBtn_main.addEventListener("click", startFibsOnMain, false);

		startStopBtn_main.innerText = "Start";
		stopFibFx = true
		currFib = 0
	}

	function incrementCounter() {
		incCountBtn.removeEventListener("click", incrementCounter, false);
		incCountBtn.addEventListener("click", incrementCounter, false);

		countText.textContent = ++count

	}

	function resetCount() {
		count = 0;
		countText.textContent = count;
	}


	function getNextFib() {
		if (stopFibFx || currFib > 45) {
			return
		}
		var fibNum = fib(currFib)
		renderFib(currFib, fibNum)
		currFib++
		setTimeout(getNextFib, 0)
	}



	function fib(n) {
		if (n < 2) {
			return n;
		}
		return fib(n - 1) + fib(n - 2);
	}


})();
