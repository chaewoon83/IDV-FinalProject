const radarDataByMode = {
  technical: [
    {
      name: "Super Famicom",
      color: "#ff7bca",
      values: [
        { axis: "CPU Speed", value: 6 },
        { axis: "Graphics Colors", value: 9 },
        { axis: "Sound Hardware", value: 9 },
        { axis: "Memory", value: 8 },
        { axis: "Resolution", value: 7 },
        { axis: "Sprites", value: 9 }
      ]
    },
    {
      name: "Sega Mega Drive",
      color: "#6fffe9",
      values: [
        { axis: "CPU Speed", value: 9 },
        { axis: "Graphics Colors", value: 6 },
        { axis: "Sound Hardware", value: 6 },
        { axis: "Memory", value: 6 },
        { axis: "Resolution", value: 8 },
        { axis: "Sprites", value: 7 }
      ]
    }
  ],

  media: [
    {
      name: "Super Famicom",
      color: "#ff7bca",
      values: [
        { axis: "Game Library", value: 9 },
        { axis: "Audio Experience", value: 9 },
        { axis: "Gameplay Experience", value: 8 },
        { axis: "Market Reach", value: 8 },
        { axis: "Cultural Impact", value: 9 },
        { axis: "Longevity & Legacy", value: 9 }
      ]
    },
    {
      name: "Sega Mega Drive",
      color: "#6fffe9",
      values: [
        { axis: "Game Library", value: 7 },
        { axis: "Audio Experience", value: 6 },
        { axis: "Gameplay Experience", value: 8 },
        { axis: "Market Reach", value: 7 },
        { axis: "Cultural Impact", value: 8 },
        { axis: "Longevity & Legacy", value: 8 }
      ]
    }
  ]
};

const axisDescriptions = {
  technical: {
    "CPU Speed": "Processing speed that affects game pace and responsiveness.",
    "Graphics Colors": "Number of colors supported, influencing visual richness.",
    "Sound Hardware": "Dedicated audio chips and synthesis capabilities.",
    "Memory": "Available RAM affecting game complexity and content size.",
    "Resolution": "Native screen resolution and visual clarity.",
    "Sprites": "Maximum number of moving objects on screen."
  },
  media: {
    "Game Library": "Overall quantity and quality of available games.",
    "Audio Experience": "How music and sound effects feel during gameplay.",
    "Gameplay Experience": "Controls, pacing, and overall play feel.",
    "Market Reach": "Regional and global popularity of the console.",
    "Cultural Impact": "Influence on pop culture and gaming identity.",
    "Longevity & Legacy": "Long-term influence on future consoles and franchises."
  }
};

export function render4thGenMedia(genMediaEls) {
  if (!genMediaEls.chart) return;

  const chart = genMediaEls.chart
    .classed("hidden", false)
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  chart.selectAll("*").remove();

  // ----- toggle UI -----
  const toggle = chart.append("div")
    .attr("class", "toggle-wrapper");

  toggle.append("span")
    .attr("class", "toggle-label")
    .text("Technical");

  toggle.append("label")
    .attr("class", "switch")
    .html(`
      <input type="checkbox" id="radarToggle">
      <span class="slider"></span>
    `);

  toggle.append("span")
    .attr("class", "toggle-label")
    .text("Media");

  // ----- initial chart -----
  renderRadarChart(chart, "technical");

  // ----- interaction -----
  d3.select("#radarToggle").on("change", function () {
    const mode = this.checked ? "media" : "technical";
    renderRadarChart(chart, mode);
  });
}


function renderRadarChart(container, mode) {

    container.selectAll("svg").remove();

    const tooltip = d3.select("body")
    .selectAll(".radar-tooltip")
    .data([null])
    .join("div")
    .attr("class", "radar-tooltip")
    .style("position", "absolute")
    .style("background", "rgba(10, 20, 40, 0.92)")
    .style("color", "#e8eeff")
    .style("padding", "6px 8px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("border", "1px solid rgba(111, 255, 233, 0.35)")
    .style("box-shadow", "0 10px 30px rgba(0,0,0,0.35)")
    .style("pointer-events", "none")
    .style("opacity", 0);

    const radarData = radarDataByMode[mode];

    const w = 450;
    const h = 300;
    const radius = Math.min(w, h) / 2 - 40;
    const levels = 5;

    const svg = container.append("svg")
        .attr("width", w)
        .attr("height", h);

    const g = svg.append("g")
        .attr("transform", `translate(${w / 2}, ${h / 2})`);

    const axes = radarData[0].values.map(d => d.axis);
    const angleSlice = (Math.PI * 2) / axes.length;

    const rScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, radius]);

        // ---------- grid ----------
        for (let lvl = 1; lvl <= levels; lvl++) {
            g.append("circle")
            .attr("r", radius * (lvl / levels))
            .attr("fill", "none")
            .attr("stroke", "rgba(232, 238, 255, 0.18)")
            .attr("stroke-dasharray", "2 2");
        }

    // ---------- axis ----------
    axes.forEach((axis, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    g.append("line")
        .attr("x2", rScale(10) * x)
        .attr("y2", rScale(10) * y)
        .attr("stroke", "rgba(232, 238, 255, 0.25)");

    g.append("text")
    .attr("x", (rScale(10) + 16) * x)
    .attr("y", (rScale(10) + 16) * y)
    .attr("dy", "0.35em")
    .attr("text-anchor", x > 0.1 ? "start" : x < -0.1 ? "end" : "middle")
    .attr("font-size", 11)
    .attr("fill", "#9fb3e9")
    .text(axis)
    .on("mouseover", (event) => {
        tooltip
        .style("opacity", 1)
        .html(
            `<b>${axis}</b><br>` +
            axisDescriptions[mode][axis]
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 24 + "px");
    })
    .on("mousemove", (event) => {
        tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 24 + "px");
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });
    });
    const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveLinearClosed);


    radarData.forEach((d, i) => {
        g.append("path")
            .datum(d.values)
            .attr("fill", d.color)
            .attr("fill-opacity", 0.25)
            .attr("stroke", d.color)
            .attr("stroke-width", 2)
            // 초기 상태: 중심에 붙어 있음
            .attr("d", radarLine(d.values.map(v => ({ ...v, value: 0 }))))
            .transition()
            .delay(i * 200)
            .duration(800)
            .ease(d3.easeCubicOut)
            .attrTween("d", function () {
                const interpolate = d3.interpolate(
                    d.values.map(v => ({ ...v, value: 0 })),
                    d.values
                );
                return t => radarLine(interpolate(t));
            });
    });

    // ---------- legend ----------
    const legend = svg.append("g")
        .attr("transform", "translate(320,250)");

    radarData.forEach((d, i) => {
        const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 18})`);

        row.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d.color);

        row.append("text")
        .attr("x", 18)
        .attr("y", 10)
        .attr("font-size", 12)
        .attr("fill", "#e8eeff")
        .text(d.name);
    });
}
