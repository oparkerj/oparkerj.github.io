
let leftScale = d3.scaleLinear([-1, 0], ["#100ffa", "#2ec1c2"]);
let rightScale = d3.scaleLinear([0, 0.5, 1], ["#0f9a1f", "#fdfe34", "#fd3238"]);

let currentPhoto = null;
const status = document.getElementById("status");

const svgWidth = 400;
const svgHeight = 25;

const svg = d3.select("#scale")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

function drawScale() {
    svg.empty();
    for (let i = 0; i < svgWidth; i++) {
        svg.append("rect")
            .attr("x", i)
            .attr("width", 1)
            .attr("height", svgHeight)
            .attr("fill", getColor(i / svgWidth * 2 - 1));
    }
}

drawScale();

let input = document.getElementById("source");
input.addEventListener("change", function() {
    const files = this.files;
    if (files.length < 1) return;
    if (currentPhoto !== null) URL.revokeObjectURL(currentPhoto);
    currentPhoto = window.URL.createObjectURL(files[0]);
    render();
});
document.getElementById("invert").addEventListener("change", function() {
    drawScale();
    if (currentPhoto !== null) render();
});

Caman.Filter.register("rbrb", function() {
    this.process("rbrb", function(rgba) {
        const r = rgba.r;
        const b = rgba.b;
        const value = (r - b) / (r + b);
        const color = getColor(value);
        rgba.r = color.r;
        rgba.g = color.g;
        rgba.b = color.b;
        return rgba;
    });
    return this;
});

function getColor(value) {
    const invert = document.getElementById("invert").checked;
    if (invert) value = -value;
    return value < 0 ? d3.rgb(leftScale(value)) : d3.rgb(rightScale(value));
}

function fetchDimensions(callback) {
    const img = new Image();
    img.addEventListener("load", function() {
        callback(this.naturalWidth, this.naturalHeight);
    });
    img.src = currentPhoto;
}

function render() {
    const canvas = document.getElementById("image");
    canvas.removeAttribute("data-caman-id");
    status.textContent = "Processing...";
    fetchDimensions(function(w, h) {
        canvas.width = w;
        canvas.height = h;
        Caman("#image", currentPhoto, function() {
            this.rbrb().render(function() {
                status.textContent = "Done";
            });
        });
    });
}