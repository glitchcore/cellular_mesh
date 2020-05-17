const Graphics = PIXI.Graphics;
const Text = PIXI.Text;
const Container = PIXI.Container;

function key_handler(key_code, value) {
    console.log(key_code, value ? "pressed" : "released");
}

let mesh = {
    points: [],
    edges: []
};

function update(delta, now, convert) {
    mesh.points.forEach(item => {
        let point = convert(item.coordinates);
        item.graphic.x = point.x;
        item.graphic.y = point.y;
    })
}

let intro_scene;

const SIZE_X = 10;
const SIZE_Y = 10;



function create_mesh(stage) {
    for(let x = -SIZE_X/2; x < SIZE_X/2; x++) {
        for(let y = -SIZE_Y/2; y < SIZE_Y/2; y++) {

            let point = new Graphics()
                .lineStyle(0, 0, 0)
                .beginFill(0x4499FF, 1)
                .drawCircle(0, 0, 5);

            stage.addChild(point);

            mesh.points.push({
                graphic: point,
                coordinates: {x: x/SIZE_X, y: y/SIZE_Y}
            });
        }
    }
}

function app(pixi) {
    let stage = pixi.stage;

    const MARGIN = 0.05;

    let convert = (origin) => ({
        x: (MARGIN + (origin.x/2 + 0.5) * (1 - MARGIN * 2)) * pixi.renderer.width,
        y: (MARGIN + (origin.y/2 + 0.5) * (1 - MARGIN * 2)) * pixi.renderer.height,
    });

    PIXI.utils.sayHello("mesh hello!");

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

    pixi.ticker.add(delta => update(delta, performance.now(), convert));

    create_mesh(stage, convert);
}
