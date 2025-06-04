// Initializing the UI
figma.showUI(__html__, { themeColors: true, width: 382, height: 404 });

// Checking whether the selected node is a frame
if (figma.currentPage.selection[0] === undefined || figma.currentPage.selection[0].type !== "FRAME") {
	figma.notify("Please select a frame to run the plugin", { timeout: 4000, error: true });
	figma.closePlugin();
}

// Catching messages from the front office
figma.ui.onmessage = (msg) => {
	if (msg.type === "insertGraph" && figma.currentPage.selection[0] !== undefined) {
		interface coordinate {
			x: number;
			y: number;
		}

		const selectionNode = figma.currentPage.selection[0];

		// One last time checking whether everything is ok with the parsed expression
		if (msg.coordinatesArray == undefined || msg.coordinatesArray.length == 0) {
			figma.notify("Expression cannot be parsed. Please try again", { timeout: 4000, error: true });
		}

		// Converting precalculated coordinates into ones suitable for rendering
		const multiplier = selectionNode.width / 100;
		const unfiltredCoordinates: coordinate[] = msg.coordinatesArray.map((i: { x: number; y: number }) => {
			return { x: i.x * multiplier, y: i.y * multiplier };
		});

		const t = 1 / 5;
		let coordinates: coordinate[] = [];
		let graphType = 0;
		let objectIndex = 0;

		// Checking whether coordinates are only positive, only negative, or mixed
		for (const property in unfiltredCoordinates) {
			const yParameter = unfiltredCoordinates[property].y;
			objectIndex += 1;
			if (yParameter < 0) {
				graphType += 1;
			} else if (yParameter > 0) {
				graphType -= 1;
			}
		}

		// Depending on that removing coordinates we don't need
		if (graphType === objectIndex - 1) {
			//console.log('Positive');
			coordinates = unfiltredCoordinates.filter((coordinate) => coordinate.y >= -selectionNode.height);
		} else if (graphType === -objectIndex + 1) {
			//console.log('Negative');
			coordinates = unfiltredCoordinates.filter((coordinate) => coordinate.y <= selectionNode.height);
		} else {
			//console.log('Equal');
			coordinates = unfiltredCoordinates.filter((coordinate) => Math.abs(coordinate.y) <= selectionNode.height / 2);
		}

		// Calculating the coordinates we need to render the vector
		const point: { x: number; y: number }[][] = [];

		for (let i = 1; i < coordinates.length - 1; i++) {
			// Calculating the X and Y differences
			const dx = coordinates[i - 1].x - coordinates[i + 1].x;
			const dy = coordinates[i - 1].y - coordinates[i + 1].y;

			// Calculating the first control point coordinates
			const x1 = coordinates[i].x - dx * t;
			const y1 = coordinates[i].y - dy * t;
			const o1 = {
				x: x1,
				y: y1,
			};

			// Calculating the second control point coordinates
			const x2 = coordinates[i].x + dx * t;
			const y2 = coordinates[i].y + dy * t;
			const o2 = {
				x: x2,
				y: y2,
			};

			// Building the control points coordinates array
			point[i] = [];
			point[i].push(o1);
			point[i].push(o2);
		}

		// Building the path data string
		let d = `M ${coordinates[0].x} ${coordinates[0].y} Q ${point[1][1].x} ${point[1][1].y} ${coordinates[1].x} ${coordinates[1].y}`;
		if (coordinates.length > 2) {
			// Central points are cubic bezier with the syntax C x0 y0 x1 y1 x y
			for (let i = 1; i < coordinates.length - 2; i++) {
				d += ` C ${point[i][0].x} ${point[i][0].y} ${point[i + 1][1].x} ${point[i + 1][1].y} ${coordinates[i + 1].x} ${coordinates[i + 1].y}`;
			}

			// The last point is again a quadratic bezier with the syntax Q x0 y0 x y
			const n = coordinates.length - 1;
			d += ` Q ${point[n - 1][0].x} ${point[n - 1][0].y} ${coordinates[n].x} ${coordinates[n].y}`;
		}

		// Configuring and rendering the vector on Figma's canvas
		const node = figma.createVector();
		node.name =  "Vector " + msg.userExpression;
		node.vectorPaths = [
			{
				windingRule: "NONE",
				data: d,
			},
		];
		node.handleMirroring = "ANGLE_AND_LENGTH";
		node.lockAspectRatio();

		// Inserting the rendered vector path into the selected frame
		if (selectionNode.type === "FRAME") {
			selectionNode.appendChild(node);
			node.x = Math.round((selectionNode.width - node.width) / 2);
			node.y = Math.round((selectionNode.height - node.height) / 2);
		}

		figma.notify("Graph successfully inserted", { timeout: 4000, error: false });

		figma.closePlugin();
	} else {
		figma.notify("Please keep a frame selected to insert a graph", { timeout: 4000, error: true });
	}
};
