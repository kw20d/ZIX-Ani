var compWidth = 1920;
var compHeight = 1080;
var comp;
var string;
var ease = new KeyframeEase(0, 100);
var textLayer;
var textProp;
var textDoc;
var rect;
var opacity;
var position;
var blur;
var blurriness;
var scale;
var key1;
var key2;
var effects;
var slider1;
var slider2;
var slider3;
var styleOf = 'Scale';
var typeOf = 'Ease';

var bounce = 'n = 0;\n'+
                                        'if (numKeys > 0){\n'+
                                        'n = nearestKey(time).index;\n'+
                                        'if (key(n).time > time){\n'+
                                        'n--;\n'+
                                        '}\n'+
                                        '}\n'+
                                        'if (n == 0){\n'+
                                        't = 0;\n'+
                                        '}else{\n'+
                                        't = time - key(n).time;\n'+
                                        '}\n'+
                                        '\n'+
                                        'if (n > 0){\n'+
                                        'v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n'+
                                        'amp = (thisComp.layer("Physics Adjustment").effect("Amplitude")("Slider"))/100;\n'+
                                        'freq = thisComp.layer("Physics Adjustment").effect("Frequency")("Slider");\n'+
                                        'decay = thisComp.layer("Physics Adjustment").effect("Decay")("Slider");\n'+
                                        'value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n'+
                                        '}else{\n'+
                                        'value;\n'+
                                        '}\n';


function easing(object, value1, value2, time1, time2){
    object.setValueAtTime(time1, value1);
    object.setValueAtTime(time2, value2);

    var easeArray = [];
    var dimensions;

    if (object.value instanceof Array)
        dimensions = object.value.length;
    else
        dimensions = 1;

    for(var i = 0; i < dimensions; i ++)
        easeArray.push(ease);

    object.setTemporalEaseAtKey(1, easeArray, easeArray);
    object.setTemporalEaseAtKey(2, easeArray, easeArray);
};

function createController(){
    var controller = comp.layers.addNull();
    controller.name = ("Physics Adjustment");

    effects = controller.property("Effects");
    slider1 = effects.addProperty("ADBE Slider Control");
    slider1.name = "Amplitude";
    slider1.property("Slider").setValue(2);
    slider2 = effects.addProperty("ADBE Slider Control");
    slider2.name = "Frequency";
    slider2.property("Slider").setValue(2);
    slider3 = effects.addProperty("ADBE Slider Control");
    slider3.name = "Decay";
    slider3.property("Slider").setValue(5);
}

function bouncing(object, value1, value2, time1, time2){
    object.setValueAtTime(time1, value1);
    object.setValueAtTime(time2, value2);

    object.setInterpolationTypeAtKey(
        1,
        KeyframeInterpolationType.LINEAR,
        KeyframeInterpolationType.LINEAR
    );
    object.setInterpolationTypeAtKey(
        2,
        KeyframeInterpolationType.LINEAR,
        KeyframeInterpolationType.LINEAR
    );

    object.expression = bounce;
}

function textInitiate(word){
    textLayer = comp.layers.addText(word);
    textProp = textLayer.property("Source Text");
    textDoc = textProp.value;
    textDoc.fontSize = 120;
    textProp.setValue(textDoc);
    rect = textLayer.sourceRectAtTime(0, false);
    textLayer.property("Transform").property("Anchor Point").setValue([rect.left + rect.width / 2, rect.top + rect.height / 2]);
}

function popIn(words, type){
    var txt = words;
    var widths = [];
    var totalWidth = 0;
    var gap = 80;

    for(var i = 0; i < txt.length; i++)
    {
        textInitiate(txt[i]);
        widths[i] = rect.width;
        totalWidth += rect.width;
        textLayer.remove();
    }

    totalWidth += gap * (txt.length - 1);

    var fitScale = Math.min(1, (compWidth - 160) / totalWidth);
    var currentX = (compWidth - totalWidth * fitScale) / 2;

    for(var i = 0; i < txt.length; i++)
    {
        key1 = 0 + .2 *i;
        key2 = .4 + .2 *i;
        textInitiate(txt[i]);
        var wordWidth = widths[i] * fitScale;
        var finalX = currentX + wordWidth / 2;

        currentX += wordWidth + gap * fitScale;

        textLayer.property("Transform").property("Scale")
            .setValue([fitScale * 100, fitScale * 100]);

        opacity = textLayer.property("Transform").property("Opacity");
        position = textLayer.property("Transform").property("Position");
        blur = textLayer.property("Effects").addProperty("ADBE Gaussian Blur 2");
        blurriness = blur.property("Blurriness");

        easing(opacity, 0, 100, key1, key2);
        easing(blurriness, 30, 0, key1 + .1, key2 + .1);

        if(type === "Bounce")
        {
            bouncing(position, [finalX, compHeight / 2 - 100],
            [finalX, compHeight / 2],
            key1, key2);
        }
        else
        {
            easing(position, [finalX, compHeight / 2 - 100],
            [finalX, compHeight / 2],
            key1, key2);
        }
    }
}

