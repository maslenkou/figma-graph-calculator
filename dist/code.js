/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/

// Initializing the UI
figma.showUI(__html__, { themeColors: true, width: 382, height: 420 });
// Checking whether the selected node is a frame
if (figma.currentPage.selection[0] === undefined || figma.currentPage.selection[0].type !== 'FRAME') {
    figma.notify('Please select a frame to run the plugin', { timeout: 4000, error: true });
    figma.closePlugin();
}
// Catching messages from the front office
figma.ui.onmessage = msg => {
    if (msg.type === 'insertGraph' && figma.currentPage.selection[0] !== undefined) {
        const selectionNode = figma.currentPage.selection[0];
        // One last time checking whether everything is ok with the parsed expression
        if (msg.coordinatesArray == undefined || msg.coordinatesArray.length == 0) {
            figma.notify('Expression cannot be parsed. Please try again', { timeout: 4000, error: true });
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
                y: y1
            };
            // Calculating the second control point coordinates
            const x2 = coordinates[i].x + dx * t;
            const y2 = coordinates[i].y + dy * t;
            const o2 = {
                x: x2,
                y: y2
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
        // Rendering the vector on Figma's canvas
        const node = figma.createVector();
        node.vectorPaths = [{
                windingRule: "NONE",
                data: d
            }];
        node.handleMirroring = "ANGLE_AND_LENGTH";
        node.constrainProportions = true;
        // Inserting the rendered vector path into the selected frame
        if (selectionNode.type === 'FRAME') {
            selectionNode.appendChild(node);
            node.x = Math.round((selectionNode.width - node.width) / 2);
            node.y = Math.round((selectionNode.height - node.height) / 2);
        }
        figma.notify('Graph successfully inserted', { timeout: 4000, error: false });
        figma.closePlugin();
    }
    else {
        figma.notify('Please keep a frame selected to insert a graph', { timeout: 4000, error: true });
    }
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFhO0FBQ2I7QUFDQSx5QkFBeUIsNENBQTRDO0FBQ3JFO0FBQ0E7QUFDQSw4REFBOEQsNEJBQTRCO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsNEJBQTRCO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsa0JBQWtCLEVBQUUsa0JBQWtCLElBQUksZUFBZSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDdEk7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQsMkJBQTJCLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCO0FBQ3BKO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsNkJBQTZCO0FBQ25GO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSw0QkFBNEI7QUFDckc7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0ZpZ21hIEdyYXBoIFZpc3VhbGlzZXIvLi9zcmMvY29kZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8vIEluaXRpYWxpemluZyB0aGUgVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB0aGVtZUNvbG9yczogdHJ1ZSwgd2lkdGg6IDM4MiwgaGVpZ2h0OiA0MjAgfSk7XG4vLyBDaGVja2luZyB3aGV0aGVyIHRoZSBzZWxlY3RlZCBub2RlIGlzIGEgZnJhbWVcbmlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0gPT09IHVuZGVmaW5lZCB8fCBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0udHlwZSAhPT0gJ0ZSQU1FJykge1xuICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIHNlbGVjdCBhIGZyYW1lIHRvIHJ1biB0aGUgcGx1Z2luJywgeyB0aW1lb3V0OiA0MDAwLCBlcnJvcjogdHJ1ZSB9KTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuLy8gQ2F0Y2hpbmcgbWVzc2FnZXMgZnJvbSB0aGUgZnJvbnQgb2ZmaWNlXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2luc2VydEdyYXBoJyAmJiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb25Ob2RlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgICAgICAvLyBPbmUgbGFzdCB0aW1lIGNoZWNraW5nIHdoZXRoZXIgZXZlcnl0aGluZyBpcyBvayB3aXRoIHRoZSBwYXJzZWQgZXhwcmVzc2lvblxuICAgICAgICBpZiAobXNnLmNvb3JkaW5hdGVzQXJyYXkgPT0gdW5kZWZpbmVkIHx8IG1zZy5jb29yZGluYXRlc0FycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ0V4cHJlc3Npb24gY2Fubm90IGJlIHBhcnNlZC4gUGxlYXNlIHRyeSBhZ2FpbicsIHsgdGltZW91dDogNDAwMCwgZXJyb3I6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29udmVydGluZyBwcmVjYWxjdWxhdGVkIGNvb3JkaW5hdGVzIGludG8gb25lcyBzdWl0YWJsZSBmb3IgcmVuZGVyaW5nXG4gICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSBzZWxlY3Rpb25Ob2RlLndpZHRoIC8gMTAwO1xuICAgICAgICBjb25zdCB1bmZpbHRyZWRDb29yZGluYXRlcyA9IG1zZy5jb29yZGluYXRlc0FycmF5Lm1hcCgoaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHsgeDogaS54ICogbXVsdGlwbGllciwgeTogaS55ICogbXVsdGlwbGllciB9O1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdCA9IDEgLyA1O1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICAgICAgbGV0IGdyYXBoVHlwZSA9IDA7XG4gICAgICAgIGxldCBvYmplY3RJbmRleCA9IDA7XG4gICAgICAgIC8vIENoZWNraW5nIHdoZXRoZXIgY29vcmRpbmF0ZXMgYXJlIG9ubHkgcG9zaXRpdmUsIG9ubHkgbmVnYXRpdmUsIG9yIG1peGVkXG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gdW5maWx0cmVkQ29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHlQYXJhbWV0ZXIgPSB1bmZpbHRyZWRDb29yZGluYXRlc1twcm9wZXJ0eV0ueTtcbiAgICAgICAgICAgIG9iamVjdEluZGV4ICs9IDE7XG4gICAgICAgICAgICBpZiAoeVBhcmFtZXRlciA8IDApIHtcbiAgICAgICAgICAgICAgICBncmFwaFR5cGUgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHlQYXJhbWV0ZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgZ3JhcGhUeXBlIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHRoYXQgcmVtb3ZpbmcgY29vcmRpbmF0ZXMgd2UgZG9uJ3QgbmVlZFxuICAgICAgICBpZiAoZ3JhcGhUeXBlID09PSBvYmplY3RJbmRleCAtIDEpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Bvc2l0aXZlJyk7XG4gICAgICAgICAgICBjb29yZGluYXRlcyA9IHVuZmlsdHJlZENvb3JkaW5hdGVzLmZpbHRlcigoY29vcmRpbmF0ZSkgPT4gY29vcmRpbmF0ZS55ID49IC1zZWxlY3Rpb25Ob2RlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZ3JhcGhUeXBlID09PSAtb2JqZWN0SW5kZXggKyAxKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdOZWdhdGl2ZScpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB1bmZpbHRyZWRDb29yZGluYXRlcy5maWx0ZXIoKGNvb3JkaW5hdGUpID0+IGNvb3JkaW5hdGUueSA8PSBzZWxlY3Rpb25Ob2RlLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdFcXVhbCcpO1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMgPSB1bmZpbHRyZWRDb29yZGluYXRlcy5maWx0ZXIoKGNvb3JkaW5hdGUpID0+IE1hdGguYWJzKGNvb3JkaW5hdGUueSkgPD0gc2VsZWN0aW9uTm9kZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYWxjdWxhdGluZyB0aGUgY29vcmRpbmF0ZXMgd2UgbmVlZCB0byByZW5kZXIgdGhlIHZlY3RvclxuICAgICAgICBjb25zdCBwb2ludCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRpbmcgdGhlIFggYW5kIFkgZGlmZmVyZW5jZXNcbiAgICAgICAgICAgIGNvbnN0IGR4ID0gY29vcmRpbmF0ZXNbaSAtIDFdLnggLSBjb29yZGluYXRlc1tpICsgMV0ueDtcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gY29vcmRpbmF0ZXNbaSAtIDFdLnkgLSBjb29yZGluYXRlc1tpICsgMV0ueTtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0aW5nIHRoZSBmaXJzdCBjb250cm9sIHBvaW50IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICBjb25zdCB4MSA9IGNvb3JkaW5hdGVzW2ldLnggLSBkeCAqIHQ7XG4gICAgICAgICAgICBjb25zdCB5MSA9IGNvb3JkaW5hdGVzW2ldLnkgLSBkeSAqIHQ7XG4gICAgICAgICAgICBjb25zdCBvMSA9IHtcbiAgICAgICAgICAgICAgICB4OiB4MSxcbiAgICAgICAgICAgICAgICB5OiB5MVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0aW5nIHRoZSBzZWNvbmQgY29udHJvbCBwb2ludCBjb29yZGluYXRlc1xuICAgICAgICAgICAgY29uc3QgeDIgPSBjb29yZGluYXRlc1tpXS54ICsgZHggKiB0O1xuICAgICAgICAgICAgY29uc3QgeTIgPSBjb29yZGluYXRlc1tpXS55ICsgZHkgKiB0O1xuICAgICAgICAgICAgY29uc3QgbzIgPSB7XG4gICAgICAgICAgICAgICAgeDogeDIsXG4gICAgICAgICAgICAgICAgeTogeTJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBCdWlsZGluZyB0aGUgY29udHJvbCBwb2ludHMgY29vcmRpbmF0ZXMgYXJyYXlcbiAgICAgICAgICAgIHBvaW50W2ldID0gW107XG4gICAgICAgICAgICBwb2ludFtpXS5wdXNoKG8xKTtcbiAgICAgICAgICAgIHBvaW50W2ldLnB1c2gobzIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEJ1aWxkaW5nIHRoZSBwYXRoIGRhdGEgc3RyaW5nXG4gICAgICAgIGxldCBkID0gYE0gJHtjb29yZGluYXRlc1swXS54fSAke2Nvb3JkaW5hdGVzWzBdLnl9IFEgJHtwb2ludFsxXVsxXS54fSAke3BvaW50WzFdWzFdLnl9ICR7Y29vcmRpbmF0ZXNbMV0ueH0gJHtjb29yZGluYXRlc1sxXS55fWA7XG4gICAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAvLyBDZW50cmFsIHBvaW50cyBhcmUgY3ViaWMgYmV6aWVyIHdpdGggdGhlIHN5bnRheCBDIHgwIHkwIHgxIHkxIHggeVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkICs9IGAgQyAke3BvaW50W2ldWzBdLnh9ICR7cG9pbnRbaV1bMF0ueX0gJHtwb2ludFtpICsgMV1bMV0ueH0gJHtwb2ludFtpICsgMV1bMV0ueX0gJHtjb29yZGluYXRlc1tpICsgMV0ueH0gJHtjb29yZGluYXRlc1tpICsgMV0ueX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGxhc3QgcG9pbnQgaXMgYWdhaW4gYSBxdWFkcmF0aWMgYmV6aWVyIHdpdGggdGhlIHN5bnRheCBRIHgwIHkwIHggeVxuICAgICAgICAgICAgY29uc3QgbiA9IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBkICs9IGAgUSAke3BvaW50W24gLSAxXVswXS54fSAke3BvaW50W24gLSAxXVswXS55fSAke2Nvb3JkaW5hdGVzW25dLnh9ICR7Y29vcmRpbmF0ZXNbbl0ueX1gO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbmRlcmluZyB0aGUgdmVjdG9yIG9uIEZpZ21hJ3MgY2FudmFzXG4gICAgICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5jcmVhdGVWZWN0b3IoKTtcbiAgICAgICAgbm9kZS52ZWN0b3JQYXRocyA9IFt7XG4gICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6IFwiTk9ORVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRcbiAgICAgICAgICAgIH1dO1xuICAgICAgICBub2RlLmhhbmRsZU1pcnJvcmluZyA9IFwiQU5HTEVfQU5EX0xFTkdUSFwiO1xuICAgICAgICBub2RlLmNvbnN0cmFpblByb3BvcnRpb25zID0gdHJ1ZTtcbiAgICAgICAgLy8gSW5zZXJ0aW5nIHRoZSByZW5kZXJlZCB2ZWN0b3IgcGF0aCBpbnRvIHRoZSBzZWxlY3RlZCBmcmFtZVxuICAgICAgICBpZiAoc2VsZWN0aW9uTm9kZS50eXBlID09PSAnRlJBTUUnKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25Ob2RlLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgbm9kZS54ID0gTWF0aC5yb3VuZCgoc2VsZWN0aW9uTm9kZS53aWR0aCAtIG5vZGUud2lkdGgpIC8gMik7XG4gICAgICAgICAgICBub2RlLnkgPSBNYXRoLnJvdW5kKChzZWxlY3Rpb25Ob2RlLmhlaWdodCAtIG5vZGUuaGVpZ2h0KSAvIDIpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLm5vdGlmeSgnR3JhcGggc3VjY2Vzc2Z1bGx5IGluc2VydGVkJywgeyB0aW1lb3V0OiA0MDAwLCBlcnJvcjogZmFsc2UgfSk7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBrZWVwIGEgZnJhbWUgc2VsZWN0ZWQgdG8gaW5zZXJ0IGEgZ3JhcGgnLCB7IHRpbWVvdXQ6IDQwMDAsIGVycm9yOiB0cnVlIH0pO1xuICAgIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=