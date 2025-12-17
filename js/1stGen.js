const generationMedia = {
    table: [
      {
        feature: "Signal Processing",
        odyssey: "Analog circuits",
        atari: "Digital logic",
        explanationImages: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Magnavox-Odyssey-Motherboard-FL.jpg/1280px-Magnavox-Odyssey-Motherboard-FL.jpg",
        "https://chester.me/img/2017/09/atari_board_without_chips.jpg"
        ],
        explanation:
          "The left image shows the analog circuitry of the Magnavox Odyssey, while the right image shows the digital logic circuit board of the Atari 2600."
      },
      {
        feature: "Programmability",
        odyssey: "Hardware-based (jumpers/cards)",
        atari: "Logic-based (counters & gates)",
        explanation:
          "The digital logic circuit board of Atari encodes control rules through logic gates, enabling greater flexibility without replacing physical hardware, whereas the Magnavox Odyssey’s analog circuitry depends on fixed signal paths that limit adaptability."
      },
      {
        feature: "CPU Usage",
        odyssey: "No CPU",
        atari: "No CPU (hardwired logic)",
        explanation:
          "Both systems predate microprocessor-based consoles."
      },
      {
        feature: "Display Method",
        odyssey: "Screen overlays",
        atari: "Direct video signal",
        explanationImages:[
            "https://www.giantbomb.com/a/uploads/scale_medium/13/132099/2158022-magnavox_odyssey_overlays.jpg",
            "https://media.wired.com/photos/59fccff22d3f5732c7d5aa15/3:2/w_2560%2Cc_limit/Pong-TA-B1C1YX.jpg"
        ],
        explanation:
          "The left image shows the analog screen overlay of the Magnavox Odyssey, while the right image shows the screen of atari's pong which do not need overlays."
      },
      {
        feature: "Scoring System",
        odyssey: "Manual scoring",
        atari: "Automatic scoring",
        explanationImages:[
            "https://www.digitalgamemuseum.org/wp-content/uploads/2016/03/Odyssey-tokens2.jpg",
        ],
        explanation:
          "The image shows the analog & physical scoring system of the Magnavox Odyssey, while atari's consoles automatically tracks scores on-screen."
      },
      {
        feature: "User Input",
        odyssey: "Analog dials",
        atari: "Digital paddles",
        explanationImages:[
            "https://oyster.ignimgs.com/mediawiki/apis.ign.com/history-of-video-game-consoles/e/ef/Control.jpg?width=396&format=jpg&auto=webp&quality=80",
            "https://upload.wikimedia.org/wikipedia/commons/3/33/Atari-2600-Joystick.jpg"
        ],
        explanation:
          "The left image shows the analog contoller system of the Magnavox Odyssey which only has analog input, while the right image shows the screen of atari's digital paddle controller which can provide digital input."
      },
      {
        feature: "Audio Output",
        odyssey: "None",
        atari: "Simple sound effects",
        explanation:
          "Magnavox Odyssey had no audio capabilities, while Atari 2600 could produce basic sound effects using its TIA chip."
      }
    ]
};


export function render1stGenMedia(genMediaEls) {
    if (!genMediaEls.table) return;
    if (genMediaEls.chart) {
        genMediaEls.chart.classed("hidden", true).selectAll("*").remove();
    }
    genMediaEls.table.classed("hidden", false).selectAll("*").remove();

    const media = generationMedia;
    if (!media) return;

    const container = genMediaEls.table;
    let explainBox = null;

    //table
    if (media.table?.length) {
        const table = container
            .append("table")
            .attr("class", "gen-table");

        const thead = table.append("thead").append("tr");
        ["Feature", "Magnavox Odyssey", "Atari"].forEach(h =>
            thead.append("th").text(h)
        );

        const tbody = table.append("tbody");

        const rows = tbody.selectAll("tr")
            .data(media.table)
            .enter()
            .append("tr")
            .on("click", function () {
                rows.classed("highlight", false);
                const d = d3.select(this).datum();
                d3.select(this).classed("highlight", true);
                if (!explainBox) {
                    explainBox = container.append("div").attr("class", "gen-explain");
                }
                let html = "";
                if (d.explanationHtml) {
                    html += d.explanationHtml;
                } else if (d.explanation) {
                    html += `<div class="explain-text">`;
                    html += `<p>${d.explanation}</p>`;
                    html += `</div>`;
                }
                if (Array.isArray(d.explanationImages)) {
                    html += `<div class="explain-images">` +
                        d.explanationImages.map(src => `<img src="${src}" alt="explanation image">`).join("") +
                        `</div>`;
                } else if (d.explanationImage) {
                    html += `<div class="explain-images"><img src="${d.explanationImage}" alt="explanation image"></div>`;
                }
                explainBox.html(html || "No explanation.");
            });

        rows.append("td").text(d => d.feature);

        rows.append("td")
            .text(d => d.odyssey)
            .append("title")
            .text(d => d.explanation);

        rows.append("td")
            .text(d => d.atari)
            .append("title")
            .text(d => d.explanation);

        explainBox = container.append("div")
            .attr("class", "gen-explain")
            .text("click table to see description.");
    }


}
