const Graphics = PIXI.Graphics;
const Text = PIXI.Text;
const Container = PIXI.Container;

function key_handler(key_code, value) {
    console.log(key_code, value ? "pressed" : "released");
}

const SIZE_X = 10;
const SIZE_Y = 10;

let mesh = {
    points: [...new Array(SIZE_X).keys()].map(item => new Array(SIZE_Y)),
    edges: [],
    physics: true
};

function update(delta, now, convert, stage) {
    mesh.points.flat().forEach(item => {
        // if(!item.graphics.is_dragging) {
            let point = convert(item.coordinates);
            item.graphics.x = point.x;
            item.graphics.y = point.y;
        // }
    });

    mesh.edges.forEach(item => {
        let begin_vertex_id = item.vertexes[0];
        let end_vertex_id = item.vertexes[1];

        let begin_vertex = mesh.points[begin_vertex_id.x][begin_vertex_id.y];
        let end_vertex = mesh.points[end_vertex_id.x][end_vertex_id.y];

        let begin = convert(begin_vertex.coordinates);
        let end = convert(end_vertex.coordinates);

        item.graphics.destroy();
        item.graphics = new Graphics()
            .lineStyle(2, 0x44AAFF, 0.8)
            .moveTo(begin.x, begin.y)
            .lineTo(end.x, end.y);

        stage.addChild(item.graphics);
    });
}

function create_mesh(stage, convert_inv) {
    console.log(mesh);

    for(let x = 0; x < SIZE_X; x++) {
        for(let y = 0; y < SIZE_Y; y++) {

            let graphics = new Graphics()
                .lineStyle(0, 0, 0)
                .beginFill(0x4499FF, 1)
                .drawCircle(0, 0, 5);

            graphics.is_dragging = false;

            graphics.interactive = true;
            graphics.on("pointerdown", event => {graphics.is_dragging = true});
            graphics.on("pointerup", event => {graphics.is_dragging = false});
            graphics.on("pointerupoutside", event => {graphics.is_dragging = false});

            stage.addChild(graphics);

            // console.log("x", x, "y",y);

            let point_edges = [];

            // create edges
            for(let i = 0; i < 4; i++) {
                if(x == 0 && i == 0) continue;
                if(y == 0 && i == 1) continue;
                if(x == SIZE_X - 1 && i == 2) continue;
                if(y == SIZE_Y - 1 && i == 3) continue;

                if(mesh.edges.filter(
                    item => item.vertexes[1].x == x && item.vertexes[1].y == y
                ).length > 0) {
                    continue;
                }

                let next_vertex = {x: NaN, y: NaN};

                switch(i) {
                    case 0: next_vertex = {x: x - 1, y: y}; break;
                    case 1: next_vertex = {x: x, y: y - 1}; break;
                    case 2: next_vertex = {x: x + 1, y: y}; break;
                    case 3: next_vertex = {x: x, y: y + 1}; break;
                }

                point_edges.push({
                    vertexes:[{x, y}, next_vertex],
                    graphics: new Graphics()
                })
            }

            point_edges.forEach(edge => mesh.edges.push(edge));

            let point = {
                graphics: graphics,
                coordinates: {x: (x + 0.5)/SIZE_X - 0.5, y: (y + 0.5)/SIZE_Y - 0.5},
                edges: point_edges
            };

            graphics.on("pointermove", event => {
                if(graphics.is_dragging) {
                    // graphics.x = event.data.global.x;
                    // graphics.y = event.data.global.y;

                    point.coordinates = convert_inv(event.data.global);
                }
            });

            mesh.points[x][y] = point;
        }
    }
}

function app(pixi) {
    let stage = pixi.stage;

    const MARGIN = 0.05;

    let convert = (origin) => ({
        x: (MARGIN + (origin.x + 0.5) * (1 - MARGIN * 2)) * pixi.renderer.height + (pixi.renderer.width - pixi.renderer.height)/2,
        y: (MARGIN + (origin.y + 0.5) * (1 - MARGIN * 2)) * pixi.renderer.height,
    });

    let convert_inv = (point) => ({
        x: ((point.x - (pixi.renderer.width - pixi.renderer.height)/2)/ pixi.renderer.height - MARGIN) / (1 - MARGIN * 2) - 0.5,
        y: (point.y / pixi.renderer.height - MARGIN) / (1 - MARGIN * 2) - 0.5
    });

    PIXI.utils.sayHello("mesh hello!");

    create_mesh(stage, convert_inv);

    // console.log(mesh.edges);

    window.addEventListener(
        "keydown",
        (event) => {
            key_handler(event.keyCode, true);
            if(event.keyCode !== 116 && event.keyCode !== 122 && event.keyCode !== 123) {
                event.preventDefault();
            }
        },
        false
    );

    window.addEventListener(
        "keyup",
        (event) => {
            key_handler(event.keyCode, false);
            event.preventDefault();
        },
        false
    );

    pixi.ticker.add(delta => update(delta, performance.now(), convert, stage));
}
