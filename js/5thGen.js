const gameSalesData = [
    // PS1
    { title: "Gran Turismo", sales: 10.85, console: "PS1" },
    { title: "Final Fantasy VII", sales: 9.8, console: "PS1" },
    { title: "Gran Turismo 2", sales: 9.49, console: "PS1" },
    { title: "Crash Bandicoot", sales: 6.82, console: "PS1" },
    { title: "Tekken 3", sales: 8.36, console: "PS1" },
    { title: "Metal Gear Solid", sales: 7.04, console: "PS1" },
    { title: "Crash Bandicoot 2", sales: 7.58, console: "PS1" },
    { title: "Final Fantasy VIII", sales: 8.6, console: "PS1" },

    // N64
    { title: "Super Mario 64", sales: 11.9, console: "N64" },
    { title: "Mario Kart 64", sales: 9.87, console: "N64" },
    { title: "GoldenEye 007", sales: 8.09, console: "N64" },
    { title: "Ocarina of Time", sales: 7.6, console: "N64" },
    { title: "Super Smash Bros.", sales: 5.55, console: "N64" },
    { title: "Pokémon Stadium", sales: 5.46, console: "N64" },
    { title: "Diddy Kong Racing", sales: 4.88, console: "N64" }
];

const slopeData = [
    {
        name: "PlayStation",
        color: "#2563eb",
        startLabel: "Launch",
        endLabel: "Final Sales",
        startValue: 0,
        endValue: 102.5
    },
    {
        name: "Nintendo 64",
        color: "#dc2626",
        startLabel: "Launch",
        endLabel: "Final Sales",
        startValue: 0,
        endValue: 32.9
    }
];

const gameImagePairs = [
  {
    title: "Super Mario",
    before: "./data/gen5/supermario2d.png",
    after: "./data/gen5/supermario3d.png",
    description: "Left: Super Mario Bros, Right: Super Mario 64"
  },
  {
    title: "Zelda",
    before: "./data/gen5/zelda2d.png",
    after: "./data/gen5/zelda3d.png",
    description: "Left: Legend of Zelda, Right: Legend of Zelda: Ocarina of Time"
  },
    {
    title: "Final Fantasy",
    before: "./data/gen5/FF2d.png",
    after: "./data/gen5/FF3d.png",
    description: "Left: Final Fantasy 6, Right: Final Fantasy 7"
  },
  {
    title: "Fighting Game",
    before: "./data/gen5/fighting2d.png",
    after: "./data/gen5/fighting3d.png",
    description: "Left: Street Fighter 2, Right: Virtual Fighter"
  }
];

export function render5thGenMedia(genMediaEls) {
    if (!genMediaEls.chart) return;

    genMediaEls.chart.selectAll("*").remove();

    const chart = genMediaEls.chart
        .classed("hidden", false)
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("width", "450px");

    // ----- initial chart -----
    renderGameSalesBarChart(chart, "technical");

    const chart2 = genMediaEls.chart2
    .classed("hidden", false)
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("width", "auto");

    renderGameScreenshot(chart2, "technical");
}


