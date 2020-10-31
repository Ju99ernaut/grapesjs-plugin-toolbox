// Adated from https://github.com/artf/grapesjs/issues/1368

export default (editor, opts = {}) => {
    const $ = editor.$;
    const deviceManager = editor.Devices;
    const hints = $(`
    <div class="iframe-handle-container hidden">
        <div class="handle right-handle">
            <div class="gutter-handle"></div>
            <div class="tab-handle"></div>
            <div class="dim-indicator"></div>
        </div>
        <div class="handle left-handle"></div>
    </div>`);

    editor.on('change:device', () => {
        const frame = $('.gjs-frame');
        frame.css({
            'width': '',
            'transition': 'width 0.35s ease,height 0.35s ease'
        });
        $('.dim-indicator').css('display', 'none');
        setTimeout(() => {
            const device = deviceManager.get(editor.getDevice());
            showDeviceResolution(device);
            initDeviceEventHandle(device);
            getWindowDims();
            frame.css('transition', 'none');
        }, 600);
    });

    editor.on('run:preview', () => $('.iframe-handle-container').css('display', 'none'));
    editor.on('stop:preview', () => $('.iframe-handle-container').css('display', 'block'));

    /**
     * This function will receive a screen type and it will prompt the description on the left side of the canvas.
     *
     * @param device
     */
    const showDeviceResolution = (device) => {
        const glutterResize = $(document).find(".gjs-cv-canvas").find(".iframe-handle-container");

        if (glutterResize.length > 0) {
            glutterResize.addClass("hidden");
        } else {
            // If the div is not created yet inside the iframe then we include it.
            const copyGlutterResize = $(document).find(".iframe-handle-container").clone(true, true);
            $(".gjs-frame").before(copyGlutterResize);
        }
        // We force to refresh the screen because then we will update all dimensions
        setTimeout(function () {
            $(window).trigger('resize');
        }, 600);
    };


    /**
     * This function initializes device glutter handle
     *
     */
    const initDeviceEventHandle = (device) => {

        try {
            const maxDeviceSize = parseInt(device.get('widthMedia'), 10);

            let widthIframe = 0; // Current iframe Width
            let maxLeftPos = 0;

            draggable($(".right-handle").get(0), {
                axis: "x",
                start() {
                    widthIframe = editor.Canvas.getFrameEl().offsetWidth;
                },
                drag(uleft) {
                    try {
                        if ($(".gjs-cv-canvas").find(".handle-mask").length == 0) {
                            // We need to create a mask to avoid in the moment that we are dragging to move the pointer over the iframe and losing then the control of the resizing.
                            $(".gjs-cv-canvas").append('<div class="handle-mask" style="position: absolute; z-index: 2; left: 0; top: 0; right: 0; bottom: 0;"></div>');
                        }

                        // We need to change the iframe width dynamically
                        const total = uleft - editor.Canvas.getOffset().left - widthIframe;
                        let width = widthIframe + total * opts.dragDampen;
                        let left = editor.Canvas.getOffset().left;

                        if (width > maxDeviceSize || width < opts.minScreenSize) {
                            uleft = maxLeftPos;
                        } else {
                            // Set the iframe width
                            maxLeftPos = uleft;
                            $('.gjs-frame').css('width', width);

                            // Set the position left of the left handle
                            $(".left-handle").css("left", left);

                            let leftDesc = left - 162; // 162 = the right panel width
                            $(".device-resolution").css("left", leftDesc);
                            $('.dim-indicator').html('Screen size  ' + Math.round(width) + 'px');
                            $('.dim-indicator').css('display', 'block');
                        }
                        // After dragging we need to refresh the editor to re-calculate the highlight border in the element selected.
                        editor.refresh();

                    } catch (err) {
                        console.error(err);
                    }
                },
                stop() {
                    try {
                        $(".handle-mask").remove();
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    editor.on('load', function () {
        // Control that the screen size is not too small
        $('.gjs-cv-canvas').append(hints);
        getWindowDims();
    });

    /**
     * Function to determine Viewport Size
     */
    const getWindowDims = () => {
        const doc = document,
            w = window;
        const docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat') ?
            doc.documentElement : doc.body;

        let width = docEl.clientWidth;
        let height = docEl.clientHeight;

        // mobile zoomed in?
        if (w.innerWidth && width > w.innerWidth) {
            width = w.innerWidth;
            height = w.innerHeight;
        }

        // IMPORTANT!!!!
        // Glutter Handle information
        const glutterHandleObj = $(document).find(".gjs-cv-canvas").find(".iframe-handle-container");
        if (glutterHandleObj.length > 0) {

            const leftGlutterHandleBar = glutterHandleObj.find(".left-handle");
            const rightGlutterHandleBar = glutterHandleObj.find(".right-handle");

            const leftOffset = editor.Canvas.getOffset().left;
            const rightOffset = editor.Canvas.getOffset().left + editor.Canvas.getFrameEl().offsetWidth;

            leftGlutterHandleBar.css("cssText", "left: " + leftOffset + "px !important");
            rightGlutterHandleBar.css("cssText", "left: " + rightOffset + "px !important");
            glutterHandleObj.removeClass("hidden");
        }

        return {
            width: width,
            height: height
        };
    };
}

const draggable = (element, opts = {}) => {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    element.addEventListener('mousedown', e => dragMouseDown(e));

    const dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        opts.start();
    }

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (opts.axis === 'x') {
            element.style.left = (element.offsetLeft - pos1) + 'px';
            opts.drag(element.offsetLeft);
        } else if (opts.axis === 'y') {
            element.style.top = (element.offsetTop - pos2) + 'px';
            opts.drag(element.offsetTop);
        } else {
            element.style.left = (element.offsetLeft - pos1) + 'px';
            element.style.top = (element.offsetTop - pos2) + 'px';
            opts.drag(element.offsetLeft, element.offsetTop);
        }
    }

    const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        opts.stop();
    }
}