/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/

// Initializing the UI
figma.showUI(__html__, { themeColors: true, width: 382, height: 420 });
// Checking whether the selected node is a frame
if (figma.currentPage.selection[0] === undefined || figma.currentPage.selection[0].type !== "FRAME") {
    figma.notify("Please select a frame to run the plugin", { timeout: 4000, error: true });
    figma.closePlugin();
}
// Catching messages from the front office
figma.ui.onmessage = (msg) => {
    if (msg.type === "insertGraph" && figma.currentPage.selection[0] !== undefined) {
        const selectionNode = figma.currentPage.selection[0];
        // One last time checking whether everything is ok with the parsed expression
        if (msg.coordinatesArray == undefined || msg.coordinatesArray.length == 0) {
            figma.notify("Expression cannot be parsed. Please try again", { timeout: 4000, error: true });
        }
        // Converting precalculated coordinates into ones suitable for rendering
        const multiplier = selectionNode.width / 100;
        const unfiltredCoordinates = msg.coordinatesArray.map((i) => {
            return { x: i.x * multiplier, y: i.y * multiplier };
        });
        const t = 1 / 5;
        let coordinates = [];
        let graphType = 0;
        let objectIndex = 0;
        // Checking whether coordinates are only positive, only negative, or mixed
        for (const property in unfiltredCoordinates) {
            const yParameter = unfiltredCoordinates[property].y;
            objectIndex += 1;
            if (yParameter < 0) {
                graphType += 1;
            }
            else if (yParameter > 0) {
                graphType -= 1;
            }
        }
        // Depending on that removing coordinates we don't need
        if (graphType === objectIndex - 1) {
            //console.log('Positive');
            coordinates = unfiltredCoordinates.filter((coordinate) => coordinate.y >= -selectionNode.height);
        }
        else if (graphType === -objectIndex + 1) {
            //console.log('Negative');
            coordinates = unfiltredCoordinates.filter((coordinate) => coordinate.y <= selectionNode.height);
        }
        else {
            //console.log('Equal');
            coordinates = unfiltredCoordinates.filter((coordinate) => Math.abs(coordinate.y) <= selectionNode.height / 2);
        }
        // Calculating the coordinates we need to render the vector
        const point = [];
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
        node.name = "Vector " + msg.userExpression;
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
    }
    else {
        figma.notify("Please keep a frame selected to insert a graph", { timeout: 4000, error: true });
    }
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFhO0FBQ2I7QUFDQSx5QkFBeUIsNENBQTRDO0FBQ3JFO0FBQ0E7QUFDQSw4REFBOEQsNEJBQTRCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsNEJBQTRCO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsa0JBQWtCLEVBQUUsa0JBQWtCLElBQUksZUFBZSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDdEk7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQsMkJBQTJCLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCO0FBQ3BKO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsNkJBQTZCO0FBQ25GO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSw0QkFBNEI7QUFDckc7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0ZpZ21hIEdyYXBoIFZpc3VhbGlzZXIvLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8vIEluaXRpYWxpemluZyB0aGUgVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB0aGVtZUNvbG9yczogdHJ1ZSwgd2lkdGg6IDM4MiwgaGVpZ2h0OiA0MjAgfSk7XG4vLyBDaGVja2luZyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBub2RlIGlzIGEgZnJhbWVcbmlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0gPT09IHVuZGVmaW5lZCB8fCBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0udHlwZSAhPT0gXCJGUkFNRVwiKSB7XG4gICAgZmlnbWEubm90aWZ5KFwiUGxlYXNlIHNlbGVjdCBhIGZyYW1lIHRvIHJ1biB0aGUgcGx1Z2luXCIsIHsgdGltZW91dDogNDAwMCwgZXJyb3I6IHRydWUgfSk7XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn1cbi8vIENhdGNoaW5nIG1lc3NhZ2VzIGZyb20gdGhlIGZyb250IG9mZmljZVxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJpbnNlcnRHcmFwaFwiICYmIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbk5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgICAgIC8vIE9uZSBsYXN0IHRpbWUgY2hlY2tpbmcgd2hldGhlciBldmVyeXRoaW5nIGlzIG9rIHdpdGggdGhlIHBhcnNlZCBleHByZXNzaW9uXG4gICAgICAgIGlmIChtc2cuY29vcmRpbmF0ZXNBcnJheSA9PSB1bmRlZmluZWQgfHwgbXNnLmNvb3JkaW5hdGVzQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIkV4cHJlc3Npb24gY2Fubm90IGJlIHBhcnNlZC4gUGxlYXNlIHRyeSBhZ2FpblwiLCB7IHRpbWVvdXQ6IDQwMDAsIGVycm9yOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbnZlcnRpbmcgcHJlY2FsY3VsYXRlZCBjb29yZGluYXRlcyBpbnRvIG9uZXMgc3VpdGFibGUgZm9yIHJlbmRlcmluZ1xuICAgICAgICBjb25zdCBtdWx0aXBsaWVyID0gc2VsZWN0aW9uTm9kZS53aWR0aCAvIDEwMDtcbiAgICAgICAgY29uc3QgdW5maWx0cmVkQ29vcmRpbmF0ZXMgPSBtc2cuY29vcmRpbmF0ZXNBcnJheS5tYXAoKGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IHg6IGkueCAqIG11bHRpcGxpZXIsIHk6IGkueSAqIG11bHRpcGxpZXIgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHQgPSAxIC8gNTtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgICAgIGxldCBncmFwaFR5cGUgPSAwO1xuICAgICAgICBsZXQgb2JqZWN0SW5kZXggPSAwO1xuICAgICAgICAvLyBDaGVja2luZyB3aGV0aGVyIGNvb3JkaW5hdGVzIGFyZSBvbmx5IHBvc2l0aXZlLCBvbmx5IG5lZ2F0aXZlLCBvciBtaXhlZFxuICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIHVuZmlsdHJlZENvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICBjb25zdCB5UGFyYW1ldGVyID0gdW5maWx0cmVkQ29vcmRpbmF0ZXNbcHJvcGVydHldLnk7XG4gICAgICAgICAgICBvYmplY3RJbmRleCArPSAxO1xuICAgICAgICAgICAgaWYgKHlQYXJhbWV0ZXIgPCAwKSB7XG4gICAgICAgICAgICAgICAgZ3JhcGhUeXBlICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh5UGFyYW1ldGVyID4gMCkge1xuICAgICAgICAgICAgICAgIGdyYXBoVHlwZSAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIERlcGVuZGluZyBvbiB0aGF0IHJlbW92aW5nIGNvb3JkaW5hdGVzIHdlIGRvbid0IG5lZWRcbiAgICAgICAgaWYgKGdyYXBoVHlwZSA9PT0gb2JqZWN0SW5kZXggLSAxKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQb3NpdGl2ZScpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB1bmZpbHRyZWRDb29yZGluYXRlcy5maWx0ZXIoKGNvb3JkaW5hdGUpID0+IGNvb3JkaW5hdGUueSA+PSAtc2VsZWN0aW9uTm9kZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGdyYXBoVHlwZSA9PT0gLW9iamVjdEluZGV4ICsgMSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnTmVnYXRpdmUnKTtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gdW5maWx0cmVkQ29vcmRpbmF0ZXMuZmlsdGVyKChjb29yZGluYXRlKSA9PiBjb29yZGluYXRlLnkgPD0gc2VsZWN0aW9uTm9kZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnRXF1YWwnKTtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzID0gdW5maWx0cmVkQ29vcmRpbmF0ZXMuZmlsdGVyKChjb29yZGluYXRlKSA9PiBNYXRoLmFicyhjb29yZGluYXRlLnkpIDw9IHNlbGVjdGlvbk5vZGUuaGVpZ2h0IC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsY3VsYXRpbmcgdGhlIGNvb3JkaW5hdGVzIHdlIG5lZWQgdG8gcmVuZGVyIHRoZSB2ZWN0b3JcbiAgICAgICAgY29uc3QgcG9pbnQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0aW5nIHRoZSBYIGFuZCBZIGRpZmZlcmVuY2VzXG4gICAgICAgICAgICBjb25zdCBkeCA9IGNvb3JkaW5hdGVzW2kgLSAxXS54IC0gY29vcmRpbmF0ZXNbaSArIDFdLng7XG4gICAgICAgICAgICBjb25zdCBkeSA9IGNvb3JkaW5hdGVzW2kgLSAxXS55IC0gY29vcmRpbmF0ZXNbaSArIDFdLnk7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGluZyB0aGUgZmlyc3QgY29udHJvbCBwb2ludCBjb29yZGluYXRlc1xuICAgICAgICAgICAgY29uc3QgeDEgPSBjb29yZGluYXRlc1tpXS54IC0gZHggKiB0O1xuICAgICAgICAgICAgY29uc3QgeTEgPSBjb29yZGluYXRlc1tpXS55IC0gZHkgKiB0O1xuICAgICAgICAgICAgY29uc3QgbzEgPSB7XG4gICAgICAgICAgICAgICAgeDogeDEsXG4gICAgICAgICAgICAgICAgeTogeTEsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRpbmcgdGhlIHNlY29uZCBjb250cm9sIHBvaW50IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICBjb25zdCB4MiA9IGNvb3JkaW5hdGVzW2ldLnggKyBkeCAqIHQ7XG4gICAgICAgICAgICBjb25zdCB5MiA9IGNvb3JkaW5hdGVzW2ldLnkgKyBkeSAqIHQ7XG4gICAgICAgICAgICBjb25zdCBvMiA9IHtcbiAgICAgICAgICAgICAgICB4OiB4MixcbiAgICAgICAgICAgICAgICB5OiB5MixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBCdWlsZGluZyB0aGUgY29udHJvbCBwb2ludHMgY29vcmRpbmF0ZXMgYXJyYXlcbiAgICAgICAgICAgIHBvaW50W2ldID0gW107XG4gICAgICAgICAgICBwb2ludFtpXS5wdXNoKG8xKTtcbiAgICAgICAgICAgIHBvaW50W2ldLnB1c2gobzIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIHRoZSBwYXRoIGRhdGEgc3RyaW5nXG4gICAgICAgIGxldCBkID0gYE0gJHtjb29yZGluYXRlc1swXS54fSAke2Nvb3JkaW5hdGVzWzBdLnl9IFEgJHtwb2ludFsxXVsxXS54fSAke3BvaW50WzFdWzFdLnl9ICR7Y29vcmRpbmF0ZXNbMV0ueH0gJHtjb29yZGluYXRlc1sxXS55fWA7XG4gICAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAvLyBDZW50cmFsIHBvaW50cyBhcmUgY3ViaWMgYmV6aWVyIHdpdGggdGhlIHN5bnRheCBDIHgwIHkwIHgxIHkxIHggeVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkICs9IGAgQyAke3BvaW50W2ldWzBdLnh9ICR7cG9pbnRbaV1bMF0ueX0gJHtwb2ludFtpICsgMV1bMV0ueH0gJHtwb2ludFtpICsgMV1bMV0ueX0gJHtjb29yZGluYXRlc1tpICsgMV0ueH0gJHtjb29yZGluYXRlc1tpICsgMV0ueX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGxhc3QgcG9pbnQgaXMgYWdhaW4gYSBxdWFkcmF0aWMgYmV6aWVyIHdpdGggdGhlIHN5bnRheCBRIHgwIHkwIHggeVxuICAgICAgICAgICAgY29uc3QgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBkICs9IGAgUSAke3BvaW50W24gLSAxXVswXS54fSAke3BvaW50W24gLSAxXVswXS55fSAke2Nvb3JkaW5hdGVzW25dLnh9ICR7Y29vcmRpbmF0ZXNbbl0ueX1gO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbmZpZ3VyaW5nIGFuZCByZW5kZXJpbmcgdGhlIHZlY3RvciBvbiBGaWdtYSdzIGNhbnZhc1xuICAgICAgICBjb25zdCBub2RlID0gZmlnbWEuY3JlYXRlVmVjdG9yKCk7XG4gICAgICAgIG5vZGUubmFtZSA9IFwiVmVjdG9yIFwiICsgbXNnLnVzZXJFeHByZXNzaW9uO1xuICAgICAgICBub2RlLnZlY3RvclBhdGhzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiBcIk5PTkVcIixcbiAgICAgICAgICAgICAgICBkYXRhOiBkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICAgICAgbm9kZS5oYW5kbGVNaXJyb3JpbmcgPSBcIkFOR0xFX0FORF9MRU5HVEhcIjtcbiAgICAgICAgbm9kZS5sb2NrQXNwZWN0UmF0aW8oKTtcbiAgICAgICAgLy8gSW5zZXJ0aW5nIHRoZSByZW5kZXJlZCB2ZWN0b3IgcGF0aCBpbnRvIHRoZSBzZWxlY3RlZCBmcmFtZVxuICAgICAgICBpZiAoc2VsZWN0aW9uTm9kZS50eXBlID09PSBcIkZSQU1FXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbk5vZGUuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICBub2RlLnggPSBNYXRoLnJvdW5kKChzZWxlY3Rpb25Ob2RlLndpZHRoIC0gbm9kZS53aWR0aCkgLyAyKTtcbiAgICAgICAgICAgIG5vZGUueSA9IE1hdGgucm91bmQoKHNlbGVjdGlvbk5vZGUuaGVpZ2h0IC0gbm9kZS5oZWlnaHQpIC8gMik7XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEubm90aWZ5KFwiR3JhcGggc3VjY2Vzc2Z1bGx5IGluc2VydGVkXCIsIHsgdGltZW91dDogNDAwMCwgZXJyb3I6IGZhbHNlIH0pO1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiUGxlYXNlIGtlZXAgYSBmcmFtZSBzZWxlY3RlZCB0byBpbnNlcnQgYSBncmFwaFwiLCB7IHRpbWVvdXQ6IDQwMDAsIGVycm9yOiB0cnVlIH0pO1xuICAgIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=