function renderGameSalesBarChart(container) {

    container.selectAll("*").remove();

    const w = 450;
    const h = 500;
    const margin = { top: 20, right: 30, bottom: 40, left: 180 };

    const tooltip = d3.select("body")
    .selectAll(".bar-tooltip")
    .data([null])
    .join("div")
    .attr("class", "bar-tooltip")
    .style("position", "absolute")
    .style("background", "#111")
    .style("color", "#fff")
    .style("padding", "6px 8px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);
    const colorScale = d3.scaleOrdinal()
        .domain(["PS1", "N64"])
        .range(["#2563eb", "#dc2626"]);


    const svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    const x = d3.scaleLinear()
        .range([margin.left, w - margin.right]);

    const y = d3.scaleBand()
        .range([margin.top, h - margin.bottom])
        .padding(0.15);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${h - margin.bottom})`);

    const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .style("font-size", "12px");
        
    svg.selectAll("rect.bar").lower();


    // ---------- Initial render ----------
    update("All");

    // ---------- Update function ----------
    function update(filter) {

        const filteredData =
        filter === "All"
            ? gameSalesData
            : gameSalesData.filter(d => d.console === filter);

        filteredData.sort((a, b) => b.sales - a.sales);

        x.domain([0, d3.max(filteredData, d => d.sales)]).nice();
        y.domain(filteredData.map(d => d.title));

        xAxis.transition().call(d3.axisBottom(x));
        yAxis.transition().call(d3.axisLeft(y));

        const bars = svg.selectAll("rect.bar")
        .data(filteredData, d => d.title);

        // EXIT
        bars.exit()
        .transition()
        .duration(400)
        .attr("width", 0)
        .remove();

        // UPDATE
        bars.transition()
        .duration(600)
        .attr("y", d => y(d.title))
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.sales) - margin.left)
        .attr("fill", d => colorScale(d.console));


        // ENTER
        bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", margin.left)
        .attr("y", d => y(d.title))
        .attr("height", y.bandwidth())
        .attr("width", 0)
        .attr("fill", d => colorScale(d.console))
        .on("mouseover", (event, d) => {
            tooltip
            .style("opacity", 1)
            .html(
                `<b>${d.title}</b><br>` +
                `Console: ${d.console}<br>` +
                `Sales: ${d.sales}M`
            )
            .style("left", event.pageX + 12 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", (event) => {
            tooltip
            .style("left", event.pageX + 12 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(600)
        .attr("width", d => x(d.sales) - margin.left);

        svg.selectAll("rect.bar").lower();
    }

    // ---------- Axis label ----------
    svg.append("text")
        .attr("x", w / 2 + margin.left/2)
        .attr("y", h - 4)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .text("Units Sold (Million)");
        
    // ---------- Buttons ----------
    const controls = container.append("div")
        .style("margin-bottom", "10px");


    ["All", "PS1", "N64"].forEach(type => {
        controls.append("button")
        .text(type)
        .style("margin-right", "8px")
        .on("click", () => update(type));
    });
}

function renderGameScreenshot(container) {

    container.selectAll("*").remove();

    const w = 800;
    const h = 500;

    let currentGame = gameImagePairs[0];
    const descEl = document.getElementById("2dto3dDesc");

    const svg = container.append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("border", "1px solid #d1d5db")
    .style("border-radius", "8px")
    .style("background", "#000");

    // ---------- defs ----------
    const defs = svg.append("defs");

    const clip = defs.append("clipPath")
    .attr("id", "clip-left");

    const clipRect = clip.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)         
    .attr("height", h);

    // Left Image
    const leftImage = svg.append("image")
    .attr("href", currentGame.before)
    .attr("width", w)
    .attr("height", h)
    .attr("preserveAspectRatio", "xMidYMid slice");

    //Right Image
    const rightImage = svg.append("image")
    .attr("href", currentGame.after)
    .attr("width", w)
    .attr("height", h)
    .attr("clip-path", "url(#clip-left)")
    .attr("preserveAspectRatio", "xMidYMid slice");

    // ---------- slider ----------
    const slider = svg.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", h)
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "ew-resize");

    const handle = svg.append("circle")
    .attr("cx", 0)
    .attr("cy", h / 2)
    .attr("r", 8)
    .attr("fill", "#fff")
    .style("cursor", "ew-resize");

    // ---------- drag ----------
    const drag = d3.drag().on("drag", (event) => {
    const x = Math.max(0, Math.min(w, event.x));

    clipRect.attr("width", x);
    slider.attr("x1", x).attr("x2", x);
    handle.attr("cx", x);
    });

    slider.call(drag);
    handle.call(drag);

    // ---------- labels ----------
    svg.append("text")
    .attr("x", 8)
    .attr("y", 18)
    .attr("fill", "#fff")
    .attr("font-size", 12)
    .text("2D");

    svg.append("text")
    .attr("x", w - 8)
    .attr("y", 18)
    .attr("fill", "#fff")
    .attr("font-size", 12)
    .attr("text-anchor", "end")
    .text("3D");

    // ---------- buttons ----------
    const controls = container.append("div")
    .style("margin-top", "8px")
    .style("display", "flex")
    .style("gap", "6px")
    .style("flex-wrap", "wrap")
    .style("justify-content", "center");

    const setDescription = (game) => {
        if (!descEl) return;
        descEl.textContent = game.description || "";
    };

    setDescription(currentGame);

    gameImagePairs.forEach(game => {
    controls.append("button")
    .text(game.title)
    .on("click", () => {
        // change images
        leftImage.attr("href", game.before);
        rightImage.attr("href", game.after);
        clipRect.attr("width", 0);
        slider.attr("x1", 0).attr("x2", 0);
        handle.attr("cx", 0);
        setDescription(game);
        });
    });
}
