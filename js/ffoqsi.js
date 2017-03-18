﻿'use strict';

function ge(id) {
    return document.getElementById(id);
}

var slides = [];
var currentslide = 0;

function animate() {
    window.setInterval(function () {
        var s1 = currentslide;
        var s2 = (currentslide + 1) % areaimgcount;
        console.log(s1, s2);
        slides[s1].classList.add("muted");
        slides[s2].classList.remove("muted");
        currentslide = ++currentslide % areaimgcount;
    }, 2000);
}

function initimages() {
    var img1 = document.getElementById("bg-1");
    slides.push(img1);
    var p = img1.parentElement;
    for (var i = 2; i <= areaimgcount; i++) {
        var img = img1.cloneNode();
        img.id = "bg-" + i;
        img.style.backgroundImage = "url(images/area-" + areanum + "/area-" + areanum + "-" + i + ".jpg)";
        img.classList.add("muted");
        slides.push(img);
        p.insertBefore(img, img1);
    }
    animate();
}

//if (window.areaimgcount) {
//    animate();
//}

// set top
var totop = document.getElementById("top");
totop.addEventListener("mousedown", function (ev) {
    console.log("mousedown");
    ev.preventDefault();
    window.scroll({ top: 0, left: 0, behavior: 'smooth' }); // polyfilled below
});
totop.addEventListener("click", function (ev) {
    console.log("click");
    ev.preventDefault();
});



// auto scrollers
function scroll2id(id) {
    ge(id).scrollIntoView({ behavior: 'smooth' });
}
window.onload = function () {
    var target = document.location.search.substring(1);
    if (target === "") target = "top";
    console.log("target", target);
    // document.body.classList.add(target);
    window.setTimeout(function() { 
        scroll2id(target);
    }, 300);
}
document.querySelector("#subunternehmen a[href*=mission]").addEventListener("click", function (ev) {
    if (document.location.href.indexOf("unternehmen") === -1) return;
    ev.preventDefault();
    scroll2id("mission");
});
document.querySelector("#subunternehmen a[href*=team]").addEventListener("click", function (ev) {
    if(document.location.href.indexOf("unternehmen") === -1) return;
    ev.preventDefault();
    scroll2id("team");
});
document.querySelector("#subunternehmen a[href*=standort]").addEventListener("click", function (ev) {
    if (document.location.href.indexOf("unternehmen") === -1) return;
    ev.preventDefault();
    scroll2id("standort");
});
var atags = document.querySelectorAll("#subunternehmen a");
[].forEach.call(atags, function (e) {
    e.href = e.href.replace("#", "?");
});

/*
 * smoothscroll polyfill - v0.3.4
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */


/*
 * aliases
 * w: window global object
 * d: document
 * undefined: undefined
 */

var d = document;
var w = window;

