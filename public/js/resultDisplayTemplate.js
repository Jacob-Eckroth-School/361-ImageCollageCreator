(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['resultDisplay'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"resultHolder\">\n    <a download=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"collageTitle") || (depth0 != null ? lookupProperty(depth0,"collageTitle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collageTitle","hash":{},"data":data,"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":33}}}) : helper)))
    + ".jpg\" href=\"/getCollage/"
    + alias4(((helper = (helper = lookupProperty(helpers,"collageTitle") || (depth0 != null ? lookupProperty(depth0,"collageTitle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collageTitle","hash":{},"data":data,"loc":{"start":{"line":2,"column":57},"end":{"line":2,"column":73}}}) : helper)))
    + "/"
    + alias4(((helper = (helper = lookupProperty(helpers,"collageStyle") || (depth0 != null ? lookupProperty(depth0,"collageStyle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collageStyle","hash":{},"data":data,"loc":{"start":{"line":2,"column":74},"end":{"line":2,"column":90}}}) : helper)))
    + "\" title=\"Download Image\">\n    <img class=\"collageImg\" src=\"/getCollage/"
    + alias4(((helper = (helper = lookupProperty(helpers,"collageTitle") || (depth0 != null ? lookupProperty(depth0,"collageTitle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collageTitle","hash":{},"data":data,"loc":{"start":{"line":3,"column":45},"end":{"line":3,"column":61}}}) : helper)))
    + "/"
    + alias4(((helper = (helper = lookupProperty(helpers,"collageStyle") || (depth0 != null ? lookupProperty(depth0,"collageStyle") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"collageStyle","hash":{},"data":data,"loc":{"start":{"line":3,"column":62},"end":{"line":3,"column":78}}}) : helper)))
    + "\" />\n    </a>\n   \n</div>";
},"useData":true});
})();