function scaleIn(words, type){
    var txt = words;
    var widths = [];
    var totalWidth = 0;
    var gap = 40;

    for(var i = 0; i < txt.length; i++)
    {
        textInitiate(txt[i]);
        widths[i] = rect.width;
        totalWidth += rect.width;
        textLayer.remove();
    }

    totalWidth += gap * (txt.length - 1);

    var fitScale = Math.min(1, (compWidth - 160) / totalWidth);
    var currentX = (compWidth - totalWidth * fitScale) / 2;

    for(var i = 0; i < txt.length; i++)
    {
        key1 = 0 + .2 *i;
        key2 = .4 + .2 *i;
        textInitiate(txt[i]);
        var wordWidth = widths[i] * fitScale;
        var finalX = currentX + wordWidth / 2;
        currentX += wordWidth + gap * fitScale;

        opacity = textLayer.property("Transform").property("Opacity");
        position = textLayer.property("Transform").property("Position");
        position.setValue([finalX, compHeight / 2]);
        blur = textLayer.property("Effects").addProperty("ADBE Gaussian Blur 2");
        blurriness = blur.property("Blurriness");
        scale = textLayer.property("Transform").property("Scale");

        easing(opacity, 0, 100, key1, key2);
        easing(blurriness, 30, 0, key1 + .1, key2 + .1);

        if(type === "Bounce")
        {
            bouncing(scale, [0,0], [fitScale * 100, fitScale * 100], key1, key2);
        }
        else
        {
            easing(scale, [0,0], [fitScale * 100, fitScale * 100], key1, key2);
        }
    }
}

function animating(style, type, words){
    if(type === 'Bounce')
        createController();

    if(style === 'Pop In') popIn(words, type);
    else scaleIn(words, type);
}

var win = new Window("palette", "ZIX-Ani", undefined);
var title = win.add("statictext", undefined, "Enter Your Text");
var input = win.add("edittext", undefined, "Hello World Of AfterFx");
var choicesGroup = win.add("group");
choicesGroup.orientation = "column";
var styleGroup = choicesGroup.add("panel", undefined, "Animation Style");
styleGroup.orientation = "row";
var choice1 = styleGroup.add("radiobutton", undefined, "Pop In");
var choice2 = styleGroup.add("radiobutton", undefined, "Scale");
choice2.value = true;
var typeGroup = choicesGroup.add("panel",undefined ,"Animation Type");
typeGroup.orientation = "row";
var choice3 = typeGroup.add("radiobutton", undefined, "Bounce");
var choice4 = typeGroup.add("radiobutton", undefined, "Ease");
choice4.value = true;
var button1 = win.add("button", undefined, "Animate");

button1.onClick = function() {
    if(input.text.replace(/\s/g, "").length === 0)
    {
        alert("Please Enter a Text");
        return;
    }

    if(choice1.value)
        styleOf = "Pop In";
    else
        styleOf = "Scale";

    if(choice3.value)
        typeOf = "Bounce";
    else
        typeOf = "Ease";

    var undoStarted = false;
    var createdComp = null;

    try {
        app.beginUndoGroup("Text Animation");
        undoStarted = true;

        string = input.text;

        var cleanString = string.replace(/^\s+|\s+$/g, "");
        var words = cleanString.split(/\s+/);
        var wordCount = words.length;

        // Fixed Full HD composition for use in standard editing projects.
        compWidth = 1920;
        compHeight = 1080;

        var compLength = .4 * wordCount + .2;

        if(typeOf === "Bounce")
            compLength += Math.log(100) / 5;

        comp = app.project.items.addComp(
            input.text,
            compWidth,
            compHeight,
            1,
            compLength,
            24
        );

        createdComp = comp;

        animating(styleOf, typeOf, words);

    } catch (error) {

        if(createdComp !== null)
            createdComp.remove();

        alert(error.toString());

    } finally {
        if(undoStarted)
            app.endUndoGroup();
    }
};


win.layout.layout(true);
win.show();
