export const getSVGForSrcById = ({ symbolId = "icon-symbol-one", color = 'red' }) => {
      let svgstr = getSVGElementById({ symbolId, color })
      let src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgstr)

      return src
}
export const getSVGElementById = ({ symbolId, color = 'red' }) => {
      symbolId = symbolId || "icon-symbol-one"
      var oSvg = document.querySelector(`symbol#${symbolId}`)
      let paths = ""
      if (oSvg) {
            var pathRegex = /<path[^>]*>[^<]*<\/path>/gi
            var pathMatches = oSvg.outerHTML.match(pathRegex);
            if (pathMatches && pathMatches.length) {
                  paths = pathMatches.join("")
            }
      }

      var svgStr = `<svg xmlns="http://www.w3.org/2000/svg" id="${symbolId}" viewBox="0 0 1024 1024" height="36px" width="36px" fill="${color}">${paths}</svg>`;
      return svgStr
}