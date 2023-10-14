;(function(a, e, c, d) {
    var b = a("html");
    b.on("click.ui.dropdown", ".js-dropdown", function(f) {
        f.preventDefault();
        a(this).toggleClass("is-open")
    });
    b.on("click.ui.dropdown", ".js-dropdown [data-dropdown-value]", function(h) {
        h.preventDefault();
        var g = a(this);
        var f = g.parents(".js-dropdown");
        f.find(".js-dropdown__input").val(g.data("dropdown-value"));
        f.find(".js-dropdown__current").text(g.text())
    });
    b.on("click.ui.dropdown", function(g) {
        var f = a(g.target);
        if (!f.parents().hasClass("js-dropdown")) {
            a(".js-dropdown").removeClass("is-open")
        }
    });
    // 在下拉菜单打开时，设置最大高度和滚动条
    b.on("click.ui.dropdown", ".js-dropdown.is-open", function() {
        var dropdown = a(this);
        var visibleItems = 4; // 可见的菜单项数量

        // 设置最大高度
        var menu = dropdown.find(".js-dropdown__menu");
        var menuElement = menu.get(0);

        if(menuElement){
            menuElement.style.maxHeight = menu.find(".js-dropdown__item").outerHeight() * visibleItems + "px";
            menuElement.style.overflowY = "hidden !important";
        };
    });
})(jQuery, window, document);