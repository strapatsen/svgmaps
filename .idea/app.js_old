class TerrainEditor {
	constructor() {
		this.elementTypes = [
			{
				group: "🎭 Food & Beverage",
				types: [
					{ value: "bar", label: "🍻 Bar" },
					{ value: "cocktail-bar", label: "🍸 Cocktail Bar" },
					{ value: "specialty-beer-bar", label: "🍺 Specialty Beer Bar" },
					{ value: "wine-bar", label: "🍷 Wine Bar" },
					{ value: "coffee-stand", label: "☕ Coffee Stand" },
					{ value: "tea-house", label: "🍵 Tea House" },
					{ value: "smoothie-stand", label: "🥤 Smoothie Stand" },
					{ value: "food-truck", label: "🚚 Food Truck" },
					{ value: "bbq-station", label: "🔥 BBQ Station" },
					{ value: "pizza-stand", label: "🍕 Pizza Stand" },
					{ value: "vegan-food-stand", label: "🥗 Vegan Food Stand" },
					{ value: "grill-stand", label: "🥩 Grill Stand" },
					{ value: "sushi-bar", label: "🍣 Sushi Bar" },
					{ value: "snack-stand", label: "🍟 Snack Stand" },
					{ value: "ice-cream-stand", label: "🍦 Ice Cream Stand" },
					{ value: "pancake-stand", label: "🥞 Pancake Stand" },
					{ value: "candy-stand", label: "🍬 Candy Stand" }
				]
			},
			{
				group: "🚮 Sanitation & Waste Management",
				types: [
					{ value: "toilet", label: "🚻 Toilet" },
					{ value: "portable-toilet", label: "🚾 Portable Toilet" },
					{ value: "vip-toilet", label: "💎 VIP Toilet" },
					{ value: "urinal-station", label: "🚹 Urinal Station" },
					{ value: "shower", label: "🚿 Shower" },
					{ value: "water-refill-station", label: "💧 Water Refill Station" },
					{ value: "garbage-bin", label: "🗑️ Garbage Bin" },
					{ value: "recycling-station", label: "♻️ Recycling Station" },
					{ value: "compost-bin", label: "🍃 Compost Bin" },
					{ value: "glass-recycling", label: "🟫 Glass Recycling" },
					{ value: "plastic-recycling", label: "🔵 Plastic Recycling" },
					{ value: "paper-recycling", label: "📄 Paper Recycling" },
					{ value: "residual-waste-bin", label: "⚫ Residual Waste Bin" }
				]
			},
			{
				group: "🔌 Infrastructure & Utilities",
				types: [
					{ value: "power-generator", label: "⚡ Power Generator" },
					{ value: "power-line", label: "🔋 Power Line" },
					{ value: "power-outlet", label: "🔌 Power Outlet" },
					{ value: "lighting", label: "💡 Lighting" },
					{ value: "stage-lighting", label: "🎆 Stage Lighting" },
					{ value: "water-pipeline", label: "🚰 Water Pipeline" },
					{ value: "wifi-hotspot", label: "📶 WiFi Hotspot" },
					{ value: "security-camera", label: "📹 Security Camera" },
					{ value: "first-aid-station", label: "⛑️ First Aid Station" }
				]
			},
			{
				group: "🎪 Entertainment & Facilities",
				types: [
					{ value: "main-stage", label: "🎤 Main Stage" },
					{ value: "secondary-stage", label: "🎸 Secondary Stage" },
					{ value: "dj-booth", label: "🎧 DJ Booth" },
					{ value: "open-air-theater", label: "🎭 Open-Air Theater" },
					{ value: "cinema-screen", label: "🎥 Cinema Screen" },
					{ value: "artist-lounge", label: "🛋️ Artist Lounge" },
					{ value: "press-area", label: "📷 Press Area" },
					{ value: "vip-area", label: "🎟️ VIP Area" },
					{ value: "photo-booth", label: "📸 Photo Booth" },
					{ value: "merchandise-stand", label: "🛍️ Merchandise Stand" },
					{ value: "seating-area", label: "🪑 Seating Area" },
					{ value: "camping-zone", label: "🏕️ Camping Zone" },
					{ value: "fire-pit", label: "🔥 Fire Pit" }
				]
			},
			{
				group: "🎭 Backstage & Crew",
				types: [
					{ value: "backstage-lounge", label: "🎤 Backstage Lounge" },
					{ value: "backstage-storage", label: "📦 Backstage Storage" },
					{ value: "backstage-catering", label: "🍽️ Backstage Catering" },
					{ value: "staff-lounge", label: "🛋️ Staff Lounge" },
					{ value: "crew-entrance", label: "🚪 Crew Entrance" },
					{ value: "production-office", label: "📑 Production Office" },
					{ value: "technical-zone", label: "🛠️ Technical Zone" },
					{ value: "dressing-room", label: "🎭 Dressing Room" }
				]
			},
			{
				group: "🔊 Audio & Sound Equipment",
				types: [
					{ value: "line-array", label: "🔈 Line Array" },
					{ value: "subwoofer", label: "🔊 Subwoofer" },
					{ value: "monitor-speaker", label: "📢 Monitor Speaker" },
					{ value: "dj-monitor", label: "🎧 DJ Monitor" },
					{ value: "front-of-house-speaker", label: "🔉 Front-of-House Speaker" },
					{ value: "wireless-microphone", label: "🎤 Wireless Microphone" },
					{ value: "wired-microphone", label: "🎙️ Wired Microphone" },
					{ value: "microphone-stand", label: "🎤 Microphone Stand" },
					{ value: "audio-mixer", label: "🎛️ Audio Mixer" },
					{ value: "digital-mixer", label: "🎚️ Digital Mixer" },
					{ value: "analog-mixer", label: "🎚️ Analog Mixer" },
					{ value: "dj-mixer", label: "🎧 DJ Mixer" },
					{ value: "turntable", label: "💿 Turntable" },
					{ value: "cdj", label: "📀 CDJ" },
					{ value: "audio-interface", label: "🔌 Audio Interface" },
					{ value: "in-ear-monitor", label: "🎧 In-Ear Monitor" },
					{ value: "monitoring-rack", label: "🖥️ Monitoring Rack" },
					{ value: "stage-box", label: "📦 Stage Box" },
					{ value: "di-box", label: "🔌 DI Box" },
					{ value: "compressor-limiter", label: "⚡ Compressor/Limiter" },
					{ value: "equalizer", label: "🎚️ Equalizer" },
					{ value: "reverb-unit", label: "🌊 Reverb Unit" },
					{ value: "delay-unit", label: "⏳ Delay Unit" },
					{ value: "multicore-cable", label: "🔀 Multicore Cable" },
					{ value: "xlr-cable", label: "🔌 XLR Cable" },
					{ value: "jack-cable", label: "🎸 Jack Cable" },
					{ value: "patch-bay", label: "🖧 Patch Bay" },
					{ value: "audio-splitter", label: "🔀 Audio Splitter" },
					{ value: "pa-system", label: "📢 PA System" },
					{ value: "backline", label: "🎸 Backline" },
					{ value: "soundproofing-panel", label: "🛑 Soundproofing Panel" }
				]
			},
			{
				group: "🍽️ Catering & Kitchen",
				types: [
					{ value: "kitchen", label: "👨‍🍳 Kitchen" },
					{ value: "catering-tent", label: "⛺ Catering Tent" },
					{ value: "dishwashing-station", label: "🧼 Dishwashing Station" },
					{ value: "beer-keg-station", label: "🍺 Beer Keg Station" },
					{ value: "food-storage", label: "📦 Food Storage" }
				]
			},
			{
				group: "🔒 Security & Staff",
				types: [
					{ value: "security-checkpoint", label: "🛑 Security Checkpoint" },
					{ value: "staff-lounge", label: "💼 Staff Lounge" },
					{ value: "lost-and-found", label: "🎒 Lost & Found" },
					{ value: "ticket-booth", label: "🎫 Ticket Booth" },
					{ value: "info-desk", label: "ℹ️ Info Desk" }
				]
			},
			{
				group: "🌍 Eco & Sustainability",
				types: [
					{ value: "solar-panel", label: "☀️ Solar Panel" },
					{ value: "wind-turbine", label: "🌬️ Wind Turbine" },
					{ value: "eco-friendly-zone", label: "🌱 Eco-friendly Zone" },
					{ value: "rainwater-collection", label: "🌧️ Rainwater Collection" }
				]
			}
		];
		this.events = new EventManager();
		this.baseScale = 1;
		this.currentScale = 1;
		this.panOffset = { x: 0, y: 0 };
		this.isPanning = false;
		this.lastPanPosition = { x: 0, y: 0 };
		this.lastMouseX = 0;
		this.lastMouseY = 0;
		this.currentTool = "select";
		this.currentElementType = "none";
		this.layers = [];
		this.activeLayerIndex = 0;
		this.elements = [];
		this.selectedElement = null;
		this.selectedPoint = null;
		this.isMeasuring = false;
		this.measurePoints = [];
		this.isDragging = false;
		this.dragStart = { x: 0, y: 0 };
		this.tempElement = null;
		this.history = [];
		this.historyIndex = -1;
		this.svgNS = "http://www.w3.org/2000/svg";
		this.baseMap = null;
		this.baseMaps = {
			blank: null,
			example: `<svg xmlns="http://www.w3.org/2000/svg" width="1883.422" height="1003.487" viewBox="0 0 1883.422 1003.487">
  <g id="Group_202" data-name="Group 202" transform="translate(-10762.646 4434.48)">
    <rect id="Rectangle_101" data-name="Rectangle 101" width="1883" height="1003" transform="translate(10763 -4434)" fill="#bb9c78"/>
    <path id="Path_84" data-name="Path 84" d="M10063.377-3180.073h487.146l-176.483-112.486s-9.1-6.529-55.092-15.858-124.137-23.416-124.137-23.416,19.764-16-64.509,23.416c-41.715,19.509,48.429,34.3,50.352,57.287,1.911,22.853,20.214,89.091,20.214,89.091l59.252-10.187,47.623,64.364,150.354-49.93h0l70.961,112.386,62.248,187.8-9.034-29.181-17.765,52.238,9.36,13.059-9.36,16.724-106.41,36.446-186.577,4.489-130.27,48.737,53.562,147.472L10258.232-2360h504.256v-590.215l-62.562-63.431-44.821-89.55-19.609-22.388-57.894-38.246-27.079-16.242h-487.146Z" transform="translate(1883.58 -1071)" fill="#437010"/>
    <path id="Path_85" data-name="Path 85" d="M9739.554-2416.084l-37.011-70.819,84.111-49.236,111.685-98.975,87.774-63.5,203.149-73.017,47.438,136.872L10312.543-2416Z" transform="translate(1839.159 -1014.996)" fill="#437010"/>
    <path id="Path_106" data-name="Path 106" d="M12121.185-4434l6.313,20.127,135.084,35.918,171.017,99.875,64.747,39.373s5.957-2.93,4.511-7.258c-.6-1.8-6.561.137-9.351-2.55-1.14-1.092,0-6.556,0-8.076,0-10.209-1.748-15.3,4.84-20.4s21.512,0,21.512,0l13.6,16.576,28.9-5.95,28.9-8.075,53.846-27.389V-4434Z" fill="#437010"/>
    <path id="Path_107" data-name="Path 107" d="M12541.532-4203.462l19.551-29.327,84.022-37.479v231.977a388.272,388.272,0,0,1-53.421-65.716c-7.846-12.347-12.777-26.865-19.126-39.527-12.835-25.6-23.716-46.252-23.716-46.252Z" fill="#437010"/>
    <path id="Path_108" data-name="Path 108" d="M11055.013-4434h0l443.112,30.3,133.179,41.02s24.553,2.824,8.243,12.21-73.48,25.337-73.48,25.337a196.209,196.209,0,0,1,3.362,57.082c-1.976,21.123-14.284,42.654-11.492,66.8,2.928,25.325-4.841,62.308,0,77.169,6.251,19.188,10.594,16.977,13.149,36.467,1.654,12.618,13.526,11.97,10.74,15.9a19.8,19.8,0,0,1-10.74,7.52l6.539,16.674v10.135l-2.288,8.5,4.577,2.615,5.737,25.5-3.825,9.808,3.825,2.142-10.314,12.264s8.692.983,10.314,9.393-3.825,24.245-3.825,24.245l3.825,10.012-19.539,6.63s2.529,23.057,4.974,38.677-4.974,34.81-4.974,34.81-5.631,26.373,0,39.229c2,4.577-11.845,12-11.6,23.758.2,9.669,26.558,12.856,37.092,23.207,11.395,11.2,7.331,29.123,12.083,30.942,5.343,2.045,37.886-5.885,43.713-6.63,8.614-1.1,0-47.518,0-47.518l15.78,63.123-177.229-19.422Z" fill="#437010"/>
    <path id="Path_91" data-name="Path 91" d="M9632.955-3205.354l-82.172-58.828-89.643-13.073s-50.19-14.707-87.774-19.609-62.562,0-62.562,0l-23.344-16.808-108.317-16.808H8895.275v629.35l93.377,13.085,10.271,15.874,64.431-8.4,253.985,45.755s80.45,35.434,161.543,30.814S9641.71-2653.3,9641.71-2653.3v-250.33l-16.887-49.46,8.132-44.368-2.228-54.828,2.228-81.171Z" transform="translate(1867.372 -1104)" fill="#174195"/>
    <path id="Path_109" data-name="Path 109" d="M10767.325-3699.005s134.643,24.975,289.674,52.875c98,17.635,200.968,43.1,283.783,43.1,75.112,0,111.492-48.831,156.054-63.541,81.766-26.99,122.113-32.431,122.113-32.431l-183.991-29.983-667.633-79.867Z" transform="translate(-4.325)" fill="#437010"/>
    <path id="Path_110" data-name="Path 110" d="M10766-3675.329l290.419,54.159-9.447,47.622L10766-3621.17Z" transform="translate(-3.353)" fill="#437010"/>
    <path id="Path_111" data-name="Path 111" d="M11090.417-3617.435l-7.47,49.49,189.556,30.815s44.949.406,81.95,2.651c14.382.873,19.952,7.015,32.727,5.95,44.821-3.735,57.8-24.226,57.8-24.226l-9.069-59.077s-40.607,18.305-81.46,25.075-81.95,2-81.95,2Z" fill="#437010"/>
    <path id="Path_112" data-name="Path 112" d="M11475.464-3633.98a265.576,265.576,0,0,1,9.945,27.074c3.688,12.048,6.232,26.737,11.051,34.809,10.636,17.819,21.548,9.393,21.548,9.393a454.878,454.878,0,0,0,62.437-35.915c5.292-3.658,9.8-6.1,13.813-11.6,3.524-4.832,6.584-12.735,9.945-15.471,4.725-3.845,10.356.6,14.366-2.21,4.633-3.244,6.979-12.754,11.6-16.023,1.723-1.215,5.827,5.075,7.735,2.762,14.365-17.4,0-27.074,0-27.074l-16.576-17.128-7.735,5.525-19.339-2.762Z" fill="#437010"/>
    <path id="Path_113" data-name="Path 113" d="M10766-3431.08v-98.956l395.037,69.193,147.654,29.764h82.711l154.8-69.823,43.879,69.823Z" transform="translate(-3.353)" fill="#437010"/>
    <path id="Path_114" data-name="Path 114" d="M0,17.848,746.187,107.8l-61.8,35.774L0,63.566Z" transform="translate(10763 -3865)" fill="#514333"/>
    <path id="Path_115" data-name="Path 115" d="M11577.626-3945.194h-150.065v12.751h156.277v-12.751Z" fill="#514333"/>
    <path id="Path_117" data-name="Path 117" d="M11667.783-3730.132l-4.42-24.311,14.365-6.078,12.156-6.63v9.393l-3.315,13.261-5.525,14.366-3.315,4.42h-7.183Z" fill="#437010"/>
    <path id="Path_120" data-name="Path 120" d="M-20.323,170.134s1.769-20.749,5.1-45.149c2.166-15.865,5.97-40.136,9.775-72.064S0-2.726,0-2.726" transform="translate(11660.637 -3726.682) rotate(90)" fill="none" stroke="#403528" stroke-width="3"/>
    <path id="Path_119" data-name="Path 119" d="M11675.752-3955.012a36.232,36.232,0,0,1-15.795,3.315c-9.59,0-22.565-3.315-22.565-3.315a117.822,117.822,0,0,0-27.079,0,123.509,123.509,0,0,0-26.514,7.183v15.471H11590l8.461-4.42a22.028,22.028,0,0,1,11.847-4.973c7.193-.691,16.925,2.21,16.925,2.21s9.308,3.315,17.487,2.762,40.617,0,40.617,0Z" fill="#bcb2a7"/>
    <path id="Path_118" data-name="Path 118" d="M-13.362,208.6s8.642,1.65,12.877-9.351c10.393-27,23.534-88.7,25.955-124.065C28.843,25.931-.485-2.726-.485-2.726" transform="translate(11684.5 -3933.5)" fill="none" stroke="#403528" stroke-width="3"/>
  </g>
</svg>
`,
			grass:
				'<svg xmlns="http://www.w3.org/2000/svg" width="1883.42" height="1003.49"><rect width="100%" height="100%" fill="#4CAF50"/></svg>',
			sand:
				'<svg xmlns="http://www.w3.org/2000/svg" width="1883.42" height="1003.49"><rect width="100%" height="100%" fill="#F4A460"/></svg>',
			water:
				'<svg xmlns="http://www.w3.org/2000/svg" width="1883.42" height="1003.49"><rect width="100%" height="100%" fill="#1E90FF"/></svg>'
		};
		this.currentText = {
			content: "",
			fontFamily: "Arial",
			fontSize: 12,
			color: "#000000"
		};
		this.initCanvas();
		this.initEvents();
		this.initLegend();
		this.initTabs();
		this.projectScale = {
			pixels: 111, // standaard 111px
			meters: 10, // staat gelijk aan 10m
			ratio: 11.1 // pixels per meter (berekend)
		};
		this.updateScaleRatio();
		this.initScaleRuler();
		this.initUndoRedo();
		this.initSaveLoad();
		this.initBaseMapControls();
		this.addBaseLayer();
		this.addLayer();
		this.adjustCanvasContainer();
		this.updateLayerList();
		const now = new Date();
		document.getElementById("project-created").value = now.toLocaleString();
		document.getElementById("project-modified").value = now.toLocaleString();
		this.setBaseMap("example");
	}
	initBaseMapControls() {
		const baseMapSelect = document.getElementById("base-map-select");
		const customMapInput = document.getElementById("custom-map-input");
		const loadCustomMapBtn = document.getElementById("load-custom-map");
		Object.keys(this.baseMaps).forEach((key) => {
			if (key !== "blank") {
				const option = document.createElement("option");
				option.value = key;
				option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
				baseMapSelect.appendChild(option);
			}
		});
		baseMapSelect.addEventListener("change", (e) => {
			this.setBaseMap(e.target.value);
		});
		loadCustomMapBtn.addEventListener("click", () => {
			customMapInput.click();
		});
		customMapInput.addEventListener("change", (e) => {
			const file = e.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				this.setBaseMap("custom", event.target.result);
			};
			reader.readAsText(file);
		});
		this.shiftKeyPressed = false;
		this.resizeHandleSize = 8;
	}
	setBaseMap(type, customSvg = null) {
		if (this.baseMap) {
			this.svg.removeChild(this.baseMap);
			this.baseMap = null;
		}

		if (type === "blank") {
			return;
		}

		let svgContent = customSvg || this.baseMaps[type];
		if (!svgContent) return;

		const parser = new DOMParser();
		const doc = parser.parseFromString(svgContent, "image/svg+xml");
		const importedSvg = doc.querySelector("svg");

		if (importedSvg) {
			this.baseMap = document.importNode(importedSvg, true);
			this.baseMap.setAttribute("class", "base-map");
			this.svg.insertBefore(this.baseMap, this.svg.firstChild);
		}
	}
	initLegend() {
		const layerVisibility = document.getElementById("layer-visibility");

		this.layers.forEach((layer) => {
			const li = document.createElement("li");
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = layer.visible;
			checkbox.id = `layer-visible-${layer.id}`;
			checkbox.addEventListener("change", () => {
				layer.visible = checkbox.checked;
				this.redrawAll();
				this.saveState();
			});

			const label = document.createElement("label");
			label.htmlFor = `layer-visible-${layer.id}`;
			label.textContent = layer.name;

			li.appendChild(checkbox);
			li.appendChild(label);
			layerVisibility.appendChild(li);
		});
	}
	initTabs() {
		const tabBtns = document.querySelectorAll(".tab-btn");
		const tabContents = document.querySelectorAll(".tab-content");
		const legendPanel = document.querySelector(".legend-panel");
		tabBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				if (!legendPanel.classList.contains("active")) {
					legendPanel.classList.add("active");
				}

				tabBtns.forEach((b) => b.classList.remove("active"));
				tabContents.forEach((c) => c.classList.remove("active"));
				btn.classList.add("active");
				const tabId = btn.dataset.tab + "-tab";
				document.getElementById(tabId).classList.add("active");
			});
		});
		const now = new Date();
		document.getElementById("project-created").value = now.toLocaleString();
		document.getElementById("project-modified").value = now.toLocaleString();
	}
	initCanvas() {
		this.svg = document.getElementById("svg-canvas");
		this.tempCanvas = document.getElementById("temp-canvas");
		this.setCanvasSize(this.tempCanvas);
		this.tempCtx = this.tempCanvas.getContext("2d");
		this.drawGrid();
	}
	setCanvasSize(canvas) {
		canvas.width = 1883.42;
		canvas.height = 1003.49;
		canvas.style.width = `${1883.42}px`;
		canvas.style.height = `${1003.49}px`;
	}
	drawGrid() {
		const oldGrid = this.svg.querySelector(".grid");
		if (oldGrid) this.svg.removeChild(oldGrid);
		if (!this.projectScale) {
			this.projectScale = { pixels: 111, meters: 10, ratio: 11.1 };
		}
		const gridSize = this.projectScale.pixels;
		const subGridSize = gridSize / 2;
		const gridGroup = document.createElementNS(this.svgNS, "g");
		gridGroup.setAttribute("class", "grid");
		const width = this.svg.width.baseVal.value;
		const height = this.svg.height.baseVal.value;
		for (let x = 0; x <= width; x += subGridSize) {
			const line = document.createElementNS(this.svgNS, "line");
			line.setAttribute("x1", x);
			line.setAttribute("y1", 0);
			line.setAttribute("x2", x);
			line.setAttribute("y2", height);
			line.setAttribute("stroke", x % gridSize === 0 ? "#3a3a3a" : "#2a2a2a");
			line.setAttribute("stroke-width", x % gridSize === 0 ? "1" : "0.5");
			gridGroup.appendChild(line);
		}
		for (let y = 0; y <= height; y += subGridSize) {
			const line = document.createElementNS(this.svgNS, "line");
			line.setAttribute("x1", 0);
			line.setAttribute("y1", y);
			line.setAttribute("x2", width);
			line.setAttribute("y2", y);
			line.setAttribute("stroke", y % gridSize === 0 ? "#3a3a3a" : "#2a2a2a");
			line.setAttribute("stroke-width", y % gridSize === 0 ? "1" : "0.5");
			gridGroup.appendChild(line);
		}
		this.svg.appendChild(gridGroup);
	}
	redrawGrid() {
		const gridSize = this.projectScale.pixels;
		const subGridSize = gridSize / 2;
		const gridGroup = document.createElementNS(this.svgNS, "g");
		gridGroup.setAttribute("class", "grid");
		const width = this.svg.width.baseVal.value;
		const height = this.svg.height.baseVal.value;
		for (let x = 0; x <= width; x += subGridSize) {
			const line = document.createElementNS(this.svgNS, "line");
			line.setAttribute("x1", x);
			line.setAttribute("y1", 0);
			line.setAttribute("x2", x);
			line.setAttribute("y2", height);
			line.setAttribute("stroke", x % gridSize === 0 ? "#3a3a3a" : "#2a2a2a");
			line.setAttribute("stroke-width", x % gridSize === 0 ? "1" : "0.5");
			gridGroup.appendChild(line);
		}
		for (let y = 0; y <= height; y += subGridSize) {
			const line = document.createElementNS(this.svgNS, "line");
			line.setAttribute("x1", 0);
			line.setAttribute("y1", y);
			line.setAttribute("x2", width);
			line.setAttribute("y2", y);
			line.setAttribute("stroke", y % gridSize === 0 ? "#3a3a3a" : "#2a2a2a");
			line.setAttribute("stroke-width", y % gridSize === 0 ? "1" : "0.5");
			gridGroup.appendChild(line);
		}
		const oldGrid = this.svg.querySelector(".grid");
		if (oldGrid) {
			this.svg.replaceChild(gridGroup, oldGrid);
		} else {
			this.svg.appendChild(gridGroup);
		}
	}
	toggleGrid() {
		const grid = this.svg.querySelector(".grid");
		if (grid) {
			grid.style.display = grid.style.display === "none" ? "block" : "none";
		}
	}
	initEvents() {
		document.querySelectorAll(".layer-name").forEach((el) => {
			el.addEventListener("click", (e) => {
				const layerId = e.target.closest("li").dataset.layerId;
				if (layerId !== "base") {
					this.setActiveLayer(layerId);
				}
			});
		});
		document
			.getElementById("zoom-in")
			.addEventListener("click", () => this.zoom(1.2));
		document
			.getElementById("zoom-out")
			.addEventListener("click", () => this.zoom(0.8));
		document
			.getElementById("zoom-reset")
			.addEventListener("click", () => this.resetZoom());
		document
			.getElementById("zoom-fit")
			.addEventListener("click", () => this.zoomToFit());
		document
			.getElementById("measure-toggle")
			.addEventListener("click", () => this.toggleMeasure());
		document
			.getElementById("layer-visibility")
			.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				const layerItem = e.target.closest(".layer-item");
				if (layerItem && layerItem.dataset.layerId !== "base") {
					const layerId = layerItem.dataset.layerId;
					const layer = this.layers.find((l) => l.id === layerId);
					const newName = prompt("Nieuwe laagnaam:", layer.name);
					if (newName && newName.trim() !== "") {
						layer.name = newName.trim();
						this.updateLayerList();
						this.updateLayerSelect();
						this.saveState();
					}
				}
			});
		document.querySelectorAll(".tool-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				this.currentTool = btn.dataset.tool;
				document
					.querySelectorAll(".tool-btn")
					.forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
			});
		});
		document.getElementById("close-legend").addEventListener("click", () => {
			document.getElementById("legend-panel").classList.remove("active");
			document
				.querySelectorAll(".tab-btn")
				.forEach((btn) => btn.classList.remove("active"));
		});
		document
			.getElementById("add-layer-btn")
			.addEventListener("click", () => this.addLayer());
		document
			.getElementById("remove-layer-btn")
			.addEventListener("click", () => this.removeLayer());
		document
			.getElementById("export-png")
			.addEventListener("click", () => this.exportAsPNG());
		document
			.getElementById("export-svg")
			.addEventListener("click", () => this.exportAsSVG());
		document
			.getElementById("print")
			.addEventListener("click", () => window.print());
		document
			.getElementById("toggle-grid")
			.addEventListener("click", () => this.toggleGrid());
		const container = document.querySelector(".canvas-container");
		container.addEventListener("mousedown", (e) => {
			if (e.button !== 0) return;
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left - this.panOffset.x) / this.currentScale;
			const y = (e.clientY - rect.top - this.panOffset.y) / this.currentScale;
			if (this.isMeasuring) {
				this.handleMeasureClick(x, y);
				return;
			}
			if (this.currentTool === "select") {
				this.handleSelectClick(x, y);
			} else {
				this.startCreatingElement(x, y);
			}
			this.isDragging = true;
			this.dragStart = { x, y };
			if (this.selectedElement && e.target.closest(".resize-handle")) {
				this.selectedElement.startResize();
				this.resizeHandle = {
					handle: e.target,
					index: Array.from(this.svg.querySelectorAll(".resize-handle")).indexOf(
						e.target
					)
				};
				return;
			}
			if (this.selectedElement && e.target.closest(".aspect-lock")) {
				this.selectedElement.lockAspectRatio = !this.selectedElement
					.lockAspectRatio;
				e.target.setAttribute(
					"fill",
					this.selectedElement.lockAspectRatio ? "#34A853" : "#EA4335"
				);
				return;
			}
		});
		container.addEventListener("mousemove", (e) => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left - this.panOffset.x) / this.currentScale;
			const y = (e.clientY - rect.top - this.panOffset.y) / this.currentScale;
			if (this.lastMouseX === x && this.lastMouseY === y) return;
			this.lastMouseX = x;
			this.lastMouseY = y;
			if (this.isMeasuring && this.measurePoints.length > 0) {
				this.drawTempMeasureLine(x, y);
				return;
			}
			if (this.isDragging) {
				if (this.currentTool === "select" && this.selectedElement) {
					if (this.selectedPoint) {
						this.moveSelectedPoint(x, y);
					} else {
						this.moveSelectedElement(x - this.dragStart.x, y - this.dragStart.y);
					}
					this.dragStart = { x, y };
				} else if (this.tempElement) {
					if (e.shiftKey) {
						const dx = Math.abs(x - this.tempElement.points[0].x);
						const dy = Math.abs(y - this.tempElement.points[0].y);
						if (this.currentTool === "line" || this.currentTool === "polygon") {
							if (dx > dy) {
								this.updateTempElement(x, this.tempElement.points[0].y);
							} else {
								this.updateTempElement(this.tempElement.points[0].x, y);
							}
						} else if (this.currentTool === "rect") {
							const size = Math.max(
								Math.abs(x - this.tempElement.points[0].x),
								Math.abs(y - this.tempElement.points[0].y)
							);
							const newX =
								this.tempElement.points[0].x +
								(x > this.tempElement.points[0].x ? size : -size);
							const newY =
								this.tempElement.points[0].y +
								(y > this.tempElement.points[0].y ? size : -size);
							this.updateTempElement(newX, newY);
						}
					} else {
						this.updateTempElement(x, y);
					}
				}
			}
			if (
				this.selectedElement &&
				this.selectedElement.isResizing &&
				this.resizeHandle
			) {
				const rect = container.getBoundingClientRect();
				const x = (e.clientX - rect.left - this.panOffset.x) / this.currentScale;
				const y = (e.clientY - rect.top - this.panOffset.y) / this.currentScale;

				const newWidth = x - this.selectedElement.points[0].x;
				const newHeight = y - this.selectedElement.points[0].y;

				this.selectedElement.resize(newWidth, newHeight);
				this.redrawAll();
				return;
			}
		});
		container.addEventListener("mouseup", (e) => {
			if (!this.isDragging) return;
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left - this.panOffset.x) / this.currentScale;
			const y = (e.clientY - rect.top - this.panOffset.y) / this.currentScale;
			if (this.tempElement && this.currentTool !== "select") {
				this.finalizeElement(x, y);
			}
			this.isDragging = false;
			if (this.selectedElement && this.selectedElement.isResizing) {
				this.selectedElement.endResize();
				this.resizeHandle = null;
				this.saveState();
			}
		});
		container.addEventListener(
			"wheel",
			(e) => {
				if (!e.ctrlKey) return;
				e.preventDefault();
				const rect = container.getBoundingClientRect();
				const x = e.clientX - rect.left - this.panOffset.x;
				const y = e.clientY - rect.top - this.panOffset.y;
				const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
				this.zoom(zoomFactor, x, y);
			},
			{ passive: false }
		);
		container.addEventListener("dblclick", (e) => {
			if (this.currentTool === "select" && this.selectedElement) {
				if (this.selectedPoint) {
					this.togglePointRounding();
				} else {
					this.toggleElementCornerRounding(this.selectedElement);
				}
			} else if (this.currentTool === "polygon" && this.tempElement) {
				this.finalizeElement();
			}
		});
		container.addEventListener("mousedown", (e) => {
			if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
				this.isPanning = true;
				this.lastPanPosition = { x: e.clientX, y: e.clientY };
				container.style.cursor = "grabbing";
				e.preventDefault();
			}
		});
		document.addEventListener("mousemove", (e) => {
			if (this.isPanning) {
				const dx = e.clientX - this.lastPanPosition.x;
				const dy = e.clientY - this.lastPanPosition.y;

				this.panOffset.x += dx;
				this.panOffset.y += dy;

				this.lastPanPosition = { x: e.clientX, y: e.clientY };

				this.updateCanvasPosition();
				e.preventDefault();
			}
		});
		document.addEventListener("mouseup", (e) => {
			if (this.isPanning) {
				this.isPanning = false;
				container.style.cursor = "default";
				e.preventDefault();
			}
		});
		container.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			if (this.currentTool === "select" && this.selectedPoint) {
				this.removeSelectedPoint();
			}
		});
		document.addEventListener("keydown", (e) => {
			if (e.key === "Delete" && this.selectedElement) {
				if (this.selectedPoint) {
					this.removeSelectedPoint();
				} else {
					this.removeElement(this.selectedElement);
				}
			} else if (e.key === "z" && e.ctrlKey) {
				e.preventDefault();
				this.undo();
			} else if (e.key === "y" && e.ctrlKey) {
				e.preventDefault();
				this.redo();
			}
			if (e.key === "Shift") this.shiftKeyPressed = true;
		});
		document.addEventListener("keyup", (e) => {
			if (e.key === "Shift") this.shiftKeyPressed = false;
		});
		document
			.getElementById("move-layer-up")
			.addEventListener("click", () => this.moveLayer(-1));
		document
			.getElementById("move-layer-down")
			.addEventListener("click", () => this.moveLayer(1));
		document.getElementById("edit-base-map").addEventListener("click", () => {
			if (this.baseMap) {
				const svgString = prompt("Edit SVG code:", this.baseMap.outerHTML);
				if (svgString) {
					try {
						const parser = new DOMParser();
						const doc = parser.parseFromString(svgString, "image/svg+xml");
						const newSvg = doc.querySelector("svg");

						if (newSvg) {
							this.svg.removeChild(this.baseMap);
							this.baseMap = document.importNode(newSvg, true);
							this.baseMap.setAttribute("class", "base-map");
							this.svg.insertBefore(this.baseMap, this.svg.firstChild);
							this.saveState();
						}
					} catch (e) {
						alert("Invalid SVG code: " + e.message);
					}
				}
			} else {
				alert("No base map loaded to edit");
			}
			document.querySelectorAll(".number-input").forEach((container) => {
				container.addEventListener("click", function (e) {
					if (e.target.classList.contains("btn")) {
						let input = this.querySelector("input");
						let value = parseInt(input.value) || 0;
						let change = e.target.dataset.action === "+" ? 1 : -1;
						input.value = Math.max(input.min, value + change);
					}
				});
			});
		});
		document.querySelectorAll("#properties-panel input").forEach((input) => {
			input.addEventListener("input", updateSelectedElement);
		});
		document.querySelectorAll("#properties-panel select").forEach((select) => {
			select.addEventListener("change", updateSelectedElement);
		});
		document
			.querySelectorAll(
				'#properties-panel [type="checkbox"], #properties-panel [type="radio"]'
			)
			.forEach((input) => {
				input.addEventListener("change", updateSelectedElement);
			});
		const panel = document.querySelector(".legend-panel");
		if (panel) {
			new MutationObserver((m) =>
				m.forEach(
					(m) => m.attributeName === "class" && this.adjustCanvasContainer()
				)
			).observe(panel, { attributes: true, attributeFilter: ["class"] });
		}
		document.addEventListener("DOMContentLoaded", () => {
			const b = document.querySelector(".toggle-legend-panel");
			if (b)
				b.addEventListener("click", () =>
					setTimeout(this.adjustCanvasContainer, 10)
				);
		});
	}
	initMenuSystem() {
		document
			.querySelector('[data-shortcut="Ctrl+N"]')
			.addEventListener("click", () => this.newProject());
		document
			.querySelector('[data-shortcut="Ctrl+S"]')
			.addEventListener("click", () => this.saveProject());
	}
	initUndoRedo() {
		document.getElementById("undo").addEventListener("click", () => this.undo());
		document.getElementById("redo").addEventListener("click", () => this.redo());
	}
	initSaveLoad() {
		document
			.getElementById("save-project")
			.addEventListener("click", () => this.saveProject());
		document
			.getElementById("load-project")
			.addEventListener("click", () =>
				document.getElementById("file-input").click()
			);

		document.getElementById("file-input").addEventListener("change", (e) => {
			const file = e.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const data = JSON.parse(event.target.result);
					this.loadProject(data);
				} catch (err) {
					alert("Ongeldig bestandsformaat");
				}
			};
			reader.readAsText(file);
		});
	}
	toJSON() {
        // Basisproperties die altijd moeten worden opgeslagen
        const baseProps = {
            id: this.id,
            type: this.type || 'none',
            shape: this.shape,
            x: this.x || 0,
            y: this.y || 0,
            width: this.width || 0,
            height: this.height || 0,
            color: this.color || '#000000',
            name: this.name || '',
            visible: this.visible !== false,
            locked: !!this.locked,
            layerId: this.layerId,
            cornerRadius: this.cornerRadius || 0,
            points: (this.points || []).map(p => ({
                x: p.x,
                y: p.y,
                id: p.id,
                canEdit: !!p.canEdit
            }))
        };

        // Type-specifieke properties
        if (this.type === 'power-point') {
            baseProps.voltage = this.voltage || 230;
            baseProps.wattage = this.wattage || 0;
            baseProps.group = this.group || 0;
        } else if (this.type === 'water-pipe') {
            baseProps.diameter = this.diameter || 0;
            baseProps.flowDirection = this.flowDirection || 'none';
        }

        return baseProps;
    }
	saveState() {
        const state = {
            layers: this.layers.map(layer => ({
                id: layer.id,
                name: layer.name,
                visible: layer.visible !== false,
                locked: !!layer.locked,
                elements: layer.elements.map(el => el.toJSON())
            })),
            activeLayerIndex: this.activeLayerIndex,
            viewState: {
                scale: this.currentScale,
                panOffset: { ...this.panOffset }
            },
            timestamp: Date.now()
        };
        if (this.history.length > 50) {
            this.history.shift();
        }
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
    }
	undo() {
		if (this.historyIndex <= 0) return;
		this.historyIndex--;
		this.loadState(this.history[this.historyIndex]);
		this.updateLayerList();
	}
	redo() {
		if (this.historyIndex >= this.history.length - 1) return;
		this.historyIndex++;
		this.loadState(this.history[this.historyIndex]);
		this.updateLayerList();
	}
	addElement(elementData) {
        const element = new TerrainElement(elementData);
        const layer = this.layers.find(l => l.id === elementData.layerId);
        if (layer) {
            layer.addElement(element);
            this.saveState();
            return element;
        }
        return null;
    }
	loadState(state) {
		// Herstel de state
		this.layers = state.layers.map((layer) => ({
			...layer,
			elements: layer.elements.map((el) => TerrainElement.fromJSON(el))
		}));

		this.activeLayerIndex = state.activeLayerIndex;
		this.currentScale = state.viewState.scale;
		this.panOffset = { ...state.viewState.panOffset };
		if (state.baseMap) {
			this.setBaseMap("custom", state.baseMap);
		} else {
			if (this.baseMap) {
				this.svg.removeChild(this.baseMap);
				this.baseMap = null;
			}
		}
		this.updateUI();
		this.redraw();
	}
	newProject() {
		if (
			confirm(
				"Are you sure you want to create a new project? Any unsaved changes will be lost."
			)
		) {
			this.layers = [];
			this.addBaseLayer();
			this.addLayer();
			this.projectScale = {
				pixels: 111,
				meters: 10,
				ratio: 11.1
			};
			document.getElementById("scale-px").value = 111;
			document.getElementById("scale-meters").value = 10;
			this.redrawAll();
			this.resetZoom();
			document.getElementById("project-name").value = "Untitled";
			document.getElementById("project-author").value = "";
			document.getElementById("project-description").value = "";
			document.getElementById("project-width").value = 1883.42;
			document.getElementById("project-height").value = 1003.49;
			const now = new Date();
			document.getElementById("project-created").value = now.toLocaleString();
			document.getElementById("project-modified").value = now.toLocaleString();
			this.saveState();
		}
	}
	saveProject() {
		const now = new Date();
		const data = {
			version: "2.0",
			meta: {
				name: document.getElementById("project-name").value,
				author: document.getElementById("project-author").value,
				description: document.getElementById("project-description").value,
				width: parseFloat(document.getElementById("project-width").value),
				height: parseFloat(document.getElementById("project-height").value),
				created: document.getElementById("project-created").value,
				modified: now.toLocaleString()
			},
			layers: this.layers,
			baseMap: this.baseMap ? this.baseMap.outerHTML : null,
			projectScale: this.projectScale,
			settings: {
				scale: this.currentScale,
				panOffset: this.panOffset,
				currentTool: this.currentTool,
				currentElementType: this.currentElementType
			}
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json"
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const projectName = document
			.getElementById("project-name")
			.value.replace(/[^a-z0-9]/gi, "_")
			.substring(0, 50);
		a.href = url;
		a.download = `${projectName || "project"}_${now
			.toISOString()
			.slice(0, 10)}.wmap`;
		a.click();
		URL.revokeObjectURL(url);
		document.getElementById("project-modified").value = now.toLocaleString();
	}
	loadProject(data) {
		if (!data || !data.layers) {
			alert("Invalid project file");
			return;
		}

		this.layers = data.layers || [];
		this.currentScale = data.settings?.scale || 1;
		this.panOffset = data.settings?.panOffset || { x: 0, y: 0 };
		this.currentTool = data.settings?.currentTool || "select";
		this.currentElementType = data.settings?.currentElementType || "none";

		document.getElementById("project-name").value = data.meta?.name || "Untitled";
		document.getElementById("project-author").value = data.meta?.author || "";
		document.getElementById("project-description").value =
			data.meta?.description || "";
		document.getElementById("project-width").value = data.meta?.width || 1883.42;
		document.getElementById("project-height").value =
			data.meta?.height || 1003.49;
		document.getElementById("project-created").value =
			data.meta?.created || new Date().toLocaleString();
		document.getElementById("project-modified").value =
			data.meta?.modified || new Date().toLocaleString();

		if (data.baseMap) {
			this.setBaseMap("custom", data.baseMap);
		} else if (this.baseMap) {
			this.svg.removeChild(this.baseMap);
			this.baseMap = null;
		}

		this.projectScale = data.projectScale || {
			pixels: 111,
			meters: 10,
			ratio: 11.1
		};
		document.getElementById("scale-px").value = this.projectScale.pixels;
		document.getElementById("scale-meters").value = this.projectScale.meters;
		this.updateScaleRatio();

		this.updateLayerSelect();
		this.updateLayerList();
		this.redrawAll();
		this.updateCanvasScale();
		this.updateScaleRuler();
		this.setActiveLayer(
			this.layers.length > 1 ? this.layers[1].id : this.layers[0].id
		);
	}
	updateScaleRatio() {
		if (this.projectScale) {
			this.projectScale.ratio =
				this.projectScale.pixels / this.projectScale.meters;
		}
	}
	addBaseLayer() {
		this.layers.push({
			id: "base",
			name: "Project",
			visible: true,
			locked: true,
			elements: []
		});
		this.updateLayerSelect();
	}
	addLayer() {
		const layerId = `layer-${Date.now()}`;
		const layerName = `Laag ${
			this.layers.filter((l) => l.id !== "base").length + 1
		}`;
		this.layers.push({
			id: layerId,
			name: layerName,
			visible: true,
			locked: false,
			elements: []
		});
		this.updateLayerSelect();
		this.updateLayerList();
		this.setActiveLayer(layerId);
		this.saveState();
	}
	removeLayer() {
		if (this.layers.length <= 2) {
			// Minimaal basislaag + 1 werklaag
			alert(
				"At least one layer is needed. You can't place items on the project layer"
			);
			return;
		}
		const layerId = this.layers[this.activeLayerIndex].id;
		if (layerId === "base") {
			alert("You can't remove the project layer!");
			return;
		}
		this.layers = this.layers.filter((layer) => layer.id !== layerId);
		this.activeLayerIndex = Math.min(
			this.activeLayerIndex,
			this.layers.length - 1
		);
		this.updateLayerSelect();
		this.updateLayerList();
		this.saveState();
	}
	updateLayerSelect() {
		const layerList = document.getElementById("layer-visibility");
		layerList.innerHTML = "";

		this.layers.forEach((layer, index) => {
			const li = document.createElement("li");
			li.className = "layer-item";
			li.dataset.layerId = layer.id;
			const visibleBtn = document.createElement("button");
			visibleBtn.className = "layer-btn visibility";
			visibleBtn.innerHTML = `<i class="fas fa-eye${
				layer.visible ? "" : "-slash"
			}"></i>`;
			visibleBtn.onclick = () => {
				layer.visible = !layer.visible;
				this.redrawAll();
				this.saveState();
				this.updateLayerList();
			};
			const lockBtn = document.createElement("button");
			lockBtn.className = "layer-btn lock";
			lockBtn.innerHTML = `<i class="fas fa-${
				layer.locked ? "lock" : "lock-open"
			}"></i>`;
			lockBtn.onclick = () => {
				layer.locked = !layer.locked;
				this.saveState();
				this.updateLayerList();
			};
			const nameSpan = document.createElement("span");
			nameSpan.className = "layer-name";
			nameSpan.textContent = layer.name;
			nameSpan.onclick = () => {
				this.setActiveLayer(layer.id);
			};
			if (index === this.activeLayerIndex) {
				li.classList.add("active");
				nameSpan.classList.add("active");
			}
			li.appendChild(visibleBtn);
			li.appendChild(lockBtn);
			li.appendChild(nameSpan);
			layerList.appendChild(li);
		});
	}
	updateLayerList() {
		const layerList = document.getElementById("layer-visibility");
		layerList.innerHTML = "";

		this.layers.forEach((layer, index) => {
			const li = document.createElement("li");
			li.className = "layer-item";
			li.dataset.layerId = layer.id;
			const visibleBtn = document.createElement("button");
			visibleBtn.className = "layer-btn visibility";
			visibleBtn.innerHTML = `<i class="fas fa-eye${
				layer.visible ? "" : "-slash"
			}"></i>`;
			visibleBtn.onclick = () => {
				layer.visible = !layer.visible;
				this.redrawAll();
				this.saveState();
				this.updateLayerList();
			};
			const lockBtn = document.createElement("button");
			lockBtn.className = "layer-btn lock";
			lockBtn.innerHTML = `<i class="fas fa-${
				layer.locked ? "lock" : "lock-open"
			}"></i>`;
			lockBtn.onclick = () => {
				layer.locked = !layer.locked;
				this.saveState();
				this.updateLayerList();
			};
			const nameSpan = document.createElement("span");
			nameSpan.className = "layer-name";
			nameSpan.textContent = layer.name;
			nameSpan.onclick = () => {
				if (layer.id !== "base") {
					this.setActiveLayer(layer.id);
				}
			};
			if (layer.id === "base") {
				li.classList.add("base-layer");
			}
			if (index === this.activeLayerIndex) {
				li.classList.add("active");
				nameSpan.classList.add("active");
			}
			li.appendChild(visibleBtn);
			li.appendChild(lockBtn);
			li.appendChild(nameSpan);
			layerList.appendChild(li);
		});
	}
	setActiveLayer(layerId) {
		this.activeLayerIndex = this.layers.findIndex(
			(layer) => layer.id === layerId
		);
	}
	zoom(factor, centerX, centerY) {
		const oldScale = this.currentScale;
		this.currentScale *= factor;

		if (centerX !== undefined && centerY !== undefined) {
			this.panOffset.x =
				centerX - (centerX - this.panOffset.x) * (this.currentScale / oldScale);
			this.panOffset.y =
				centerY - (centerY - this.panOffset.y) * (this.currentScale / oldScale);
		}

		this.updateCanvasScale();
		this.updateScaleRuler();
	}
	resetZoom() {
		this.currentScale = 1;
		this.updateCanvasScale();
		this.updateScaleRuler();
	}
	zoomToFit() {
		const container = document.querySelector(".canvas-container");
		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;

		const scaleX = containerWidth / this.svg.width.baseVal.value;
		const scaleY = containerHeight / this.svg.height.baseVal.value;

		this.currentScale = Math.min(scaleX, scaleY) * 0.9;
		this.panOffset = { x: 0, y: 0 };
		this.updateCanvasScale();
		this.updateScaleRuler();
	}
	updateCanvasScale() {
		const container = document.querySelector(".canvas-container");
		this.svg.style.transform = `scale(${this.currentScale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;
		this.tempCanvas.style.transform = `scale(${this.currentScale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;
	}
	updateCanvasPosition() {
		const container = document.querySelector(".canvas-container");
		const svgWidth = this.svg.width.baseVal.value * this.currentScale;
		const svgHeight = this.svg.height.baseVal.value * this.currentScale;

		const maxX = Math.max(0, svgWidth - container.clientWidth);
		const maxY = Math.max(0, svgHeight - container.clientHeight);

		this.panOffset.x = Math.min(0, Math.max(-maxX, this.panOffset.x));
		this.panOffset.y = Math.min(0, Math.max(-maxY, this.panOffset.y));

		this.svg.style.transform = `scale(${this.currentScale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;
		this.tempCanvas.style.transform = `scale(${this.currentScale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`;

		container.scrollLeft = -this.panOffset.x;
		container.scrollTop = -this.panOffset.y;
	}
	toggleMeasure() {
		this.isMeasuring = !this.isMeasuring;
		this.measurePoints = [];
		this.clearTempCanvas();
		if (!this.isMeasuring) {
			this.removeAllMeasureLines();
		}
		document
			.getElementById("measure-toggle")
			.classList.toggle("active", this.isMeasuring);
	}
	removeAllMeasureLines() {
		const measureLines = this.svg.querySelectorAll(
			".measure-line, .measure-label"
		);
		measureLines.forEach((line) => this.svg.removeChild(line));
	}
	handleMeasureClick(x, y) {
		this.measurePoints.push({ x, y });
		if (this.measurePoints.length === 2) {
			this.drawMeasureLine();
			this.measurePoints = [];
		}
	}
	drawTempMeasureLine(x, y) {
		this.clearTempCanvas();
		if (!this.isMeasuring || this.measurePoints.length !== 1) return;
		const ctx = this.tempCtx;
		const p1 = this.measurePoints[0];
		if (x !== p1.x || y !== p1.y) {
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(x, y);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.stroke();
			const dx = x - p1.x;
			const dy = y - p1.y;
			const distancePx = Math.sqrt(dx * dx + dy * dy);
			const distanceMeters = this.pixelsToMeters(distancePx);
			ctx.fillStyle = "red";
			ctx.font = "12px Arial";
			ctx.fillText(
				`${distanceMeters.toFixed(2)} m (${distancePx.toFixed(0)} px)`,
				x + 5,
				y + 5
			);
		}
	}
	drawMeasureLine() {
		const [p1, p2] = this.measurePoints;
		const svg = this.svg;
		const line = document.createElementNS(this.svgNS, "line");
		line.setAttribute("x1", p1.x);
		line.setAttribute("y1", p1.y);
		line.setAttribute("x2", p2.x);
		line.setAttribute("y2", p2.y);
		line.setAttribute("stroke", "red");
		line.setAttribute("stroke-width", "2");
		line.classList.add("measure-line");
		svg.appendChild(line);
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const distancePx = Math.sqrt(dx * dx + dy * dy);
		const distanceMeters = this.pixelsToMeters(distancePx);
		const midX = (p1.x + p2.x) / 2;
		const midY = (p1.y + p2.y) / 2;
		const text = document.createElementNS(this.svgNS, "text");
		text.setAttribute("x", midX + 5);
		text.setAttribute("y", midY + 5);
		text.setAttribute("fill", "red");
		text.setAttribute("font-size", "12");
		text.textContent = `${distanceMeters.toFixed(2)} m`;
		text.classList.add("measure-label");
		svg.appendChild(text);
	}
	pixelsToMeters(px) {
		return (
			((px / this.projectScale.pixels) * this.projectScale.meters) /
			this.currentScale
		);
	}
	formatLength(pixels) {
		const meters = pixels / this.projectScale.ratio;
		let value, unit;

		if (meters >= 1000) {
			value = (meters / 1000).toFixed(2);
			unit = "km";
		} else if (meters >= 1) {
			value = meters.toFixed(2);
			unit = "m";
		} else if (meters >= 0.01) {
			value = (meters * 100).toFixed(1);
			unit = "cm";
		} else {
			value = (meters * 1000).toFixed(0);
			unit = "mm";
		}

		return `${value} ${unit}`;
	}
	updateTooltip(element, mouseX, mouseY) {
		const tooltip = document.getElementById("element-tooltip");
		if (!tooltip) return;

		tooltip.style.left = `${mouseX + 15}px`;
		tooltip.style.top = `${mouseY + 15}px`;

		const widthText = this.formatLength(element.width);
		const heightText = this.formatLength(element.height);

		tooltip.innerHTML = `
            <div>Size: ${widthText} × ${heightText}</div>
            <div>Position: ${this.formatLength(element.x)}, ${this.formatLength(
			element.y
		)}</div>
            ${element.lockAspectRatio ? "<div>Aspect ratio: locked</div>" : ""}
        `;
		tooltip.style.display = "block";
	}
	hideTooltip() {
		const tooltip = document.getElementById("element-tooltip");
		if (tooltip) tooltip.style.display = "none";
	}
	handleSelectClick(x, y) {
		const clickedElement = this.findElementAt(x, y);
		const clickedPoint = clickedElement
			? this.findPointAt(clickedElement, x, y)
			: null;

		if (clickedPoint) {
			this.selectedPoint = clickedPoint;
			this.selectedElement = clickedElement;
		} else if (clickedElement) {
			this.selectElement(clickedElement);
		} else {
			this.deselectElement();
		}
	}
	findElementAt(x, y) {
		const elements = Array.from(this.svg.querySelectorAll(".element")).reverse();

		for (const element of elements) {
			if (this.isPointInElement(x, y, element)) {
				return this.getElementById(element.getAttribute("data-id"));
			}
		}
		return null;
	}
	getElementById(id) {
		for (const layer of this.layers) {
			const element = layer.elements.find((el) => el.id === id);
			if (element) return element;
		}
		return null;
	}
	isPointInElement(x, y, element) {
		const type = element.tagName.toLowerCase();
		const id = element.getAttribute("data-id");
		const elData = this.getElementById(id);

		if (type === "rect") {
			const x1 = parseFloat(element.getAttribute("x"));
			const y1 = parseFloat(element.getAttribute("y"));
			const width = parseFloat(element.getAttribute("width"));
			const height = parseFloat(element.getAttribute("height"));
			return x >= x1 && x <= x1 + width && y >= y1 && y <= y1 + height;
		} else if (type === "circle") {
			const cx = parseFloat(element.getAttribute("cx"));
			const cy = parseFloat(element.getAttribute("cy"));
			const r = parseFloat(element.getAttribute("r"));
			const dx = x - cx;
			const dy = y - cy;
			return Math.sqrt(dx * dx + dy * dy) <= r;
		} else if (type === "polyline" || type === "polygon") {
			const points = element.getAttribute("points").split(" ");
			const polygon = points.map((p) => {
				const [x, y] = p.split(",");
				return { x: parseFloat(x), y: parseFloat(y) };
			});
			return this.isPointInPolygon({ x, y }, polygon);
		}
		return false;
	}
	isPointInPolygon(point, polygon) {
		let inside = false;
		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const xi = polygon[i].x,
				yi = polygon[i].y;
			const xj = polygon[j].x,
				yj = polygon[j].y;

			const intersect =
				yi > point.y !== yj > point.y &&
				point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
			if (intersect) inside = !inside;
		}
		return inside;
	}
	findPointAt(element, x, y) {
		if (!element.points) return null;

		const hitRadius = 8 / this.currentScale;

		for (const point of element.points) {
			if (
				point.canEdit &&
				Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)) <= hitRadius
			) {
				return point;
			}
		}

		return null;
	}
	setupPropertyListeners() {
		document
			.querySelectorAll("#properties-panel input, #properties-panel select")
			.forEach((input) => {
				input.addEventListener("input", (e) => this.updateSelectedElement(e));
			});
	}
	selectElement(element) {
		if (this.selectedElement) {
			this.selectedElement.selected = false;
		}
		if (element && typeof element === "object") {
			this.selectedElement = element;
			element.selected = true;
			this.drawSelection(element);
		} else {
			this.selectedElement = null;
		}
		this.events.emit("elementSelected", element);
		this.updatePropertiesPanel(this.selectedElement);
	}
	drawElement(element) {
		if (!element.visible) return;
		let svgElement;
		const ns = "http://www.w3.org/2000/svg";
		switch (element.shape) {
			case "rect":
				svgElement = document.createElementNS(ns, "rect");
				svgElement.setAttribute("x", element.x);
				svgElement.setAttribute("y", element.y);
				svgElement.setAttribute("width", element.width);
				svgElement.setAttribute("height", element.height);
				if (element.cornerRadius > 0) {
					svgElement.setAttribute("rx", element.cornerRadius);
					svgElement.setAttribute("ry", element.cornerRadius);
				}
				break;

			case "circle":
				svgElement = document.createElementNS(ns, "circle");
				svgElement.setAttribute("cx", element.x);
				svgElement.setAttribute("cy", element.y);
				svgElement.setAttribute("r", element.radius || element.width / 2);
				break;

			case "line":
				svgElement = document.createElementNS(ns, "line");
				svgElement.setAttribute("x1", element.points[0].x);
				svgElement.setAttribute("y1", element.points[0].y);
				svgElement.setAttribute("x2", element.points[1].x);
				svgElement.setAttribute("y2", element.points[1].y);
				svgElement.setAttribute("stroke-width", element.lineWidth || 2);
				break;

			case "polygon":
				svgElement = document.createElementNS(ns, "polygon");
				const points = element.points.map((p) => `${p.x},${p.y}`).join(" ");
				svgElement.setAttribute("points", points);
				break;

			case "text":
				svgElement = document.createElementNS(ns, "text");
				svgElement.setAttribute("x", element.x);
				svgElement.setAttribute("y", element.y);
				svgElement.textContent = element.text;
				svgElement.setAttribute("font-family", element.fontFamily || "Arial");
				svgElement.setAttribute("font-size", element.fontSize || 12);
				svgElement.setAttribute("fill", element.textColor || "#000000");
				break;

			default:
				console.warn(`Unknown shape: ${element.shape}`);
				return;
		}
		if (element.shape !== "text") {
			svgElement.setAttribute("fill", element.color);
			svgElement.setAttribute("stroke", element.borderColor || "#000000");
			svgElement.setAttribute("stroke-width", element.borderWidth || 1);
		}
		svgElement.setAttribute("opacity", element.opacity || 1);
		svgElement.setAttribute("data-element-id", element.id);
		svgElement.classList.add("element");
		if (element.selected) {
			svgElement.classList.add("selected");
			this.drawElementHandles(element);
		}
		this.svg.appendChild(svgElement);
		this.drawElementExtras(element);
	}
	drawElementHandles(element) {
		const ns = "http://www.w3.org/2000/svg";
		const handleSize = 8 / this.currentScale;

		// Resize handles voor rechthoeken
		if (element.shape === "rect") {
			const handles = [
				{ x: element.x, y: element.y }, // NW
				{ x: element.x + element.width, y: element.y }, // NE
				{ x: element.x, y: element.y + element.height }, // SW
				{ x: element.x + element.width, y: element.y + element.height } // SE
			];

			handles.forEach((handle) => {
				const handleEl = document.createElementNS(ns, "circle");
				handleEl.setAttribute("cx", handle.x);
				handleEl.setAttribute("cy", handle.y);
				handleEl.setAttribute("r", handleSize);
				handleEl.setAttribute("fill", "#4285F4");
				handleEl.setAttribute("class", "resize-handle");
				this.svg.appendChild(handleEl);
			});
		}

		// Edit points voor polygonen/lijnen
		if (element.points && element.points.length > 0) {
			element.points.forEach((point) => {
				if (point.canEdit) {
					const pointEl = document.createElementNS(ns, "circle");
					pointEl.setAttribute("cx", point.x);
					pointEl.setAttribute("cy", point.y);
					pointEl.setAttribute("r", handleSize);
					pointEl.setAttribute("fill", point.rounded ? "#4CAF50" : "#FF5722");
					pointEl.setAttribute("class", "edit-point");
					pointEl.setAttribute("data-point-id", point.id);
					this.svg.appendChild(pointEl);
				}
			});
		}
	}
	drawElementExtras(element) {
		const ns = "http://www.w3.org/2000/svg";

		// Labels voor elementen met naam
		if (element.name) {
			const text = document.createElementNS(ns, "text");
			let x, y;

			if (element.shape === "rect") {
				x = element.x + element.width / 2;
				y = element.y + element.height / 2;
			} else if (element.shape === "circle") {
				x = element.x;
				y = element.y + (element.radius || 0) + 15;
			} else if (element.points?.length > 0) {
				const center = this.getPolygonCenter(element.points);
				x = center.x;
				y = center.y;
			}

			if (x && y) {
				text.setAttribute("x", x);
				text.setAttribute("y", y);
				text.setAttribute("text-anchor", "middle");
				text.setAttribute("font-size", "12");
				text.setAttribute("fill", element.labelColor || "#000000");
				text.textContent = element.name;
				text.classList.add("element-label");
				this.svg.appendChild(text);
			}
		}

		// Speciale weergave voor stroompunten
		if (element.type === "power-point") {
			const group = document.createElementNS(ns, "g");
			group.setAttribute("class", "power-point-details");

			const details = [
				`${element.voltage || 230}V`,
				element.wattage ? `${element.wattage}W` : null,
				element.circuitGroup ? `Groep ${element.circuitGroup}` : null
			].filter(Boolean);

			details.forEach((detail, i) => {
				const text = document.createElementNS(ns, "text");
				text.setAttribute("x", element.x);
				text.setAttribute("y", element.y + (element.radius || 20) + 15 + i * 15);
				text.setAttribute("text-anchor", "middle");
				text.setAttribute("font-size", "10");
				text.textContent = detail;
				group.appendChild(text);
			});

			this.svg.appendChild(group);
		}

		// Speciale weergave voor waterleidingen
		if (
			element.type === "water-pipe" &&
			element.shape === "line" &&
			element.points?.length >= 2
		) {
			if (element.flowDirection && element.flowDirection !== "none") {
				const arrowSize = 10;
				const angle = Math.atan2(
					element.points[1].y - element.points[0].y,
					element.points[1].x - element.points[0].x
				);

				const startX =
					element.points[0].x + (element.points[1].x - element.points[0].x) * 0.7;
				const startY =
					element.points[0].y + (element.points[1].y - element.points[0].y) * 0.7;

				const arrow1 = document.createElementNS(ns, "line");
				const arrow2 = document.createElementNS(ns, "line");

				if (element.flowDirection === "right") {
					arrow1.setAttribute(
						"x2",
						startX - arrowSize * Math.cos(angle - Math.PI / 6)
					);
					arrow1.setAttribute(
						"y2",
						startY - arrowSize * Math.sin(angle - Math.PI / 6)
					);
					arrow2.setAttribute(
						"x2",
						startX - arrowSize * Math.cos(angle + Math.PI / 6)
					);
					arrow2.setAttribute(
						"y2",
						startY - arrowSize * Math.sin(angle + Math.PI / 6)
					);
				} else {
					arrow1.setAttribute(
						"x2",
						startX + arrowSize * Math.cos(angle - Math.PI / 6)
					);
					arrow1.setAttribute(
						"y2",
						startY + arrowSize * Math.sin(angle - Math.PI / 6)
					);
					arrow2.setAttribute(
						"x2",
						startX + arrowSize * Math.cos(angle + Math.PI / 6)
					);
					arrow2.setAttribute(
						"y2",
						startY + arrowSize * Math.sin(angle + Math.PI / 6)
					);
				}

				arrow1.setAttribute("x1", startX);
				arrow1.setAttribute("y1", startY);
				arrow2.setAttribute("x1", startX);
				arrow2.setAttribute("y1", startY);

				arrow1.setAttribute("stroke", "#0000FF");
				arrow2.setAttribute("stroke", "#0000FF");
				arrow1.setAttribute("stroke-width", "2");
				arrow2.setAttribute("stroke-width", "2");

				this.svg.appendChild(arrow1);
				this.svg.appendChild(arrow2);
			}
		}
	}
	getPolygonCenter(points) {
		if (!points || points.length === 0) return { x: 0, y: 0 };

		let x = 0,
			y = 0;
		points.forEach((point) => {
			x += point.x;
			y += point.y;
		});

		return {
			x: x / points.length,
			y: y / points.length
		};
	}
	deselectElement() {
		if (this.selectedElement) {
			this.selectedElement.selected = false;
			this.selectedElement = null;
			this.selectedPoint = null;
			this.redrawAll();
		}
	}
	updateElementPropertiesPanel(element) {
		const panel = document.querySelector("#element-properties .property-grid");
		panel.innerHTML = "";
		const typeRow = document.createElement("div");
		typeRow.className = "property-row";
		typeRow.innerHTML = `<div class="property-name">Type</div><div class="property-value"><select class="element-type"></select></div>`;
		panel.appendChild(typeRow);
		const typeSelect = typeRow.querySelector(".element-type");

		this.elementTypes.forEach((group) => {
			const optgroup = document.createElement("optgroup");
			optgroup.label = group.group;
			group.types.forEach((type) => {
				const option = document.createElement("option");
				option.value = type.value;
				option.textContent = type.label;
				option.selected = type.value === element.type;
				optgroup.appendChild(option);
			});
			typeSelect.appendChild(optgroup);
		});

		const rows = [
			{
				name: "Name",
				value: `<input type="text" class="element-name" value="${
					element.name || ""
				}">`
			},
			{
				name: "Color",
				value: `<input type="color" class="element-color" value="${
					element.color || "#000000"
				}">`
			},
			{
				name: "Visible",
				value: `<input type="checkbox" class="element-visible" ${
					element.visible !== false ? "checked" : ""
				}>`
			},
			{
				name: "Locked",
				value: `<input type="checkbox" class="element-locked" ${
					element.locked ? "checked" : ""
				}>`
			}
		];

		rows.forEach((row) => {
			const rowEl = document.createElement("div");
			rowEl.className = "property-row";
			rowEl.innerHTML = `<div class="property-name">${row.name}</div><div class="property-value">${row.value}</div>`;
			panel.appendChild(rowEl);
		});

		if (element.type === "stroompunt") {
			const specRows = [
				{
					name: "Voltage",
					value: `<input type="number" class="element-voltage" value="${
						element.voltage || 230
					}">`
				},
				{
					name: "Wattage",
					value: `<input type="number" class="element-wattage" value="${
						element.wattage || ""
					}">`
				},
				{
					name: "Group",
					value: `<input type="number" class="element-group" value="${
						element.group || ""
					}">`
				}
			];
			specRows.forEach((row) => {
				const rowEl = document.createElement("div");
				rowEl.className = "property-row";
				rowEl.innerHTML = `<div class="property-name">${row.name}</div><div class="property-value">${row.value}</div>`;
				panel.appendChild(rowEl);
			});
		} else if (element.type === "waterleiding") {
			const specRows = [
				{
					name: "Diameter (mm)",
					value: `<input type="number" class="element-diameter" value="${
						element.diameter || ""
					}">`
				},
				{
					name: "Flow Direction",
					value: `<select class="element-flow"><option value="none" ${
						!element.flowDirection ? "selected" : ""
					}>None</option><option value="left" ${
						element.flowDirection === "left" ? "selected" : ""
					}>Left</option><option value="right" ${
						element.flowDirection === "right" ? "selected" : ""
					}>Right</option></select>`
				}
			];
			specRows.forEach((row) => {
				const rowEl = document.createElement("div");
				rowEl.className = "property-row";
				rowEl.innerHTML = `<div class="property-name">${row.name}</div><div class="property-value">${row.value}</div>`;
				panel.appendChild(rowEl);
			});
		}
		if (element.width) {
			panel.innerHTML += `
				<div class="property-row">
					<div class="property-name">Width</div>
					<div class="property-value">
						${element.width.toFixed(1)} px (${this.pixelsToMeters(element.width).toFixed(
				2
			)} m)
					</div>
				</div>`;
		}
		const actionsRow = document.createElement("div");
		actionsRow.className = "property-row";
		actionsRow.innerHTML = `<div class="property-name"></div><div class="property-value" style="display: flex; gap: 5px;"><button class="save-properties"><i class="fas fa-save"></i> Save</button><button class="delete-element"><i class="fas fa-trash"></i></button></div>`;
		panel.appendChild(actionsRow);

		panel
			.querySelector(".save-properties")
			.addEventListener("click", () => this.saveElementProperties(element));
		panel
			.querySelector(".delete-element")
			.addEventListener("click", () => this.removeElement(element));
		typeSelect.addEventListener("change", (e) => {
			element.type = e.target.value;
			element.color = this.getDefaultColor(element.type);
			this.updateElementPropertiesPanel(element);
			this.redrawAll();
		});

		if (element.shape === "rect") {
			const sizeRow = document.createElement("div");
			sizeRow.className = "property-row";
			sizeRow.innerHTML = `<div class="property-name">Size</div><div class="property-value">${element.width.toFixed(
				1
			)} × ${element.height.toFixed(1)} px</div>`;
			panel.appendChild(sizeRow);
		} else if (element.shape === "circle") {
			const sizeRow = document.createElement("div");
			sizeRow.className = "property-row";
			sizeRow.innerHTML = `<div class="property-name">Radius</div><div class="property-value">${element.radius.toFixed(
				1
			)} px</div>`;
			panel.appendChild(sizeRow);
		}
	}
	getElementIcon(type) {
		const icons = {
			bar: "🍻",
			"cocktail-bar": "🍸",
			"specialty-beer-bar": "🍺",
			"wine-bar": "🍷",
			"coffee-stand": "☕",
			"tea-house": "🍵",
			"smoothie-stand": "🥤",
			"food-truck": "🚚",
			"bbq-station": "🔥",
			"pizza-stand": "🍕",
			"vegan-food-stand": "🥗",
			"grill-stand": "🥩",
			"sushi-bar": "🍣",
			"snack-stand": "🍟",
			"ice-cream-stand": "🍦",
			"pancake-stand": "🥞",
			"candy-stand": "🍬",
			toilet: "🚻",
			"portable-toilet": "🚾",
			"vip-toilet": "💎",
			"urinal-station": "🚹",
			shower: "🚿",
			"water-refill-station": "💧",
			"garbage-bin": "🗑️",
			"recycling-station": "♻️",
			"compost-bin": "🍃",
			"glass-recycling": "🟫",
			"plastic-recycling": "🔵",
			"paper-recycling": "📄",
			"residual-waste-bin": "⚫",
			"power-generator": "⚡",
			"power-line": "🔋",
			"power-outlet": "🔌",
			lighting: "💡",
			"stage-lighting": "🎆",
			"water-pipeline": "🚰",
			"wifi-hotspot": "📶",
			"security-camera": "📹",
			"first-aid-station": "⛑️"
		};
		return icons[type] || "📍";
	}
	getElementTypeName(type) {
		const names = {
			bar: "Bar",
			"cocktail-bar": "Cocktail Bar",
			"specialty-beer-bar": "Specialty Beer Bar",
			"wine-bar": "Wine Bar",
			"coffee-stand": "Coffee Stand",
			"tea-house": "Tea House",
			"smoothie-stand": "Smoothie Stand",
			"food-truck": "Food Truck",
			"bbq-station": "BBQ Station",
			"pizza-stand": "Pizza Stand",
			"vegan-food-stand": "Vegan Food Stand",
			"grill-stand": "Grill Stand",
			"sushi-bar": "Sushi Bar",
			"snack-stand": "Snack Stand",
			"ice-cream-stand": "Ice Cream Stand",
			"pancake-stand": "Pancake Stand",
			"candy-stand": "Candy Stand",
			toilet: "Toilet",
			"portable-toilet": "Portable Toilet",
			"vip-toilet": "VIP Toilet",
			"urinal-station": "Urinal Station",
			shower: "Shower",
			"water-refill-station": "Water Refill Station",
			"garbage-bin": "Garbage Bin",
			"recycling-station": "Recycling Station",
			"compost-bin": "Compost Bin",
			"glass-recycling": "Glass Recycling",
			"plastic-recycling": "Plastic Recycling",
			"paper-recycling": "Paper Recycling",
			"residual-waste-bin": "Residual Waste Bin",
			"power-generator": "Power Generator",
			"power-line": "Power Line",
			"power-outlet": "Power Outlet",
			lighting: "Lighting",
			"stage-lighting": "Stage Lighting",
			"water-pipeline": "Water Pipeline",
			"wifi-hotspot": "WiFi Hotspot",
			"security-camera": "Security Camera",
			"first-aid-station": "First Aid Station"
		};
		return names[type] || type;
	}
	getTypeSpecificProperties(element) {
		if (element.type === "stroompunt") {
			return `
          <div class="form-group">
            <label>Voltage:</label>
            <input type="number" class="element-voltage" value="${
													element.voltage || 230
												}">
          </div>
          <div class="form-group">
            <label>Wattage:</label>
            <input type="number" class="element-wattage" value="${
													element.wattage || ""
												}">
          </div>
          <div class="form-group">
            <label>Groep:</label>
            <input type="number" class="element-group" value="${
													element.group || ""
												}">
          </div>
        `;
		} else if (element.type === "waterleiding") {
			return `
          <div class="form-group">
            <label>Diameter (mm):</label>
            <input type="number" class="element-diameter" value="${
													element.diameter || ""
												}">
          </div>
          <div class="form-group">
            <label>Stroomrichting:</label>
            <select class="element-flow">
              <option value="none" ${
															!element.flowDirection ? "selected" : ""
														}>Geen</option>
              <option value="left" ${
															element.flowDirection === "left" ? "selected" : ""
														}>Links</option>
              <option value="right" ${
															element.flowDirection === "right" ? "selected" : ""
														}>Rechts</option>
            </select>
          </div>
        `;
		}
		return "";
	}
	saveElementProperties(element) {
		const panel = document.querySelector("#element-properties .property-grid");

		element.name = panel.querySelector(".element-name").value;
		element.color = panel.querySelector(".element-color").value;
		element.visible = panel.querySelector(".element-visible").checked;
		element.locked = panel.querySelector(".element-locked").checked;

		if (element.type === "stroompunt") {
			element.voltage =
				parseInt(panel.querySelector(".element-voltage").value) || 230;
			element.wattage =
				parseInt(panel.querySelector(".element-wattage").value) || 0;
			element.group = parseInt(panel.querySelector(".element-group").value) || 0;
		} else if (element.type === "waterleiding") {
			element.diameter =
				parseInt(panel.querySelector(".element-diameter").value) || 0;
			element.flowDirection = panel.querySelector(".element-flow").value;
		}

		this.redrawAll();
		this.saveState();
	}
	startCreatingElement(x, y) {
		this.deselectElement();
		const currentLayer = this.layers[this.activeLayerIndex];
		if (currentLayer.id === "base") {
			alert("Je kunt geen elementen toevoegen aan de basislaag!");
			return;
		}
		if (currentLayer.locked) {
			alert("Deze laag is vergrendeld!");
			return;
		}
		this.tempElement = {
			id: `element-${Date.now()}`,
			type: this.currentElementType,
			shape: this.currentTool,
			points: [{ x, y, id: `point-${Date.now()}`, canEdit: true }],
			color: this.getDefaultColor(this.currentElementType),
			name: "",
			visible: true,
			locked: false,
			isTemp: true,
			layerId: this.layers[this.activeLayerIndex].id
		};
		if (this.currentTool === "rect") {
			this.tempElement.width = 0;
			this.tempElement.height = 0;
			this.tempElement.cornerRadius = 0;
		} else if (this.currentTool === "circle") {
			this.tempElement.radius = 0;
		}
		if (this.currentTool === "text") {
			this.tempElement = {
				id: `element-${Date.now()}`,
				type: "text",
				shape: "text",
				points: [{ x, y, id: `point-${Date.now()}`, canEdit: true }],
				text: "New Text",
				fontFamily: this.currentText.fontFamily,
				fontSize: this.currentText.fontSize,
				color: this.currentText.color,
				name: "",
				visible: true,
				locked: false,
				isTemp: true,
				layerId: this.layers[this.activeLayerIndex].id
			};
			const text = prompt("Enter text:", "New Text");
			if (text !== null) {
				this.tempElement.text = text;
				this.finalizeElement();
			} else {
				this.tempElement = null;
			}
			return;
		}
		this.saveState();
	}
	updateTempElement(x, y) {
		if (!this.tempElement) return;
		const startPoint = this.tempElement.points[0];
		let newX = x;
		let newY = y;
		if (this.shiftKeyPressed) {
			const dx = Math.abs(x - startPoint.x);
			const dy = Math.abs(y - startPoint.y);

			if (this.currentTool === "rect") {
				const size = Math.max(dx, dy);
				newX = startPoint.x + (x > startPoint.x ? size : -size);
				newY = startPoint.y + (y > startPoint.y ? size : -size);
			} else if (this.currentTool === "line" || this.currentTool === "polygon") {
				if (dx > dy) newY = startPoint.y;
				else newX = startPoint.x;
			}
		}
		switch (this.currentTool) {
			case "line":
				if (this.tempElement.points.length === 1) {
					this.tempElement.points.push({
						x: newX,
						y: newY,
						id: `point-${Date.now()}`,
						canEdit: true
					});
				} else {
					this.tempElement.points[1] = {
						...this.tempElement.points[1],
						x: newX,
						y: newY
					};
				}
				break;

			case "rect":
				this.tempElement.width = newX - startPoint.x;
				this.tempElement.height = newY - startPoint.y;
				break;

			case "circle":
				const dx = x - startPoint.x;
				const dy = y - startPoint.y;
				this.tempElement.radius = Math.sqrt(dx * dx + dy * dy);
				break;

			case "polygon":
				this.tempElement.points.push({
					x: newX,
					y: newY,
					id: `point-${Date.now()}`,
					canEdit: true
				});
				break;
		}
		this.drawTempElement();
	}
	drawTempElement() {
		this.clearTempCanvas();

		if (!this.tempElement) return;

		this.tempCtx.strokeStyle = this.tempElement.color;
		this.tempCtx.lineWidth = 2;
		this.tempCtx.fillStyle = `${this.tempElement.color}40`;

		if (
			this.tempElement.shape === "line" &&
			this.tempElement.points.length === 2
		) {
			this.tempCtx.beginPath();
			this.tempCtx.moveTo(
				this.tempElement.points[0].x,
				this.tempElement.points[0].y
			);
			this.tempCtx.lineTo(
				this.tempElement.points[1].x,
				this.tempElement.points[1].y
			);
			this.tempCtx.stroke();
		} else if (this.tempElement.shape === "rect") {
			this.tempCtx.beginPath();
			this.tempCtx.rect(
				this.tempElement.points[0].x,
				this.tempElement.points[0].y,
				this.tempElement.width,
				this.tempElement.height
			);
			this.tempCtx.fill();
			this.tempCtx.stroke();
		} else if (this.tempElement.shape === "circle") {
			this.tempCtx.beginPath();
			this.tempCtx.arc(
				this.tempElement.points[0].x,
				this.tempElement.points[0].y,
				this.tempElement.radius,
				0,
				Math.PI * 2
			);
			this.tempCtx.fill();
			this.tempCtx.stroke();
		} else if (
			this.tempElement.shape === "polygon" &&
			this.tempElement.points.length > 1
		) {
			this.tempCtx.beginPath();
			this.tempCtx.moveTo(
				this.tempElement.points[0].x,
				this.tempElement.points[0].y
			);

			for (let i = 1; i < this.tempElement.points.length; i++) {
				this.tempCtx.lineTo(
					this.tempElement.points[i].x,
					this.tempElement.points[i].y
				);
			}

			if (this.tempElement.points.length > 2) {
				this.tempCtx.closePath();
				this.tempCtx.fill();
			}

			this.tempCtx.stroke();
		}
	}
	finalizeElement(x, y) {
		if (!this.tempElement) return;

		this.updateTempElement(x, y);

		const newElement = {
			...this.tempElement,
			isTemp: false
		};

		delete newElement.isTemp;

		this.layers[this.activeLayerIndex].elements.push(newElement);
		this.tempElement = null;
		this.clearTempCanvas();
		this.selectElement(newElement);
		this.saveState();
	}
	clearTempCanvas() {
		this.clearCanvas();
	}
	clearCanvas() {
		// Maak het hoofdcanvas leeg
		const ctx = this.tempCanvas.getContext("2d");
		ctx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

		// Verwijder alle niet-basis SVG elementen
		const svgChildren = Array.from(this.svg.children);
		svgChildren.forEach((child) => {
			if (
				!child.classList.contains("base-map") &&
				!child.classList.contains("grid")
			) {
				this.svg.removeChild(child);
			}
		});
	}
	drawSelection(element) {
		if (!element || !element.visible || !element.shape) return;
		this.removeOldSelection();
		switch (element.shape) {
			case "rect":
				this.drawRectSelection(element);
				break;
			case "circle":
				this.drawCircleSelection(element);
				break;
			case "line":
				this.drawLineSelection(element);
				break;
			case "polygon":
				this.drawPolygonSelection(element);
				break;
			default:
				this.drawGenericSelection(element);
		}
		this.drawSelectionInfo(element);
	}
	removeOldSelection() {
		const oldSelection = this.svg.querySelectorAll(
			".selection-outline, .resize-handle, .rotate-handle, .selection-info"
		);
		oldSelection.forEach((el) => el.remove());
	}
	drawRectSelection(element) {
		const ns = "http://www.w3.org/2000/svg";
		const outline = document.createElementNS(ns, "rect");
		outline.setAttribute("x", element.x - 5);
		outline.setAttribute("y", element.y - 5);
		outline.setAttribute("width", element.width + 10);
		outline.setAttribute("height", element.height + 10);
		outline.setAttribute("stroke", "#4285F4");
		outline.setAttribute("stroke-width", "2");
		outline.setAttribute("fill", "none");
		outline.setAttribute("stroke-dasharray", "5,5");
		outline.classList.add("selection-outline");
		this.svg.appendChild(outline);
		const handlePositions = [
			{ x: element.x, y: element.y }, // NW
			{ x: element.x + element.width, y: element.y }, // NE
			{ x: element.x, y: element.y + element.height }, // SW
			{ x: element.x + element.width, y: element.y + element.height } // SE
		];
		handlePositions.forEach((pos) => {
			const handle = document.createElementNS(ns, "circle");
			handle.setAttribute("cx", pos.x);
			handle.setAttribute("cy", pos.y);
			handle.setAttribute("r", 6);
			handle.setAttribute("fill", "#4285F4");
			handle.setAttribute("stroke", "white");
			handle.setAttribute("stroke-width", "2");
			handle.classList.add("resize-handle");
			this.svg.appendChild(handle);
		});
		const rotateHandle = document.createElementNS(ns, "circle");
		rotateHandle.setAttribute("cx", element.x + element.width / 2);
		rotateHandle.setAttribute("cy", element.y - 20);
		rotateHandle.setAttribute("r", 6);
		rotateHandle.setAttribute("fill", "#34A853");
		rotateHandle.setAttribute("stroke", "white");
		rotateHandle.setAttribute("stroke-width", "2");
		rotateHandle.classList.add("rotate-handle");
		this.svg.appendChild(rotateHandle);
	}
	drawCircleSelection(element) {
		const ns = "http://www.w3.org/2000/svg";
		const outline = document.createElementNS(ns, "circle");
		outline.setAttribute("cx", element.x);
		outline.setAttribute("cy", element.y);
		outline.setAttribute("r", (element.radius || element.width / 2) + 5);
		outline.setAttribute("stroke", "#4285F4");
		outline.setAttribute("stroke-width", "2");
		outline.setAttribute("fill", "none");
		outline.setAttribute("stroke-dasharray", "5,5");
		outline.classList.add("selection-outline");
		this.svg.appendChild(outline);
		const handle = document.createElementNS(ns, "circle");
		handle.setAttribute("cx", element.x + (element.radius || element.width / 2));
		handle.setAttribute("cy", element.y);
		handle.setAttribute("r", 6);
		handle.setAttribute("fill", "#4285F4");
		handle.setAttribute("stroke", "white");
		handle.setAttribute("stroke-width", "2");
		handle.classList.add("resize-handle");
		this.svg.appendChild(handle);
	}
	drawLineSelection(element) {
		const ns = "http://www.w3.org/2000/svg";
		const outline = document.createElementNS(ns, "line");
		outline.setAttribute("x1", element.points[0].x);
		outline.setAttribute("y1", element.points[0].y);
		outline.setAttribute("x2", element.points[1].x);
		outline.setAttribute("y2", element.points[1].y);
		outline.setAttribute("stroke", "#4285F4");
		outline.setAttribute("stroke-width", "6");
		outline.setAttribute("opacity", "0.3");
		outline.classList.add("selection-outline");
		this.svg.appendChild(outline);
		element.points.forEach((point, index) => {
			const handle = document.createElementNS(ns, "circle");
			handle.setAttribute("cx", point.x);
			handle.setAttribute("cy", point.y);
			handle.setAttribute("r", 6);
			handle.setAttribute("fill", index === 0 ? "#EA4335" : "#34A853");
			handle.setAttribute("stroke", "white");
			handle.setAttribute("stroke-width", "2");
			handle.classList.add("resize-handle");
			this.svg.appendChild(handle);
		});
	}
	drawPolygonSelection(element) {
		const ns = "http://www.w3.org/2000/svg";
		const outline = document.createElementNS(ns, "polygon");
		const points = element.points.map((p) => `${p.x},${p.y}`).join(" ");
		outline.setAttribute("points", points);
		outline.setAttribute("stroke", "#4285F4");
		outline.setAttribute("stroke-width", "3");
		outline.setAttribute("fill", "none");
		outline.setAttribute("stroke-dasharray", "5,5");
		outline.classList.add("selection-outline");
		this.svg.appendChild(outline);
		element.points.forEach((point, index) => {
			const handle = document.createElementNS(ns, "circle");
			handle.setAttribute("cx", point.x);
			handle.setAttribute("cy", point.y);
			handle.setAttribute("r", 6);
			handle.setAttribute("fill", "#4285F4");
			handle.setAttribute("stroke", "white");
			handle.setAttribute("stroke-width", "2");
			handle.classList.add("resize-handle");
			handle.setAttribute("data-point-index", index);
			this.svg.appendChild(handle);
		});
	}
	drawGenericSelection(element) {
		const ns = "http://www.w3.org/2000/svg";
		const bounds = this.getElementBounds(element);
		const outline = document.createElementNS(ns, "rect");
		outline.setAttribute("x", bounds.x - 5);
		outline.setAttribute("y", bounds.y - 5);
		outline.setAttribute("width", bounds.width + 10);
		outline.setAttribute("height", bounds.height + 10);
		outline.setAttribute("stroke", "#4285F4");
		outline.setAttribute("stroke-width", "2");
		outline.setAttribute("fill", "none");
		outline.setAttribute("stroke-dasharray", "5,5");
		outline.classList.add("selection-outline");
		this.svg.appendChild(outline);
	}
	drawSelectionInfo(element) {
		if (!element) return;
		const ns = "http://www.w3.org/2000/svg";
		const infoGroup = document.createElementNS(ns, "g");
		infoGroup.classList.add("selection-info");
		const infoText = document.createElementNS(ns, "text");
		infoText.setAttribute("x", 10);
		infoText.setAttribute("y", 20);
		infoText.setAttribute("font-size", "12");
		infoText.setAttribute("fill", "#4285F4");
		const type = element.type || "unknown";
		const x = this.safeToFixed(element.x);
		const y = this.safeToFixed(element.y);
		let textContent = `${type} | X: ${x}, Y: ${y}`;
		if (typeof element.width !== "undefined") {
			textContent += ` | W: ${this.safeToFixed(element.width)}`;
		}
		if (typeof element.height !== "undefined") {
			textContent += `, H: ${this.safeToFixed(element.height)}`;
		}
		if (typeof element.radius !== "undefined") {
			textContent += ` | Radius: ${this.safeToFixed(element.radius)}`;
		}
		infoText.textContent = textContent;
		infoGroup.appendChild(infoText);
		this.svg.appendChild(infoGroup);
	}
	safeToFixed(value, decimals = 1) {
		if (typeof value !== "number" || isNaN(value)) {
			return "--";
		}
		return value.toFixed(decimals);
	}
	getElementBounds(element) {
		if (element.shape === "rect") {
			return {
				x: element.x,
				y: element.y,
				width: element.width,
				height: element.height
			};
		}
		if (element.shape === "circle") {
			return {
				x: element.x - (element.radius || element.width / 2),
				y: element.y - (element.radius || element.height / 2),
				width: (element.radius || element.width / 2) * 2,
				height: (element.radius || element.height / 2) * 2
			};
		}
		if (element.points && element.points.length > 0) {
			let minX = Infinity,
				minY = Infinity,
				maxX = -Infinity,
				maxY = -Infinity;
			element.points.forEach((point) => {
				minX = Math.min(minX, point.x);
				minY = Math.min(minY, point.y);
				maxX = Math.max(maxX, point.x);
				maxY = Math.max(maxY, point.y);
			});
			return {
				x: minX,
				y: minY,
				width: maxX - minX,
				height: maxY - minY
			};
		}
		return {
			x: element.x || 0,
			y: element.y || 0,
			width: element.width || 40,
			height: element.height || 40
		};
	}
	moveSelectedElement(dx, dy) {
		if (!this.selectedElement) return;

		if (this.selectedElement.shape === "rect") {
			this.selectedElement.points[0].x += dx;
			this.selectedElement.points[0].y += dy;
		} else if (this.selectedElement.shape === "circle") {
			this.selectedElement.points[0].x += dx;
			this.selectedElement.points[0].y += dy;
		} else if (this.selectedElement.points) {
			this.selectedElement.points.forEach((point) => {
				point.x += dx;
				point.y += dy;
			});
		}

		this.redrawAll();
	}
	moveSelectedPoint(x, y) {
		if (!this.selectedPoint) return;

		this.selectedPoint.x = x;
		this.selectedPoint.y = y;
		this.redrawAll();
	}
	toggleElementCornerRounding(element) {
		if (element.shape === "rect") {
			element.cornerRadius = element.cornerRadius ? 0 : 10;
			this.redrawAll();
			this.saveState();
		}
	}
	togglePointRounding() {
		if (!this.selectedPoint) return;

		this.selectedPoint.rounded = !this.selectedPoint.rounded;
		this.selectedPoint.radius = this.selectedPoint.rounded ? 10 : 0;
		this.redrawAll();
		this.saveState();
	}
	removeSelectedPoint() {
		if (
			!this.selectedElement ||
			!this.selectedPoint ||
			this.selectedElement.points.length <= 2
		)
			return;

		const index = this.selectedElement.points.indexOf(this.selectedPoint);
		if (index !== -1) {
			this.selectedElement.points.splice(index, 1);
			this.selectedPoint = null;
			this.redrawAll();
			this.saveState();
		}
	}
	removeElement(element) {
		for (const layer of this.layers) {
			layer.elements = layer.elements.filter((el) => el.id !== element.id);
		}

		if (this.selectedElement && this.selectedElement.id === element.id) {
			this.deselectElement();
		}

		this.redrawAll();
		this.saveState();
	}
	redrawAll() {
		this.clearCanvas();
		this.drawGrid();
		this.layers
			.filter((layer) => layer.visible)
			.forEach((layer) => {
				layer.elements.forEach((element) => {
					this.drawElement(element);
				});
			});
		if (this.baseMap) {
			this.svg.appendChild(this.baseMap);
		}
		if (this.tempElement) {
			this.drawElement(this.tempElement);
		}
	}
	redraw() {
		this.clearCanvas();
		this.layers
			.filter((layer) => layer.visible)
			.forEach((layer) => {
				layer.elements.forEach((element) => {
					if (element.visible) {
						this.drawElement(element);
					}
				});
			});
		if (this.selectedElement) {
			this.drawSelection(this.selectedElement);
		}
		if (this.tempElement) {
			this.drawTempElement(this.tempElement);
		}
	}
	drawSVGElement(element) {
		let svgElement;

		switch (element.shape) {
			case "rect":
				svgElement = document.createElementNS(this.svgNS, "rect");
				svgElement.setAttribute("x", element.points[0].x);
				svgElement.setAttribute("y", element.points[0].y);
				svgElement.setAttribute("width", element.width);
				svgElement.setAttribute("height", element.height);
				if (element.cornerRadius) {
					svgElement.setAttribute("rx", element.cornerRadius);
					svgElement.setAttribute("ry", element.cornerRadius);
				}
				break;

			case "circle":
				svgElement = document.createElementNS(this.svgNS, "circle");
				svgElement.setAttribute("cx", element.points[0].x);
				svgElement.setAttribute("cy", element.points[0].y);
				svgElement.setAttribute("r", element.radius);
				break;

			case "line":
				svgElement = document.createElementNS(this.svgNS, "polyline");
				const points = element.points.map((p) => `${p.x},${p.y}`).join(" ");
				svgElement.setAttribute("points", points);
				break;

			case "polygon":
				svgElement = document.createElementNS(this.svgNS, "polygon");
				const polyPoints = element.points.map((p) => `${p.x},${p.y}`).join(" ");
				svgElement.setAttribute("points", polyPoints);
				break;

			case "text":
				svgElement = document.createElementNS(this.svgNS, "text");
				svgElement.setAttribute("x", element.points[0].x);
				svgElement.setAttribute("y", element.points[0].y);
				svgElement.textContent = element.text;
				svgElement.setAttribute("font-family", element.fontFamily || "Roboto");
				svgElement.setAttribute("font-size", element.fontSize || 12);
				break;

			default:
				return;
		}

		svgElement.setAttribute(
			"fill",
			element.color || this.getDefaultColor(element.type)
		);
		svgElement.setAttribute("stroke", "rgba(0, 0, 0, 0.16)");
		svgElement.setAttribute("stroke-width", element.lineWidth || 1);
		svgElement.setAttribute("data-id", element.id);
		svgElement.classList.add("element");
		if (element.selected) {
			svgElement.classList.add("selected");
			this.drawEditPoints(element);
		}
		this.svg.appendChild(svgElement);
		if (element.name) {
			this.drawElementLabel(element);
		}
		if (element.type === "stroompunt") {
			this.drawPowerPointDetails(element);
		} else if (element.type === "waterleiding") {
			this.drawWaterPipeDetails(element);
		}
	}
	drawEditPoints(element) {
		if (!element.points) return;
		element.points.forEach((point) => {
			if (point.canEdit) {
				const circle = document.createElementNS(this.svgNS, "circle");
				circle.setAttribute("cx", point.x);
				circle.setAttribute("cy", point.y);
				circle.setAttribute("r", 5 / this.currentScale);
				circle.setAttribute("fill", point.rounded ? "#4CAF50" : "#FF5722");
				circle.setAttribute("stroke", "#FFFFFF");
				circle.setAttribute("stroke-width", 1);
				circle.setAttribute("data-point-id", point.id);
				circle.classList.add("edit-point");
				this.svg.appendChild(circle);
			}
		});
		if (element.shape === "rect") {
			const handles = [
				{ x: element.points[0].x, y: element.points[0].y }, // NW
				{ x: element.points[0].x + element.width, y: element.points[0].y }, // NE
				{ x: element.points[0].x, y: element.points[0].y + element.height }, // SW
				{
					x: element.points[0].x + element.width,
					y: element.points[0].y + element.height
				} // SE
			];
			handles.forEach((handle) => {
				const circle = document.createElementNS(this.svgNS, "circle");
				circle.setAttribute("cx", handle.x);
				circle.setAttribute("cy", handle.y);
				circle.setAttribute("r", this.resizeHandleSize / this.currentScale);
				circle.setAttribute("fill", "#4285F4");
				circle.setAttribute("stroke", "#FFFFFF");
				circle.setAttribute("stroke-width", 1);
				circle.setAttribute("data-resize-handle", "true");
				circle.classList.add("resize-handle");
				this.svg.appendChild(circle);
			});
			if (element.selected) {
				const lockBtn = document.createElementNS(this.svgNS, "circle");
				lockBtn.setAttribute("cx", element.points[0].x + element.width / 2);
				lockBtn.setAttribute("cy", element.points[0].y - 20 / this.currentScale);
				lockBtn.setAttribute("r", 8 / this.currentScale);
				lockBtn.setAttribute(
					"fill",
					element.lockAspectRatio ? "#34A853" : "#EA4335"
				);
				lockBtn.setAttribute("stroke", "#FFFFFF");
				lockBtn.setAttribute("stroke-width", 1);
				lockBtn.setAttribute("data-lock-aspect", "true");
				lockBtn.classList.add("aspect-lock");
				this.svg.appendChild(lockBtn);
			}
		}
	}
	drawElementLabel(element) {
		const text = document.createElementNS(this.svgNS, "text");
		let x, y;

		if (element.shape === "rect") {
			x = element.points[0].x + element.width / 2;
			y = element.points[0].y + element.height / 2;
		} else if (element.shape === "circle") {
			x = element.points[0].x;
			y = element.points[0].y + (element.radius || 0) + 15;
		} else if (element.points && element.points.length > 0) {
			const center = this.getPolygonCenter(element.points);
			x = center.x;
			y = center.y;
		}

		if (x && y) {
			text.setAttribute("x", x);
			text.setAttribute("y", y);
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("dominant-baseline", "middle");
			text.setAttribute("fill", element.labelColor || "#000000");
			text.setAttribute("font-size", "12");
			text.setAttribute("font-family", "Roboto");
			text.textContent = element.name;
			text.setAttribute("class", "element-label");
			this.svg.appendChild(text);
		}
	}
	drawPowerPointDetails(element) {
		if (element.shape !== "circle") return;

		const group = document.createElementNS(this.svgNS, "g");
		group.setAttribute("class", "power-point-details");

		const text1 = document.createElementNS(this.svgNS, "text");
		text1.setAttribute("x", element.points[0].x);
		text1.setAttribute("y", element.points[0].y + (element.radius || 20) + 15);
		text1.setAttribute("text-anchor", "middle");
		text1.setAttribute("fill", "#000000");
		text1.setAttribute("font-size", "10");
		text1.textContent = `${element.voltage || 230}V`;
		group.appendChild(text1);

		if (element.wattage) {
			const text2 = document.createElementNS(this.svgNS, "text");
			text2.setAttribute("x", element.points[0].x);
			text2.setAttribute("y", element.points[0].y + (element.radius || 20) + 30);
			text2.setAttribute("text-anchor", "middle");
			text2.setAttribute("fill", "#000000");
			text2.setAttribute("font-size", "10");
			text2.textContent = `${element.wattage}W`;
			group.appendChild(text2);
		}

		if (element.group) {
			const text3 = document.createElementNS(this.svgNS, "text");
			text3.setAttribute("x", element.points[0].x);
			text3.setAttribute("y", element.points[0].y + (element.radius || 20) + 45);
			text3.setAttribute("text-anchor", "middle");
			text3.setAttribute("fill", "#000000");
			text3.setAttribute("font-size", "10");
			text3.textContent = `Groep ${element.group}`;
			group.appendChild(text3);
		}

		this.svg.appendChild(group);
	}
	drawWaterPipeDetails(element) {
		if (element.shape !== "line" || element.points.length < 2) return;

		const group = document.createElementNS(this.svgNS, "g");
		group.setAttribute("class", "water-pipe-details");

		if (element.diameter) {
			const midPoint = this.getLineMidPoint(element.points[0], element.points[1]);
			const text = document.createElementNS(this.svgNS, "text");
			text.setAttribute("x", midPoint.x);
			text.setAttribute("y", midPoint.y - 5);
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("fill", "#000000");
			text.setAttribute("font-size", "10");
			text.textContent = `Ø${element.diameter}mm`;
			group.appendChild(text);
		}

		if (element.flowDirection && element.flowDirection !== "none") {
			const arrowSize = 10;
			const angle = Math.atan2(
				element.points[1].y - element.points[0].y,
				element.points[1].x - element.points[0].x
			);

			const startX =
				element.points[0].x + (element.points[1].x - element.points[0].x) * 0.7;
			const startY =
				element.points[0].y + (element.points[1].y - element.points[0].y) * 0.7;

			if (element.flowDirection === "right") {
				const arrow1 = document.createElementNS(this.svgNS, "line");
				arrow1.setAttribute("x1", startX);
				arrow1.setAttribute("y1", startY);
				arrow1.setAttribute(
					"x2",
					startX - arrowSize * Math.cos(angle - Math.PI / 6)
				);
				arrow1.setAttribute(
					"y2",
					startY - arrowSize * Math.sin(angle - Math.PI / 6)
				);
				arrow1.setAttribute("stroke", "#0000FF");
				arrow1.setAttribute("stroke-width", "2");
				group.appendChild(arrow1);

				const arrow2 = document.createElementNS(this.svgNS, "line");
				arrow2.setAttribute("x1", startX);
				arrow2.setAttribute("y1", startY);
				arrow2.setAttribute(
					"x2",
					startX - arrowSize * Math.cos(angle + Math.PI / 6)
				);
				arrow2.setAttribute(
					"y2",
					startY - arrowSize * Math.sin(angle + Math.PI / 6)
				);
				arrow2.setAttribute("stroke", "#0000FF");
				arrow2.setAttribute("stroke-width", "2");
				group.appendChild(arrow2);
			} else {
				const arrow1 = document.createElementNS(this.svgNS, "line");
				arrow1.setAttribute("x1", startX);
				arrow1.setAttribute("y1", startY);
				arrow1.setAttribute(
					"x2",
					startX + arrowSize * Math.cos(angle - Math.PI / 6)
				);
				arrow1.setAttribute(
					"y2",
					startY + arrowSize * Math.sin(angle - Math.PI / 6)
				);
				arrow1.setAttribute("stroke", "#0000FF");
				arrow1.setAttribute("stroke-width", "2");
				group.appendChild(arrow1);

				const arrow2 = document.createElementNS(this.svgNS, "line");
				arrow2.setAttribute("x1", startX);
				arrow2.setAttribute("y1", startY);
				arrow2.setAttribute(
					"x2",
					startX + arrowSize * Math.cos(angle + Math.PI / 6)
				);
				arrow2.setAttribute(
					"y2",
					startY + arrowSize * Math.sin(angle + Math.PI / 6)
				);
				arrow2.setAttribute("stroke", "#0000FF");
				arrow2.setAttribute("stroke-width", "2");
				group.appendChild(arrow2);
			}
		}

		this.svg.appendChild(group);
	}
	getDefaultColor(elementType) {
		const colors = {
			bar: "#8B0000",
			"cocktail-bar": "#FF69B4",
			"specialty-beer-bar": "#DAA520",
			"wine-bar": "#722F37",
			"coffee-stand": "#4A2F1C",
			"tea-house": "#90EE90",
			"smoothie-stand": "#FF1493",
			"food-truck": "#FFA07A",
			"bbq-station": "#8B4513",
			"pizza-stand": "#FF4500",
			"vegan-food-stand": "#228B22",
			"grill-stand": "#CD853F",
			"sushi-bar": "#FA8072",
			"snack-stand": "#FFD700",
			"ice-cream-stand": "#87CEEB",
			"pancake-stand": "#DEB887",
			"candy-stand": "#FF69B4",
			toilet: "#4B0082",
			"portable-toilet": "#483D8B",
			"vip-toilet": "#9370DB",
			"urinal-station": "#6A5ACD",
			shower: "#00CED1",
			"water-refill-station": "#40E0D0",
			"garbage-bin": "#696969",
			"recycling-station": "#2E8B57",
			"compost-bin": "#556B2F",
			"glass-recycling": "#8FBC8F",
			"plastic-recycling": "#3CB371",
			"paper-recycling": "#98FB98",
			"residual-waste-bin": "#2F4F4F",
			"power-generator": "#B8860B",
			"power-line": "#CD5C5C",
			"power-outlet": "#DC143C",
			lighting: "#FFD700",
			"stage-lighting": "#FFA500",
			"water-pipeline": "#4169E1",
			"wifi-hotspot": "#00BFFF",
			"security-camera": "#708090",
			"first-aid-station": "#FF0000"
		};
		return colors[elementType] || "#000000";
	}
	getPolygonCenter(points) {
		if (!points || points.length === 0) return { x: 0, y: 0 };

		let x = 0,
			y = 0;
		points.forEach((point) => {
			x += point.x;
			y += point.y;
		});

		return {
			x: x / points.length,
			y: y / points.length
		};
	}
	getLineMidPoint(point1, point2) {
		return {
			x: (point1.x + point2.x) / 2,
			y: (point1.y + point2.y) / 2
		};
	}
	exportAsPNG() {
		const serializer = new XMLSerializer();
		const svgStr = serializer.serializeToString(this.svg);
		const canvas = document.createElement("canvas");
		canvas.width = parseFloat(document.getElementById("project-width").value);
		canvas.height = parseFloat(document.getElementById("project-height").value);
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			const projectName = document.getElementById("project-name")?.value || "map";
			const cleanProjectName = projectName
				.replace(/[^a-z0-9]/gi, "_")
				.substring(0, 50);
			const now = new Date();
			const dateStr = now
				.toISOString()
				.replace(/T/, "_")
				.replace(/\..+/, "")
				.replace(/:/g, "-");
			const filename = `${projectName} [${dateStr}].png`;
			const link = document.createElement("a");
			link.download = filename;
			link.href = canvas.toDataURL("image/png", 1.0);
			link.click();
		};
		img.src =
			"data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
	}
	exportAsSVG() {
		const svgClone = this.svg.cloneNode(true);
		if (!svgClone.hasAttribute("viewBox")) {
			const width = parseFloat(document.getElementById("project-width").value);
			const height = parseFloat(document.getElementById("project-height").value);
			svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`);
		}
		svgClone.removeAttribute("style");
		svgClone.querySelectorAll("[style]").forEach((el) => {
			el.removeAttribute("style");
		});
		const elementsToRemove = [
			...svgClone.querySelectorAll(".edit-point"),
			...svgClone.querySelectorAll(".measure-line"),
			...svgClone.querySelectorAll(".measure-label")
		];
		elementsToRemove.forEach((el) => el.remove());
		const scaleText = `Scale: ${this.projectScale.pixels}px = ${this.projectScale.meters}m`;
		const projectName = document.getElementById("project-name")?.value || "map";
		const cleanProjectName = projectName
			.replace(/[^a-z0-9]/gi, "_")
			.substring(0, 50);
		const now = new Date();
		const dateStr = now
			.toISOString()
			.replace(/T/, "_")
			.replace(/\..+/, "")
			.replace(/:/g, "-");
		const filename = `${projectName} [${dateStr}].svg`;
		const serializer = new XMLSerializer();
		let svgStr = serializer.serializeToString(svgClone);
		svgStr = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
	<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
	${svgStr}`;
		const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
		const svgUrl = URL.createObjectURL(svgBlob);
		const link = document.createElement("a");
		link.href = svgUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setTimeout(() => {
			URL.revokeObjectURL(svgUrl);
		}, 100);
	}
	pixelsToMeters(px) {
		return px / this.projectScale.ratio;
	}
	metersToPixels(meters) {
		return meters * this.projectScale.ratio;
	}
	updateScaleRatio() {
		this.projectScale.ratio = this.projectScale.pixels / this.projectScale.meters;
	}
	initScaleControls() {
		document.getElementById("apply-scale").addEventListener("click", () => {
			const px = parseFloat(document.getElementById("scale-px").value);
			const meters = parseFloat(document.getElementById("scale-meters").value);

			if (px > 0 && meters > 0) {
				this.projectScale.pixels = px;
				this.projectScale.meters = meters;
				this.updateScaleRatio();

				// Update alle afhankelijke elementen
				this.updateScaleRuler();
				this.redrawGrid();
				this.saveState();

				alert(
					`Scale updated to: ${px}px = ${meters}m (${this.projectScale.ratio.toFixed(
						2
					)}px/m)`
				);
			}
		});
	}
	initScaleRuler() {
		this.scaleRuler = document.createElement("div");
		this.scaleRuler.className = "scale-ruler";
		document.querySelector(".canvas-container").appendChild(this.scaleRuler);
		this.updateScaleRuler();
	}
	updateScaleRuler() {
		const rulerPx = this.projectScale.pixels * this.currentScale;
		this.scaleRuler.style.width = `${rulerPx}px`;
		this.scaleRuler.textContent = `${this.projectScale.meters} m`;
	}
	setActiveLayer(layerId) {
		const layerIndex = this.layers.findIndex((layer) => layer.id === layerId);
		if (layerIndex !== -1) {
			this.activeLayerIndex = layerIndex;
			this.updateLayerSelect();
			this.updateLayerList();
		}
	}
	moveLayer(direction) {
		const newIndex = this.activeLayerIndex + direction;
		if (
			newIndex >= 0 &&
			newIndex < this.layers.length &&
			this.layers[newIndex].id !== "base"
		) {
			[this.layers[this.activeLayerIndex], this.layers[newIndex]] = [
				this.layers[newIndex],
				this.layers[this.activeLayerIndex]
			];
			this.activeLayerIndex = newIndex;
			this.updateLayerSelect();
			this.updateLayerList();
			this.redrawAll();
			this.saveState();
		}
	}
	adjustCanvasContainer() {
		const p = document.querySelector(".legend-panel");
		const c = document.querySelector(".canvas-container");
		if (p && c)
			c.style.width = p.classList.contains("active")
				? "calc(100% - 300px)"
				: "calc(100% - 30px)";
	}
	updateSelectedElement(e) {
		const property = e.target.name;
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;
		if (selectedElement) {
			selectedElement.setProperty(property, value);
			if (!isNaN(value) && e.target.type !== "checkbox") {
				selectedElement.setProperty(property, parseFloat(value));
			}
			renderScene();
		}
	}
	setupTerrainPropertyListeners() {
		const terrainProps = ["height", "texture", "roughness", "width", "depth"];
		terrainProps.forEach((prop) => {
			const el = document.querySelector(`#terrain-${prop}`);
			if (el) {
				el.addEventListener("input", function () {
					if (selectedTerrain) {
						selectedTerrain[prop] =
							this.type === "checkbox"
								? this.checked
								: this.type === "number"
								? parseFloat(this.value)
								: this.value;
						updateTerrainVisuals();
					}
				});
			}
		});
	}
	createLineControls(element) {
		const controls = document.createElement("div");
		controls.className = "line-controls";
		controls.appendChild(
			this.createRangeControl("Width", element.lineWidth, 1, 20, (value) => {
				element.lineWidth = value;
				this.redrawAll();
			})
		);
		controls.appendChild(
			this.createSelectControl(
				"Style",
				[
					{ value: "solid", label: "Solid" },
					{ value: "dashed", label: "Dashed" },
					{ value: "dotted", label: "Dotted" }
				],
				element.lineStyle,
				(value) => {
					element.lineStyle = value;
					this.redrawAll();
				}
			)
		);
		controls.appendChild(
			this.createColorControl("Color", element.lineColor, (value) => {
				element.lineColor = value;
				this.redrawAll();
			})
		);
		const measurementGroup = document.createElement("div");
		measurementGroup.className = "control-group";
		const measurementCheck = document.createElement("label");
		measurementCheck.innerHTML = `
            <input type="checkbox" ${element.showMeasurement ? "checked" : ""}>
            Show measurement
        `;
		measurementCheck.querySelector("input").addEventListener("change", (e) => {
			element.showMeasurement = e.target.checked;
			measurementSelect.disabled = !e.target.checked;
			this.redrawAll();
		});
		const measurementSelect = this.createSelectControl(
			"Unit",
			[
				{ value: "auto", label: "Auto" },
				{ value: "km", label: "Kilometers" },
				{ value: "m", label: "Meters" },
				{ value: "cm", label: "Centimeters" },
				{ value: "mm", label: "Millimeters" }
			],
			element.measurementUnit,
			(value) => {
				element.measurementUnit = value;
				this.redrawAll();
			}
		);
		measurementSelect.disabled = !element.showMeasurement;
		measurementGroup.appendChild(measurementCheck);
		measurementGroup.appendChild(measurementSelect);
		controls.appendChild(measurementGroup);
		return controls;
	}
	createRangeControl(label, value, min, max, onChange) {
		const group = document.createElement("div");
		group.className = "control-group";
		group.innerHTML = `
            <label>${label}:
                <input type="range" min="${min}" max="${max}" value="${value}">
                <span class="value-display">${value}</span>
            </label>
        `;
		const input = group.querySelector("input");
		const display = group.querySelector(".value-display");
		input.addEventListener("input", (e) => {
			display.textContent = e.target.value;
			onChange(parseInt(e.target.value));
		});
		return group;
	}
	createSelectControl(label, options, value, onChange) {
		const group = document.createElement("div");
		group.className = "control-group";
		group.innerHTML = `<label>${label}: <select></select></label>`;
		const select = group.querySelector("select");

		options.forEach((opt) => {
			const option = document.createElement("option");
			option.value = opt.value;
			option.textContent = opt.label;
			option.selected = opt.value === value;
			select.appendChild(option);
		});

		select.addEventListener("change", (e) => onChange(e.target.value));
		return group;
	}
	createColorControl(label, value, onChange) {
		const group = document.createElement("div");
		group.className = "control-group";
		group.innerHTML = `<label>${label}: <input type="color" value="${value}"></label>`;
		group
			.querySelector("input")
			.addEventListener("input", (e) => onChange(e.target.value));
		return group;
	}
	createElement(type, shape, x, y, options = {}) {
		const elementOptions = {
			type,
			shape,
			x,
			y,
			layerId: this.layers[this.activeLayerIndex].id,
			...options
		};
		switch (type) {
			case "power-point":
				elementOptions.color = this.getDefaultColor(type);
				elementOptions.shape = "circle";
				elementOptions.radius = 20;
				break;

			case "water-pipe":
				elementOptions.color = "#4169E1";
				elementOptions.shape = "line";
				elementOptions.lineWidth = 3;
				break;

			// Andere types...
		}

		return new TerrainElement(elementOptions);
	}
	updatePropertiesPanel(element) {
		const panel = document.querySelector("#element-properties .property-grid");
		if (!panel) return;
		panel.innerHTML = "";
		if (!element) {
			panel.innerHTML =
				'<div class="no-selection">Select an element to edit properties</div>';
			return;
		}
		const typeRow = document.createElement("div");
		typeRow.className = "property-row";
		typeRow.innerHTML = `
			<div class="property-name">Type</div>
			<div class="property-value">
				<select class="element-type">${this.getElementTypeOptions(
					element.type
				)}</select>
			</div>
		`;
		panel.appendChild(typeRow);
		const nameRow = document.createElement("div");
		nameRow.className = "property-row";
		nameRow.innerHTML = `
			<div class="property-name">Name</div>
			<div class="property-value"><input type="text" class="element-name" value="${
				element.name || ""
			}"></div>
		`;
		panel.appendChild(nameRow);
		const colorRow = document.createElement("div");
		colorRow.className = "property-row";
		colorRow.innerHTML = `
			<div class="property-name">Color</div>
			<div class="property-value"><input type="color" class="element-color" value="${
				element.color || "#000000"
			}"></div>
		`;
		panel.appendChild(colorRow);

		const visibilityRow = document.createElement("div");
		visibilityRow.className = "property-row";
		visibilityRow.innerHTML = `
			<div class="property-name">Visible</div>
			<div class="property-value"><input type="checkbox" class="element-visible" ${
				element.visible !== false ? "checked" : ""
			}></div>
		`;
		panel.appendChild(visibilityRow);

		const lockRow = document.createElement("div");
		lockRow.className = "property-row";
		lockRow.innerHTML = `
			<div class="property-name">Locked</div>
			<div class="property-value"><input type="checkbox" class="element-locked" ${
				element.locked ? "checked" : ""
			}></div>
		`;
		panel.appendChild(lockRow);

		if (element.type === "power-point") {
			this.addPowerPointProperties(panel, element);
		} else if (element.type === "water-pipe") {
			this.addWaterPipeProperties(panel, element);
		}

		const actionsRow = document.createElement("div");
		actionsRow.className = "property-row actions";
		actionsRow.innerHTML = `
			<div class="property-name"></div>
			<div class="property-value">
				<button class="save-properties">Save</button>
				<button class="delete-element">Delete</button>
			</div>
		`;
		panel.appendChild(actionsRow);
		panel
			.querySelector(".save-properties")
			.addEventListener("click", () => this.saveElementProperties(element));
		panel
			.querySelector(".delete-element")
			.addEventListener("click", () => this.removeElement(element));
		panel.querySelector(".element-type").addEventListener("change", (e) => {
			element.type = e.target.value;
			this.updatePropertiesPanel(element);
			this.redraw();
		});
	}
	getElementTypeOptions(selectedType) {
		let options = "";
		this.elementTypes.forEach((group) => {
			options += `<optgroup label="${group.group}">`;
			group.types.forEach((type) => {
				options += `<option value="${type.value}" ${
					type.value === selectedType ? "selected" : ""
				}>${type.label}</option>`;
			});
			options += "</optgroup>";
		});
		return options;
	}
	addPowerPointProperties(panel, element) {
		const voltageRow = document.createElement("div");
		voltageRow.className = "property-row";
		voltageRow.innerHTML = `
				<div class="property-name">Voltage</div>
				<div class="property-value"><input type="number" class="element-voltage" value="${
					element.voltage || 230
				}"></div>
			`;
		panel.appendChild(voltageRow);

		const wattageRow = document.createElement("div");
		wattageRow.className = "property-row";
		wattageRow.innerHTML = `
				<div class="property-name">Wattage</div>
				<div class="property-value"><input type="number" class="element-wattage" value="${
					element.wattage || ""
				}"></div>
			`;
		panel.appendChild(wattageRow);

		const groupRow = document.createElement("div");
		groupRow.className = "property-row";
		groupRow.innerHTML = `
				<div class="property-name">Group</div>
				<div class="property-value"><input type="number" class="element-group" value="${
					element.group || ""
				}"></div>
			`;
		panel.appendChild(groupRow);
	}
	addWaterPipeProperties(panel, element) {
		const diameterRow = document.createElement("div");
		diameterRow.className = "property-row";
		diameterRow.innerHTML = `
				<div class="property-name">Diameter (mm)</div>
				<div class="property-value"><input type="number" class="element-diameter" value="${
					element.diameter || ""
				}"></div>
			`;
		panel.appendChild(diameterRow);

		const flowRow = document.createElement("div");
		flowRow.className = "property-row";
		flowRow.innerHTML = `
				<div class="property-name">Flow Direction</div>
				<div class="property-value">
					<select class="element-flow">
						<option value="none" ${!element.flowDirection ? "selected" : ""}>None</option>
						<option value="left" ${
							element.flowDirection === "left" ? "selected" : ""
						}>Left</option>
						<option value="right" ${
							element.flowDirection === "right" ? "selected" : ""
						}>Right</option>
					</select>
				</div>
			`;
		panel.appendChild(flowRow);
	}
}
class Layer {
    constructor(id, name, options = {}) {
        this.id = id;
        this.name = name;
        this.visible = options.visible !== undefined ? options.visible : true;
        this.locked = options.locked || false;
        this.elements = [];
    }

    addElement(element) {
        if (!this.isValidElement(element)) {
            console.error("Invalid element:", element);
            return false;
        }
        this.elements.push(element);
        element.layerId = this.id;
    }

    isValidElement(element) {
        return (
            element &&
            typeof element === "object" &&
            element.shape &&
            typeof element.x === "number" &&
            typeof element.y === "number"
        );
    }

    removeElement(elementId) {
        this.elements = this.elements.filter((el) => el.id !== elementId);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            visible: this.visible,
            locked: this.locked,
            elements: this.elements.map((el) => el.toJSON()),
        };
    }

    static fromJSON(json) {
        const layer = new Layer(json.id, json.name, {
            visible: json.visible,
            locked: json.locked,
        });
        json.elements.forEach((el) => {
            layer.addElement(TerrainElement.fromJSON(el));
        });
        return layer;
    }
}
class TerrainElement {
	constructor(options = {}) {
		// Basis eigenschappen
		this.id = options.id || `element-${Date.now()}`;
		this.type = options.type || "generic";
		this.shape = options.shape || "rectangle";
		this.layerId = options.layerId || null;
		this.name = options.name || "";
		this.visible = options.visible !== undefined ? options.visible : true;
		this.locked = options.locked || false;
		this.selected = options.selected || false;
		// Positionering en grootte
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.width = options.width || 100;
		this.height = options.height || 100;
		this.rotation = options.rotation || 0;
		// Visuele eigenschappen
		this.color = options.color || "#3498db";
		this.borderColor = options.borderColor || "#000000";
		this.borderWidth = options.borderWidth || 1;
		this.opacity = options.opacity || 1;
		this.cornerRadius = options.cornerRadius || 0;
		// Punten voor complexe vormen
		this.points = options.points || [];
		// Status flags
		this.isResizing = false;
		this.isDragging = false;
		this.lockAspectRatio = options.lockAspectRatio || false;
		this.originalAspectRatio = this.width / this.height;
		// Type-specifieke eigenschappen
		this.initTypeSpecificProperties(options);
	}
	initTypeSpecificProperties(options) {
		// Initialiseer type-specifieke eigenschappen
		switch (this.type) {
			case "power-point":
				this.voltage = options.voltage || 230;
				this.wattage = options.wattage || 0;
				this.circuitGroup = options.circuitGroup || 0;
				break;
			case "water-pipe":
				this.diameter = options.diameter || 50;
				this.flowDirection = options.flowDirection || "none";
				this.pressure = options.pressure || 0;
				break;
			case "text":
				this.text = options.text || "";
				this.fontFamily = options.fontFamily || "Arial";
				this.fontSize = options.fontSize || 12;
				this.textColor = options.textColor || "#000000";
				break;
		}
	}
	move(dx, dy) {
		if (this.locked) return;

		this.x += dx;
		this.y += dy;

		// Verplaats ook alle punten als die er zijn
		this.points.forEach((point) => {
			point.x += dx;
			point.y += dy;
		});
	}
	resize(newWidth, newHeight, anchor = "top-left") {
		if (this.locked) return;

		if (this.lockAspectRatio) {
			if (Math.abs(newWidth - this.width) > Math.abs(newHeight - this.height)) {
				newHeight = newWidth / this.originalAspectRatio;
			} else {
				newWidth = newHeight * this.originalAspectRatio;
			}
		}

		// Pas positie aan op basis van anchor point
		switch (anchor) {
			case "top-left":
				// Geen positie aanpassing nodig
				break;
			case "center":
				this.x -= (newWidth - this.width) / 2;
				this.y -= (newHeight - this.height) / 2;
				break;
			// Andere anchor points kunnen hier worden toegevoegd
		}

		this.width = newWidth;
		this.height = newHeight;
	}
	rotate(angle) {
		this.rotation = (this.rotation + angle) % 360;
	}
	startResize() {
		this.isResizing = true;
		this.originalAspectRatio = this.width / this.height;
	}
	endResize() {
		this.isResizing = false;
	}
	startDrag() {
		this.isDragging = true;
	}
	endDrag() {
		this.isDragging = false;
	}
	containsPoint(x, y) {
		// Eenvoudige rechthoekige hit test
		return (
			x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height
		);
	}
	getBounds() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}
	toJSON() {
        const baseProps = {
            id: this.id,
            type: this.type || 'none',
            shape: this.shape,
            x: this.x || 0,
            y: this.y || 0,
            width: this.width || 0,
            height: this.height || 0,
            color: this.color || '#000000',
            name: this.name || '',
            visible: this.visible !== false,
            locked: !!this.locked,
            layerId: this.layerId,
            cornerRadius: this.cornerRadius || 0,
            points: (this.points || []).map(p => ({
                x: p.x,
                y: p.y,
                id: p.id,
                canEdit: !!p.canEdit
            }))
        };

        // Type-specifieke properties
        if (this.type === 'power-point') {
            baseProps.voltage = this.voltage || 230;
            baseProps.wattage = this.wattage || 0;
            baseProps.group = this.group || 0;
        } else if (this.type === 'water-pipe') {
            baseProps.diameter = this.diameter || 0;
            baseProps.flowDirection = this.flowDirection || 'none';
        }

        return baseProps;
    }
	static fromJSON(json) {
		return new TerrainElement(json);
	}
}
class MenuSystem {
	constructor() {
		this.openMenu = null;
		this.initMenus();
		this.initShortcuts();
		this.initMenuInteractions();
	}
	initMenus() {
		document.addEventListener("click", (e) => {
			if (!e.target.closest(".menu")) {
				this.closeAllMenus();
			}
		});
		this.initMenuItems();
	}
	initMenuItems() {
		document.querySelectorAll(".menu-item.checkbox").forEach((item) => {
			item.addEventListener("click", (e) => {
				e.stopPropagation();
				this.toggleCheckbox(item);
				this.handleAction(item);
			});
		});
		document.querySelectorAll(".menu-item.radio").forEach((item) => {
			item.addEventListener("click", (e) => {
				e.stopPropagation();
				this.selectRadioItem(item);
				this.handleAction(item);
			});
		});
		document
			.querySelectorAll(".menu-item:not(.checkbox):not(.radio)")
			.forEach((item) => {
				item.addEventListener("click", (e) => {
					e.stopPropagation();
					this.handleAction(item);
					this.closeAllMenus();
				});
			});
	}
	initMenuInteractions() {
		document.querySelectorAll(".menu-title").forEach((title) => {
			title.addEventListener("click", (e) => {
				const menu = e.currentTarget.parentElement;
				this.toggleMenu(menu);
			});
		});
		document.querySelectorAll(".has-submenu").forEach((item) => {
			item.addEventListener("mouseenter", () => {
				if (this.openMenu) {
					item.querySelector(".submenu").style.display = "block";
				}
			});
			item.addEventListener("mouseleave", () => {
				setTimeout(() => {
					if (!item.matches(":hover") && !item.querySelector(".submenu:hover")) {
						item.querySelector(".submenu").style.display = "none";
					}
				}, 200);
			});
		});
	}
	toggleMenu(menu) {
		if (this.openMenu === menu) {
			this.closeAllMenus();
		} else {
			this.closeAllMenus();
			this.openMenu = menu;
			menu.classList.add("open");
			menu.querySelector(".menu-items").style.display = "block";
		}
	}
	closeAllMenus() {
		document.querySelectorAll(".menu.open").forEach((menu) => {
			menu.classList.remove("open");
			menu.querySelector(".menu-items").style.display = "none";
		});
		this.openMenu = null;
	}
	toggleCheckbox(item) {
		item.classList.toggle("checked");
	}
	selectRadioItem(item) {
		const groupName = item.closest(".menu-items").id;
		document
			.querySelectorAll(`.menu-item.radio[data-group="${groupName}"]`)
			.forEach((radio) => {
				radio.classList.remove("checked");
			});
		item.classList.add("checked");
	}
	initShortcuts() {
		document.addEventListener("keydown", (e) => {
			if (e.target.tagName === "INPUT") return;
			const shortcut = this.getShortcutString(e);
			const menuItem = document.querySelector(
				`.menu-item[data-shortcut="${shortcut}"]`
			);
			if (menuItem) {
				this.handleAction(menuItem);
				e.preventDefault();
			}
		});
	}
	getShortcutString(e) {
		const keys = [];
		if (e.ctrlKey) keys.push("Ctrl");
		if (e.shiftKey) keys.push("Shift");
		if (e.altKey) keys.push("Alt");
		const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
		keys.push(key);
		return keys.join("+");
	}
	handleAction(item) {
		const action = item.dataset.action || item.textContent.trim();
		const isChecked = item.classList.contains("checked");
		console.log(`Menu action: ${action}`, { isChecked });
		const actionMap = {
			Undo: () => terrainEditor.undo(),
			Redo: () => terrainEditor.redo(),
			Save: () => terrainEditor.saveProject(),
			New: () => terrainEditor.newProject(),
			Open: () => terrainEditor.loadProject(),
			"Export PNG": () => terrainEditor.exportAsPNG(),
			"Export SVG": () => terrainEditor.exportAsSVG(),
			Print: () => terrainEditor.print(),
			"Zoom In": () => terrainEditor.zoom(1.2),
			"Zoom Out": () => terrainEditor.zoom(0.8),
			"Reset Zoom": () => terrainEditor.resetZoom(),
			"Fit to Screen": () => terrainEditor.zoomToFit(),
			"Show Grid": () => terrainEditor.toggleGrid(),
			"Show/Hide Sidebar": () => terrainEditor.toggleSidebar()
			// Add more actions as needed
		};
		if (actionMap[action]) {
			actionMap[action]();
		} else {
			console.warn(`No handler for action: ${action}`);
		}
	}
}
class EventManager {
	constructor() {
		this.listeners = {};
	}
	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}
	off(event, callback) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter(
				(cb) => cb !== callback
			);
		}
	}
	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				callback(data);
			});
		}
	}
}
// Run
document.addEventListener("DOMContentLoaded", () => {
	// App
	new TerrainEditor();

	// Menubar
	const menuSystem = new MenuSystem();

	// Standard grid is on. Below is just for editing fase
	document.querySelector("#toggle-grid").click();
});
