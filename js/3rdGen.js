const arcadeConsumerData = {
  1985: { arcade: 9.5,  consumer: 0.0 },
  1986: { arcade: 8.5,  consumer: 1.2 },
  1987: { arcade: 11.5, consumer: 1.5 },
  1988: { arcade: 12.0, consumer: 7.0 },
  1989: { arcade: 13.0, consumer: 8.0 },
  1990: { arcade: 14.0, consumer: 7.0 },
};

export function render3rdGenMedia(genMediaEls) {
    if (!genMediaEls.chart) return;

    const chart = genMediaEls.chart
        .classed("hidden", false)
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("justify-content", "flex-start");

    chart.selectAll("*").remove();
    // chart render
    renderArcadeConsumerChart(chart);
}


function renderArcadeConsumerChart(container) {

    const years = Object.keys(arcadeConsumerData).map(Number);

    const wrapper = container.append("div")
        .style("margin-top", "20px");

    // ---------- svg ----------
    const w = 340;
    const h = 240;
    const radius = Math.min(w, h) * 0.4;

    const svg = wrapper.append("svg")
        .attr("width", w)
        .attr("height", h);

    const g = svg.append("g")
        .attr("transform", `translate(${w / 2}, ${h / 2})`);

    const color = d3.scaleOrdinal()
        .domain(["Arcade", "Consumer"])
        .range(["#6fffe9", "#ff7bca"]);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

    const centerText = g.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 4)
        .attr("font-size", 12)
        .attr("fill", "#e8eeff");

    // legend (bottom-right inside chart)
    const legendItems = [
        { key: "Arcade", color: "#6fffe9", label: "Arcade" },
        { key: "Consumer", color: "#ff7bca", label: "Console / PC" }
    ];

    const legendSpacing = 80;
    const legendWidth = legendItems.length * legendSpacing;
    const legendX = w - legendWidth - 12; // keep inside svg bounds
    const legendY = h - 10;

    const legend = svg.append("g")
        .attr("transform", `translate(${legendX}, ${legendY})`);

    const legendRow = legend.selectAll("g.legend-item")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_, i) => `translate(${i * legendSpacing}, 0)`);

    legendRow.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => d.color)
        .attr("rx", 2);

    legendRow.append("text")
        .attr("x", 16)
        .attr("y", 10)
        .attr("font-size", 11)
        .attr("fill", "#9fb3e9")
        .text(d => d.label);

    // ---------- slider (below chart) ----------
    const control = wrapper.append("div")
        .style("text-align", "center")
        .style("margin-top", "14px");

    control.append("span")
        .text("Year: ")
        .style("margin-right", "6px")
        .style("color", "#e8eeff");

    const yearLabel = control.append("span")
        .style("font-weight", "bold")
        .style("color", "#6fffe9")
        .text("1982");

    const slider = control.append("input")
        .attr("type", "range")
        .attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("step", 1)
        .attr("value", 1985)
        .style("width", "200px")
        .style("margin-left", "10px");

    // ---------- render function ----------
    function update(year) {
        const d = arcadeConsumerData[year];
        yearLabel.text(year);

        const data = [
            { key: "Arcade", value: d.arcade },
            { key: "Consumer", value: d.consumer }
        ];

        const arcs = pie(data);

        const paths = g.selectAll("path")
            .data(arcs, d => d.data.key);

        paths.enter()
            .append("path")
            .attr("fill", d => color(d.data.key))
            .each(function (d) { this._current = d; })
            .merge(paths)
            .transition()
            .duration(600)
            .attrTween("d", function (d) {
                const i = d3.interpolate(this._current, d);
                this._current = i(1);
                return t => arc(i(t));
            });

        paths.exit().remove();

        const total = d.arcade + d.consumer;
        centerText.text(
            `Total\n$${total.toFixed(1)}B`
        );
    }

    // ---------- interaction ----------
    slider.on("input", function () {
        update(this.value);
    });

    // ---------- init ----------
    update(1985);
}
