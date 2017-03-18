

var initPhotoSwipeFromDOM = function (gallerySelector) {

    var gallery = document.querySelector(gallerySelector);
    var parseThumbnailElements = function (el) {

        return [].map.call(gallery.querySelectorAll("figure"), (figureEl) => {

            var linkEl = figureEl.children[0]; // <a> element
            var size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            var item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            if (figureEl.children.length > 1) {
                item.title = figureEl.getElementsByTagName("figcaption")[0].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.firstElementChild.getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            return item;
        });
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentElement, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            children = clickedListItem.parentElement.children,
            numChildNodes = children.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (children[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        } // open PhotoSwipe if valid index found

        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.getElementById('pswp'),
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            zoomEl: false,
            shareEl: false
        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};

// execute above function
console.log("initing");
initPhotoSwipeFromDOM('.gallery1');
initPhotoSwipeFromDOM('.gallery2');
console.log("inited");