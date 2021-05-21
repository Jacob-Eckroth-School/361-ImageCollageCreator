(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cropImage'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"cropHolder\">\r\n    <div class=\"headerHolder\">\r\n        <h1 class=\"cropImageHeader\">Crop Your Image</h1>\r\n    </div>\r\n    <div class=\"cropImageHolder\">\r\n        <img id=\"cropImg\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"imgSrc") || (depth0 != null ? lookupProperty(depth0,"imgSrc") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imgSrc","hash":{},"data":data,"loc":{"start":{"line":6,"column":31},"end":{"line":6,"column":41}}}) : helper)))
    + "\"/>\r\n    </div>\r\n    <div class=\"cropButtonsHolder\">\r\n        <button type=\"button\" id=\"cancelCropButton\" class=\"cropButton\">Cancel</button>\r\n        <button type=\"button\" id=\"submitCropButton\" class=\"cropButton\">Submit</button>\r\n    </div>\r\n\r\n</div>";
},"useData":true});
})();