import { render1stGenMedia } from "./1stGen.js";
import { render2ndGenMedia } from "./2ndGen.js";
import { render3rdGenMedia } from "./3rdGen.js";
import { render4thGenMedia } from "./4thGen.js";
import { render5thGenMedia } from "./5thGen.js";

const renderMediaByGen = {
    "1st": render1stGenMedia,
    "2nd": render2ndGenMedia,
    "3rd": render3rdGenMedia,
    "4th": render4thGenMedia,
    "5th": render5thGenMedia,
};

// svg width height
const viewHeight = 600;
const viewWidth = document.getElementById("timeline-container").clientWidth;

const svg = d3.select("#timeline")
    .attr("viewBox", `0 0 ${viewWidth} ${viewHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%") 
    .style("height", `${viewHeight}px`);


const container = svg.append("g");

// detail elements and video mapping
const detailEls = {
    meta: d3.select("#detail-meta"),
    title: d3.select("#detail-title"),
    description: d3.select("#detail-description"),
    video: document.getElementById("detail-video"),
    image: document.getElementById("detail-image")
};

const genContentEls = {
    timelineWrapper: document.getElementById("timeline-wrapper"),
    genPanel: document.getElementById("gen-content")
};

const genMediaTargets = {
    "1st": {
        table: d3.select("#gen1-table")
    },
    "2nd": {
        chart: d3.select("#gen2-chart")
    },
    "3rd": {
        chart: d3.select("#gen3-chart")
    },
    "4th": {
        chart: d3.select("#gen4-chart")
    },
    "5th": {
        chart: d3.select("#gen5-chart-1"),
        chart2: d3.select("#gen5-chart-2")
    },
};
const genSections = Array.from(document.querySelectorAll(".gen-section"));

const genInfoEls = {
    items: Array.from(document.querySelectorAll(".gen-item"))
};

// run renderer when the target element enters the viewport (with fallback)
function renderOnVisible(targetEl, renderer, targets) {
    if (!targetEl || typeof renderer !== "function") {
        renderer?.(targets);
        return;
    }
    if (!("IntersectionObserver" in window)) {
        renderer(targets);
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderer(targets);
                obs.disconnect();
            }
        });
    }, { threshold: 0.25 });
    observer.observe(targetEl);
}

function showPanel(panel) {
    const { timelineWrapper, genPanel } = genContentEls;
    if (panel === "timeline") {
        timelineWrapper.classList.remove("hidden");
        genPanel.classList.add("hidden");
    } else {
        timelineWrapper.classList.add("hidden");
        genPanel.classList.remove("hidden");
    }
}

function showGenSection(genKey) {
    genSections.forEach(sec => {
        const targetId = `gen-${genKey}`;
        const isTarget = sec.id === targetId;
        sec.classList.toggle("hidden", !isTarget);
    });
}


function setGenerationInfo(genKey) {
    const isTimeline = genKey === "timeline";
    genInfoEls.items.forEach(li => {
        li.classList.toggle("active", li.dataset.gen === genKey);
    });
    showPanel(isTimeline ? "timeline" : "generation");
    if (isTimeline) {
        showGenSection("default");
        return;
    }

    showGenSection(genKey);
    const targets = genMediaTargets[genKey];
    const renderer = renderMediaByGen[genKey];
    if (targets && typeof renderer === "function") {
        const watchEl = targets.chart?.node?.() || targets.table?.node?.();
        renderOnVisible(watchEl, renderer, targets);
    }
}

genInfoEls.items.forEach(li => {
    li.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "auto" });
        setGenerationInfo(li.dataset.gen);
    });
});

// seed sidebar info
setGenerationInfo("timeline");

const videoMap = {
    "Magnavox Odyssey": "https://www.youtube.com/embed/oVV2Fe6Z9xo",
    "Pong": "https://www.youtube.com/embed/fiShX2pTz9A",
    "Breakout": "https://www.youtube.com/embed/Ad6qZfwtQ6o",
    "Space Invaders": "https://www.youtube.com/embed/Qx7ehbWDiSM",
    "Pac-Man": "https://www.youtube.com/embed/XYzO9nEknhA",
    "Donkey Kong": "https://www.youtube.com/embed/NthIhZy44_g",
    "Famicom / NES": "https://www.youtube.com/embed/vXzYH7dDxXY",
    "Super Mario Bros.": "https://www.youtube.com/embed/SN8pNdCDo1k",
    "The Legend of Zelda": "https://www.youtube.com/embed/JmupJcIDyBQ",
    "Sega Mega Drive / Genesis": "https://www.youtube.com/embed/4eCQGMZvbBg",
    "Game Boy": "https://www.youtube.com/embed/-uPAV1ykKNs",
    "DOOM": "https://www.youtube.com/embed/Wgxek3GR4s4",
    "PlayStation": "https://www.youtube.com/embed/T-AVB3z0Gf0",
    "Nintendo 64": "https://www.youtube.com/embed/1PCs1el-mW8",
    "Nintendo Wii": "https://www.youtube.com/embed/Qt1b2T2te6E"
};

const buildMeta = (d) => `${d.year} \u00b7 ${d.type === "console" ? "Console" : "Game"} \u00b7 ${d.generation} gen`;

const normalizeEmbed = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
};

function renderDetail(d) {
    if (!d) return;
    detailEls.meta.text(buildMeta(d));
    detailEls.title.text(d.title);
    detailEls.description.text(d.description);
    const embedUrl = normalizeEmbed(d.video || videoMap[d.title] || "");

    if (embedUrl) {
        detailEls.video.src = embedUrl;
        detailEls.video.style.display = "block";
        detailEls.image.style.display = "none";
    } else {
        detailEls.video.src = "";
        detailEls.video.style.display = "none";
        detailEls.image.src = d.image;
        detailEls.image.style.display = "block";
    }
}

// color per generation
const generations = [
    { name: "1st", color: "#7BC67B" },
    { name: "2nd", color: "#58A4E0" },
    { name: "3rd", color: "#F4D35E" },
    { name: "4th", color: "#EE964B" },
    { name: "5th", color: "#F95738" },
];

// length per generation
const genWidth = 800;
const cardWidth = 200;
let genX = 0;

// timeline width (add padding so the last card isn't clipped)
const timelineWidth = genWidth * generations.length;

// drag activiate
const zoom = d3.zoom()
    .scaleExtent([1, 1])        //only drag to move
    .translateExtent([[-80, 0], [timelineWidth, viewHeight]])
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
    
    const eventExtent = d3.extent(events, d => new Date(d.date));

    const xScale = d3.scaleTime()
        .domain(eventExtent)
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
        .attr("width", 200)
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
    card.append("foreignObject")
        .attr("x", 95)
        .attr("y", 35)
        .attr("width", 95)
        .attr("height", 60) 
        .append("xhtml:div")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")   
        .style("justify-content", "flex-start")
        .style("font", "13px sans-serif-Bold")
        .style("color", "#131313ff")
        .style("overflow", "hidden")
        .style("line-height", "1.35")
        .style("display", "-webkit-box")
        .style("-webkit-line-clamp", "3")
        .style("-webkit-box-orient", "vertical")
        .style("text-overflow", "ellipsis")
        .attr("height", 38) 
        .style("padding-top", "2px")
        .text(d => d.title);
    // add hover handlers with explicit transform attr changes (no CSS transform)
    card
        .on("mouseover", function(event, d) {
            const el = d3.select(this);
            const x = +el.attr("data-x") || 0;
            const y = +el.attr("data-y") || 0;
            console.log('card mouseover', {x, y, id: d.id || d.title});
            el.raise();
            el.transition()
                .duration(10)
                .attr("transform", `translate(${x}, ${y - 12}) scale(1.03)`);
        })
        .on("mouseout", function(event, d) {
            const el = d3.select(this);
            const x = +el.attr("data-x") || 0;
            const y = +el.attr("data-y") || 0;
            console.log('card mouseout', {x, y, id: d.id || d.title});
            el.transition()
                .duration(10)
                .attr("transform", `translate(${x}, ${y}) scale(1)`);
        })
        .on("click", function(event, d) {
            renderDetail(d);
        });

    // seed detail panel with the first event
    if (events.length > 0) {
        renderDetail(events[0]);
    }
});
