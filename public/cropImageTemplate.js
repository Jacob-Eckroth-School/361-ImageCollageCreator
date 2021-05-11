(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cropImage'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"cropHolder\">\n    <div class=\"headerHolder\">\n        <h1 class=\"cropImageHeader\">Crop Your Image</h1>\n    </div>\n    <div class=\"cropImageHolder\">\n        <img id=\"cropImg\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"imgSrc") || (depth0 != null ? lookupProperty(depth0,"imgSrc") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imgSrc","hash":{},"data":data,"loc":{"start":{"line":6,"column":31},"end":{"line":6,"column":41}}}) : helper)))
    + "\"/>\n    </div>\n    <div class=\"cropButtonsHolder\">\n        <button type=\"button\" id=\"cancelCropButton\" class=\"cropButton\">Cancel</button>\n        <button type=\"button\" id=\"submitCropButton\" class=\"cropButton\">Submit</button>\n    </div>\n\n</div>";
},"useData":true});
})();