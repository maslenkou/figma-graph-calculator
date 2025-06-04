import * as mathjs from "mathjs";
import * as mixpanel from "mixpanel-figma";

mixpanel.init("da12692dae6e441016b0f496646a7f47", {
	disable_cookie: true,
	disable_persistence: true,
});

// Tracking plugin session start
mixpanel.track("Plugin opened");

const borderColor = getComputedStyle(document.documentElement).getPropertyValue("--figma-color-border");
const bgBrandColor = getComputedStyle(document.documentElement).getPropertyValue("--figma-color-bg-brand");
const backgroundDisabledColor = getComputedStyle(document.documentElement).getPropertyValue("--figma-color-bg-disabled");
const expressionInput = document.getElementById("expression");
const clearButton = document.getElementById("clearExpression");
const insertButton = document.getElementById("pluginRun");

// Set initial button state
insertButton.disabled = !expressionInput.value;

const feature = {
	/* 
    Global function generateCanvasCoordinates
    Draws and labels the X and Y axis, draws the background grid
    */
	generateCanvasCoordinates() {
		// Defining canvas variables
		globalThis.previewCanvas = document.getElementById("preview-canvas");
		globalThis.ctx = previewCanvas.getContext("2d");

		// Fixing blurry canvas content on the retina and other high dpi screens
		const dpi = window.devicePixelRatio;
		const doubleDpi = dpi * 2;

		globalThis.canvasWidth = previewCanvas.width = 350 * dpi;
		globalThis.canvasHeight = previewCanvas.height = 210 * dpi;
		previewCanvas.style.width = "350px";
		previewCanvas.style.height = "210px";
		previewCanvas.getContext("2d").scale(dpi, dpi);

		// Defining grid variables
		globalThis.gridSize = 35;
		const xLinesAmount = Math.floor(canvasHeight / gridSize);
		const yLinesAmount = Math.floor(canvasWidth / gridSize);

		// Defining grid lines style
		ctx.setLineWidth = 1;
		ctx.strokeStyle = borderColor;
		ctx.setLineDash([5, 5]);

		// Drawing grid lines along the X axis
		for (let i = 1; i <= xLinesAmount; i++) {
			ctx.beginPath();
			ctx.moveTo(0, gridSize * i);
			ctx.lineTo(canvasWidth, gridSize * i);
			ctx.stroke();
		}

		// Drawing grid lines along the Y axis
		for (let i = 1; i <= yLinesAmount; i++) {
			ctx.beginPath();
			ctx.moveTo(gridSize * i, 0);
			ctx.lineTo(gridSize * i, canvasHeight);
			ctx.stroke();
		}

		// Drawing X and Y axis
		ctx.strokeStyle = backgroundDisabledColor;
		ctx.setLineDash([0, 0]);
		ctx.beginPath();
		ctx.moveTo(canvasWidth / doubleDpi, 0);
		ctx.lineTo(canvasWidth / doubleDpi, canvasHeight);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, canvasHeight / doubleDpi);
		ctx.lineTo(canvasWidth, canvasHeight / doubleDpi);
		ctx.stroke();

		// Signing X and Y axis
		ctx.font = "400 11px Inter";
		ctx.fillStyle = backgroundDisabledColor;
		ctx.fillText("f(x)", 182, 18);
		ctx.fillText("x", 332, 96);

		// Shifting the origin to the canvas center
		ctx.translate(canvasWidth / doubleDpi, canvasHeight / doubleDpi);
	},

	/* 
    Global function debounce
    Adds feature of detecting when a user finishes the input
    */
	debounce(callback, wait) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				callback.apply(this, args);
			}, wait);
		};
	},

	/* 
    Global function drawChartPreview
    Adds feature of previewing users' equations by drawing them on the preview canvas
    */
	drawChartPreview() {
		// Defining variables and parsing the expression
		let previewCoordinates = [];
		const quantityValue = 0.25;
		let expressionInputValue = expressionInput.value;

		// Clear the canvas first
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
		ctx.restore();
		feature.generateCanvasCoordinates();

		// Checking whether the equation is valid and can be parsed
		if (!validateExpression(expressionInputValue)) {
			expressionInput.setAttribute("aria-invalid", "true");
			// Show error message overlay
			document.getElementById("preview-error").classList.add("visible");
			return;
		}
		expressionInput.setAttribute("aria-invalid", "false");
		// Hide error message overlay
		document.getElementById("preview-error").classList.remove("visible");

		let parsedExpression = mathjs.parse(expressionInputValue);

		// Calculating the temporary coordinates we need to draw the preview the chart
		// TODO: remove dividing by 28 and scale the preview chart properly
		for (let x = -canvasWidth / 28; x <= canvasWidth / 28; x += 0.25) {
			try {
				const simplifiedExpression = mathjs
					.simplify(parsedExpression, {
						x: x,
					})
					.toString();
				let floatY = mathjs.evaluate(simplifiedExpression);
				let y = floatY.toFixed(2);
				previewCoordinates.push({
					x: x,
					y: y * -1,
				});
			} catch (error) {
				continue;
			}
		}

		// Defining the variables and moving a context to the first point coordinates
		ctx.strokeStyle = bgBrandColor;
		ctx.setLineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-200, 0);

		// Drawing a function chart on the preview canvas
		for (let i = 0; i < previewCoordinates.length - 1; i++) {
			ctx.lineTo(gridSize * previewCoordinates[i].x, gridSize * previewCoordinates[i].y);

			// Moving context 1 step further if the function is discontinuous and we expect an abrupt change
			if ((previewCoordinates[i].y < -3 || previewCoordinates[i].y > 3) && (previewCoordinates[i + 1].y < -3 || previewCoordinates[i + 1].y > 3)) {
				ctx.moveTo(gridSize * previewCoordinates[i + 1].x, gridSize * previewCoordinates[i + 1].y);
			}
		}
		ctx.stroke();
	},

	/* 
	Global function clearInput
	Adds clear button functionality
	*/
	clearInput() {
		clearButton.addEventListener("click", () => {
			expressionInput.value = "";
			expressionInput.focus();
			feature.drawChartPreview();
		});
	},
};

