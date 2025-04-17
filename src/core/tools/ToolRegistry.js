const tools = {
    // Basis vorm tools
    select: eventManager => new SelectTool(eventManager),
    rectangle: eventManager => new RectangleTool(eventManager),
    circle: eventManager => new CircleTool(eventManager),
    line: eventManager => new LineTool(eventManager),
    polygon: eventManager => new PolygonTool(eventManager),
    text: eventManager => new TextTool(eventManager),
    
    // Meet- en bewerkingstools
    measure: eventManager => new MeasureTool(eventManager),
    eraser: eventManager => new EraserTool(eventManager),
    paint: eventManager => new PaintTool(eventManager),
    gradient: eventManager => new GradientTool(eventManager),
    transform: eventManager => new TransformTool(eventManager),
    
    // Speciale vormtools
    triangle: eventManager => new PolygonTool(eventManager, 3),
    pentagon: eventManager => new PolygonTool(eventManager, 5),
    hexagon: eventManager => new PolygonTool(eventManager, 6),
    star: eventManager => new StarTool(eventManager),
    
    // Geavanceerde tools
    'text-path': eventManager => new TextPathTool(eventManager),
    symbol: (eventManager, symbolLibrary) => new SymbolTool(eventManager, symbolLibrary),
    'svg-import': eventManager => new ExternalSVGTool(eventManager),
    
    // Groepering tools
    group: eventManager => new GroupTool(eventManager),
    ungroup: eventManager => new UngroupTool(eventManager),
    
    // Presentatie tools
    slice: eventManager => new SliceTool(eventManager),
    artboard: eventManager => new ArtboardTool(eventManager),
    
    // Plugins
    ...pluginTools // Uitgebreid met geregistreerde plugin tools
};