/**
 * Created by Elory on 2016/12/1.
 * This is a standardized library of animation mode.
 * If you have some questions,contact me!
 * Github：https://github.com/Gong-Elory
 * Blog：http://gelroy.me
 * QQ: 1010688273
 * email: elory0513@hotmail.com
 */


/*
 *  name: moveLinear
 *  description: You can use this function to control  elements' linear motion.
 *  params:
 *          targetElements： a DOM object which you will control.
 *          obj: a json object which contains CSS key-value.
 *          func: the function which will be executed later.
 *  return:
 *          no return
 */

function moveLinear(targetElements,obj,func) {
        var onlyOneTest = true;
        clearInterval(targetElements.timer);
        targetElements.timer = setInterval(function () {
            var allDoneFlag = true;
            for(var targetAttr in obj){
                var targetValue = obj[targetAttr];
                // 常规检测
                if(onlyOneTest){
                    if(targetAttr == "opacity" ){
                        if((parseInt(targetValue) != targetValue) || (targetValue >100) || (targetValue < 0) ) {
                            onlyOneTest = false;
                            throw new Error("opacity value must be an integer between 0 to 100(不能为浮点型，必须是一个0-100的整型)。");
                        }
                    }
                    if((typeof targetValue) != "number" ) {
                        onlyOneTest = false;
                        throw new Error("value must be an integer (必须是一个数字并且是整数)。");
                    }
                }
                var attr =getCssValue(targetElements,targetAttr);
                var speed = (targetValue - attr)/20;
                speed = speed>0?Math.ceil(speed):Math.floor(speed);
                if(speed){
                    allDoneFlag = false;
                    if(targetAttr == "opacity") {
                        targetElements.style[targetAttr] = (attr + speed)/100;
                        targetElements.style.filter='alpha:(opacity:'+attr+speed+')';
                    }
                    else targetElements.style[targetAttr] = attr + speed+"px";
                }
                if(allDoneFlag){
                    clearInterval(targetElements.timer);
                    if(func) func();
                }

            }
        },30);
}

/*
 *  name: getCssValue
 *  description: You can use this function to get CSS value.
 *  params:
 *          element： a DOM object where you get the attribute value.
 *          attr: attribute name.
 *  return:
 *          styleValue: attribute value.
 *
 */

function getCssValue(element,attr) {
    var styleValue;
    if(element.currentStyle) styleValue = element.currentStyle[attr];
    else styleValue = getComputedStyle(element,null)[attr];
    styleValue = (attr == "opacity")?parseInt(parseFloat(styleValue)*100):parseInt(styleValue);
    return styleValue;
}