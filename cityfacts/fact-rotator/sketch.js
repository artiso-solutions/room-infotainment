let data = JSON.parse('[ { "Cityname": "Kapstadt", "Facts": [ "Im Stadtzentrum nahe der Hauptstraße Long Street, befindet sich tatsächlich ein Teil der Berliner Mauer.", "Luftgetrocknetes Rindfleisch gilt als der absolute Lieblingssnack in Kapstadt.", "Kapstadt ist nur zu einem Drittel die Hauptstadt Südafrikas. ", "In Kapstadt ertönt täglich um 12 Uhr mittags ein Kanonenschuss. ", "Robben Island, eine Insel knapp 11 Kilometer von Kapstadt entfernet, ist das Alcatraz Südafrikas.", "Ungefähr 20% der Autofahrer und Autofahrerinnen am Westkap besitzen angeblich keinen Führerschein.", "Meist beträgt das Intervall, um die Straße zu überqueren für Fußgänger nicht einmal zwei Sekunden.", "Bisweilen regnet es in Kapstadt Algenschaum.", "Beim Rhode Memorial nahe der Universität können Besucher durch die zerfallenen Käfige eines ehemaligen Zoos schleichen.", " Zu jedem Vollmond findet an einem beliebigen Ort in Kapstadt eine Vollmond-Meditation statt.", "Kapstadt hat den leisesten Club der Welt. Jeder trägt nämlich seine eigenen Kopfhörer und kann zu seiner eigenen Musik abtanzen.", "Kameelperd ist Afrikaans und bedeutet Giraffe.", "Am Boulders Beach leben 3000 Pinguine.", "Das «Test Kitchen» belegt den 63. Platz auf der Rangliste der 100 weltbesten Restaurants.", "Eine halbe Bier kostet in Kapstadt 1,29 Euro.", "Kapstadt besitzt Südafrikas einzige Rodelbahn." ] }, { "Cityname": "Rio", "Facts": [ "In Rio gab es im Jahr 1947 einen Anti-Bikini-Verein.", "Rio war einst die Hauptstadt von Portugal, was es zur einzigen europäischen Hauptstadt außerhalb des Kontinents machte?", "Beim Neujahreskonzert 2011 versammelte Rod Stuart sagenhafte 3,5 Mio. Zuschauer an der Copacabana.", "In Rio herrscht das ganze Jahr über Badewetter.", "In Rio gibt es den blauesten Himmel.", "Die Bewohner Rios gehören zu den schnellsten weltweit, wenn es darum geht in einen Bus ein- oder auszusteigen.", "Das mit 173,850 Besuchern größte Fußballsopiel fand 150 in Rio statt.", "2014 verlor die Christusstatue aufgrund eines Sturms einen Daumen.", "Die Mordrate in Rio beträgt 18.6 pro 100,000 Einwohner. Damit ist Rio sicherer als Detroit (44).", "Eine Spezialität Rios sind in einem Ziegenmagen zubereitete Innereien dieses Tiers.", "Ein Friseur verdient in Rio 591 USD." ] } ]');
let img;
let rotationIntervalInMs;
let lastTextRotationTimestamp;
let currentFactIndex;
let pg;

function preload() {
    img = loadImage('assets/cape-town-aerial-view-greenpoint-stadium.jpg');
}

function setup() {
    rotationIntervalInMs = 5000
    lastTextRotationTimestamp = Date.now();
    currentFactIndex = 0;
    createCanvas(1200, 800);
    pg = createGraphics(600, 400);
}

function draw() {
    image(img, 0, 0);
    filter(BLUR, 2);
    
    // pg.background('rgba(100, 100, 100, 100)');
    // pg.rect(0, 0, 600, 400);
    // pg.filter(BLUR, 2);
    // pg.loadPixels();
    // pg.updatePixels();
    // image(pg, 300, 200);
    
    let timeDiff = Date.now() - lastTextRotationTimestamp;
    if (timeDiff > rotationIntervalInMs) {
        currentFactIndex = (currentFactIndex + 1) % data[0].Facts.length;
        lastTextRotationTimestamp = Date.now();
    }

    var fact = data[0].Facts[currentFactIndex];
    textSize(40);
    textStyle(ITALIC);
    text(fact, 300, 300, 600, 400);
    fill(255);
}
