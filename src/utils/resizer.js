// Adated from https://github.com/artf/grapesjs/issues/1368

export default (editor, opts = {}) => {
    const { $ } = editor;
    const deviceManager = editor.Devices;
    const hints = $(`<div class="iframe-handle-container hidden">
        <div class="handle right-handle">
            <div class="gutter-handle"></div>
            <div class="tab-handle"></div>
            <div class="dim-indicator"></div>
        </div>
        <div class="handle left-handle"></div>
    </div>`);

    editor.Commands.add('smoothresize', () => { });

    editor.on('change:device', () => {
        const frame = $('.gjs-frame');
        frame.css({
            'width': '',
            'transition': 'width 0.35s ease,height 0.35s ease'
        });
        hints.find('.dim-indicator').css('display', 'none');
        hints.css('display', 'none');
        setTimeout(() => {
            const device = deviceManager.get(editor.getDevice());
            showDeviceResolution(device);
            initDeviceEventHandle(device);
            getWindowDims();
            hints.css('display', 'block')
            frame.css('transition', 'none');
        }, 800);
    });

    editor.on('run:preview', () => hints.css('display', 'none'));
    editor.on('stop:preview', () => hints.css('display', 'block'));
    editor.Canvas.model.on('change:zoom', () => {
        if (opts.hideOnZoom) {
            if (editor.Canvas.getZoom() === 100) hints.css('display', 'block');
            else hints.css('display', 'none');
        }
    });

    /**
     * This function will receive a screen type and it will prompt the description on the left side of the canvas.
     *
     * @param device
     */
    const showDeviceResolution = (device) => {
        const glutterResize = hints;

        if (glutterResize.length > 0) {
            glutterResize.addClass('hidden');
        } else {
            // If the div is not created yet inside the iframe then we include it.
            const copyGlutterResize = hints.clone(true, true);
            $('.gjs-frame').before(copyGlutterResize);
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

            draggable(hints.find('.right-handle').get(0), {
                axis: "x",
                max: maxDeviceSize,
                min: opts.minScreenSize,
                start() {
                    widthIframe = editor.Canvas.getFrameEl().offsetWidth;
                },
                drag(uleft) {
                    try {
                        if ($(".gjs-cv-canvas").find(".handle-mask").length === 0) {
                            // We need to create a mask to avoid in the moment that we are dragging to move the pointer over the iframe and losing then the control of the resizing.
                            $(".gjs-cv-canvas").append('<div class="handle-mask" style="position: absolute; z-index: 2; left: 0; top: 0; right: 0; bottom: 0;"></div>');
                        }

                        // We need to change the iframe width dynamically
                        const total = uleft - editor.Canvas.getOffset().left - widthIframe;
                        let width = widthIframe + total * opts.dragDampen;
                        let left = editor.Canvas.getOffset().left;
                        let res = true;

                        if (width > maxDeviceSize || width < opts.minScreenSize) {
                            uleft = maxLeftPos;
                            res = false;
                        } else {
                            // Set the iframe width
                            maxLeftPos = uleft;
                            $('.gjs-frame').css('width', width);

                            // Set the position left of the left handle
                            hints.find('.left-handle').css('left', left);

                            let leftDesc = left - 162; // 162 = the right panel width
                            hints.find('.device-resolution').css('left', leftDesc);
                            hints.find('.dim-indicator').html('Screen size  ' + Math.round(width) + 'px');
                            hints.find('.dim-indicator').css('display', 'block');
                        }
                        // After dragging we need to refresh the editor to re-calculate the highlight border in the element selected.
                        editor.refresh();
                        return res
                    } catch (err) {
                        console.error(err);
                        return false;
                    }
                },
                stop() {
                    try {
                        $(".handle-mask").remove();
                        editor.runCommand('smoothresize');
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
        const glutterHandleObj = hints;
        if (glutterHandleObj.length > 0) {

            const leftGlutterHandleBar = glutterHandleObj.find('.left-handle');
            const rightGlutterHandleBar = glutterHandleObj.find(".right-handle");

            const leftOffset = editor.Canvas.getOffset().left;
            const rightOffset = editor.Canvas.getOffset().left + editor.Canvas.getFrameEl().offsetWidth;

            leftGlutterHandleBar.css('cssText', 'left: ' + leftOffset + 'px !important');
            rightGlutterHandleBar.css('cssText', 'left: ' + rightOffset + 'px !important');
            glutterHandleObj.removeClass('hidden');
        }

        return { width, height };
    };
}

const draggable = (element, opts = {}) => {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0,
        push = 5,
        falseCountX = 0,
        falseCountY = 0;

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
        if (opts.axis === 'x' || opts.axis === 'xy') {
            element.style.left = (element.offsetLeft - pos1) + 'px';
            if (!opts.drag(element.offsetLeft)) {
                if (falseCountX) {
                    element.style.left = (element.offsetLeft + pos1) + Math.sign(pos1) * push + 'px';
                    falseCountX = 0;
                } else {
                    element.style.left = (element.offsetLeft + pos1) + 'px'
                    falseCountX++;
                }
            };
        }
        if (opts.axis === 'y' || opts.axis === 'xy') {
            element.style.top = (element.offsetTop - pos2) + 'px';
            if (!opts.drag(element.offsetTop)) {
                if (falseCountY) {
                    element.style.top = (element.offsetTop + pos2) + Math.sign(pos2) * push + 'px';
                    falseCountY = 0
                } else {
                    element.style.top = (element.offsetTop + pos2) + 'px';
                    falseCountY++;
                }
            };
        }
    }

    const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        opts.stop();
    }
}