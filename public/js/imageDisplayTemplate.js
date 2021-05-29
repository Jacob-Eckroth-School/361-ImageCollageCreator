(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['imageDisplay'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n<div class = \"imageHolder\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"imageID") || (depth0 != null ? lookupProperty(depth0,"imageID") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"imageID","hash":{},"data":data,"loc":{"start":{"line":2,"column":31},"end":{"line":2,"column":42}}}) : helper)))
    + "\">  \n    <img class = \"animalPicture\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"animalImage") || (depth0 != null ? lookupProperty(depth0,"animalImage") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalImage","hash":{},"data":data,"loc":{"start":{"line":3,"column":38},"end":{"line":3,"column":53}}}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"alt") || (depth0 != null ? lookupProperty(depth0,"alt") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"alt","hash":{},"data":data,"loc":{"start":{"line":3,"column":60},"end":{"line":3,"column":67}}}) : helper)))
    + "\" />\n    <div class=\"buttonsHolder\">\n        <button class=\"crop alterButton\" >Crop</button>\n        <button class=\"delete alterButton\">Delete</button>\n    </div>\n</div>\n";
},"useData":true});
})();