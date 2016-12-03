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

/*
*   name: scrollLinear
*   description: You can use this function to control the object to scroll from any direction.
*   params:
*       elementContainer:
*                       a object contains 'ul' object
*       targetElement:
*                      a 'ul' object which contains list of "li" object
*       direction:
*                   scrolling direction default: [u2d] means：up-to-down
*                   you can use this:
*                                               [d2u] means:down-to-up
*                                               [r2l] means:right-to-left
*                                               [l3r] means:left-to-right
*       speed: scrolling speed. default: 30
*       obj:   a json object which contains attrbutes about intermittent scrolling.
*               attributes:
*                   [mode]: you can setting the  number of scrolling intervals. default: -1 :no intervals
*                   [delay]: the time of scrolling intervals （The unit is milliseconds）
*       return: no return
*
*       template:
*           ······scrollLinear(divElem,ulElem)
*           ······scrollLinear(divElem,ulElem,"u2d")
*           ······scrollLinear(divElem,ulElem,"u2d",40)
*           ······scrollLinear(divElem,ulElem,"u2d",{"mode":2})
*           ······scrollLinear(divElem,ulElem,"u2d",{"mode":2,"delay":1000})
 */

function scrollLinear(elementContainer,targetElement,direction,speed,obj) {
    var speedValue = 30,
        inn,
        stepTest = 0,
        mode=-1,
        delay = 1000;
    elementContainer.timer = null;
    if(speed) speedValue = speed;
    if(obj){
        mode = obj.mode?obj.mode:-1;
        var delay = obj.delay?obj.delay:1000;
        console.log(mode+":"+delay);
    }
    targetElement.innerHTML += targetElement.innerHTML;
    var num = targetElement.getElementsByTagName("li").length;
    switch(direction){
        case "r2l":
        case "l2r":
                    var widthElem = targetElement.getElementsByTagName("li")[0].offsetWidth;
                    var leftValue = parseInt(targetElement.getElementsByTagName("li")[0].style.marginLeft);
                    var rightValue =parseInt(targetElement.getElementsByTagName("li")[0].style.marginRight);
                    if(rightValue) widthElem+=rightValue;
                    if(leftValue ) widthElem+=leftValue ;
                    inn = widthElem*num;
                    targetElement.style.width = inn+"px";
                    break;
        case "d2u":
        case "u2d":
        default:
                    var heightElem = targetElement.getElementsByTagName("li")[0].offsetHeight
                    var topValue = parseInt(targetElement.getElementsByTagName("li")[0].style.marginTop);
                    var bottomValue= parseInt(targetElement.getElementsByTagName("li")[0].style.marginBottom);
                    if(topValue) heightElem+=topValue;
                    if(bottomValue) heightElem+=bottomValue ;
                    inn = heightElem*num;
                    targetElement.style.height = inn+"px";
                    break;
    }
    if(mode == -1){
        elementContainer.timer = setInterval(scrollStep,speedValue);
    }else if(mode > 0){
        elementContainer.timer = setTimeout(scrollByStep,delay);
    }

    elementContainer.onmouseover= function () {
        // if(stepTest == 2) clearTimeout(elementContainer.timer);
        // else clearInterval(elementContainer.timer);
        if(stepTest == 1) clearTimeout(elementContainer.timer);
        else clearInterval(elementContainer.timer);

    }
    elementContainer.onmouseleave = function () {

        if(stepTest == 1) elementContainer.timer = setTimeout(scrollByStep,speedValue);
        else elementContainer.timer = setInterval(scrollStep,speedValue);


    }

    function scrollStep() {
        stepTest = 2;
        switch(direction){
            case "r2l" :
                if((elementContainer.scrollLeft++) > (inn/2)) elementContainer.scrollLeft = 0;
                else if((mode > 0) && (elementContainer.scrollLeft %( mode * widthElem)) == 0 ) {
                    clearInterval(elementContainer.timer);
                    setTimeout(scrollByStep, delay);
                }
                break;
            case "l2r" :
                if((elementContainer.scrollLeft--) <= 0) elementContainer.scrollLeft =(inn/2);
                else if((mode > 0) && ((elementContainer.scrollLeft) %( mode * widthElem)) == 0){
                    clearInterval(elementContainer.timer);
                    setTimeout(scrollByStep,delay);
                }
                break;
            case "d2u" :
                if((elementContainer.scrollTop++) > (inn/2)) {elementContainer.scrollTop= 0;stepTest = 1;}
                else if((mode > 0) && (elementContainer.scrollTop %( mode * heightElem)) == 0 ) {
                    clearInterval(elementContainer.timer);
                    elementContainer.timer = setTimeout(scrollByStep, delay);
                }
                break;
            case "u2d" :
            default:
                if((elementContainer.scrollTop--) <= 0) elementContainer.scrollTop= (inn/2);
                else if((mode > 0) && (elementContainer.scrollTop %( mode * heightElem)) == 0 ){
                    clearInterval(elementContainer.timer);
                    setTimeout(scrollByStep,delay);
                }
                break;
        }
    }

    function scrollByStep()
    {
        stepTest = 1;
        elementContainer.timer=setInterval(scrollStep,speedValue);
    }
}

