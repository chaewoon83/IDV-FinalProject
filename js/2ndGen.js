const atariShockData10yr = [
  { year: 1980, revenue: 0.8 },
  { year: 1981, revenue: 1.5 },
  { year: 1982, revenue: 2.8 },
  { year: 1983, revenue: 3.2 }, // peak
  { year: 1984, revenue: 0.8 },
  { year: 1985, revenue: 0.1 },  // crash bottom
  { year: 1986, revenue: 0.2 },
];

export function render2ndGenMedia(genMediaEls) {
    if (!genMediaEls.chart) return;

    genMediaEls.chart
        .classed("hidden", false)
        .selectAll("*")
        .remove();

    // chart render
    renderAtariShockChart(genMediaEls.chart);
}


function renderAtariShockChart(container) {
    const data = atariShockData10yr;

    const w = container.node().clientWidth || 450;
    const h = 260;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#111")
        .style("color", "#fff")
        .style("padding", "6px 8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    const svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, w - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue) || 1])
        .nice()
        .range([h - margin.bottom, margin.top]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.revenue))
        .curve(d3.curveMonotoneX);

    // axes
    svg.append("g")
        .attr("transform", `translate(0,${h - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5));

    // path
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);

    // crash line
    svg.append("line")
        .attr("x1", x(1983))
        .attr("x2", x(1983))
        .attr("y1", margin.top)
        .attr("y2", h - margin.bottom)
        .attr("stroke", "#991b1b")
        .attr("stroke-dasharray", "4 4")
        .attr("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr("opacity", 1);

    svg.append("text")
        .attr("x", x(1983) + 6)
        .attr("y", margin.top + 12)
        .attr("fill", "#991b1b")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text("atari shock")
        .transition()
        .delay(1100)
        .duration(500)
        .attr("opacity", 1);

    // data points
    const points = svg.selectAll("circle.data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.revenue))
        .attr("r", 0)
        .attr("fill", "#111")
        .attr("opacity", 0);

    points
        .transition()
        .delay((d, i) => 300 + i * 100)
        .duration(600)
        .attr("r", 4);  

    // hover
    svg.append("rect")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", w - margin.left - margin.right)
        .attr("height", h - margin.top - margin.bottom)
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave);

    // labels
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("fill", "#374151")
        .text("Revenue (Billion USD)");

    svg.append("text")
        .attr("x", w / 2)
        .attr("y", h - 4)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("fill", "#374151")
        .text("Year");

    const bisectYear = d3.bisector(d => d.year).left;

    function onMouseMove(event) {
        const [mx] = d3.pointer(event);
        const year = Math.round(x.invert(mx));

        const idx = bisectYear(data, year);
        const d0 = data[idx - 1];
        const d1 = data[idx];
        const d = !d1 || (year - d0.year < d1.year - year) ? d0 : d1;

        points.attr("opacity", p => (p === d ? 1 : 0));

        tooltip
            .style("opacity", 1)
            .html(`<b>${d.year}</b><br>Revenue: $${d.revenue.toFixed(1)}B`)
            .style("left", event.pageX + 12 + "px")
            .style("top", event.pageY - 28 + "px");
    }

    function onMouseLeave() {
        points.attr("opacity", 0);
        tooltip.style("opacity", 0);
    }
}
