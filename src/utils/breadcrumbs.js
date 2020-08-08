export default (editor, config) => {
    const generateQuerySelector = el => {
        let str = el.tagName.toLowerCase();
        str += el.id ? "#" + el.id : "";
        el.className.length && el.className.split(/\s/).forEach(cls => {
            str += (cls != "gjs-selected" && cls != "cke_editable" &&
                cls != "cke_editable_inline" && cls != "cke_contents_ltr" &&
                cls != "cke_show_borders") ? "." + cls : "";
        });
        return generateTree(el.parentNode) + `<li><a><span>${str}</span></a></li>`;
    };

    const generateTree = el => {
        if (el.tagName.toLowerCase() == "html")
            return `<li><a><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;html</span></a></li>`; //?link href to components
        return generateTree(el.parentNode) + `<li><a><span>${el.tagName.toLowerCase()+(el.id ? "#" + el.id : "")}</span></a></li>`;
    };

    const $ = grapesjs.$;

    editor.on('component:selected', model => {
        !$('#breadcrumbs').length && $('body').append($('<div id="breadcrumbs"></div>'));
        const breadcrumbs = $('#breadcrumbs');
        breadcrumbs.get(0).innerHTML = generateQuerySelector(model.getEl());
    });
}