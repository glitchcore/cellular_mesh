const Graphics = PIXI.Graphics;
const Text = PIXI.Text;
const Container = PIXI.Container;

function key_handler(key_code, value) {
    console.log(key_code, value ? "pressed" : "released");
}

function update(delta, now) {

}

let intro_scene;

function create_mesh(stage) {
    const LINE_WIDTH = 8;

    /*
    let point = new Graphics()
        .lineStyle(LINE_WIDTH, "#4499FF", 2)
        .drawCircle(200, 100, 10);
    */

    /*
    point.visible = true;

    let mesh = new Container();

    mesh.addChild(point);
    mesh.visible = true;

    stage.addChild(mesh);
    */
}

function app(pixi) {
    let stage = pixi.stage;

    PIXI.utils.sayHello("mesh hello!");

    intro_scene = Intro_scene(pixi);
    intro_scene.visible = false;
    stage.addChild(intro_scene);

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

    pixi.ticker.add(delta => update(delta, performance.now()));

    select_scene(intro_scene);

    // create_mesh(stage);
}

let current_scene = null;
let back_scene = null;

function select_scene(scene, params) {
    if(current_scene !== null) {
        current_scene.visible = false;
    }
    scene.visible = true;
    current_scene = scene;

    update = scene.update;
    key_handler = scene.key_handler;
    scene.select(params);
}
