import React, { useEffect, useRef } from "react";

const ContinuousBloodStainEffect = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";
    // Create an SVG overlay that covers the viewport.
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.position = "fixed";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100vw";
    svg.style.height = "100vh";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "9999";

    // Define a radial gradient for a blood stain effect.
    const defs = document.createElementNS(svgNS, "defs");
    const radialGradient = document.createElementNS(svgNS, "radialGradient");
    radialGradient.setAttribute("id", "bloodGradient");
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "rgb(196, 17, 17)");
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "70%");
    stop2.setAttribute("stop-color", "rgba(189, 6, 6, 0.5)");
    const stop3 = document.createElementNS(svgNS, "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("stop-color", "rgba(192, 6, 6, 0)");
    radialGradient.appendChild(stop1);
    radialGradient.appendChild(stop2);
    radialGradient.appendChild(stop3);
    defs.appendChild(radialGradient);
    svg.appendChild(defs);

    svgRef.current = svg;
    document.body.appendChild(svg);

    const handleMouseMove = (e) => {
      const x = e.pageX;
      const y = e.pageY;

      // Create a circular burst of dots around the cursor.
      const numDots = 5; // Number of dots in the circle.
      const circleRadius = 5; // Distance from the cursor.
      for (let i = 0; i < numDots; i++) {
        const angle = (2 * Math.PI / numDots) * i;
        const dotX = x + circleRadius * Math.cos(angle);
        const dotY = y + circleRadius * Math.sin(angle);
        const radius = 2 + Math.random() * 2; // Dot radius between 2 and 4 px.
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", dotX);
        circle.setAttribute("cy", dotY);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "url(#bloodGradient)");
        circle.style.opacity = "1";
        circle.style.transition = "opacity 1s ease-out, transform 1s ease-out";
        // Optional: slight random scale for organic variation.
        circle.style.transform = `scale(${1 + Math.random() * 0.1})`;

        svg.appendChild(circle);

        // Fade out after 1 second then remove.
        setTimeout(() => {
          circle.style.opacity = "0";
          setTimeout(() => {
            if (circle.parentNode) {
              circle.parentNode.removeChild(circle);
            }
          }, 300);
        }, 100);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (svg && svg.parentNode) {
        svg.parentNode.removeChild(svg);
      }
    };
  }, []);

  return null;
};

export default ContinuousBloodStainEffect;