// Drawing grid and coordinate axis when plugin loaded
window.addEventListener("load", () => {
	feature.generateCanvasCoordinates();
});

// Add validation helper function
function validateExpression(expr) {
	if (!expr) return false;
	
	try {
		// Check if expression contains invalid symbols
		// Updated regex to include common math functions
		const validSymbolsRegex = /^[0-9x+\-*/^().\s,a-z]+$/i;
		if (!validSymbolsRegex.test(expr)) {
			return false;
		}

		// Parse the expression to check syntax
		const parsedExpr = mathjs.parse(expr);
		
		// Get all variables and function names used in the expression
		const variables = new Set();
		const functions = new Set();
		parsedExpr.traverse((node) => {
			if (node.type === "SymbolNode") {
				variables.add(node.name);
			} else if (node.type === "FunctionNode") {
				functions.add(node.name);
			}
		});

		// Remove known function names from variables
		const validFunctions = new Set([
			"sin",
			"sinh",
			"asin",
			"cos",
			"cosh",
			"tan",
			"tanh",
			"cot",
			"coth",
			"random",
			"pow",
			"cube",
			"cbrt",
			"abs",
			"e",
			"pi",

			"atan",
			"sqrt",
			"log",
			"log10",
			"log2",
			"ceil",
			"floor",
			"round",
			"sign",
		]);

		variables.forEach((v) => {
			if (validFunctions.has(v)) {
				variables.delete(v);
			}
		});

		// Only allow 'x' as variable, unless it's a constant
		const validVars = new Set(["x"]);
		if (variables.size > 0 && ![...variables].every((v) => validVars.has(v))) {
			return false;
		}

		// Verify all used functions are valid
		if (![...functions].every((f) => validFunctions.has(f))) {
			return false;
		}

		// Test evaluation at multiple points
		const testPoints = [0.5, 1, 2];  // Using positive numbers for log function
		for (const x of testPoints) {
			const scope = { x };
			const result = mathjs.evaluate(expr, scope);
			if (typeof result !== "number" || !isFinite(result)) {
				return false;
			}
		}

		return true;
	} catch (error) {
		return false;
	}
}

// Update the immediate validation listener
expressionInput.addEventListener("input", (e) => {
	const isValid = validateExpression(e.target.value);
	expressionInput.setAttribute("aria-invalid", (!isValid).toString());
	insertButton.disabled = !isValid;
});

// Debounce the heavy chart drawing operation
const debouncedDrawChart = feature.debounce(() => {
	feature.drawChartPreview();
}, 200);

// Listen to both input and change events
expressionInput.addEventListener("input", debouncedDrawChart);
expressionInput.addEventListener("change", debouncedDrawChart);

// Catching the click onto the "Insert" button
document.getElementById("pluginRun").onclick = () => {
	// Tracking a successful plugin session finish
	mixpanel.track("Graph Inserted");

	// Defining expression variables
	const inputExpression = document.getElementById("expression").value;
	console.log(inputExpression);
	const simplifiedExpression = mathjs.parse(inputExpression);

	// Defining coordinate variables
	let chartCoordinates = [];

	// Checking whether the expression was parsed properly
	if (!simplifiedExpression) {
		//console.log('Simplified expression does not exist');
		return;
	}

	// Creating an array of coordinates
	for (let x = -50; x < 50; x++) {
		try {
			const parsedExpression = mathjs
				.simplify(simplifiedExpression, {
					x: x.toFixed(2),
				})
				.toString();

			const floatY = mathjs.evaluate(parsedExpression);
			const y = floatY.toFixed(2);

			chartCoordinates.push({
				x: x,
				y: y * -1,
			});
		} catch (error) {
			continue;
		}
	}

	// Sending information to the back office
	parent.postMessage(
		{
			pluginMessage: {
				type: "insertGraph",
				coordinatesArray: chartCoordinates,
				userExpression: inputExpression,
			},
		},
		"*"
	);
};