// polyfill
(function (w, d, undefined) {
    'use strict';

    /*
     * aliases
     * w: window global object
     * d: document
     * undefined: undefined
     */

    // polyfill
    function polyfill() {
        // return when scrollBehavior interface is supported
        if ('scrollBehavior' in d.documentElement.style) {
            return;
        }

        /*
         * globals
         */
        var Element = w.HTMLElement || w.Element;
        var SCROLL_TIME = 250;

        /*
         * object gathering original scroll methods
         */
        var original = {
            scroll: w.scroll || w.scrollTo,
            scrollBy: w.scrollBy,
            elScroll: Element.prototype.scroll || scrollElement,
            scrollIntoView: Element.prototype.scrollIntoView
        };

        /*
         * define timing method
         */
        var now = w.performance && w.performance.now
            ? w.performance.now.bind(w.performance) : Date.now;

        /**
         * changes scroll position inside an element
         * @method scrollElement
         * @param {Number} x
         * @param {Number} y
         */
        function scrollElement(x, y) {
            this.scrollLeft = x;
            this.scrollTop = y;
        }

        /**
         * returns result of applying ease math function to a number
         * @method ease
         * @param {Number} k
         * @returns {Number}
         */
        function ease(k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }

        /**
         * indicates if a smooth behavior should be applied
         * @method shouldBailOut
         * @param {Number|Object} x
         * @returns {Boolean}
         */
        function shouldBailOut(x) {
            if (typeof x !== 'object'
                || x === null
                || x.behavior === undefined
                || x.behavior === 'auto'
                || x.behavior === 'instant') {
                // first arg not an object/null
                // or behavior is auto, instant or undefined
                return true;
            }

            if (typeof x === 'object'
                && x.behavior === 'smooth') {
                // first argument is an object and behavior is smooth
                return false;
            }

            // throw error when behavior is not supported
            throw new TypeError('behavior not valid');
        }

        /**
         * finds scrollable parent of an element
         * @method findScrollableParent
         * @param {Node} el
         * @returns {Node} el
         */
        function findScrollableParent(el) {
            var isBody;
            var hasScrollableSpace;
            var hasVisibleOverflow;

            do {
                el = el.parentNode;

                // set condition variables
                isBody = el === d.body;
                hasScrollableSpace =
                    el.clientHeight < el.scrollHeight ||
                    el.clientWidth < el.scrollWidth;
                hasVisibleOverflow =
                    w.getComputedStyle(el, null).overflow === 'visible';
            } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

            isBody = hasScrollableSpace = hasVisibleOverflow = null;

            return el;
        }

        /**
         * self invoked function that, given a context, steps through scrolling
         * @method step
         * @param {Object} context
         */
        function step(context) {
            // call method again on next available frame
            context.frame = w.requestAnimationFrame(step.bind(w, context));

            var time = now();
            var value;
            var currentX;
            var currentY;
            var elapsed = (time - context.startTime) / SCROLL_TIME;

            // avoid elapsed times higher than one
            elapsed = elapsed > 1 ? 1 : elapsed;

            // apply easing to elapsed time
            value = ease(elapsed);

            currentX = context.startX + (context.x - context.startX) * value;
            currentY = context.startY + (context.y - context.startY) * value;

            context.method.call(context.scrollable, currentX, currentY);

            // return when end points have been reached
            if (currentX === context.x && currentY === context.y) {
                w.cancelAnimationFrame(context.frame);
                return;
            }
        }

        /**
         * scrolls window with a smooth behavior
         * @method smoothScroll
         * @param {Object|Node} el
         * @param {Number} x
         * @param {Number} y
         */
        function smoothScroll(el, x, y) {
            var scrollable;
            var startX;
            var startY;
            var method;
            var startTime = now();
            var frame;

            // define scroll context
            if (el === d.body) {
                scrollable = w;
                startX = w.scrollX || w.pageXOffset;
                startY = w.scrollY || w.pageYOffset;
                method = original.scroll;
            } else {
                scrollable = el;
                startX = el.scrollLeft;
                startY = el.scrollTop;
                method = scrollElement;
            }

            // cancel frame when a scroll event's happening
            if (frame) {
                w.cancelAnimationFrame(frame);
            }

            // scroll looping over a frame
            step({
                scrollable: scrollable,
                method: method,
                startTime: startTime,
                startX: startX,
                startY: startY,
                x: x,
                y: y,
                frame: frame
            });
        }

        /*
         * ORIGINAL METHODS OVERRIDES
         */

        // w.scroll and w.scrollTo
        w.scroll = w.scrollTo = function () {
            // avoid smooth behavior if not required
            if (shouldBailOut(arguments[0])) {
                original.scroll.call(
                    w,
                    arguments[0].left || arguments[0],
                    arguments[0].top || arguments[1]
                );
                return;
            }

            // LET THE SMOOTHNESS BEGIN!
            smoothScroll.call(
                w,
                d.body,
                ~~arguments[0].left,
                ~~arguments[0].top
            );
        };

        // w.scrollBy
        w.scrollBy = function () {
            // avoid smooth behavior if not required
            if (shouldBailOut(arguments[0])) {
                original.scrollBy.call(
                    w,
                    arguments[0].left || arguments[0],
                    arguments[0].top || arguments[1]
                );
                return;
            }

            // LET THE SMOOTHNESS BEGIN!
            smoothScroll.call(
                w,
                d.body,
                ~~arguments[0].left + (w.scrollX || w.pageXOffset),
                ~~arguments[0].top + (w.scrollY || w.pageYOffset)
            );
        };

        // Element.prototype.scroll and Element.prototype.scrollTo
        Element.prototype.scroll = Element.prototype.scrollTo = function () {
            // avoid smooth behavior if not required
            if (shouldBailOut(arguments[0])) {
                original.elScroll.call(
                    this,
                    arguments[0].left || arguments[0],
                    arguments[0].top || arguments[1]
                );
                return;
            }

            // LET THE SMOOTHNESS BEGIN!
            smoothScroll.call(
                this,
                this,
                arguments[0].left,
                arguments[0].top
            );
        };

        // Element.prototype.scrollBy
        Element.prototype.scrollBy = function () {
            var arg0 = arguments[0];

            if (typeof arg0 === 'object') {
                this.scroll({
                    left: arg0.left + this.scrollLeft,
                    top: arg0.top + this.scrollTop,
                    behavior: arg0.behavior
                });
            } else {
                this.scroll(
                    this.scrollLeft + arg0,
                    this.scrollTop + arguments[1]
                );
            }
        };

        // Element.prototype.scrollIntoView
        Element.prototype.scrollIntoView = function () {
            // avoid smooth behavior if not required
            if (shouldBailOut(arguments[0])) {
                original.scrollIntoView.call(this, arguments[0] || true);
                return;
            }

            // LET THE SMOOTHNESS BEGIN!
            var scrollableParent = findScrollableParent(this);
            var parentRects = scrollableParent.getBoundingClientRect();
            var clientRects = this.getBoundingClientRect();

            if (scrollableParent !== d.body) {
                // reveal element inside parent
                smoothScroll.call(
                    this,
                    scrollableParent,
                    scrollableParent.scrollLeft + clientRects.left - parentRects.left,
                    scrollableParent.scrollTop + clientRects.top - parentRects.top
                );
                // reveal parent in viewport
                w.scrollBy({
                    left: parentRects.left,
                    top: parentRects.top,
                    behavior: 'smooth'
                });
            } else {
                // reveal element in viewport
                w.scrollBy({
                    left: clientRects.left,
                    top: clientRects.top,
                    behavior: 'smooth'
                });
            }
        };
    }

    if (typeof exports === 'object') {
        // commonjs
        module.exports = { polyfill: polyfill };
    } else {
        // global
        polyfill();
    }
})(window, document);
