// svg width height
const viewWidth = 1400;
const viewHeight = 700;



// select svg
const svg = d3.select("#timeline")
    .attr("width", viewWidth)
    .attr("height", viewHeight);

const container = svg.append("g");

// color per generation
const generations = [
    { name: "1st", color: "#7BC67B" },
    { name: "2nd", color: "#58A4E0" },
    { name: "3rd", color: "#F4D35E" },
    { name: "4th", color: "#EE964B" },
    { name: "5th", color: "#F95738" },
    { name: "6th", color: "#9B5DE5" },
    { name: "7th", color: "#252422" }
];

// length per generation
const genWidth = 800;
let genX = 0;

// timeline width
const timelineWidth = genWidth * generations.length;

// drag activiate
const zoom = d3.zoom()
    .scaleExtent([1, 1])        //only drag to move
    .translateExtent([[0, 0], [timelineWidth, viewHeight]])
    .on("zoom", (event) => {
        container.attr("transform", event.transform);
    });

svg.call(zoom);

// color strip for generation
container.selectAll("rect.genbar")
    .data(generations)
    .enter()
    .append("rect")
    .attr("class", "genbar")
    .attr("x", (d, i) => i * genWidth)
    .attr("y", 0)
    .attr("width", genWidth)
    .attr("height", 40)
    .attr("fill", d => d.color);

// generation name
container.selectAll("text.genlabel")
    .data(generations)
    .enter()
    .append("text")
    .attr("class", "genlabel")
    .attr("x", (d, i) => i * genWidth + 20)
    .attr("y", 25)
    .attr("font-size", 20)
    .attr("fill", "white")
    .text(d => d.name + " Generation");

// retrieve json datas
d3.json("data/events.json").then(events => {

    // xScale: 날짜 → 가로 좌표
    const xScale = d3.scaleTime()
        .domain([new Date(1972, 0, 1), new Date(2007, 0, 1)])
        .range([0, timelineWidth]);

    // card group
    const card = container.selectAll("g.card")
        .data(events)
        .enter()
        .append("g")
        .attr("class", "card")
        .attr("transform", function(d, i) {
            const x = xScale(new Date(d.date));
            const y = (i % 2 === 0) ? 100 : 320; 
            // store original coords as attributes so hover handlers can use them
            d3.select(this).attr("data-x", x).attr("data-y", y);
            return `translate(${x}, ${y})`;
        });
    // cardbox
    card.append("rect")
        .attr("width", 180)
        .attr("height", 180)
        .attr("fill", "white")
        .attr("stroke", "#aaa")
        .attr("rx", 10);

    // image
    card.append("image")
        .attr("href", d => d.image)
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 70)
        .attr("height", 70);

    // year
    card.append("text")
        .text(d => d.year)
        .attr("x", 95)
        .attr("y", 30)
        .attr("font-weight", "bold")
        .attr("font-size", 18);

    // title
    card.append("text")
        .text(d => d.title)
        .attr("x", 95)
        .attr("y", 55)
        .attr("font-size", 12)
        .attr("fill", "#444");

    // description
    card.append("foreignObject")
    .attr("x", 10)
    .attr("y", 95)
    .attr("width", 160)
    .attr("height", 70)
    .append("xhtml:div")
    .style("font", "11px sans-serif")
    .style("color", "#666")
    .style("line-height", "1.35")
    .style("overflow", "hidden")
    .style("display", "-webkit-box")
    .style("-webkit-line-clamp", "3")
    .style("-webkit-box-orient", "vertical")
    .style("text-overflow", "ellipsis")
    .text(d => d.description);

    // add hover handlers with explicit transform attr changes (no CSS transform)
    card
        .on("mouseover", function(event, d) {
            const el = d3.select(this);
            const x = +el.attr("data-x") || 0;
            const y = +el.attr("data-y") || 0;
            console.log('card mouseover', {x, y, id: d.id || d.title});
            el.raise();
            el.transition()
                .duration(180)
                .attr("transform", `translate(${x}, ${y - 12}) scale(1.03)`);
        })
        .on("mouseout", function(event, d) {
            const el = d3.select(this);
            const x = +el.attr("data-x") || 0;
            const y = +el.attr("data-y") || 0;
            console.log('card mouseout', {x, y, id: d.id || d.title});
            el.transition()
                .duration(180)
                .attr("transform", `translate(${x}, ${y}) scale(1)`);
        });
});
